import { ICategory } from '../models/category.model.js';
import { CategoryRepository } from '../repositories/category.repository.js';

export class CategoryService {
  private repository = new CategoryRepository();

  async createCategory(data: Partial<ICategory>) {
    const existing = await this.repository.findAll();

    if (existing.some((c) => c.name === data.name)) {
      throw new Error('Category already exists');
    }

    // Always generate or sanitize slug
    const nameToUse = data.name || '';
    const slugToUse = data.slug || nameToUse;
    data.slug = slugToUse
      .toLowerCase()
      .trim()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');

    if (!data.slug) {
      throw new Error('Slug is required');
    }

    return await this.repository.create(data);
  }

  async getCategories() {
    return await this.repository.findAll();
  }

  async getCategoryById(id: string) {
    const category = await this.repository.findById(id);

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }

  async updateCategory(id: string, data: Partial<ICategory>) {
    if (data.name && !data.slug) {
      data.slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    } else if (data.slug) {
      data.slug = data.slug.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
    return await this.repository.update(id, data);
  }

  async updateCategoryStatus(id: string, status: 'active' | 'inactive') {
    const category = await this.repository.update(id, { status });

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }

  async deleteCategory(id: string) {
    return await this.repository.delete(id);
  }

  async getCategoryBySlug(slug: string) {
    let category = await this.repository.findBySlug(slug);
    
    if (!category && /^[0-9a-fA-F]{24}$/.test(slug)) {
      category = await this.repository.findById(slug);
    }

    if (!category) throw new Error('Category not found');
    return category;
  }

  async getActiveCategories() {
    return await this.repository.findAllActive();
  }
}

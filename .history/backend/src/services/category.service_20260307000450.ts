import { CategoryRepository } from "../repositories/category.repository.js";

export class CategoryService {

  private repository = new CategoryRepository();

  async createCategory(data: any) {

    const existing = await this.repository.findAll();

    if (existing.some(c => c.name === data.name)) {
      throw new Error("Category already exists");
    }

    return await this.repository.create(data);
  }

  async getCategories() {
    return await this.repository.findAll();
  }

  async getCategoryById(id: string) {

    const category = await this.repository.findById(id);

    if (!category) {
      throw new Error("Category not found");
    }

    return category;
  }

  async updateCategory(id: string, data: any) {
    return await this.repository.update(id, data);
  }

  async deleteCategory(id: string) {
    return await this.repository.delete(id);
  }

}
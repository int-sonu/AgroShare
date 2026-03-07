import { Category, ICategory } from "../models/category.model.js";

export class CategoryRepository {

  async create(data: Partial<ICategory>) {
    return await Category.create(data);
  }

  async findAll() {
    return await Category.find();
  }

  async findById(id: string) {
    return await Category.findById(id);
  }

  async update(id: string, data: Partial<ICategory>) {
    return await Category.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return await Category.findByIdAndDelete(id);
  }

}
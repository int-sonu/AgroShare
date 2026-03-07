import Category from "../models/category.model.";

export class CategoryService {

  createCategory = async (data: any) => {
    return await Category.create(data);
  };

  getCategories = async () => {
    return await Category.find();
  };

  getCategoryById = async (id: string) => {
    return await Category.findById(id);
  };

  updateCategory = async (id: string, data: any) => {
    return await Category.findByIdAndUpdate(id, data, { new: true });
  };

  deleteCategory = async (id: string) => {
    return await Category.findByIdAndDelete(id);
  };

}
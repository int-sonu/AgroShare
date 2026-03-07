import { CategoryRepository } from "../repositories/category.repository.js";

export class CategoryService {

  private repo = new CategoryRepository();

  async createCategory(data:any){

    const exists = await this.repo.findByName(data.name);

    if(exists){
      throw new Error("Category already exists");
    }

    return this.repo.create(data);
  }

  async getCategories(){
    return this.repo.findAll();
  }

}
import { Category } from "../models/category.model.js";

export class CategoryRepository {

  async create(data:any){
    return Category.create(data);
  }

  async findAll(){
    return Category.find();
  }

  async findByName(name:string){
    return Category.findOne({name});
  }

}
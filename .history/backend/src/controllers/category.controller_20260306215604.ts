import { Request, Response } from "express";
import { CategoryService } from "../services/category.service.js";

export class CategoryController {

  private service = new CategoryService();

  createCategory = async (req: Request, res: Response) => {

    try {

      const image = req.file?.filename;

      const category = await this.service.createCategory({
        ...req.body,
        image
      });

      res.status(201).json({
        success:true,
        data:category
      });

    } catch(error:any){

      res.status(400).json({
        success:false,
        message:error.message
      });

    }

  };

  getCategories = async (req:Request,res:Response)=>{

    const categories = await this.service.getCategories();

    res.json({
      success:true,
      data:categories
    });

  };

}
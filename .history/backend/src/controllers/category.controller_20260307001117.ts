import { Request, Response } from "express";
import { CategoryService } from "../services/category.service.js";

// Params type for routes like /categories/:id
interface CategoryParams {
  id: string;
}

export class CategoryController {

  private service = new CategoryService();

  // Create Category
  createCategory = async (req: Request, res: Response) => {

    try {

      const image = req.file?.filename;

      const category = await this.service.createCategory({
        ...req.body,
        image
      });

      return res.status(201).json({
        success: true,
        data: category
      });

    } catch (error: any) {

      return res.status(400).json({
        success: false,
        message: error.message
      });

    }

  };

  // Get All Categories
  getCategories = async (req: Request, res: Response) => {

    try {

      const categories = await this.service.getCategories();

      return res.json({
        success: true,
        data: categories
      });

    } catch (error: any) {

      return res.status(500).json({
        success: false,
        message: error.message
      });

    }

  };

  // Get Category By ID
  getCategoryById = async (
    req: Request<CategoryParams>,
    res: Response
  ) => {

    try {

      const category = await this.service.getCategoryById(req.params.id);

      return res.json({
        success: true,
        data: category
      });

    } catch (error: any) {

      return res.status(404).json({
        success: false,
        message: error.message
      });

    }

  };

  updateCategory = async (
  req: Request<CategoryParams> & { file?: Express.Multer.File },
  res: Response
) => {

  try {

    const image = req.file?.filename;

    const category = await this.service.updateCategory(
      req.params.id,
      {
        ...req.body,
        ...(image && { image })
      }
    );

    return res.json({
      success: true,
      data: category
    });

  } catch (error: any) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

  // Delete Category
  deleteCategory = async (
    req: Request<CategoryParams>,
    res: Response
  ) => {

    try {

      await this.service.deleteCategory(req.params.id);

      return res.json({
        success: true,
        message: "Category deleted"
      });

    } catch (error: any) {

      return res.status(500).json({
        success: false,
        message: error.message
      });

    }

  };

}
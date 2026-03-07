import { Request, Response } from "express";
import { CategoryService } from "../services/category.service.js";

export class CategoryController {

  private service = new CategoryService();

  // Create Category
  createCategory = async (req: Request, res: Response) => {
    try {

      const { name, description, status } = req.body;
      const image = req.file?.filename || null;

      const category = await this.service.createCategory({
        name,
        description,
        status,
        image
      });

      res.status(201).json({
        success: true,
        message: "Category created",
        data: category
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

  getCategories = async (req: Request, res: Response) => {
    try {

      const categories = await this.service.getCategories();

      res.json({
        success: true,
        data: categories
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

  getCategoryById = async (req: Request, res: Response) => {
    try {

      const category = await this.service.getCategoryById(req.params.id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found"
        });
      }

      res.json({
        success: true,
        data: category
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

  updateCategory = async (req: Request, res: Response) => {
    try {

      const image = req.file?.filename;

      const category = await this.service.updateCategory(
        req.params.id,
        {
          ...req.body,
          ...(image && { image })
        }
      );

      res.json({
        success: true,
        message: "Category updated",
        data: category
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

  deleteCategory = async (req: Request, res: Response) => {
    try {

      await this.service.deleteCategory(req.params.id);

      res.json({
        success: true,
        message: "Category deleted"
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

}
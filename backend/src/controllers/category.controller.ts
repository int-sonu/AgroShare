import { Request, Response } from 'express';
import { CategoryService } from '../services/category.service.js';

export class CategoryController {
  private service = new CategoryService();

  createCategory = async (req: Request, res: Response) => {
    try {
      const image = req.file?.filename;

      const category = await this.service.createCategory({
        ...req.body,
        image: image ? `uploads/categories/${image}` : undefined,
      });

      return res.status(201).json({
        success: true,
        data: category,
      });
    } catch (error: unknown) {
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  };

  getCategories = async (req: Request, res: Response) => {
    try {
      const categories = await this.service.getCategories();

      return res.json({
        success: true,
        data: categories,
      });
    } catch (error: unknown) {
      return res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  };

  getCategoryById = async (req: Request, res: Response) => {
    try {
      const category = await this.service.getCategoryById(req.params.id as string);

      return res.json({
        success: true,
        data: category,
      });
    } catch (error: unknown) {
      return res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Category not found',
      });
    }
  };

  updateCategory = async (req: Request, res: Response) => {
    try {
      const image = req.file?.filename;

      const category = await this.service.updateCategory(req.params.id as string, {
        ...req.body,
        ...(image && { image: `uploads/categories/${image}` }),
      });

      return res.json({
        success: true,
        data: category,
      });
    } catch (error: unknown) {
      return res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Update failed',
      });
    }
  };

  deleteCategory = async (req: Request, res: Response) => {
    try {
      await this.service.deleteCategory(req.params.id as string);

      return res.json({
        success: true,
        message: 'Category deleted',
      });
    } catch (error: unknown) {
      return res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Delete failed',
      });
    }
  };
}

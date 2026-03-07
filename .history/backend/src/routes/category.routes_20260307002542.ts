import { Router } from "express";
import { CategoryController } from "../controllers/category.controller.js";
import { uploadCategoryImage } from "../middlewares/multer.js";

const router = Router();
const controller = new CategoryController();

router.post(
  "/",
  uploadCategoryImage.single("image"),
  (req: any, res: any) => controller.createCategory(req, res)
);

router.get(
  "/",
  (req: any, res: any) => controller.getCategories(req, res)
);

router.get(
  "/:id",
  (req: any, res: any) => controller.getCategoryById(req, res)
);

router.put(
  "/:id",
  uploadCategoryImage.single("image"),
  (req: any, res: any) => controller.updateCategory(req, res)
);

router.delete(
  "/:id",
  (req: any, res: any) => controller.deleteCategory(req, res)
);

export default router;
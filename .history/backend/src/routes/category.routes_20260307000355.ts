import { Router } from "express";
import { CategoryController } from "../controllers/category.controller.js";
import { uploadCategoryImage } from "../middlewares/multer.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = Router();

const controller = new CategoryController();

router.post(
  "/categories",
  adminAuth,
  uploadCategoryImage.single("image"),
  controller.createCategory
);

router.put(
  "/categories/:id",
  adminAuth,
  uploadCategoryImage.single("image"),
  controller.updateCategory
);

router.delete(
  "/categories/:id",
  adminAuth,
  controller.deleteCategory
);

router.get("/categories", controller.getCategories);
router.get("/categories/:id", controller.getCategoryById);

export default router;
import { Router } from "express";
import { CategoryController } from "../controllers/category.controller.js";
import { uploadCategoryImage } from "../middlewares/multer.js";

const router = Router();
const controller = new CategoryController();

router.post( "/categories", uploadCategoryImage.single("image"), controller.createCategory
);

router.get("/categories", controller.getCategories);

router.get("/categories/:id", controller.getCategoryById);

router.put(
  "/categories/:id",
  uploadCategoryImage.single("image"),
  controller.updateCategory
);

router.delete("/categories/:id", controller.deleteCategory);

export default router;
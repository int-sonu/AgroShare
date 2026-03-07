import { Router } from "express";
import { CategoryController } from "../controllers/category.controller.js";
import { uploadCategoryImage } from "../middlewares/upload.middleware.js";

const router = Router();
const controller = new CategoryController();

router.post( "/", uploadCategoryImage.single("image"), controller.createCategory);

router.get("/", controller.getCategories);

export default router;
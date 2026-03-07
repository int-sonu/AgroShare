import { Router } from "express";
import { CategoryController } from "../controllers/category.controller.js";
import { uploadCategoryImage } from "../middlewares/multer.js";

const router = Router();
const controller = new CategoryController();

router.post("/", uploadCategoryImage.single("image"), controller.createCategory);
router.get("/", controller.getCategories);
router.get("/:id", controller.getCategoryById);
router.put("/:id", uploadCategoryImage.single("image"), controller.updateCategory);
router.delete("/:id", controller.deleteCategory);

export default router;
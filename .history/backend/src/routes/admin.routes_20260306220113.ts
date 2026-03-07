import { Router } from "express";
import * as adminController from "../controllers/admin.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = Router();

router.get( "/dashboard", protect, authorize("admin"), adminController.dashboard);
router.get("/users",protect,authorize("admin"),adminController.getUsers);
router.get( "/sellers", protect, authorize("admin"), adminController.getAllSellers);
router.get( "/sellers/pending", protect, authorize("admin"), adminController.getPendingSellers);
router.get("/sellers/pending",protect,authorize("admin"),adminController.getPendingSellers);
router.put( "/sellers/:sellerId/verify", protect,authorize("admin"),adminController.verifySeller);
export default router;
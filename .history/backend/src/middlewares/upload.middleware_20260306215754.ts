import multer from "multer";
import path from "path";
import { Request } from "express";
import { FileFilterCallback } from "multer";

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: Function) => {
    cb(null, "uploads/categories");
  },

  filename: (req: Request, file: Express.Multer.File, cb: Function) => {
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});

export const uploadCategoryImage = multer({ storage });
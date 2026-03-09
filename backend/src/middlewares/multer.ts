import multer from 'multer';
import path from 'path';
import { Request } from 'express';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) => {
    cb(null, path.join(__dirname, '../../uploads/categories'));
  },

  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});

export const uploadCategoryImage = multer({ storage });

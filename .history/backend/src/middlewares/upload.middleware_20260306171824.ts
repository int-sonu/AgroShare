import multer from "multer";
import path from "path";

const storage = multer.diskStorage({

  destination:(req,file,cb)=>{
    cb(null,"uploads/categories");
  },

  filename:(req,file,cb)=>{
    const name = Date.now() + path.extname(file.originalname);
    cb(null,name);
  }

});

export const uploadCategoryImage = multer({storage});
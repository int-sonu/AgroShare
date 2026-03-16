import multer from 'multer';

const storage = multer.memoryStorage();

export const uploadMachineImages = multer({
  storage,
  limits: {
    files: 5,
    fileSize: 5 * 1024 * 1024,
  },
});

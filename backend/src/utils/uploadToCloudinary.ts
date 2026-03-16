import cloudinary from './cloudinary.js';
import { UploadApiResponse } from 'cloudinary';

export const uploadBufferToCloudinary = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'machines' },
      (error, result: UploadApiResponse | undefined) => {
        if (error) return reject(error);

        if (!result) {
          return reject(new Error('Upload failed'));
        }

        resolve(result.secure_url);
      },
    );

    stream.end(buffer);
  });
};

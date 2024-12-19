import multer from 'multer';
import { promisify } from 'util';

// Define storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// Promisify the multer middleware to use it with async/await
const uploadMiddleware = promisify(upload.array('photos'));

// Middleware handler function to use in API routes
export const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

// Export uploadMiddleware for file uploads
export { uploadMiddleware };

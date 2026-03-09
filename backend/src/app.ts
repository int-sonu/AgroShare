import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import morgan from 'morgan';

import authRoutes from './routes/auth.routes.js';
import categoryRoutes from './routes/category.routes.js';
import adminRoutes from './routes/admin.routes.js';
import sellerRoutes from './routes/seller.routes.js';

import logger, { morganStream } from './config/logger.js';
import cookieParser from 'cookie-parser';
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(process.cwd(), 'uploads');
console.log('Static uploads server root:', uploadsPath);

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev', { stream: morganStream }));

app.use('/auth', authRoutes);
app.use('/categories', categoryRoutes);
app.use('/seller', sellerRoutes);
app.use('/admin', adminRoutes);
app.use('/uploads', express.static(uploadsPath));

app.get('/health', (_req, res) => {
  logger.info('Health check endpoint hit');
  res.status(200).json({ status: 'Backend is running' });
});

export default app;

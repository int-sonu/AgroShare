import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';

import logger, { morganStream } from './config/logger.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev', { stream: morganStream }));

app.use('/auth', authRoutes);

app.get('/health', (_req, res) => {
  logger.info('Health check endpoint hit');
  res.status(200).json({ status: 'Backend is running' });
});

export default app;

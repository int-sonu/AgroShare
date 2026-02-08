import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import healthRoutes from './routes/health.routes.js';
import errorHandler from './middlewares/errorHandler.js';
const app = express();

app.use(cors());
app.use(express.json());

app.use(morgan('dev'));
app.use('/api', healthRoutes);

app.get('/', (req, res) => {
  res.send('AgroShare API is running');
});

app.use(errorHandler);

export default app;

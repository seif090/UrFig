import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import customizerRoutes from './routes/customizerRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Basic Route for Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// Routes
app.use('/api/customizer', customizerRoutes);
app.use('/api/orders', orderRoutes);

// TODO: Register actual routes (products) here

export default app;

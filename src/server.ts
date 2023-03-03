import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';
import morgan from 'morgan';
import router from './router';

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(router);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) return res.status(400).json({ error: err.message });

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
});

const {
  PORT
} = process.env;

app.listen(PORT || 3333, () => {
  console.log(`🚀 API running on http://localhost:${PORT || 3333}`);
});

import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);

  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof Error) {
    message = err.message;
  }

  if ((err as any)?.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  if ((err as any)?.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err instanceof Error ? err.stack : undefined,
    }),
  });
};

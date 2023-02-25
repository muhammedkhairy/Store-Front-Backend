import { Request, Response, NextFunction } from 'express';

export interface customError extends Error {
  statusCode?: number;
  errorCode?: string;
}

const errorHandler = (err: customError, _req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  const status = err.statusCode || 500;
  const errorCode = err.errorCode || 'SERVER_ERROR';
  const message = err.message || 'Internal server error';
  const response = {
    status,
    "error detail": {
      code: errorCode,
      message,
    },
  };
  res.status(status).json(response);
  next(err);
};

export default errorHandler;

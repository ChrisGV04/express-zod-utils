import { NextFunction, Request, Response } from 'express';
import { CustomError } from './errors';

/**
 * Custom middleware to handle any route error
 */
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ error: err.serializeError() });
  }

  console.error('An unexpected error occured:', err);
  res.status(500).send({ error: { message: 'Ocurrió un error inesperado de nuestra parte' } });
}

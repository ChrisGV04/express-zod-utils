import type { NextFunction, Request, Response } from 'express';
import { ZodError, type AnyZodObject } from 'zod';
import { SchemaValidationError, UnknownError } from '../errors';

export const validateSchema = (schema: AnyZodObject) => (req: Request, _: Response, next: NextFunction) => {
  try {
    const parsedData = schema.parse({ body: req.body, params: req.params, query: req.query });
    if (parsedData.body) req.body = parsedData.body;
    if (parsedData.params) req.params = parsedData.params;
    if (parsedData.query) req.query = parsedData.query;

    next();
  } catch (error) {
    if (error instanceof ZodError) throw new SchemaValidationError(error);

    console.error('Error with the Zod schema valdation middleware:', error);
    throw new UnknownError(
      'Ocurrió un error inesperado',
      'No pudimos validar la información recibida. Por favor, vuelve a intentar más tarde.'
    );
  }
};

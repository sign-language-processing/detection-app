import {ErrorRequestHandler} from 'express';
import 'express-async-errors';

/**
 * General HTTP error middleware
 */
export const errorMiddleware: ErrorRequestHandler = async (e, req, res, next) => {
  if (e.code && typeof e.code === 'number' && e.code > 0) {
    console.error('errorMiddleware', 'Error to client', e.message, e.code);
  } else {
    console.error(e);
  }

  const executionId = req.header('function-execution-id');

  const message = 'message' in e ? e.message : e;

  const code = e.code && e.code > 200 && e.code < 600 ? e.code : 500;
  res.status(code).json(e.entity ? {entity: e.entity, executionId} : {message, executionId});

  next();
};

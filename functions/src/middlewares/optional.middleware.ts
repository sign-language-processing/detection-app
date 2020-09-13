import {RequestHandler} from 'express';

export const optionalMiddleware = (middleware: RequestHandler) => {
  const handler: RequestHandler = async (req, res, next) => {
    try {
      await middleware(req, res, next);
    } catch (e) {
      console.log("Skipping", e);

      next()
    }
  };

  return handler;
};

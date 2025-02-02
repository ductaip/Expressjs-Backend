import { NextFunction, Request, Response, RequestHandler } from 'express'

//wrap request handler to handle error
export const wrapRequestHandler = (func: RequestHandler): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next)
    } catch (error) {
      next(error)
    }
    // Promise.resolve(func(req, res, next)).catch(next)
  }
}
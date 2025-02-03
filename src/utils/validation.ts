import express from 'express';
import { validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import httpStatus from '~/constants/httpStatus';
import { ErrorWithStatus } from '~/models/Errors';

/**
 * Middleware for validating request data.
 *
 * @param validations - An array of validation chains from `express-validator`.
 * @returns Middleware function to handle validation and errors.
 */

export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      // sequential processing, stops running validations chain if one fails.
      await validation.run(req)

      const errors = validationResult(req)
      const errorsObject = errors.mapped()
      for (const key in errorsObject) {
        const {msg} = errorsObject[key]

        if (msg instanceof ErrorWithStatus && msg.status !== httpStatus.UNPROCESSABLE_ENTITY)
          return next(msg)
      }

      if (errors.isEmpty()) return next()
      else res.status(422).json({ errors: errors.mapped() })

    } catch (error) {
      // Handle unexpected errors gracefully
      console.error('Validation middleware error:', error)
      res.status(500).json({
        message: 'Internal Server Error'
      })
    }
  }
}
import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import { ErrorWithStatus } from '~/models/Errors'
import userService from '~/services/users.services'
import { validate } from '~/utils/validation'

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const {email, password} = req.body
  if (!email || !password) {
    res.status(400).json({
      error: 'Missing email or password....,'
    })
    return
  } else next()
}

export const registerValidator = validate(
  checkSchema({
    name: {
      in: ['body'],
      isString: {
        errorMessage: 'Name must be a string'
      },
      notEmpty: {
        errorMessage: 'Name is required'
      },
      trim: true,
      isLength: {
        options: { min: 4, max: 100 },
        errorMessage: 'Name must be between 4 and 100 characters'
      }
    },
    email: {
      in: ['body'],
      isEmail: {
        errorMessage: 'Invalid email address'
      },
      notEmpty: {
        errorMessage: 'Email is required'
      },
      trim: true,
      custom: {
        options: async (value) => {
          const isExistEmail = await userService.checkEmailExist(value)
          if (isExistEmail) throw new Error('Email already exists')

          return true
        }
      }
    },
    password: {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Password is required'
      },
      isLength: {
        options: { min: 4, max: 50 },
        errorMessage: 'Password must be between 4 and 50 characters'
      }
    },
    confirm_password: {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Confirm password is required'
      },
      isLength: {
        options: { min: 4, max: 50 },
        errorMessage: 'Confirm password must be between 4 and 50 characters'
      },
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('Passwords do not match')
          }
          return true
        }
      }
    }
  })
)
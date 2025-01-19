import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
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

export const registerValidator = validate(checkSchema({
  name: {
    isString: true,
    notEmpty: true,
    trim: true,
    isLength: {
      options: {min: 4, max: 100}
    }
  },
  email: {
    isEmail: true,
    notEmpty: true, 
    trim: true
  },
  password: {
    notEmpty: true,
    isLength: {
      options: { min: 4, max: 50 }
    }
  },
  confirm_password: {
    notEmpty: true,
    isLength: {
      options: { min: 4, max: 50 }
    },
    custom: {
      options: (value, { req }) => {
        if ( value !== req.body.password ) {
          throw new Error('Password is not matched')
        }
        return true
      }
    }
  }

}))
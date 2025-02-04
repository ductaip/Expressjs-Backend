import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import USER_MESSAGES from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import userService from '~/services/users.services'
import { validate } from '~/utils/validation'

export const loginValidator = validate(
  checkSchema({
    email: {
      in: ['body'],
      isEmail: {
        errorMessage: USER_MESSAGES.EMAIL_IS_REQUIRED
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
        errorMessage: USER_MESSAGES.PASSWORD_IS_REQUIRED
      },
      isLength: {
        options: { min: 4, max: 50 },
        errorMessage: USER_MESSAGES.PASSWORD_IS_NOT_VALID
      }
    } 
  })
)

export const registerValidator = validate(
  checkSchema({
    username: {
      in: ['body'],
      isString: {
        errorMessage: USER_MESSAGES.USERNAME_IS_STRING
      },
      notEmpty: {
        errorMessage: USER_MESSAGES.USERNAME_IS_REQUIRED
      },
      trim: true,
      isLength: {
        options: { min: 4, max: 100 },
        errorMessage: USER_MESSAGES.USERNAME_IS_NOT_VALID
      }
    },
    email: {
      in: ['body'],
      isEmail: {
        errorMessage: USER_MESSAGES.EMAIL_IS_REQUIRED
      },
      trim: true,
      custom: {
        options: async (value) => {
          const isExistEmail = await userService.checkEmailExist(value)
          if (isExistEmail) throw new Error(USER_MESSAGES.EMAIL_IS_EXISTS)

          return true
        }
      }
    },
    password: {
      in: ['body'],
      notEmpty: {
        errorMessage: USER_MESSAGES.PASSWORD_IS_REQUIRED
      },
      isLength: {
        options: { min: 4, max: 50 },
        errorMessage: USER_MESSAGES.PASSWORD_IS_NOT_VALID
      }
    },
    confirm_password: {
      in: ['body'],
      notEmpty: {
        errorMessage: USER_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
      },
      isLength: {
        options: { min: 4, max: 50 },
        errorMessage: USER_MESSAGES.CONFIRM_PASSWORD_IS_NOT_VALID
      },
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error(USER_MESSAGES.CONFIRM_PASSWORD_IS_NOT_MATCH)
          }
          return true
        }
      }
    }
  })
)
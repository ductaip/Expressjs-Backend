/* eslint-disable prettier/prettier */
import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import USER_MESSAGES from '~/constants/messages'
import databaseService from '~/services/database.services'
import userService from '~/services/users.services'
import { hashPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'

export const loginValidator = validate(
  checkSchema({
    email: {
      isEmail: {
        errorMessage: USER_MESSAGES.EMAIL_IS_REQUIRED
      },
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const user = await databaseService.users.findOne({
            email: value,
            password: hashPassword(req.body.password)
          })
          if (!user) throw new Error(USER_MESSAGES.USER_NOT_FOUND)

          req.user = user
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
  }, ['body'])
)

export const registerValidator = validate(
  checkSchema({
    username: {
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
      notEmpty: {
        errorMessage: USER_MESSAGES.PASSWORD_IS_REQUIRED
      },
      isLength: {
        options: { min: 4, max: 50 },
        errorMessage: USER_MESSAGES.PASSWORD_IS_NOT_VALID
      }
    },
    confirm_password: {
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
  }, ['body'])
)

export const accessTokenValidator = validate(
  checkSchema({
    Authorization: {
      notEmpty: {
        errorMessage: USER_MESSAGES.ACCESS_TOKEN_IS_REQUIRED 
      },
      custom: {
        options: async (value: string, { req }) => {
          const access_token = value.replace('Bearer ', '')

          if(access_token === '') throw new Error(USER_MESSAGES.ACCESS_TOKEN_IS_REQUIRED)
          
          const decoded_authorization = await verifyToken({token: access_token}) 
          req.decoded_authorization = decoded_authorization

          return true
        }
      }
    }
  }, ['headers'])
)
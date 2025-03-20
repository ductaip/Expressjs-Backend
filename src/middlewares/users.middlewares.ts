/* eslint-disable prettier/prettier */
import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import USER_MESSAGES from '~/constants/messages'
import HTTP_STATUS from '~/constants/statusCodes'
import { ErrorWithStatus } from '~/models/Errors'
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
          const access_token = value.split(' ')[1]

          if(!access_token) throw new ErrorWithStatus({
            message: USER_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
            status: HTTP_STATUS.UNAUTHORIZED
          })
          
          const decoded_authorization = await verifyToken({token: access_token}) 
          req.decoded_authorization = decoded_authorization

          return true
        }
      }
    }
  }, ['headers'])
)

export const refreshTokenValidator = validate(
  checkSchema({
    refresh_token: {
      notEmpty: {
        errorMessage: USER_MESSAGES.REFRESH_TOKEN_IS_REQUIRED
      },
      custom: {
        options: async (value: string, { req }) => {
          try {
            const [decoded_refresh_token, refresh_token] = await Promise.all([
              verifyToken({token: value }),
              databaseService.refreshTokens.findOne({token: value})
            ]) 
            if(!refresh_token) {
              throw new ErrorWithStatus({
                message: USER_MESSAGES.USED_REFRESH_TOKEN_OR_NOT_EXIST, 
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            req.decoded_refresh_token = decoded_refresh_token
            
          } catch (error) {
            throw new ErrorWithStatus({
              message: USER_MESSAGES.REFRESH_TOKEN_IS_INVALID, 
              status: HTTP_STATUS.UNAUTHORIZED
            })
          }
        }
      }
    }
  }, ['body'])
)
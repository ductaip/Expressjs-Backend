import { Request, Response } from 'express'
import userService from '~/services/users.services'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import {
  ForgotPasswordRequestBody,
  LogoutReqBody,
  RegisterReqBody,
  TokenPayload,
  VerifyForgotPasswordRequestBody
} from '~/models/requests/User.requests'
import USER_MESSAGES from '~/constants/messages'
import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/statusCodes'
import User from '~/models/schemas/User.schema'

export const loginController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  const user = req.user
  const { _id } = user
  const result = await userService.login(_id.toString())
  res.json({
    message: USER_MESSAGES.LOGIN_SUCCESS,
    result
  })
}

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  // throw new Error('test new')
  const result = await userService.register(req.body)

  // console.log('result>>', result)

  res.json({
    message: USER_MESSAGES.REGISTER_SUCCESS,
    result
  })
}

export const logoutController = async (
  req: Request<ParamsDictionary, any, LogoutReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { refresh_token } = req.body
  const result = await userService.logout(refresh_token)
  res.json(result)
}

export const emailVerifyValidatorController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload
  const user = await databaseService.users.findOne({
    _id: new ObjectId(user_id)
  })

  if (!user) {
    res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USER_MESSAGES.USER_NOT_FOUND
    })
  }

  if (user.email_verify_token === '') {
    res.json({
      message: USER_MESSAGES.USER_ALREADY_VERIFIED
    })
  }

  const result = await userService.verifyEmail(user_id)
  res.json({
    message: USER_MESSAGES.EMAIL_VERIFY_SUCCESS,
    result
  })
}

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { _id } = req.user as User
  const result = await userService.forgotPassword(_id.toString())
  res.json(result)
}

export const verifyForgotPasswordController = async (
  req: Request<ParamsDictionary, any, VerifyForgotPasswordRequestBody>,
  res: Response,
  next: NextFunction
) => {
  res.json({
    message: USER_MESSAGES.VERIFY_FORGOT_PASSWORD_SUCCESS
  })
}

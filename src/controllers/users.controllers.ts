import { Request, Response } from 'express'
import userService from '~/services/users.services'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { RegisterReqBody } from '~/models/requests/User.requests'
import USER_MESSAGES from '~/constants/messages'

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

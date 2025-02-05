import { Request, Response } from 'express'
import userService from '~/services/users.services'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { RegisterReqBody } from '~/models/requests/User.requests'

export const loginController = (req: Request, res: Response) => {
  const { user }: any = req
  const { _id } = user
  console.log('_id', _id.toString())
  userService.login(_id.toString())
}

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  // throw new Error('test new')
  const result = await userService.register(req.body)

  console.log('result>>', result)

  res.json({
    message: 'Register success...',
    result
  })
}

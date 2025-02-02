import { Request, Response } from 'express'
import userService from '~/services/users.services'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { RegisterReqBody } from '~/models/requests/User.requests'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email === 'testemail' && password === '123') {
    res.json({
      message: 'Login success'
    })
  } else res.status(400).json({ error: 'Login failed' })
}

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await userService.register(req.body)

    console.log('result>>', result)

    res.json({
      message: 'Register success...',
      result
    })
  } catch (error) {
    next(error)
  }
}
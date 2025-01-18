import { Request, Response } from 'express'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import userService from '~/services/users.services'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email === 'testemail' && password === '123') {
    res.json({
      message: 'Login successssss'
    })
  } else res.status(400).json({ error: 'Login failed' })
}

export const registerController = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try{
    const result = await userService.register({ email, password })

    console.log('result>>', result)

    res.json({
      message: 'Register success...',
      result
    })
  } catch ( error ) {
    res.status(400).json({ 
      error: 'Register failed...'
    })
  }
}
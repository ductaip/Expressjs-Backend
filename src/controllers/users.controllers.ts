import { Request, Response } from 'express'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'

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
    const result = await databaseService.users.insertOne(
      new User({
        email,
        password
      })
    )
    return res.json({
      message: 'Register success'
    })

  } catch (error) {
    return res.status(400).json({ 
      error: 'Register failed' 
    })
  }

}
import { Request, Response } from "express"

export const loginController = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body
  if (email === 'testemail' && password === '123') {
    res.json({
      message: 'Login successssss'
    })
  } else res.status(400).json({ error: 'Login failed' })
}
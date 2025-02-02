import {Router} from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'
const usersRouter = Router()

usersRouter.post('/login', loginValidator, loginController)
usersRouter.post('/register', registerValidator, 
  async (req, res, next) => {
    console.log('error 1')
    next(new Error('log Error from next'))
  },
  (err, req, res, next) => {
    console.log('hi guys')
    res.status(400).json({ error: err.message })
  }
)

export default usersRouter
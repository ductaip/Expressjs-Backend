import {Router} from 'express'
const userRouter = Router()

userRouter.use((req, res, next) => {
  console.log('Time: ', Date.now())
  next()
})

userRouter.get('/ig', (req, res) => {
  res.json({
    data: [
      {
        name: 'hi guys...'
      }
  ]
  })
})

export default userRouter
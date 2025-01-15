import {Router} from 'express'
const usersRouter = Router()

usersRouter.use((req, res, next) => {
  console.log('Time: ', Date.now())
  next()
  },
  (req, res, next) => {
      console.log('time 2: ', Date.now())
      next()
  }
)

usersRouter.get('/ig', (req, res) => {
  res.json({
    data: [
      {
        name: 'hi guys...'
      }
  ]
  })
})

export default usersRouter
import express from 'express'
import userRouter from './user.routes'
const app = express()
const port = 3002

app.post('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/user', userRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
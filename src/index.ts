import express from 'express'
import usersRouter from './routes/users.routes' 
const app = express()
const port = 3002

app.use(express.json())
app.use('/users', usersRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
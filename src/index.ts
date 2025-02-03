import express from 'express'
import usersRouter from './routes/users.routes' 
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
//connect to database
databaseService.connect()

const app = express()
const port = 3002

app.use(express.json())
app.use('/users', usersRouter)


//default error handler custom
app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

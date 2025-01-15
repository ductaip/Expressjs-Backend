import express from 'express'
import usersRouter from './routes/users.routes' 
import databaseService from './services/database.services'
const app = express()
const port = 3002

app.use(express.json())
app.use('/users', usersRouter)

//connect to database
databaseService.connect()

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
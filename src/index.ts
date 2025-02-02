import express from 'express'
import usersRouter from './routes/users.routes' 
import databaseService from './services/database.services'
const app = express()
const port = 3002

app.use(express.json())
app.use('/users', usersRouter)

//connect to database
databaseService.connect()

//error handler
app.use((err, req, res, next) => {
  console.log('Error is ', err.message)
  res.status(404).json({ error: err.message })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
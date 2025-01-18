import { config } from "dotenv"

config()

const envConfig = {
  port: process.env.PORT || 4000,
  dbName: process.env.DB_NAME,
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbUsersCollection: process.env.DB_USERS_COLLECTION
}

export default envConfig
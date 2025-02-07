import { config } from "dotenv"

config()

const envConfig = {
  port: process.env.PORT || 4000,
  passwordSecret: process.env.PASSWORD_SECRET,
  dbName: process.env.DB_NAME,
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbUsersCollection: process.env.DB_USERS_COLLECTION,
  dbRefreshTokensCollection: process.env.DB_REFRESH_TOKENS_COLLECTION,
  jwtSecret: process.env.JWT_SECRET,
  expiredAccess: process.env.ACCESS_TOKEN_EXPIRES_IN,
  expiredRefresh: process.env.REFRESH_TOKEN_EXPIRES_IN,

}

export default envConfig
import { config } from 'dotenv'

config()

const envConfig = {
  port: process.env.PORT || 4000,
  passwordSecret: process.env.PASSWORD_SECRET,
  dbName: process.env.DB_NAME,
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbUsersCollection: process.env.DB_USERS_COLLECTION,
  dbRefreshTokensCollection: process.env.DB_REFRESH_TOKENS_COLLECTION,
  dbFollowersCollection: process.env.DB_FOLLOWERS_COLLECTION,
  jwtAccessTokenSecret: process.env.JWT_SECRET_ACCESS_TOKEN,
  jwtRefreshTokenSecret: process.env.JWT_SECRET_REFRESH_TOKEN,
  jwtEmailVerifyTokenSecret: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN,
  jwtEmailForgotPasswordSecret: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN,
  expiredAccess: process.env.ACCESS_TOKEN_EXPIRES_IN,
  expiredRefresh: process.env.REFRESH_TOKEN_EXPIRES_IN,
  expiredEmailVerify: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN,
  expiredForgotPassword: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN
}

export default envConfig

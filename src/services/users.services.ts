import User from '~/models/schemas/User.schema'
import databaseService from './database.services'
import { RegisterReqBody } from '~/models/requests/User.requests'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enums'
import envConfig from '~/constants/config'
import type { StringValue } from 'ms'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { ObjectId } from 'mongodb'
import USER_MESSAGES from '~/constants/messages'

class UsersService {
  private signAccessToken(user_id: string) {
    try {
      return signToken({
        payload: {
          user_id,
          token_type: TokenType.AccessToken
        },
        privateKey: envConfig.jwtAccessTokenSecret,
        options: {
          expiresIn: envConfig.expiredAccess as StringValue
        }
      })
    } catch (error) {
      console.error('Error signing access token:', error)
      throw new Error('Could not sign access token')
    }
  }

  private signRefreshToken(user_id: string) {
    try {
      return signToken({
        payload: {
          user_id,
          token_type: TokenType.RefreshToken
        },
        privateKey: envConfig.jwtRefreshTokenSecret,
        options: {
          expiresIn: envConfig.expiredRefresh as StringValue
        }
      })
    } catch (error) {
      console.error('Error signing refresh token:', error)
      throw new Error('Could not sign refresh token')
    }
  }

  private signEmailVerifyToken(user_id: string) {
    try {
      return signToken({
        payload: {
          user_id,
          token_type: TokenType.EmailVerifyToken
        },
        privateKey: envConfig.jwtEmailVerifyTokenSecret,
        options: {
          expiresIn: envConfig.expiredEmailVerify as StringValue
        }
      })
    } catch (error) {
      console.error('Error signing email verify token:', error)
      throw new Error('Could not sign email verify token')
    }
  }

  private signForgotPasswordToken(user_id: string) {
    try {
      return signToken({
        payload: {
          user_id,
          token_type: TokenType.ForgotPasswordToken
        },
        privateKey: envConfig.jwtEmailForgotPasswordSecret,
        options: {
          expiresIn: envConfig.expiredForgotPassword as StringValue
        }
      })
    } catch (error) {
      console.error('Error signing forgot password token:', error)
      throw new Error('Could not sign forgot password token')
    }
  }

  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({ email })

    return Boolean(user)
  }

  private signAccessAndRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }

  async register(payload: RegisterReqBody) {
    const user_id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken(user_id.toString())
    await databaseService.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        email_verify_token,
        password: hashPassword(payload.password)
      })
    )

    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id.toString())
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token: refresh_token
      })
    )
    // console.log('email-verify-token', email_verify_token)
    return {
      access_token,
      refresh_token
    }
  }

  async login(user_id: string) {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token: refresh_token
      })
    )

    return {
      access_token,
      refresh_token
    }
  }

  async logout(refresh_token: string) {
    await databaseService.refreshTokens.deleteOne({ token: refresh_token })
    return {
      message: USER_MESSAGES.LOGOUT_SUCCESS
    }
  }

  async verifyEmail(user_id: string) {
    const [token] = await Promise.all([
      this.signAccessAndRefreshToken(user_id),
      databaseService.users.updateOne(
        { _id: new ObjectId(user_id) },
        {
          $set: {
            email_verify_token: ''
          },
          $currentDate: {
            updated_at: true
          }
        }
      )
    ])
    const [access_token, refresh_token] = token
    return {
      access_token,
      refresh_token
    }
  }

  async forgotPassword(user_id: string) {
    const forgot_password_token = await this.signForgotPasswordToken(user_id)

    await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
      {
        $set: {
          forgot_password_token,
          updated_at: '$$NOW'
        }
      }
    ])

    return {
      message: 'Check email to reset password'
    }
  }

  async verifyForgotPassword(user_id: string) {
    const [token] = await Promise.all([
      this.signAccessAndRefreshToken(user_id),
      databaseService.users.updateOne(
        { _id: new ObjectId(user_id) },
        {
          $set: {
            forgot_password_token: ''
          },
          $currentDate: {
            updated_at: true
          }
        }
      )
    ])
    const [access_token, refresh_token] = token
    return {
      access_token,
      refresh_token
    }
  }

  async getProfile(user_id: string) {
    const user = await databaseService.users.findOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )

    return user
  }
}

const userService = new UsersService()

export default userService

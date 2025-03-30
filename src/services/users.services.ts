import User from '~/models/schemas/User.schema'
import databaseService from './database.services'
import { RegisterReqBody, UpdateProfileReqBody } from '~/models/requests/User.requests'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { TokenType, UserVerifyStatus } from '~/constants/enums'
import envConfig from '~/constants/config'
import type { StringValue } from 'ms'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { ObjectId, ReturnDocument } from 'mongodb'
import USER_MESSAGES from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/statusCodes'
import { pick } from 'lodash'
import Follower from '~/models/schemas/Follower.schema'

class UsersService {
  private signAccessToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    try {
      return signToken({
        payload: {
          user_id,
          token_type: TokenType.AccessToken,
          verify
        },
        privateKey: envConfig.jwtAccessTokenSecret as string,
        options: {
          expiresIn: envConfig.expiredAccess as StringValue
        }
      })
    } catch (error) {
      console.error('Error signing access token:', error)
      throw new Error('Could not sign access token')
    }
  }

  private signRefreshToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    try {
      return signToken({
        payload: {
          user_id,
          token_type: TokenType.RefreshToken,
          verify
        },
        privateKey: envConfig.jwtRefreshTokenSecret as string,
        options: {
          expiresIn: envConfig.expiredRefresh as StringValue
        }
      })
    } catch (error) {
      console.error('Error signing refresh token:', error)
      throw new Error('Could not sign refresh token')
    }
  }

  private signEmailVerifyToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    try {
      return signToken({
        payload: {
          user_id,
          token_type: TokenType.EmailVerifyToken,
          verify
        },
        privateKey: envConfig.jwtEmailVerifyTokenSecret as string,
        options: {
          expiresIn: envConfig.expiredEmailVerify as StringValue
        }
      })
    } catch (error) {
      console.error('Error signing email verify token:', error)
      throw new Error('Could not sign email verify token')
    }
  }

  private signForgotPasswordToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    try {
      return signToken({
        payload: {
          user_id,
          token_type: TokenType.ForgotPasswordToken,
          verify
        },
        privateKey: envConfig.jwtEmailForgotPasswordSecret as string,
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

  private signAccessAndRefreshToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return Promise.all([this.signAccessToken({ user_id, verify }), this.signRefreshToken({ user_id, verify })])
  }

  async register(payload: RegisterReqBody) {
    const user_id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified
    })
    await databaseService.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        email_verify_token,
        password: hashPassword(payload.password)
      })
    )

    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified
    })

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

  async login({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id,
      verify
    })
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
      this.signAccessAndRefreshToken({
        user_id,
        verify: UserVerifyStatus.Verified
      }),
      databaseService.users.updateOne(
        { _id: new ObjectId(user_id) },
        {
          $set: {
            email_verify_token: '',
            verify: UserVerifyStatus.Verified
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

  async forgotPassword({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const forgot_password_token = await this.signForgotPasswordToken({ user_id, verify })

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

  async verifyForgotPassword({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const [token] = await Promise.all([
      this.signAccessAndRefreshToken({ user_id, verify }),
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

  async updateProfile(user_id: string, payload: UpdateProfileReqBody) {
    const _payload = payload.date_of_birth ? { ...payload, date_of_birth: new Date(payload.date_of_birth) } : payload
    const user = await databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          ...(_payload as UpdateProfileReqBody & { date_of_birth?: Date })
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        projection: { password: 0, email_verify_token: 0, forgot_password_token: 0 },
        returnDocument: 'after'
      }
    )

    return user
  }

  async getUser(username: string) {
    try {
      const user = await databaseService.users.findOne({ username })
      if (!user) {
        throw new ErrorWithStatus({
          message: 'Cannot find this user',
          status: HTTP_STATUS.NOT_FOUND
        })
      }
      return user
    } catch (error) {
      throw new ErrorWithStatus({
        message: 'Cannot find this user',
        status: HTTP_STATUS.NOT_FOUND
      })
    }
  }

  async follow({ user_id, followed_user_id }: { user_id: string; followed_user_id: string }) {
    const follower = await databaseService.followers.findOne({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(followed_user_id)
    })
    if (!follower) {
      await databaseService.followers.insertOne(
        new Follower({
          user_id: new ObjectId(user_id),
          followed_user_id: new ObjectId(followed_user_id)
        })
      )

      return {
        message: USER_MESSAGES.FOLLOW_SUCCESS
      }
    }
    return {
      message: USER_MESSAGES.FOLLOW_SUCCESS
    }
  }
}

const userService = new UsersService()

export default userService

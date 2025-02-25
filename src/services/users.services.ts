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

class UsersService {
  private signAccessToken(user_id: string) {
    try {
      return signToken({
        payload: {
          user_id,
          token_type: TokenType.AccessToken
        },
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
        options: {
          expiresIn: envConfig.expiredRefresh as StringValue
        }
      })
    } catch (error) {
      console.error('Error signing refresh token:', error)
      throw new Error('Could not sign refresh token')
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
    const result = await databaseService.users.insertOne(
      new User({
        ...payload,
        password: hashPassword(payload.password)
      })
    )

    const user_id = result.insertedId.toString()
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)
    await databaseService.refreshTokens.insertOne(new RefreshToken({
      user_id: new ObjectId(user_id),
      token: refresh_token
    }))

    return {
      access_token,
      refresh_token
    }
  }

  async login(user_id: string) {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)
    await databaseService.refreshTokens.insertOne( new RefreshToken({
      user_id: new ObjectId(user_id),
      token: refresh_token
    }))
    
    return {
      access_token,
      refresh_token
    }
  }
}

const userService = new UsersService()

export default userService
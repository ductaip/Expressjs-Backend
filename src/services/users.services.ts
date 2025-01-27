import User from '~/models/schemas/User.schema'
import databaseService from './database.services'
import { RegisterReqBody } from '~/models/requests/User.requests'
import { hashPassword } from '~/utils/crypto'

class UsersService {
  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({ email })
    console.log('user',user)
    return Boolean(user)
  }

  async register(payload: RegisterReqBody) {
    const result = await databaseService.users.insertOne(
      new User({
        ...payload,
        password: hashPassword(payload.password)
      })
    )
    return result
  }
}

const userService = new UsersService()

export default userService
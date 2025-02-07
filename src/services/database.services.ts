
import { MongoClient, Db, Collection } from 'mongodb'
import { config } from 'dotenv'
import User from '~/models/schemas/User.schema'
import envConfig from '~/constants/config'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
config()
const uri = `mongodb+srv://${envConfig.dbUsername}:${envConfig.dbPassword}@threads.tv53y.mongodb.net/?retryWrites=true&w=majority&appName=threads`

class DatabaseService {
  client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(envConfig.dbName)
  }
  async connect() {
    try {
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log('Error', error)
      throw error
    }
  }

  get users(): Collection<User> {
    return this.db.collection(envConfig.dbUsersCollection as string)
  }

  get refreshTokens() : Collection<RefreshToken> {
    return this.db.collection(envConfig.dbRefreshTokensCollection as string)
  }
}

const databaseService = new DatabaseService()
export default databaseService

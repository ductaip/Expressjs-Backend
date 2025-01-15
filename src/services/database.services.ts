
import { configDotenv } from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb'
config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@threads.tv53y.mongodb.net/?retryWrites=true&w=majority&appName=threads`;
import {config} from 'dotenv'

class DatabaseService {
  client: MongoClient
  constructor() {
    this.client = new MongoClient(uri)
  }
  async connect() {
    try { 
      await this.client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
      await this.client.close()
    }
  }
}

const databaseService = new DatabaseService()
export default databaseService

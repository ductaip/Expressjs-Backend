
import { MongoClient, ServerApiVersion } from 'mongodb'
const uri = "mongodb+srv://ductai:123456Aa.@threads.tv53y.mongodb.net/?retryWrites=true&w=majority&appName=threads";

const client = new MongoClient(uri)

export async function run() {
  try { 
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close()
  }
}

import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);

export const db = client.db("naturaly");


client.connect().then(() => {
  console.log("✅ MongoDB connected to naturaly");
}).catch(error => {
  console.error("❌ MongoDB connection error:", error);
});
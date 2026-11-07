import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const ATLAS_URI = 'mongodb+srv://balancehamize1_db_user:eyMBirHjaLcf77S8@cluster0.nnykaj5.mongodb.net/chemsou_store?retryWrites=true&w=majority&appName=Cluster0';
const MONGODB_URI = process.env.MONGODB_URI || ATLAS_URI;
const DB_NAME = process.env.DB_NAME || 'chemsou_store';

let client = null;
let db = null;

const clientOptions = {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
  maxPoolSize: 10
};

try {
  client = new MongoClient(MONGODB_URI, clientOptions);
  await client.connect();
  db = client.db(DB_NAME);
  console.log(`✓ Connected to MongoDB database: ${DB_NAME} (Cloud Atlas / Primary)`);
} catch (err) {
  console.warn('⚠️ Warning: Primary MongoDB connection failed, trying fallback URI:', err.message);
  try {
    const fallbackUri = MONGODB_URI !== ATLAS_URI ? ATLAS_URI : 'mongodb://winnerdz000%40gmail.com:yacine123@127.0.0.1:27017/chemsou_store?authSource=admin';
    client = new MongoClient(fallbackUri, clientOptions);
    await client.connect();
    db = client.db(DB_NAME);
    console.log(`✓ Connected to MongoDB database (fallback): ${DB_NAME}`);
  } catch (err2) {
    console.warn('ℹ️ Running in standalone/serverless mode without active MongoDB instance:', err2.message);
    db = null;
  }
}

export { db, client };
export default db;

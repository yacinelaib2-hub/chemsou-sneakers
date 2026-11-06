import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://winnerdz000%40gmail.com:yacine123@127.0.0.1:27017/chemsou_store?authSource=admin';
const DB_NAME = process.env.DB_NAME || 'chemsou_store';

let client = null;
let db = null;

try {
  client = new MongoClient(MONGODB_URI);
  await client.connect();
  db = client.db(DB_NAME);
  console.log(`✓ Connected to MongoDB database: ${DB_NAME} (User: winnerdz000@gmail.com)`);
} catch (err) {
  console.warn('⚠️ Warning: Authenticated MongoDB connection failed, trying unauthenticated fallback:', err.message);
  try {
    client = new MongoClient('mongodb://127.0.0.1:27017');
    await client.connect();
    db = client.db(DB_NAME);
    console.log(`✓ Connected to MongoDB database (unauthenticated fallback): ${DB_NAME}`);
  } catch (err2) {
    console.error('❌ Could not connect to MongoDB:', err2.message);
    db = null;
  }
}

export { db, client };
export default db;

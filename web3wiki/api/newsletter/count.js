// Newsletter subscriber count endpoint for Vercel
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  if (!MONGODB_URI) {
    throw new Error('Please define MONGODB_URI environment variable');
  }

  const client = await MongoClient.connect(MONGODB_URI);
  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db('web3wiki');
    const collection = db.collection('subscribers');

    const count = await collection.countDocuments({ status: 'active' });

    return res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Error fetching subscriber count:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

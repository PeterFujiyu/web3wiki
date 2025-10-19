// Feedback submission endpoint for Vercel
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
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { articleId, language, selectedText, suggestion, type, contactEmail, timestamp } = req.body;

    // Validate required fields
    if (!articleId || !selectedText || !suggestion || !type) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const client = await connectToDatabase();
    const db = client.db('web3wiki');
    const collection = db.collection('feedback');

    const newFeedback = {
      articleId,
      language,
      selectedText,
      suggestion,
      type,
      contactEmail,
      timestamp: timestamp || new Date().toISOString(),
      status: 'pending'
    };

    await collection.insertOne(newFeedback);

    return res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    console.error('Feedback submission error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

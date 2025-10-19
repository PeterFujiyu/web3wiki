// Main API handler for Vercel serverless functions
import cors from 'cors';

// Simple in-memory storage for development (replace with database in production)
let subscribers = [];
let feedback = [];

// Helper to run middleware
const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export default async function handler(req, res) {
  // Enable CORS
  await runMiddleware(req, res, cors());

  // Health check
  if (req.method === 'GET' && req.url === '/api') {
    return res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'Web3wiki API is running'
    });
  }

  // Default response
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
}

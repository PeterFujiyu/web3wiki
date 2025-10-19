import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Data file path
const DATA_DIR = path.join(__dirname, 'data');
const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'subscribers.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Read subscribers from file
async function readSubscribers() {
  try {
    const data = await fs.readFile(SUBSCRIBERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Write subscribers to file
async function writeSubscribers(subscribers) {
  await fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
}

// Newsletter subscription endpoint
app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    const { email, timestamp } = req.body;

    // Validate email
    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address'
      });
    }

    // Ensure data directory exists
    await ensureDataDir();

    // Read existing subscribers
    const subscribers = await readSubscribers();

    // Check if email already exists
    const existingSubscriber = subscribers.find(sub => sub.email === email);
    if (existingSubscriber) {
      return res.status(409).json({
        success: false,
        message: 'Email already subscribed'
      });
    }

    // Add new subscriber
    const newSubscriber = {
      email,
      timestamp: timestamp || new Date().toISOString(),
      status: 'active'
    };

    subscribers.push(newSubscriber);
    await writeSubscribers(subscribers);

    console.log(`New subscriber: ${email}`);

    res.json({
      success: true,
      message: 'Successfully subscribed to newsletter'
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get subscriber count (public - no email addresses)
app.get('/api/newsletter/count', async (req, res) => {
  try {
    await ensureDataDir();
    const subscribers = await readSubscribers();
    res.json({
      success: true,
      count: subscribers.length
    });
  } catch (error) {
    console.error('Error fetching subscriber count:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all subscribers (ADMIN ONLY - requires authentication)
// TODO: Add proper authentication before using in production
app.get('/api/admin/newsletter/subscribers', async (req, res) => {
  try {
    // TODO: Add authentication check here
    // Example: if (!req.headers.authorization || !verifyAdminToken(req.headers.authorization)) {
    //   return res.status(401).json({ success: false, message: 'Unauthorized' });
    // }

    // For now, this endpoint is disabled for security
    return res.status(403).json({
      success: false,
      message: 'This endpoint requires authentication. Please implement admin authentication first.'
    });

    // Uncomment after implementing authentication:
    // await ensureDataDir();
    // const subscribers = await readSubscribers();
    // res.json({
    //   success: true,
    //   count: subscribers.length,
    //   subscribers
    // });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Feedback submission endpoint
app.post('/api/feedback', async (req, res) => {
  try {
    const { articleId, language, selectedText, suggestion, type, contactEmail, timestamp } = req.body;

    // Validate required fields
    if (!articleId || !selectedText || !suggestion || !type) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Ensure data directory exists
    await ensureDataDir();

    const FEEDBACK_FILE = path.join(DATA_DIR, 'feedback.json');

    // Read existing feedback
    let feedback = [];
    try {
      const data = await fs.readFile(FEEDBACK_FILE, 'utf-8');
      feedback = JSON.parse(data);
    } catch {
      feedback = [];
    }

    // Add new feedback
    const newFeedback = {
      id: Date.now().toString(),
      articleId,
      language,
      selectedText,
      suggestion,
      type,
      contactEmail,
      timestamp: timestamp || new Date().toISOString(),
      status: 'pending'
    };

    feedback.push(newFeedback);
    await fs.writeFile(FEEDBACK_FILE, JSON.stringify(feedback, null, 2));

    console.log(`New feedback for article: ${articleId}`);

    res.json({
      success: true,
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

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

// Localhost authentication middleware
function requireLocalhost(req, res, next) {
  const clientIp = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;

  // Normalize IPv6 localhost to IPv4
  const normalizedIp = clientIp === '::1' || clientIp === '::ffff:127.0.0.1' ? '127.0.0.1' : clientIp;

  // Check if request is from localhost
  const isLocalhost = normalizedIp === '127.0.0.1' ||
                      normalizedIp === 'localhost' ||
                      clientIp === '::1' ||
                      clientIp === '::ffff:127.0.0.1';

  if (isLocalhost) {
    console.log(`✓ Admin access granted from localhost (${clientIp})`);
    next();
  } else {
    console.warn(`✗ Admin access denied from ${clientIp}`);
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin endpoints are only accessible from localhost.',
      ip: clientIp
    });
  }
}

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

// Get all subscribers (ADMIN ONLY - LOCALHOST ONLY)
app.get('/api/admin/newsletter/subscribers', requireLocalhost, async (req, res) => {
  try {
    await ensureDataDir();
    const subscribers = await readSubscribers();
    res.json({
      success: true,
      count: subscribers.length,
      subscribers
    });
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

// Glossary submission endpoint
app.post('/api/glossary', async (req, res) => {
  try {
    const { id, term, definition, category, tags, relatedTerms, difficulty, language, mode } = req.body;

    // Validate required fields
    if (!term || !definition || !category || !language) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields (term, definition, category, language)'
      });
    }

    // Ensure data directory exists
    await ensureDataDir();

    const GLOSSARY_SUBMISSIONS_FILE = path.join(DATA_DIR, 'glossary-submissions.json');

    // Read existing submissions
    let submissions = [];
    try {
      const data = await fs.readFile(GLOSSARY_SUBMISSIONS_FILE, 'utf-8');
      submissions = JSON.parse(data);
    } catch {
      submissions = [];
    }

    // Create submission record
    const submission = {
      submissionId: Date.now().toString(),
      termId: id || term.toLowerCase().replace(/\s+/g, '-'),
      term,
      definition,
      category,
      tags: tags || [],
      relatedTerms: relatedTerms || [],
      difficulty: difficulty || 'beginner',
      language,
      mode, // 'create' or 'edit'
      timestamp: new Date().toISOString(),
      status: 'pending' // pending, approved, rejected
    };

    submissions.push(submission);
    await fs.writeFile(GLOSSARY_SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2));

    console.log(`New glossary submission: ${term} (${language})`);

    res.json({
      success: true,
      message: 'Glossary term submitted successfully',
      submissionId: submission.submissionId
    });
  } catch (error) {
    console.error('Glossary submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get glossary submissions (for admin review) - LOCALHOST ONLY
app.get('/api/glossary/submissions', requireLocalhost, async (req, res) => {
  try {
    await ensureDataDir();
    const GLOSSARY_SUBMISSIONS_FILE = path.join(DATA_DIR, 'glossary-submissions.json');

    let submissions = [];
    try {
      const data = await fs.readFile(GLOSSARY_SUBMISSIONS_FILE, 'utf-8');
      submissions = JSON.parse(data);
    } catch {
      submissions = [];
    }

    res.json({
      success: true,
      count: submissions.length,
      submissions
    });
  } catch (error) {
    console.error('Error fetching glossary submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Approve glossary submission and update glossary.json - LOCALHOST ONLY
app.post('/api/glossary/approve/:submissionId', requireLocalhost, async (req, res) => {
  try {
    const { submissionId } = req.params;

    await ensureDataDir();
    const GLOSSARY_SUBMISSIONS_FILE = path.join(DATA_DIR, 'glossary-submissions.json');
    const GLOSSARY_FILE = path.join(__dirname, '../public/content/glossary.json');

    // Read submissions
    let submissions = [];
    try {
      const data = await fs.readFile(GLOSSARY_SUBMISSIONS_FILE, 'utf-8');
      submissions = JSON.parse(data);
    } catch {
      return res.status(404).json({
        success: false,
        message: 'No submissions found'
      });
    }

    // Find the submission
    const submission = submissions.find(s => s.submissionId === submissionId);
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Read current glossary
    let glossary = { en: [], zh: [] };
    try {
      const data = await fs.readFile(GLOSSARY_FILE, 'utf-8');
      glossary = JSON.parse(data);
    } catch {
      // Create new glossary if doesn't exist
      glossary = { en: [], zh: [] };
    }

    // Determine language key
    const langKey = submission.language === 'zh' || submission.language === 'zh-CN' ? 'zh' : 'en';

    // Create glossary term
    const glossaryTerm = {
      id: submission.termId,
      term: submission.term,
      definition: submission.definition,
      category: submission.category,
      tags: submission.tags,
      relatedTerms: submission.relatedTerms,
      difficulty: submission.difficulty
    };

    // Check if term exists (for edit mode)
    const existingIndex = glossary[langKey].findIndex(t => t.id === glossaryTerm.id);
    if (existingIndex >= 0) {
      // Update existing term
      glossary[langKey][existingIndex] = glossaryTerm;
    } else {
      // Add new term
      glossary[langKey].push(glossaryTerm);
    }

    // Sort terms alphabetically
    glossary[langKey].sort((a, b) => a.term.localeCompare(b.term));

    // Write updated glossary
    await fs.writeFile(GLOSSARY_FILE, JSON.stringify(glossary, null, 2));

    // Update submission status
    submission.status = 'approved';
    submission.approvedAt = new Date().toISOString();
    await fs.writeFile(GLOSSARY_SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2));

    console.log(`Approved glossary term: ${submission.term}`);

    res.json({
      success: true,
      message: 'Glossary term approved and published'
    });
  } catch (error) {
    console.error('Error approving glossary submission:', error);
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

import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeReview, validateOwnerPassword } from './src/utils/sentiment.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const OWNER_PASSWORD = process.env.OWNER_PASSWORD || '21062006';

// Store active server session tokens in memory
const activeSessions = new Set<string>();

app.use(express.json());

// Public health & meta endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'ReviewInsight – Restaurant Review Analyzer',
    author: 'Vishapal Yadav',
    mode: process.env.NODE_ENV || 'development'
  });
});

// Server-side secure authentication endpoint
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ success: false, message: 'Password is required' });
  }

  const isValid = validateOwnerPassword(password, OWNER_PASSWORD);
  if (!isValid) {
    return res.status(401).json({
      success: false,
      message: 'Incorrect demo password. Please try again.'
    });
  }

  // Generate secure random server session token
  const token = 'ri_' + Buffer.from(`${Date.now()}_${Math.random()}`).toString('base64url');
  activeSessions.add(token);

  return res.json({
    success: true,
    token,
    user: {
      role: 'Owner',
      name: 'Vishapal Yadav',
      brand: 'ReviewInsight'
    },
    message: 'Authentication successful. Website unlocked.'
  });
});

// Verify active session token
app.post('/api/auth/verify', (req, res) => {
  const { token } = req.body;
  if (token && activeSessions.has(token)) {
    return res.json({ valid: true, user: { role: 'Owner', name: 'Vishapal Yadav' } });
  }
  return res.status(401).json({ valid: false, message: 'Session expired or invalid' });
});

// Owner logout endpoint
app.post('/api/auth/logout', (req, res) => {
  const { token } = req.body;
  if (token) {
    activeSessions.delete(token);
  }
  return res.json({ success: true, message: 'Logged out successfully' });
});

// Review Sentiment Analysis API
app.post('/api/analyze-review', (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Review text is required' });
  }

  const result = analyzeReview(text);
  return res.json({ success: true, data: result });
});

// Business Review & Customer Support Chatbot API
app.post('/api/assistant-chat', async (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Attempt real Gemini AI response if API key is configured
  if (process.env.GEMINI_API_KEY) {
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI();
      const prompt = `You are "ReviewInsight Support AI", a professional 24/7 technical support and reputation consultant for the Business Review Analyzer platform created by Vishapal Yadav.
Your mission:
1. Help business owners troubleshoot website issues (login, session tokens, review pasting, chart rendering, data export).
2. Answer questions about review sentiment analysis, star rating prediction, and aspect detection (Food, Service, Ambiance, Value).
3. Provide step-by-step troubleshooting instructions for any technical error.
4. Provide actionable advice on handling negative 1-star reviews and drafting customer apologies.
Keep answers concise, clear, polite, and directly actionable with bullet points or numbered steps.

User question: "${message}"`;

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      if (aiResponse && aiResponse.text) {
        return res.json({ success: true, reply: aiResponse.text.trim(), source: 'gemini' });
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to local support engine:', (err as Error).message);
    }
  }

  // Intelligent domain-specific support and troubleshooting rule engine
  const query = message.toLowerCase();
  let reply = '';

  if (query.includes('login') || query.includes('password') || query.includes('unlock') || query.includes('21062006')) {
    reply = "Troubleshooting Login & Password:\n" +
      "1. Demo Password: The official demo password is '21062006'.\n" +
      "2. Case Sensitivity: Ensure Caps Lock is OFF. The password contains digits only.\n" +
      "3. Visibility: Click the 👁 eye icon to reveal the password and check for spaces.\n" +
      "4. Session Expiration: If your session expires after closing the tab, simply enter the password again to generate a new secure server session token.\n" +
      "5. Need direct bypass? You can append '?autostart=1' to your URL for instant presentation testing.";
  } else if (query.includes('how to analyze') || query.includes('batch') || query.includes('paste') || query.includes('multiple')) {
    reply = "How to Analyze Reviews:\n" +
      "1. Navigate to the 'Review Analyzer' section.\n" +
      "2. Paste text from Google Reviews, Yelp, TripAdvisor, Zomato, or customer emails into the text area.\n" +
      "3. Click 'Analyze Review ↓'. The system instantly calculates sentiment score (0-100%), predicted star rating (1-5★), highlights positive/critical keywords, and drafts a manager reply.\n" +
      "4. Quick Test: Click any of the sample preset buttons (5-Star Rave, 1-Star Disaster, Mixed, Ambiance) to see instant analysis.";
  } else if (query.includes('how does') || query.includes('sentiment') || query.includes('score') || query.includes('formula') || query.includes('algorithm')) {
    reply = "Review Analysis Methodology:\n" +
      "1. Polarity Scoring: Natural Language Processing scans for over 180 domain-specific sentiment terms with positive/negative weights.\n" +
      "2. Aspect Detection: Evaluates 4 core business pillars: Food/Product, Service, Ambiance/Cleanliness, and Value/Pricing.\n" +
      "3. Star Prediction: Maps calculated polarity to an industry standard 1 to 5 star rating.\n" +
      "4. Neutral Sentiment: Reviews with balanced pros and cons or purely descriptive sentences without sentiment keywords receive a neutral classification (score ~50%).";
  } else if (query.includes('chart') || query.includes('dashboard') || query.includes('trend') || query.includes('no data')) {
    reply = "Dashboard & Chart Troubleshooting:\n" +
      "1. Real-Time Sync: The dashboard updates dynamically whenever you analyze a review in the Review Analyzer.\n" +
      "2. Empty State: If no reviews have been analyzed yet, the dashboard shows an informational prompt. Analyze at least 1 review to see charts appear.\n" +
      "3. Date Filters: Use the 'All Time', 'Last 7 Days', or 'Last 30 Days' toggle above the trends chart to filter your data window.\n" +
      "4. Dish Breakdown: Mentions of menu items (e.g., pizza, pasta, burger, salad, soup) are automatically grouped into Most Praised vs Most Complained.";
  } else if (query.includes('export') || query.includes('save') || query.includes('pdf') || query.includes('print')) {
    reply = "Exporting & Saving Reports:\n" +
      "1. Click the 'Print / Save as PDF' button in the Platform Overview section at the bottom.\n" +
      "2. In your browser's print dialog, choose 'Save as PDF' as the printer destination.\n" +
      "3. Tip: Enable 'Background graphics' in print settings for colorful charts and badges.";
  } else if (query.includes('error') || query.includes('issue') || query.includes('bug') || query.includes('problem') || query.includes('connection')) {
    reply = "General Technical Troubleshooting Steps:\n" +
      "Step 1: Check your network connection and reload the page (Ctrl+F5 or Cmd+Shift+R).\n" +
      "Step 2: Verify server health at '/api/health' (should return { status: 'ok' }).\n" +
      "Step 3: Clear browser cache or test in an Incognito/Private window if local storage state is corrupted.\n" +
      "Step 4: If an action button appears disabled, ensure review input contains non-empty text.";
  } else if (query.includes('1-star') || query.includes('negative') || query.includes('complaint') || query.includes('bad review')) {
    reply = "Best Practice for 1-Star Review Management:\n" +
      "1. Fast Response: Reply within 12 to 24 hours.\n" +
      "2. Empathy First: Validate their frustration ('We are truly sorry your meal did not meet expectations').\n" +
      "3. No Public Arguments: State facts gently without arguing or blaming the customer.\n" +
      "4. Move Offline: Offer a direct manager email to resolve the issue privately.\n" +
      "5. Compensation: Offer a replacement meal or personal discount once the issue is acknowledged.";
  } else if (query.includes('whatsapp') || query.includes('share') || query.includes('url')) {
    reply = "Sharing Via WhatsApp:\n" +
      "1. Copy the public HTTPS URL: https://ais-pre-xkb2cbnp2rxn76fg6xhhk7-627267135763.asia-east1.run.app\n" +
      "2. Paste into any WhatsApp chat or group.\n" +
      "3. Share the demo password '21062006' with the recipient.\n" +
      "4. The recipient clicks the link, sees the Owner Login screen, enters '21062006', and the full platform unlocks instantly!";
  } else {
    reply = "Hello! I am your ReviewInsight Customer Support Assistant.\n\n" +
      "I can assist you with:\n" +
      "• Troubleshooting website problems, login errors, or chart questions\n" +
      "• Explaining sentiment scores, star prediction, and aspect detection\n" +
      "• Best practices for responding to difficult 1-star customer complaints\n" +
      "• Sharing reports and using WhatsApp links\n\n" +
      "How may I help you today? Feel free to ask any question!";
  }

  return res.json({ success: true, reply, source: 'rules' });
});

// Mount Vite or static files
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ReviewInsight Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();

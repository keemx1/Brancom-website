import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './firebase.js';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Production CORS settings
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, 'https://yourdomain.com'] 
    : ['http://localhost:3000', 'http://localhost:5000'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../')));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.post('/api/test', (req, res) => {
  console.log('TEST BODY:', req.body);
  res.json(req.body);
});

// 2. Place the transporter code here, after requires and before routes
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'briankibet61@gmail.com',      // your Gmail address
    pass: 'hpvs obrd zvsu oqpz'     // your Gmail app password
  }
});

// 3. Your contact route uses the transporter
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  const mailOptions = {
    from: '"Brancom Website" <your_email@gmail.com>',
    to: 'briankibet61@gmail.com',
    subject: `New Contact Form Submission: ${subject}`,
    text: `
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Subject: ${subject}
      Message: ${message}
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Nodemailer response:', info);
    res.json({ success: true, message: 'Message sent via email!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.json({ success: false, message: 'Failed to send email.' });
  }
});




// Register
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password, pppoe_username } = req.body;

  // 1. Validate PPPoE username
  const pppoeSnap = await db.collection('pppoe_users')
    .where('pppoe_username', '==', pppoe_username)
    .get();

  if (pppoeSnap.empty) {
    return res.status(400).json({ message: 'Invalid PPPoE username.' });
  }

  // 2. Check for duplicate email
  const userSnap = await db.collection('users').where('email', '==', email).get();
  if (!userSnap.empty) return res.status(400).json({ message: 'User already exists' });

  // 3. Register user
  await db.collection('users').add({ username, email, password, pppoe_username });
  res.json({ message: 'User registered successfully' });
});


// Login
app.post('/api/auth/login', async (req, res) => {
  console.log('BODY RECEIVED:', req.body);
  const { email, password } = req.body;
  try {
    const userSnap = await db.collection('users').where('email', '==', email).get();
    if (userSnap.empty) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    let user;
    userSnap.forEach(doc => {
      const data = doc.data();
      if (data.password === password) {
        user = { id: doc.id, ...data };
      }
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Generate a fake token for demo (replace with JWT in production)
    const token = 'demo-token-' + user.id;
    res.json({
      token,
      user: { username: user.username }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.toString() });
  }
});

// Get user profile
app.get('/api/user', async (req, res) => {
  const { email } = req.query;
  const userSnap = await db.collection('users').where('email', '==', email).get();
  if (userSnap.empty) return res.status(404).json({ message: 'User not found' });
  const user = userSnap.docs[0].data();
  res.json({ username: user.username, email: user.email });
});

// Update user profile
app.put('/api/user', async (req, res) => {
  const { email, username } = req.body;
  const userSnap = await db.collection('users').where('email', '==', email).get();
  if (userSnap.empty) return res.status(404).json({ message: 'User not found' });
  const userRef = userSnap.docs[0].ref;
  await userRef.update({ username });
  res.json({ message: 'Profile updated' });
});

// Package info (static/demo)
app.get('/api/package', (req, res) => {
  res.json({
    name: 'Premium Fiber 50Mbps',
    speed: '50Mbps',
    price: 3000,
    currency: 'KSH',
    renewal: 'monthly'
  });
});

// Billing info (static/demo)
app.get('/api/billing', (req, res) => {
  res.json({
    lastPayment: { amount: 3000, date: '2025-04-01', method: 'M-PESA' },
    nextDue: '2025-05-01',
    invoices: [
      { id: 1, amount: 3000, date: '2025-04-01', url: '#' },
      { id: 2, amount: 3000, date: '2025-03-01', url: '#' }
    ]
  });
});

// Usage info (static/demo)
app.get('/api/usage', (req, res) => {
  res.json({
    months: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
    usage: [120, 135, 110, 150, 140, 160], // in GB
    unit: 'GB'
  });
});

// Support info (static)
app.get('/api/support', (req, res) => {
  res.json({
    phone: '0704 233 377',
    email: 'brancom@gmail.com',
    liveChatUrl: '#'
  });
});

app.get('/api/test-firestore', async (req, res) => {
  try {
    await db.collection('test').add({ timestamp: Date.now() });
    res.json({ message: 'Successfully wrote to Firestore!' });
  } catch (err) {
    res.status(500).json({ message: 'Firestore connection failed', error: err.message });
  }
});


app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  const userSnap = await db.collection('users').where('email', '==', email).get();
  if (userSnap.empty) {
    // For security, don't reveal if email exists
    return res.json({ message: 'If your email exists, a reset link has been sent.' });
  }
  // Here you would send an email with a reset link/token
  res.json({ message: 'If your email exists, a reset link has been sent.' });
});

// Demo admin credentials (replace with secure storage in production)
const ADMIN_EMAIL = 'admin@brancom.com';
const ADMIN_PASSWORD = 'admin123';

app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    // For demo, just return a fake token
    return res.json({ token: 'admin-demo-token' });
  }
  res.status(401).json({ message: 'Invalid admin credentials' });
});

// Catch-all route for frontend (must be last)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../brancom main.html'));
  });
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 
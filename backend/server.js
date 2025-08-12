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

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Basic contact endpoint (simplified)
app.post('/api/contact', async (req, res) => {
  try {
    res.json({ success: true, message: 'Contact endpoint working!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Basic auth endpoints (simplified)
app.post('/api/auth/login', async (req, res) => {
  try {
    res.json({ success: true, message: 'Login endpoint working!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    res.json({ success: true, message: 'Register endpoint working!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Comment out catch-all route temporarily to isolate the issue
// if (process.env.NODE_ENV === 'production') {
//   app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../brancom main.html'));
//   });
// }

app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 
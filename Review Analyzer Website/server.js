/**
 * ReviewInsight - Standalone Node.js & Express Server
 * Author: Vishapal Yadav
 */

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const OWNER_PASSWORD = process.env.OWNER_PASSWORD || '21062006';

app.use(express.json());
app.use(express.static(__dirname));

// Server-side secure password verification endpoint
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ success: false, message: 'Password is required' });
  }

  if (password.trim() === OWNER_PASSWORD.trim()) {
    return res.json({
      success: true,
      token: 'ri_token_' + Date.now(),
      message: 'Password verified successfully.'
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Incorrect demo password. Please try again.'
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`ReviewInsight running at http://localhost:${PORT}`);
  console.log(`Demo owner password is set.`);
});

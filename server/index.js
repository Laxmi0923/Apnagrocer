require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const apiRouter = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRouter);

// Serve static frontend files if dist folder exists
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API Endpoint Not Found' });
  }
  const indexPath = path.join(distPath, 'index.html');
  if (require('fs').existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>ApnaGrocer Server</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h1 style="color: #16a34a;">🥦 ApnaGrocer Server is Running</h1>
          <p>API endpoints are live under <code>/api</code>.</p>
        </body>
      </html>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🥦 ApnaGrocer Server running on http://localhost:${PORT}`);
  console.log(`⚡ API Router active at http://localhost:${PORT}/api`);
  console.log(`🤖 Gemini AI status: ${process.env.GEMINI_API_KEY ? 'Configured (Gemini Active)' : 'Offline/Rule-Engine Active'}`);
  console.log(`====================================================`);
});

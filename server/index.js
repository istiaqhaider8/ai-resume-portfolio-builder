/**
 * AI Resume & Portfolio Builder — Express Server
 * Main entry point for the backend application
 */

import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

// Routes
import resumeRoutes from './routes/resume.js';
import portfolioRoutes from './routes/portfolio.js';
import templateRoutes from './routes/templates.js';
import pdfRoutes from './routes/pdf.js';

// Middleware
import { errorHandler } from './middleware/errorHandler.js';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(join(__dirname, '..', 'public')));

// API Routes
app.use('/api/resume', resumeRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/pdf', pdfRoutes);

// SPA fallback — serve index.html for non-API, non-file routes
app.use((req, res, next) => {
  if (!req.path.startsWith('/api') && !req.path.includes('.')) {
    return res.sendFile(join(__dirname, '..', 'public', 'index.html'));
  }
  next();
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n🚀 AI Resume & Portfolio Builder`);
  console.log(`   Server running at http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

export default app;

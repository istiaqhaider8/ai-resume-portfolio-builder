/**
 * Portfolio Routes — Generate portfolio from resume data
 */

import { Router } from 'express';
import { generatePortfolio } from '../services/ai.js';

const router = Router();

/**
 * POST /api/portfolio/generate
 * Generate portfolio content from resume data
 */
router.post('/generate', async (req, res, next) => {
  try {
    const { resumeData } = req.body;
    if (!resumeData) {
      return res.status(400).json({ success: false, error: 'Resume data is required.' });
    }

    const portfolio = await generatePortfolio(resumeData);
    res.json({ success: true, data: portfolio });
  } catch (err) {
    next(err);
  }
});

export default router;

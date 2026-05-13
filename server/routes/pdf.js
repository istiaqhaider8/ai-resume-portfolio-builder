/**
 * PDF Export Routes — Generate and download resume as PDF
 */

import { Router } from 'express';
import { generatePDF } from '../services/pdf.js';
import { renderResumeHTML } from '../services/resumeRenderer.js';

const router = Router();

router.post('/export', async (req, res, next) => {
  try {
    const { resumeData, templateId } = req.body;
    if (!resumeData) return res.status(400).json({ success: false, error: 'Resume data is required.' });
    const html = renderResumeHTML(resumeData, templateId || 'modern');
    const pdfBuffer = await generatePDF(html);
    const filename = `${(resumeData.fullName || 'resume').replace(/\s+/g, '_')}_Resume.pdf`;
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${filename}"`, 'Content-Length': pdfBuffer.length });
    res.send(pdfBuffer);
  } catch (err) { next(err); }
});

export default router;

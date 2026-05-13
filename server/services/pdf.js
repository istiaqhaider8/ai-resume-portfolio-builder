/**
 * PDF Generation Service
 * Uses Puppeteer to render HTML resume templates to PDF
 */

import puppeteer from 'puppeteer';

export async function generatePDF(htmlContent) {
  let browser = null;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdf = await page.pdf({
      format: 'A4',
      margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' },
      printBackground: true
    });
    
    return pdf;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  } finally {
    if (browser) await browser.close();
  }
}

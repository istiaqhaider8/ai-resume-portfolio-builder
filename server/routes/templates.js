/**
 * Template Routes — Resume template management
 */

import { Router } from 'express';

const router = Router();

const TEMPLATES = [
  { id: 'modern', name: 'Modern Professional', description: 'Clean, contemporary design with a sidebar layout. Perfect for tech and creative professionals.', thumbnail: 'modern', category: 'professional', colors: { primary: '#6366f1', secondary: '#818cf8', accent: '#4f46e5' }, popular: true },
  { id: 'classic', name: 'Classic Elegant', description: 'Traditional layout with a timeless feel. Ideal for corporate, finance, and law professionals.', thumbnail: 'classic', category: 'traditional', colors: { primary: '#1e293b', secondary: '#475569', accent: '#0f172a' }, popular: true },
  { id: 'minimal', name: 'Minimalist', description: 'Ultra-clean design that lets your content shine. Great for experienced professionals.', thumbnail: 'minimal', category: 'minimal', colors: { primary: '#171717', secondary: '#525252', accent: '#262626' }, popular: false },
  { id: 'creative', name: 'Creative Bold', description: 'Eye-catching design with bold colors and unique layout. Perfect for designers and marketers.', thumbnail: 'creative', category: 'creative', colors: { primary: '#ec4899', secondary: '#f472b6', accent: '#db2777' }, popular: true },
  { id: 'executive', name: 'Executive Suite', description: 'Sophisticated and refined layout for C-level executives and senior management.', thumbnail: 'executive', category: 'professional', colors: { primary: '#0d9488', secondary: '#14b8a6', accent: '#0f766e' }, popular: false },
  { id: 'developer', name: 'Developer Dark', description: 'Dark-themed design inspired by code editors. Built for software engineers and developers.', thumbnail: 'developer', category: 'tech', colors: { primary: '#22d3ee', secondary: '#67e8f9', accent: '#06b6d4' }, popular: true }
];

router.get('/', (req, res) => {
  const { category } = req.query;
  let templates = TEMPLATES;
  if (category && category !== 'all') templates = templates.filter(t => t.category === category);
  res.json({ success: true, data: templates });
});

router.get('/:id', (req, res) => {
  const template = TEMPLATES.find(t => t.id === req.params.id);
  if (!template) return res.status(404).json({ success: false, error: 'Template not found.' });
  res.json({ success: true, data: template });
});

export default router;

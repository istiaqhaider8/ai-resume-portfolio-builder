/**
 * Resume Routes — CRUD + AI generation endpoints
 */

import { Router } from 'express';
import { randomUUID } from 'crypto';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { generateResume, improveSection } from '../services/ai.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, '..', 'data', 'resumes.json');

const router = Router();

function readData() {
  if (!existsSync(DATA_FILE)) return {};
  try {
    return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
  } catch { return {}; }
}

function writeData(data) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

router.post('/generate', async (req, res, next) => {
  try {
    const { input } = req.body;
    if (!input || input.trim().length < 10) {
      return res.status(400).json({ success: false, error: 'Please provide more details about yourself (at least 10 characters).' });
    }
    const resumeData = await generateResume(input);
    const id = randomUUID();
    const resume = { id, ...resumeData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const data = readData();
    data[id] = resume;
    writeData(data);
    res.json({ success: true, data: resume });
  } catch (err) { next(err); }
});

router.post('/improve', async (req, res, next) => {
  try {
    const { section, content, tone } = req.body;
    if (!section || !content) {
      return res.status(400).json({ success: false, error: 'Section and content are required.' });
    }
    const improved = await improveSection(section, content, tone);
    res.json({ success: true, data: improved });
  } catch (err) { next(err); }
});

router.get('/:id', (req, res) => {
  const data = readData();
  const resume = data[req.params.id];
  if (!resume) return res.status(404).json({ success: false, error: 'Resume not found.' });
  res.json({ success: true, data: resume });
});

router.post('/save', (req, res) => {
  const { id, ...resumeData } = req.body;
  const data = readData();
  const resumeId = id || randomUUID();
  data[resumeId] = { id: resumeId, ...resumeData, updatedAt: new Date().toISOString(), createdAt: data[resumeId]?.createdAt || new Date().toISOString() };
  writeData(data);
  res.json({ success: true, data: data[resumeId] });
});

router.get('/', (req, res) => {
  const data = readData();
  const resumes = Object.values(data).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  res.json({ success: true, data: resumes });
});

export default router;

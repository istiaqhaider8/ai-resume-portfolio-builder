/**
 * Store — Client-side state management
 */
const Store = {
  KEYS: { RESUME: 'resumeai_resume', TEMPLATE: 'resumeai_template', PORTFOLIO: 'resumeai_portfolio', RESUME_ID: 'resumeai_resume_id' },
  getResume() { try { const data = localStorage.getItem(this.KEYS.RESUME); return data ? JSON.parse(data) : null; } catch { return null; } },
  setResume(data) { localStorage.setItem(this.KEYS.RESUME, JSON.stringify(data)); this._notify('resume', data); },
  updateResumeField(field, value) { const resume = this.getResume() || {}; resume[field] = value; this.setResume(resume); },
  getTemplate() { return localStorage.getItem(this.KEYS.TEMPLATE) || 'modern'; },
  setTemplate(templateId) { localStorage.setItem(this.KEYS.TEMPLATE, templateId); this._notify('template', templateId); },
  getPortfolio() { try { const data = localStorage.getItem(this.KEYS.PORTFOLIO); return data ? JSON.parse(data) : null; } catch { return null; } },
  setPortfolio(data) { localStorage.setItem(this.KEYS.PORTFOLIO, JSON.stringify(data)); },
  getResumeId() { return localStorage.getItem(this.KEYS.RESUME_ID); },
  setResumeId(id) { localStorage.setItem(this.KEYS.RESUME_ID, id); },
  clearAll() { Object.values(this.KEYS).forEach(key => localStorage.removeItem(key)); },
  _listeners: {},
  on(event, callback) { if (!this._listeners[event]) this._listeners[event] = []; this._listeners[event].push(callback); },
  _notify(event, data) { (this._listeners[event] || []).forEach(cb => cb(data)); }
};

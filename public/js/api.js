/**
 * API Client — Handles all communication with the backend
 */
const API = {
  BASE: '/api',
  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.BASE}${endpoint}`, { headers: { 'Content-Type': 'application/json', ...options.headers }, ...options });
      if (options.responseType === 'blob') { if (!response.ok) throw new Error('PDF generation failed'); return await response.blob(); }
      const data = await response.json();
      if (!data.success) throw new Error(data.error || 'Request failed');
      return data.data;
    } catch (error) { console.error(`API Error [${endpoint}]:`, error); throw error; }
  },
  async generateResume(input) { return this.request('/resume/generate', { method: 'POST', body: JSON.stringify({ input }) }); },
  async improveSection(section, content, tone = 'professional') { return this.request('/resume/improve', { method: 'POST', body: JSON.stringify({ section, content, tone }) }); },
  async saveResume(resumeData) { return this.request('/resume/save', { method: 'POST', body: JSON.stringify(resumeData) }); },
  async getResume(id) { return this.request(`/resume/${id}`); },
  async getTemplates(category = 'all') { const query = category && category !== 'all' ? `?category=${category}` : ''; return this.request(`/templates${query}`); },
  async generatePortfolio(resumeData) { return this.request('/portfolio/generate', { method: 'POST', body: JSON.stringify({ resumeData }) }); },
  async downloadPDF(resumeData, templateId) { return this.request('/pdf/export', { method: 'POST', body: JSON.stringify({ resumeData, templateId }), responseType: 'blob' }); }
};

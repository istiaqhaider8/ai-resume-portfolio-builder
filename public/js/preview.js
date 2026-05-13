/**
 * Resume Preview — Renders resume data with selected template styling
 */

const TEMPLATE_COLORS = {
  modern:    { primary: '#6366f1', secondary: '#818cf8' },
  classic:   { primary: '#1e293b', secondary: '#475569' },
  minimal:   { primary: '#171717', secondary: '#525252' },
  creative:  { primary: '#ec4899', secondary: '#f472b6' },
  executive: { primary: '#0d9488', secondary: '#14b8a6' },
  developer: { primary: '#22d3ee', secondary: '#67e8f9' }
};

document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('templateSelect');
  const saved = Store.getTemplate();
  if (select && saved) select.value = saved;
  renderPreview();
  if (select) select.addEventListener('change', () => { Store.setTemplate(select.value); renderPreview(); });
});

function renderPreview() {
  const container = document.getElementById('previewContent');
  if (!container) return;
  const data = Store.getResume();
  if (!data || !data.fullName) {
    container.innerHTML = '<div class="preview-empty"><div class="empty-icon">📄</div><h2>No Resume Data Yet</h2><p>Create your resume using the AI builder first.</p><a href="/builder.html" class="btn btn-primary btn-lg">✨ Start Building</a></div>';
    return;
  }
  const templateId = Store.getTemplate();
  const colors = TEMPLATE_COLORS[templateId] || TEMPLATE_COLORS.modern;
  const isDev = templateId === 'developer';

  container.innerHTML = `<div class="resume-preview-frame"><div class="resume-preview-content" style="--rv-primary: ${colors.primary}; --rv-secondary: ${colors.secondary}; ${isDev ? 'background: #0f172a; color: #e2e8f0;' : ''}">
    <h1 style="color: ${colors.primary}">${esc(data.fullName)}</h1>
    <div class="rv-title" style="color: ${colors.secondary}">${esc(data.title || '')}</div>
    <div class="rv-contact" style="border-color: ${colors.primary}">
      ${data.email ? `<span>${esc(data.email)}</span>` : ''}${data.phone ? `<span>${esc(data.phone)}</span>` : ''}${data.location ? `<span>${esc(data.location)}</span>` : ''}${data.linkedin ? `<span>${esc(data.linkedin)}</span>` : ''}
    </div>
    ${data.summary ? `<div class="rv-section"><h2 class="rv-section-title" style="color: ${colors.primary}">Professional Summary</h2><p class="rv-summary" ${isDev ? 'style="color:#94a3b8"' : ''}>${esc(data.summary)}</p></div>` : ''}
    ${data.experience?.length ? `<div class="rv-section"><h2 class="rv-section-title" style="color: ${colors.primary}">Experience</h2>${data.experience.map(exp => `<div class="rv-exp-item"><div class="rv-exp-header"><h3 ${isDev ? 'style="color:#e2e8f0"' : ''}>${esc(exp.position)}</h3><span class="rv-exp-dates" style="color: ${colors.secondary}">${esc(exp.startDate)} — ${esc(exp.endDate)}</span></div><div class="rv-exp-company" style="color: ${colors.primary}">${esc(exp.company)}</div>${exp.description ? `<p class="rv-exp-desc">${esc(exp.description)}</p>` : ''}${exp.highlights?.length ? `<ul class="rv-highlights">${exp.highlights.map(h => `<li ${isDev ? 'style="color:#cbd5e1"' : ''}>${esc(h)}</li>`).join('')}</ul>` : ''}</div>`).join('')}</div>` : ''}
    ${data.education?.length ? `<div class="rv-section"><h2 class="rv-section-title" style="color: ${colors.primary}">Education</h2>${data.education.map(edu => `<div class="rv-edu-item"><h3 ${isDev ? 'style="color:#e2e8f0"' : ''}>${esc(edu.degree)} in ${esc(edu.field)}</h3><div class="rv-edu-institution" style="color: ${colors.primary}">${esc(edu.institution)}</div><div class="rv-edu-details">${esc(edu.startDate)} — ${esc(edu.endDate)}${edu.gpa ? ` · GPA: ${esc(edu.gpa)}` : ''}</div></div>`).join('')}</div>` : ''}
    ${data.skills?.length ? `<div class="rv-section"><h2 class="rv-section-title" style="color: ${colors.primary}">Skills</h2><div class="rv-skills-grid">${data.skills.map(cat => `<div class="rv-skill-category"><h4 ${isDev ? 'style="color:#e2e8f0"' : ''}>${esc(cat.category)}</h4><div class="rv-skill-tags">${(cat.items || []).map(s => `<span class="rv-skill-tag" style="color:${colors.primary};border-color:${colors.primary}40;background:${colors.primary}15">${esc(s)}</span>`).join('')}</div></div>`).join('')}</div></div>` : ''}
    ${data.projects?.length ? `<div class="rv-section"><h2 class="rv-section-title" style="color: ${colors.primary}">Projects</h2>${data.projects.map(p => `<div class="rv-project-item"><h3 ${isDev ? 'style="color:#e2e8f0"' : ''}>${esc(p.name)}</h3><p>${esc(p.description)}</p>${p.technologies?.length ? `<span class="rv-project-tech" style="color:${colors.primary}">${p.technologies.map(t => esc(t)).join(' · ')}</span>` : ''}</div>`).join('')}</div>` : ''}
    ${data.certifications?.length ? `<div class="rv-section"><h2 class="rv-section-title" style="color: ${colors.primary}">Certifications</h2>${data.certifications.map(c => `<div class="rv-cert-item"><span class="rv-cert-name" ${isDev ? 'style="color:#e2e8f0"' : ''}>${esc(c.name)}</span><span class="rv-cert-issuer"> — ${esc(c.issuer)}</span>${c.date ? `<span class="rv-cert-date"> (${esc(c.date)})</span>` : ''}</div>`).join('')}</div>` : ''}
  </div></div>`;
}

function esc(str) { return escapeHTML(str); }

async function handleDownloadPDF() {
  const data = Store.getResume();
  if (!data || !data.fullName) { showToast('No resume data to download.', 'warning'); return; }
  const btn = document.getElementById('downloadBtn');
  btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Generating PDF...';
  showLoading('📥 Generating PDF...', 'Rendering your resume for download');
  try {
    const blob = await API.downloadPDF(data, Store.getTemplate());
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${(data.fullName || 'Resume').replace(/\s+/g, '_')}_Resume.pdf`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    hideLoading(); showToast('PDF downloaded successfully!', 'success');
  } catch (err) { hideLoading(); showToast('Failed to generate PDF. Please try again.', 'error'); console.error(err); }
  finally { btn.disabled = false; btn.innerHTML = '📥 Download PDF'; }
}

async function handleRegenerate() {
  const data = Store.getResume();
  if (!data) { showToast('No resume data to regenerate.', 'warning'); return; }
  const btn = document.getElementById('regenerateBtn');
  btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Regenerating...';
  showLoading('🤖 AI is regenerating your resume...', 'Creating improved content');
  try {
    const input = `My name is ${data.fullName}. I am a ${data.title}. ${data.summary || ''}`;
    const newData = await API.generateResume(input);
    Store.setResume({ ...data, ...newData, fullName: data.fullName });
    renderPreview(); hideLoading(); showToast('Resume regenerated with new AI suggestions!', 'success');
  } catch (err) { hideLoading(); showToast('Failed to regenerate. Please try again.', 'error'); }
  finally { btn.disabled = false; btn.innerHTML = '🤖 Regenerate with AI'; }
}

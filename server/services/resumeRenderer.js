/**
 * Resume HTML Renderer — Generates printable HTML for each template
 */

const TEMPLATE_STYLES = {
  modern: { primary: '#6366f1', secondary: '#818cf8', accent: '#4f46e5', bg: '#ffffff', text: '#1e293b', lightBg: '#f1f5f9', font: "'Inter', 'Segoe UI', sans-serif" },
  classic: { primary: '#1e293b', secondary: '#475569', accent: '#0f172a', bg: '#ffffff', text: '#1e293b', lightBg: '#f8fafc', font: "'Georgia', 'Times New Roman', serif" },
  minimal: { primary: '#171717', secondary: '#525252', accent: '#262626', bg: '#ffffff', text: '#171717', lightBg: '#fafafa', font: "'Inter', 'Helvetica Neue', sans-serif" },
  creative: { primary: '#ec4899', secondary: '#f472b6', accent: '#db2777', bg: '#ffffff', text: '#1e293b', lightBg: '#fdf2f8', font: "'Poppins', 'Inter', sans-serif" },
  executive: { primary: '#0d9488', secondary: '#14b8a6', accent: '#0f766e', bg: '#ffffff', text: '#1e293b', lightBg: '#f0fdfa', font: "'Inter', 'Segoe UI', sans-serif" },
  developer: { primary: '#22d3ee', secondary: '#67e8f9', accent: '#06b6d4', bg: '#0f172a', text: '#e2e8f0', lightBg: '#1e293b', font: "'JetBrains Mono', 'Fira Code', monospace" }
};

export function renderResumeHTML(data, templateId = 'modern') {
  const s = TEMPLATE_STYLES[templateId] || TEMPLATE_STYLES.modern;
  const isDark = templateId === 'developer';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: ${s.font}; background: ${s.bg}; color: ${s.text}; font-size: 10pt; line-height: 1.5; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .resume { max-width: 8.5in; margin: 0 auto; padding: 0.4in; }
  .header { text-align: ${templateId === 'modern' ? 'left' : 'center'}; margin-bottom: 18px; padding-bottom: 14px; border-bottom: 2px solid ${s.primary}; }
  .header h1 { font-size: 22pt; font-weight: 700; color: ${s.primary}; letter-spacing: -0.5px; margin-bottom: 4px; }
  .header .title { font-size: 11pt; color: ${s.secondary}; font-weight: 500; margin-bottom: 8px; }
  .contact-row { display: flex; flex-wrap: wrap; gap: 12px; justify-content: ${templateId === 'modern' ? 'flex-start' : 'center'}; font-size: 8.5pt; color: ${isDark ? '#94a3b8' : '#64748b'}; }
  .contact-row span::before { content: ''; display: inline-block; width: 4px; height: 4px; background: ${s.primary}; border-radius: 50%; margin-right: 6px; vertical-align: middle; }
  .section { margin-bottom: 16px; }
  .section-title { font-size: 11pt; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: ${s.primary}; border-bottom: 1px solid ${isDark ? '#334155' : '#e2e8f0'}; padding-bottom: 4px; margin-bottom: 10px; }
  .summary { font-size: 9.5pt; color: ${isDark ? '#cbd5e1' : '#475569'}; line-height: 1.6; }
  .exp-item { margin-bottom: 14px; }
  .exp-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px; }
  .exp-header h3 { font-size: 10.5pt; font-weight: 600; color: ${s.text}; }
  .exp-header .dates { font-size: 8.5pt; color: ${s.secondary}; font-weight: 500; }
  .exp-company { font-size: 9.5pt; color: ${s.primary}; font-weight: 500; margin-bottom: 4px; }
  .exp-desc { font-size: 9pt; color: ${isDark ? '#94a3b8' : '#64748b'}; margin-bottom: 4px; }
  .highlights { list-style: none; padding: 0; }
  .highlights li { font-size: 9pt; padding-left: 14px; position: relative; margin-bottom: 2px; color: ${isDark ? '#cbd5e1' : '#334155'}; }
  .highlights li::before { content: '\\25B8'; position: absolute; left: 0; color: ${s.primary}; font-size: 10pt; }
  .edu-item { margin-bottom: 8px; }
  .edu-item h3 { font-size: 10pt; font-weight: 600; }
  .edu-item .institution { font-size: 9pt; color: ${s.primary}; font-weight: 500; }
  .edu-item .details { font-size: 8.5pt; color: ${isDark ? '#94a3b8' : '#64748b'}; }
  .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 8px; }
  .skill-category h4 { font-size: 9pt; font-weight: 600; color: ${s.text}; margin-bottom: 3px; }
  .skill-tags { display: flex; flex-wrap: wrap; gap: 4px; }
  .skill-tag { font-size: 8pt; padding: 2px 8px; background: ${isDark ? '#1e293b' : s.lightBg}; color: ${s.primary}; border-radius: 3px; border: 1px solid ${isDark ? '#334155' : s.primary + '30'}; }
  .project-item { margin-bottom: 10px; }
  .project-item h3 { font-size: 10pt; font-weight: 600; color: ${s.text}; margin-bottom: 2px; }
  .project-item p { font-size: 9pt; color: ${isDark ? '#94a3b8' : '#64748b'}; margin-bottom: 3px; }
  .project-tech { font-size: 8pt; color: ${s.primary}; }
  .cert-item { margin-bottom: 4px; }
  .cert-name { font-weight: 600; color: ${s.text}; font-size: 9pt; }
  .cert-issuer { color: ${s.secondary}; font-size: 9pt; }
  .cert-date { color: #94a3b8; font-size: 8pt; }
  ${templateId === 'modern' ? '.content-grid { display: grid; grid-template-columns: 1fr 280px; gap: 24px; }' : ''}
</style>
</head>
<body>
<div class="resume">
  <div class="header">
    <h1>${esc(data.fullName || '')}</h1>
    <div class="title">${esc(data.title || '')}</div>
    <div class="contact-row">
      ${data.email ? `<span>${esc(data.email)}</span>` : ''}
      ${data.phone ? `<span>${esc(data.phone)}</span>` : ''}
      ${data.location ? `<span>${esc(data.location)}</span>` : ''}
      ${data.linkedin ? `<span>${esc(data.linkedin)}</span>` : ''}
    </div>
  </div>

  ${templateId === 'modern' ? '<div class="content-grid"><div class="main">' : ''}

  ${data.summary ? `<div class="section"><h2 class="section-title">Professional Summary</h2><p class="summary">${esc(data.summary)}</p></div>` : ''}

  ${data.experience?.length ? `<div class="section"><h2 class="section-title">Experience</h2>${data.experience.map(exp => `
  <div class="exp-item">
    <div class="exp-header"><h3>${esc(exp.position || '')}</h3><span class="dates">${esc(exp.startDate || '')} — ${esc(exp.endDate || '')}</span></div>
    <div class="exp-company">${esc(exp.company || '')}</div>
    ${exp.description ? `<p class="exp-desc">${esc(exp.description)}</p>` : ''}
    ${exp.highlights?.length ? `<ul class="highlights">${exp.highlights.map(h => `<li>${esc(h)}</li>`).join('')}</ul>` : ''}
  </div>`).join('')}</div>` : ''}

  ${data.projects?.length ? `<div class="section"><h2 class="section-title">Projects</h2>${data.projects.map(p => `
  <div class="project-item"><h3>${esc(p.name || '')}</h3><p>${esc(p.description || '')}</p>${p.technologies?.length ? `<span class="project-tech">${p.technologies.map(t => esc(t)).join(' · ')}</span>` : ''}</div>`).join('')}</div>` : ''}

  ${templateId === 'modern' ? '</div><div class="sidebar">' : ''}

  ${data.education?.length ? `<div class="section"><h2 class="section-title">Education</h2>${data.education.map(edu => `
  <div class="edu-item"><h3>${esc(edu.degree || '')} in ${esc(edu.field || '')}</h3><div class="institution">${esc(edu.institution || '')}</div><div class="details">${esc(edu.startDate || '')} — ${esc(edu.endDate || '')}${edu.gpa ? ` · GPA: ${esc(edu.gpa)}` : ''}</div></div>`).join('')}</div>` : ''}

  ${data.skills?.length ? `<div class="section"><h2 class="section-title">Skills</h2><div class="skills-grid">${data.skills.map(cat => `
  <div class="skill-category"><h4>${esc(cat.category || '')}</h4><div class="skill-tags">${(cat.items || []).map(s => `<span class="skill-tag">${esc(s)}</span>`).join('')}</div></div>`).join('')}</div></div>` : ''}

  ${data.certifications?.length ? `<div class="section"><h2 class="section-title">Certifications</h2>${data.certifications.map(c => `
  <div class="cert-item"><span class="cert-name">${esc(c.name || '')}</span><span class="cert-issuer"> — ${esc(c.issuer || '')}</span>${c.date ? `<span class="cert-date"> (${esc(c.date)})</span>` : ''}</div>`).join('')}</div>` : ''}

  ${templateId === 'modern' ? '</div></div>' : ''}
</div>
</body>
</html>`;
}

function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

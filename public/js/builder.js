/**
 * Resume Builder — Multi-step form logic, AI generation, autosave
 */

let currentStep = 0;

document.addEventListener('DOMContentLoaded', () => {
  loadExistingData();
  setupAutosave();
});

function goToStep(step) {
  collectFormData();
  currentStep = step;
  document.querySelectorAll('.builder-form').forEach(f => f.classList.remove('active'));
  const target = document.getElementById(`step-${step}`);
  if (target) target.classList.add('active');
  document.querySelectorAll('.stepper .step').forEach((s, i) => {
    s.classList.remove('active', 'completed');
    if (i < step) s.classList.add('completed');
    if (i === step) s.classList.add('active');
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function handleGenerate() {
  const input = document.getElementById('aiInput').value.trim();
  if (!input || input.length < 10) { showToast('Please describe yourself in more detail.', 'warning'); return; }
  const btn = document.getElementById('generateBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Generating...';
  showLoading('🤖 AI is generating your resume...', 'Analyzing your input and creating professional content');
  try {
    const resume = await API.generateResume(input);
    Store.setResume(resume);
    if (resume.id) Store.setResumeId(resume.id);
    populateForm(resume);
    hideLoading();
    showToast('Resume generated successfully! Review and edit the details below.', 'success');
    goToStep(1);
  } catch (err) {
    hideLoading();
    showToast('Failed to generate resume. Please try again.', 'error');
    console.error(err);
  } finally {
    btn.disabled = false;
    btn.innerHTML = '🤖 Generate Resume with AI';
  }
}

async function handleImproveSection(section) {
  const field = document.getElementById(section);
  if (!field || !field.value.trim()) { showToast('Please enter some content first.', 'warning'); return; }
  try {
    showToast('AI is improving this section...', 'info');
    const improved = await API.improveSection(section, field.value);
    if (typeof improved === 'string') field.value = improved;
    showToast('Section improved!', 'success');
    collectFormData();
  } catch (err) { showToast('Could not improve section. Try again.', 'error'); }
}

function populateForm(data) {
  if (!data) return;
  ['fullName', 'title', 'email', 'phone', 'location', 'linkedin', 'summary'].forEach(field => {
    const el = document.getElementById(field);
    if (el && data[field]) el.value = data[field];
  });
  const expList = document.getElementById('experienceList');
  if (expList && data.experience) { expList.innerHTML = ''; data.experience.forEach(exp => addExperience(exp)); }
  const eduList = document.getElementById('educationList');
  if (eduList && data.education) { eduList.innerHTML = ''; data.education.forEach(edu => addEducation(edu)); }
  const skillsList = document.getElementById('skillsList');
  if (skillsList && data.skills) { skillsList.innerHTML = ''; data.skills.forEach(cat => addSkillCategory(cat)); }
  const projList = document.getElementById('projectsList');
  if (projList && data.projects) { projList.innerHTML = ''; data.projects.forEach(proj => addProject(proj)); }
  const certList = document.getElementById('certificationsList');
  if (certList && data.certifications) { certList.innerHTML = ''; data.certifications.forEach(cert => addCertification(cert)); }
}

function addExperience(data = {}) {
  const list = document.getElementById('experienceList');
  const index = list.children.length;
  const item = document.createElement('div');
  item.className = 'repeatable-item';
  item.innerHTML = `
    <div class="item-header"><h4>Experience ${index + 1}</h4><button class="remove-btn" onclick="this.closest('.repeatable-item').remove()">✕</button></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Position</label><input type="text" placeholder="Senior Software Engineer" value="${escapeHTML(data.position || '')}" data-exp="${index}" data-field="position"></div>
      <div class="form-group"><label class="form-label">Company</label><input type="text" placeholder="Google" value="${escapeHTML(data.company || '')}" data-exp="${index}" data-field="company"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Start Date</label><input type="text" placeholder="2020" value="${escapeHTML(data.startDate || '')}" data-exp="${index}" data-field="startDate"></div>
      <div class="form-group"><label class="form-label">End Date</label><input type="text" placeholder="Present" value="${escapeHTML(data.endDate || '')}" data-exp="${index}" data-field="endDate"></div>
    </div>
    <div class="form-group"><label class="form-label">Description</label><textarea rows="2" placeholder="Brief description of your role..." data-exp="${index}" data-field="description">${escapeHTML(data.description || '')}</textarea></div>
    <div class="form-group"><label class="form-label">Key Achievements</label>
      <div class="highlights-list" data-exp="${index}">
        ${(data.highlights || ['']).map((h, hi) => `<div class="highlight-row"><input type="text" placeholder="Achieved..." value="${escapeHTML(h)}"><button class="remove-highlight" onclick="this.parentElement.remove()">✕</button></div>`).join('')}
      </div>
      <button class="add-highlight-btn" onclick="addHighlight(this.previousElementSibling)">+ Add Achievement</button>
    </div>`;
  list.appendChild(item);
}

function addHighlight(container) {
  const row = document.createElement('div');
  row.className = 'highlight-row';
  row.innerHTML = '<input type="text" placeholder="Achieved..."><button class="remove-highlight" onclick="this.parentElement.remove()">✕</button>';
  container.appendChild(row);
}

function addEducation(data = {}) {
  const list = document.getElementById('educationList');
  const index = list.children.length;
  const item = document.createElement('div');
  item.className = 'repeatable-item';
  item.innerHTML = `
    <div class="item-header"><h4>Education ${index + 1}</h4><button class="remove-btn" onclick="this.closest('.repeatable-item').remove()">✕</button></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Institution</label><input type="text" placeholder="MIT" value="${escapeHTML(data.institution || '')}" data-edu="${index}" data-field="institution"></div>
      <div class="form-group"><label class="form-label">Degree</label><input type="text" placeholder="Bachelor's" value="${escapeHTML(data.degree || '')}" data-edu="${index}" data-field="degree"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Field of Study</label><input type="text" placeholder="Computer Science" value="${escapeHTML(data.field || '')}" data-edu="${index}" data-field="field"></div>
      <div class="form-group"><label class="form-label">GPA</label><input type="text" placeholder="3.8/4.0" value="${escapeHTML(data.gpa || '')}" data-edu="${index}" data-field="gpa"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Start Year</label><input type="text" placeholder="2016" value="${escapeHTML(data.startDate || '')}" data-edu="${index}" data-field="startDate"></div>
      <div class="form-group"><label class="form-label">End Year</label><input type="text" placeholder="2020" value="${escapeHTML(data.endDate || '')}" data-edu="${index}" data-field="endDate"></div>
    </div>`;
  list.appendChild(item);
}

function addSkillCategory(data = {}) {
  const list = document.getElementById('skillsList');
  const index = list.children.length;
  const items = data.items || [];
  const item = document.createElement('div');
  item.className = 'repeatable-item';
  item.innerHTML = `
    <div class="item-header"><h4>Skill Category ${index + 1}</h4><button class="remove-btn" onclick="this.closest('.repeatable-item').remove()">✕</button></div>
    <div class="form-group"><label class="form-label">Category Name</label><input type="text" placeholder="Technical Skills" value="${escapeHTML(data.category || '')}" data-skill-cat="${index}"></div>
    <div class="form-group"><label class="form-label">Skills (press Enter to add)</label>
      <div class="skills-input-wrapper" data-skill-items="${index}">
        ${items.map(s => `<span class="skill-tag-input">${escapeHTML(s)}<span class="remove-skill" onclick="this.parentElement.remove()">✕</span></span>`).join('')}
        <input type="text" placeholder="Type a skill and press Enter" onkeydown="handleSkillInput(event, this)">
      </div>
    </div>`;
  list.appendChild(item);
}

function handleSkillInput(event, input) {
  if (event.key === 'Enter' && input.value.trim()) {
    event.preventDefault();
    const tag = document.createElement('span');
    tag.className = 'skill-tag-input';
    tag.innerHTML = `${escapeHTML(input.value.trim())}<span class="remove-skill" onclick="this.parentElement.remove()">✕</span>`;
    input.parentElement.insertBefore(tag, input);
    input.value = '';
  }
}

function addProject(data = {}) {
  const list = document.getElementById('projectsList');
  const index = list.children.length;
  const item = document.createElement('div');
  item.className = 'repeatable-item';
  item.innerHTML = `
    <div class="item-header"><h4>Project ${index + 1}</h4><button class="remove-btn" onclick="this.closest('.repeatable-item').remove()">✕</button></div>
    <div class="form-group"><label class="form-label">Project Name</label><input type="text" placeholder="E-Commerce Platform" value="${escapeHTML(data.name || '')}" data-proj="${index}" data-field="name"></div>
    <div class="form-group"><label class="form-label">Description</label><textarea rows="2" placeholder="Describe the project..." data-proj="${index}" data-field="description">${escapeHTML(data.description || '')}</textarea></div>
    <div class="form-group"><label class="form-label">Technologies (press Enter to add)</label>
      <div class="skills-input-wrapper" data-proj-tech="${index}">
        ${(data.technologies || []).map(t => `<span class="skill-tag-input">${escapeHTML(t)}<span class="remove-skill" onclick="this.parentElement.remove()">✕</span></span>`).join('')}
        <input type="text" placeholder="React, Node.js..." onkeydown="handleSkillInput(event, this)">
      </div>
    </div>`;
  list.appendChild(item);
}

function addCertification(data = {}) {
  const list = document.getElementById('certificationsList');
  const index = list.children.length;
  const item = document.createElement('div');
  item.className = 'repeatable-item';
  item.innerHTML = `
    <div class="item-header"><h4>Certification ${index + 1}</h4><button class="remove-btn" onclick="this.closest('.repeatable-item').remove()">✕</button></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Certification Name</label><input type="text" placeholder="AWS Solutions Architect" value="${escapeHTML(data.name || '')}" data-cert="${index}" data-field="name"></div>
      <div class="form-group"><label class="form-label">Issuer</label><input type="text" placeholder="Amazon Web Services" value="${escapeHTML(data.issuer || '')}" data-cert="${index}" data-field="issuer"></div>
    </div>
    <div class="form-group" style="max-width: 200px;"><label class="form-label">Date</label><input type="text" placeholder="2023" value="${escapeHTML(data.date || '')}" data-cert="${index}" data-field="date"></div>`;
  list.appendChild(item);
}

function collectFormData() {
  const resume = Store.getResume() || {};
  ['fullName', 'title', 'email', 'phone', 'location', 'linkedin', 'summary'].forEach(field => {
    const el = document.getElementById(field);
    if (el) resume[field] = el.value;
  });
  resume.experience = [];
  document.querySelectorAll('#experienceList .repeatable-item').forEach(item => {
    const exp = {};
    item.querySelectorAll('[data-field]').forEach(input => { exp[input.dataset.field] = input.value; });
    exp.highlights = [];
    item.querySelectorAll('.highlights-list .highlight-row input').forEach(input => { if (input.value.trim()) exp.highlights.push(input.value.trim()); });
    resume.experience.push(exp);
  });
  resume.education = [];
  document.querySelectorAll('#educationList .repeatable-item').forEach(item => {
    const edu = {};
    item.querySelectorAll('[data-field]').forEach(input => { edu[input.dataset.field] = input.value; });
    resume.education.push(edu);
  });
  resume.skills = [];
  document.querySelectorAll('#skillsList .repeatable-item').forEach(item => {
    const catInput = item.querySelector('[data-skill-cat]');
    const cat = { category: catInput ? catInput.value : '', items: [] };
    item.querySelectorAll('.skill-tag-input').forEach(tag => { const text = tag.childNodes[0]?.textContent?.trim(); if (text) cat.items.push(text); });
    resume.skills.push(cat);
  });
  resume.projects = [];
  document.querySelectorAll('#projectsList .repeatable-item').forEach(item => {
    const proj = {};
    item.querySelectorAll('[data-field]').forEach(input => { proj[input.dataset.field] = input.value; });
    proj.technologies = [];
    item.querySelectorAll('.skill-tag-input').forEach(tag => { const text = tag.childNodes[0]?.textContent?.trim(); if (text) proj.technologies.push(text); });
    resume.projects.push(proj);
  });
  resume.certifications = [];
  document.querySelectorAll('#certificationsList .repeatable-item').forEach(item => {
    const cert = {};
    item.querySelectorAll('[data-field]').forEach(input => { cert[input.dataset.field] = input.value; });
    resume.certifications.push(cert);
  });
  Store.setResume(resume);
  return resume;
}

function loadExistingData() { const resume = Store.getResume(); if (resume && resume.fullName) populateForm(resume); }

function setupAutosave() {
  const debouncedSave = debounce(() => { collectFormData(); updateAutosaveIndicator(true); setTimeout(() => updateAutosaveIndicator(false), 1000); }, 1500);
  document.addEventListener('input', (e) => { if (e.target.closest('.builder-form')) debouncedSave(); });
}

function updateAutosaveIndicator(saving) {
  const indicator = document.getElementById('autosaveIndicator');
  if (!indicator) return;
  const dot = indicator.querySelector('.autosave-dot');
  const text = indicator.querySelector('span:last-child');
  if (saving) { dot.classList.add('saving'); text.textContent = 'Saving...'; }
  else { dot.classList.remove('saving'); text.textContent = 'All changes saved'; }
}

function saveBeforePreview() { collectFormData(); }

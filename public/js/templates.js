/**
 * Templates Page — Browse, filter, and select resume templates
 */
document.addEventListener('DOMContentLoaded', async () => { await loadTemplates(); setupFilters(); });

async function loadTemplates(category = 'all') {
  const grid = document.getElementById('templatesGrid');
  if (!grid) return;
  try {
    const templates = await API.getTemplates(category);
    const selected = Store.getTemplate();
    grid.innerHTML = templates.map(t => `<div class="template-card ${t.id === selected ? 'selected' : ''}" data-id="${t.id}" onclick="selectTemplate('${t.id}')"><div class="template-card-preview" style="background: ${t.id === 'developer' ? '#0f172a' : '#f1f5f9'}">${renderMiniResume(t.colors)}</div><div class="template-card-body"><h3>${escapeHTML(t.name)}</h3><p>${escapeHTML(t.description)}</p><div class="template-card-meta"><span class="template-category">${escapeHTML(t.category)}</span>${t.popular ? '<span class="template-popular">⭐ Popular</span>' : ''}</div></div></div>`).join('');
  } catch (err) { console.error('Failed to load templates:', err); grid.innerHTML = '<p style="text-align:center;color:var(--neutral-500);padding:var(--space-10);">Failed to load templates. Please refresh.</p>'; }
}

function setupFilters() {
  const filters = document.getElementById('templateFilters');
  if (!filters) return;
  filters.addEventListener('click', (e) => { const btn = e.target.closest('.filter-btn'); if (!btn) return; filters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); loadTemplates(btn.dataset.category); });
}

function selectTemplate(id) { Store.setTemplate(id); document.querySelectorAll('.template-card').forEach(card => { card.classList.toggle('selected', card.dataset.id === id); }); showToast(`Template "${id}" selected! Preview your resume to see it in action.`, 'success'); }

/**
 * Landing Page — App initialization and template preview
 */
document.addEventListener('DOMContentLoaded', async () => { initScrollAnimations(); await loadTemplatesPreviews(); });

async function loadTemplatesPreviews() {
  const container = document.getElementById('templatesPreview');
  if (!container) return;
  try {
    const templates = await API.getTemplates();
    const popular = templates.filter(t => t.popular).slice(0, 3);
    container.innerHTML = popular.map(t => `<a href="/templates.html" class="template-preview-card card" style="text-decoration:none;"><div class="template-thumbnail" style="background: ${t.id === 'developer' ? '#0f172a' : '#f8fafc'}">${renderMiniResume(t.colors)}</div><div class="template-info"><h3>${escapeHTML(t.name)}</h3><p>${escapeHTML(t.description)}</p>${t.popular ? '<span class="popular-badge">⭐ Popular</span>' : ''}</div></a>`).join('');
  } catch (err) { console.error('Failed to load templates:', err); }
}

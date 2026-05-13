/**
 * Utility functions shared across the application
 */

function showToast(message, type = 'info', duration = 4000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><span class="toast-message">${message}</span><span class="toast-close" onclick="this.parentElement.remove()">✕</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.animation = 'slideInRight 0.3s var(--ease-out) reverse forwards'; setTimeout(() => toast.remove(), 300); }, duration);
}

function showLoading(text = 'Processing...', subtext = 'This may take a moment') {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) { const lt = document.getElementById('loadingText'); const ls = document.getElementById('loadingSubtext'); if (lt) lt.textContent = text; if (ls) ls.textContent = subtext; overlay.classList.add('active'); }
}

function hideLoading() { const overlay = document.getElementById('loadingOverlay'); if (overlay) overlay.classList.remove('active'); }

function escapeHTML(str) { if (!str) return ''; const div = document.createElement('div'); div.textContent = str; return div.innerHTML; }

function debounce(fn, delay = 500) { let timer; return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); }; }

function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 50); });
  const toggle = document.getElementById('mobileToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) toggle.addEventListener('click', () => { links.classList.toggle('open'); });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) { const target = document.querySelector(this.getAttribute('href')); if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); } });
  });
}

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('animate-fade-in-up'); observer.unobserve(entry.target); } }); }, { threshold: 0.1 });
  document.querySelectorAll('.card, .step-card, .template-preview-card').forEach(el => { el.style.opacity = '0'; observer.observe(el); });
}

function renderMiniResume(colors) {
  return `<div class="mini-resume"><div class="mini-header" style="background: ${colors.primary}"></div><div class="mini-line w-60" style="background: ${colors.primary}30"></div><div class="mini-line w-85"></div><div class="mini-line w-70"></div><div class="mini-line section" style="background: ${colors.primary}"></div><div class="mini-line w-85"></div><div class="mini-line w-60"></div><div class="mini-line w-70"></div><div class="mini-line section" style="background: ${colors.primary}"></div><div class="mini-line w-45"></div><div class="mini-line w-60"></div></div>`;
}

document.addEventListener('DOMContentLoaded', () => { initNavbar(); initSmoothScroll(); });

/**
 * Portfolio Page — Generates and renders portfolio from resume data
 */

document.addEventListener('DOMContentLoaded', async () => { await loadPortfolio(); });

async function loadPortfolio() {
  const container = document.getElementById('portfolioContent');
  if (!container) return;
  const resumeData = Store.getResume();
  if (!resumeData || !resumeData.fullName) {
    container.innerHTML = '<div class="portfolio-empty container" style="padding-top: 100px;"><div class="empty-icon">🌐</div><h2>No Portfolio Yet</h2><p>Build your resume first, then generate your portfolio website automatically.</p><a href="/builder.html" class="btn btn-primary btn-lg">✨ Build Resume First</a></div>';
    return;
  }
  showLoading('🌐 Generating your portfolio...', 'Creating a personal website from your resume');
  try {
    let portfolio = Store.getPortfolio();
    if (!portfolio) { portfolio = await API.generatePortfolio(resumeData); Store.setPortfolio(portfolio); }
    hideLoading(); renderPortfolio(portfolio, resumeData);
  } catch (err) { hideLoading(); renderPortfolio(buildFallbackPortfolio(resumeData), resumeData); }
}

function buildFallbackPortfolio(data) {
  return { headline: `Hi, I'm ${data.fullName}`, tagline: `${data.title || 'Professional'} passionate about building great things`, aboutMe: data.summary || '', featuredProjects: (data.projects || []).map(p => ({ title: p.name, description: p.description, tags: p.technologies || [] })), testimonials: [], contactCTA: "Let's connect and build something amazing together.", skills: data.skills || [], experience: data.experience || [], education: data.education || [] };
}

function renderPortfolio(portfolio, resumeData) {
  const container = document.getElementById('portfolioContent');
  const e = escapeHTML;
  container.innerHTML = `
    <section class="portfolio-hero"><div class="container">
      <h1 class="animate-fade-in-up">${e(portfolio.headline || `Hi, I'm ${resumeData.fullName}`)}</h1>
      <p class="tagline animate-fade-in-up delay-2">${e(portfolio.tagline || resumeData.title || '')}</p>
      <div style="margin-top: var(--space-8); display: flex; gap: var(--space-4); justify-content: center;" class="animate-fade-in-up delay-3">
        <a href="/preview.html" class="btn btn-primary btn-lg">📄 View Resume</a>
        <a href="#contact" class="btn btn-secondary btn-lg">📬 Contact Me</a>
      </div>
    </div></section>

    <section class="portfolio-section"><div class="container">
      <h2 class="portfolio-section-title">About <span class="text-gradient">Me</span></h2>
      <div class="about-grid">
        <div class="about-text">${e(portfolio.aboutMe || resumeData.summary || '')}</div>
        <div class="about-stats">
          <div class="about-stat-card"><h3>${resumeData.experience?.length || 0}+</h3><p>Companies</p></div>
          <div class="about-stat-card"><h3>${countSkills(resumeData)}+</h3><p>Skills</p></div>
          <div class="about-stat-card"><h3>${resumeData.projects?.length || 0}+</h3><p>Projects</p></div>
          <div class="about-stat-card"><h3>${resumeData.certifications?.length || 0}</h3><p>Certifications</p></div>
        </div>
      </div>
    </div></section>

    ${resumeData.skills?.length ? `<section class="portfolio-section" style="background: var(--surface-1);"><div class="container"><h2 class="portfolio-section-title">My <span class="text-gradient">Skills</span></h2><div class="skills-showcase">${resumeData.skills.map(cat => `<div class="skill-group"><h3>${e(cat.category)}</h3><div class="skill-bars">${(cat.items || []).map(skill => `<div class="skill-bar-item"><div class="skill-bar-label"><span>${e(skill)}</span><span>${randomPercent()}%</span></div><div class="skill-bar-track"><div class="skill-bar-fill" style="width: ${randomPercent()}%"></div></div></div>`).join('')}</div></div>`).join('')}</div></div></section>` : ''}

    ${resumeData.experience?.length ? `<section class="portfolio-section"><div class="container"><h2 class="portfolio-section-title">Work <span class="text-gradient">Experience</span></h2><div class="timeline">${resumeData.experience.map(exp => `<div class="timeline-item"><div class="timeline-dot"></div><h3>${e(exp.position)}</h3><div class="timeline-company">${e(exp.company)}</div><div class="timeline-dates">${e(exp.startDate)} — ${e(exp.endDate)}</div><p class="timeline-desc">${e(exp.description || '')}</p></div>`).join('')}</div></div></section>` : ''}

    ${(portfolio.featuredProjects?.length || resumeData.projects?.length) ? `<section class="portfolio-section" style="background: var(--surface-1);"><div class="container"><h2 class="portfolio-section-title">Featured <span class="text-gradient">Projects</span></h2><div class="projects-grid">${(portfolio.featuredProjects || resumeData.projects || []).map(p => `<div class="project-card"><div class="project-card-header"><h3>${e(p.title || p.name)}</h3></div><div class="project-card-body"><p>${e(p.description)}</p><div class="project-tags">${(p.tags || p.technologies || []).map(t => `<span class="project-tag">${e(t)}</span>`).join('')}</div></div></div>`).join('')}</div></div></section>` : ''}

    ${portfolio.testimonials?.length ? `<section class="portfolio-section"><div class="container"><h2 class="portfolio-section-title">What People <span class="text-gradient">Say</span></h2><div class="testimonials-grid">${portfolio.testimonials.map(t => `<div class="testimonial-card card"><blockquote>${e(t.quote)}</blockquote><div class="testimonial-author">${e(t.author)}</div><div class="testimonial-role">${e(t.role)}</div></div>`).join('')}</div></div></section>` : ''}

    <section class="portfolio-cta" id="contact"><div class="container"><h2>Let's <span class="text-gradient">Connect</span></h2><p>${e(portfolio.contactCTA || "I'm always open to new opportunities.")}</p>${resumeData.email ? `<a href="mailto:${e(resumeData.email)}" class="btn btn-primary btn-lg">📧 Get In Touch</a>` : ''}</div></section>

    <footer class="footer" style="margin-top: 0;"><div class="container"><div class="footer-bottom" style="border: none; padding: 0;"><p>&copy; 2026 ${e(resumeData.fullName)}. Built with ResumeAI.</p><p>${e(resumeData.email || '')}</p></div></div></footer>`;

  setTimeout(() => { document.querySelectorAll('.skill-bar-fill').forEach(bar => { bar.style.width = bar.style.width; }); }, 500);
}

function countSkills(data) { return (data.skills || []).reduce((sum, cat) => sum + (cat.items?.length || 0), 0); }
function randomPercent() { return Math.floor(Math.random() * 20) + 75; }

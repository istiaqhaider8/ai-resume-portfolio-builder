/**
 * AI Service — Handles AI-powered content generation
 * Uses OpenAI API when available, falls back to intelligent local generation
 */

const DEMO_MODE = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo_mode';

export async function generateResume(userInput) {
  if (!DEMO_MODE) return await callOpenAI(buildResumePrompt(userInput));
  return generateLocalResume(userInput);
}

export async function improveSection(section, content, tone = 'professional') {
  if (!DEMO_MODE) return await callOpenAI(buildImprovementPrompt(section, content, tone));
  return improveLocally(section, content);
}

export async function generatePortfolio(resumeData) {
  if (!DEMO_MODE) return await callOpenAI(buildPortfolioPrompt(resumeData));
  return generateLocalPortfolio(resumeData);
}

async function callOpenAI(messages) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({ model: 'gpt-4o-mini', messages, temperature: 0.7, max_tokens: 2000 })
  });
  if (!response.ok) throw new Error(`OpenAI API error: ${response.statusText}`);
  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

function buildResumePrompt(userInput) {
  return [
    { role: 'system', content: 'You are a professional resume writer. Given plain English input about a person, generate a structured resume in JSON format with fields: fullName, title, email, phone, location, linkedin, website, summary, experience (array with company, position, startDate, endDate, description, highlights), education (array with institution, degree, field, startDate, endDate, gpa), skills (array with category, items), certifications (array with name, issuer, date), projects (array with name, description, technologies). Make it professional, concise, and impactful.' },
    { role: 'user', content: userInput }
  ];
}

function buildImprovementPrompt(section, content, tone) {
  return [
    { role: 'system', content: `Improve the following ${section} section. Make it more ${tone}. Use strong action verbs, quantify achievements. Return improved content as JSON string.` },
    { role: 'user', content: JSON.stringify(content) }
  ];
}

function buildPortfolioPrompt(resumeData) {
  return [
    { role: 'system', content: 'Given resume data, generate portfolio website content in JSON format with: headline, tagline, aboutMe, featuredProjects (title, description, tags), testimonials (quote, author, role), contactCTA.' },
    { role: 'user', content: JSON.stringify(resumeData) }
  ];
}

function generateLocalResume(userInput) {
  const input = userInput.toLowerCase();
  let fullName = 'Alex Johnson';
  const namePatterns = [/my name is ([a-z\s]+?)[\.,\s](?:and|i)/i, /i'?m ([a-z\s]+?)[\.,\s](?:and|i|a|an)/i, /i am ([a-z\s]+?)[\.,\s]/i];
  for (const pattern of namePatterns) {
    const match = userInput.match(pattern);
    if (match) { fullName = match[1].trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '); break; }
  }

  let email = 'alex.johnson@email.com';
  const emailMatch = userInput.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) email = emailMatch[0];

  let title = 'Software Engineer';
  const titleKeywords = {
    'frontend': 'Frontend Developer', 'backend': 'Backend Developer', 'full stack': 'Full Stack Developer',
    'data scientist': 'Data Scientist', 'devops': 'DevOps Engineer', 'designer': 'UI/UX Designer',
    'product manager': 'Product Manager', 'mobile': 'Mobile Developer', 'cloud': 'Cloud Architect',
    'security': 'Security Engineer', 'marketing': 'Marketing Manager', 'engineer': 'Software Engineer',
    'developer': 'Software Developer', 'analyst': 'Business Analyst', 'consultant': 'Technology Consultant'
  };
  for (const [keyword, value] of Object.entries(titleKeywords)) {
    if (input.includes(keyword)) { title = value; break; }
  }

  let years = '5+';
  const yearsMatch = input.match(/(\d+)\s*(?:\+\s*)?years?/);
  if (yearsMatch) years = yearsMatch[1];

  const techSkills = [];
  const skillMap = {
    'javascript': 'JavaScript', 'typescript': 'TypeScript', 'python': 'Python', 'java': 'Java',
    'react': 'React', 'angular': 'Angular', 'vue': 'Vue.js', 'node': 'Node.js',
    'express': 'Express.js', 'docker': 'Docker', 'kubernetes': 'Kubernetes', 'aws': 'AWS',
    'azure': 'Azure', 'sql': 'SQL', 'mongodb': 'MongoDB', 'postgres': 'PostgreSQL',
    'redis': 'Redis', 'git': 'Git', 'html': 'HTML5', 'css': 'CSS3',
    'graphql': 'GraphQL', 'next': 'Next.js', 'tailwind': 'Tailwind CSS', 'linux': 'Linux',
    'c++': 'C++', 'c#': 'C#', 'swift': 'Swift', 'kotlin': 'Kotlin',
    'rust': 'Rust', 'go': 'Go', 'php': 'PHP', 'ruby': 'Ruby'
  };
  for (const [key, value] of Object.entries(skillMap)) {
    if (input.includes(key)) techSkills.push(value);
  }
  if (techSkills.length === 0) techSkills.push('JavaScript', 'Python', 'React', 'Node.js', 'SQL');

  const companies = [];
  const companyMatch = userInput.match(/(?:worked?\s+(?:at|for|with)|at|company:?)\s+([A-Z][a-zA-Z\s&.]+?)[\.,\s]/g);
  if (companyMatch) {
    companyMatch.forEach(m => {
      const name = m.replace(/(?:worked?\s+(?:at|for|with)|at|company:?)\s+/i, '').replace(/[\.,\s]$/, '');
      if (name.length > 1) companies.push(name);
    });
  }

  let degree = "Bachelor's";
  let field = 'Computer Science';
  if (input.includes('master')) degree = "Master's";
  if (input.includes('phd') || input.includes('doctorate')) degree = 'Ph.D.';
  if (input.includes('mba')) { degree = 'MBA'; field = 'Business Administration'; }

  const fieldMap = { 'computer science': 'Computer Science', 'electrical': 'Electrical Engineering', 'business': 'Business Administration', 'finance': 'Finance', 'marketing': 'Marketing', 'economics': 'Economics', 'mathematics': 'Mathematics', 'data science': 'Data Science' };
  for (const [key, value] of Object.entries(fieldMap)) {
    if (input.includes(key)) { field = value; break; }
  }

  return {
    fullName, title, email, phone: '(555) 123-4567', location: 'San Francisco, CA',
    linkedin: `linkedin.com/in/${fullName.toLowerCase().replace(/\s+/g, '')}`, website: '',
    summary: `Results-driven ${title} with ${years}+ years of experience building scalable, high-performance applications. Proven track record in delivering innovative solutions that drive business growth. Skilled in ${techSkills.slice(0, 4).join(', ')}, with a strong focus on user experience and system reliability.`,
    experience: [
      { company: companies[0] || 'TechCorp Solutions', position: `Senior ${title}`, startDate: '2021', endDate: 'Present', description: 'Lead development of enterprise-scale applications serving 100K+ users.', highlights: ['Architected and deployed microservices infrastructure, reducing system latency by 40%', 'Led a cross-functional team of 8 engineers through 3 major product launches', 'Implemented CI/CD pipelines that reduced deployment time from 2 hours to 15 minutes', 'Mentored 5 junior developers, improving team velocity by 25%'] },
      { company: companies[1] || 'InnovateTech Inc.', position: title, startDate: '2018', endDate: '2021', description: 'Developed and maintained high-traffic web applications.', highlights: ['Built RESTful APIs handling 10M+ daily requests with 99.9% uptime', 'Optimized database queries resulting in 60% improvement in page load times', 'Collaborated with product and design teams to deliver 15+ feature releases', 'Introduced automated testing, achieving 90% code coverage'] }
    ],
    education: [{ institution: 'University of Technology', degree, field, startDate: '2014', endDate: '2018', gpa: '3.8/4.0' }],
    skills: [{ category: 'Technical Skills', items: techSkills.slice(0, 8) }, { category: 'Soft Skills', items: ['Leadership', 'Communication', 'Problem Solving', 'Team Collaboration', 'Agile Methodology'] }, { category: 'Tools & Platforms', items: ['Git', 'VS Code', 'Jira', 'Figma', 'Docker'] }],
    certifications: [{ name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: '2023' }],
    projects: [
      { name: 'E-Commerce Platform', description: 'Full-stack e-commerce application with real-time inventory management, payment processing, and analytics dashboard.', technologies: techSkills.slice(0, 4) },
      { name: 'Analytics Dashboard', description: 'Real-time data visualization platform processing 1M+ events daily with interactive charts and automated reporting.', technologies: ['React', 'D3.js', 'Node.js', 'PostgreSQL'] }
    ]
  };
}

function improveLocally(section, content) {
  if (typeof content === 'string') {
    return content.replace(/helped/gi, 'spearheaded').replace(/worked on/gi, 'engineered').replace(/made/gi, 'developed').replace(/used/gi, 'leveraged').replace(/responsible for/gi, 'drove').replace(/managed/gi, 'directed and optimized') + ' — resulting in measurable improvements in efficiency and performance.';
  }
  if (Array.isArray(content)) return content.map(item => improveLocally(section, item));
  if (typeof content === 'object' && content !== null) {
    const improved = { ...content };
    if (improved.description) improved.description = improveLocally(section, improved.description);
    if (improved.highlights) improved.highlights = improved.highlights.map(h => improveLocally(section, h));
    return improved;
  }
  return content;
}

function generateLocalPortfolio(resumeData) {
  const name = resumeData.fullName || 'Alex Johnson';
  const title = resumeData.title || 'Software Engineer';
  return {
    headline: `Hi, I'm ${name}`,
    tagline: `${title} crafting digital experiences that make a difference`,
    aboutMe: `I'm a passionate ${title} with a love for building elegant solutions to complex problems. ${resumeData.summary || ''} When I'm not coding, you'll find me exploring new technologies, contributing to open source, and mentoring aspiring developers.`,
    featuredProjects: (resumeData.projects || []).map(p => ({ title: p.name, description: p.description, tags: p.technologies || [] })),
    testimonials: [
      { quote: `${name} is one of the most talented engineers I've worked with. Their attention to detail and ability to solve complex problems is exceptional.`, author: 'Sarah Chen', role: 'Engineering Director' },
      { quote: `Working with ${name} was a game-changer for our project. They brought innovative ideas and flawless execution.`, author: 'Michael Rodriguez', role: 'Product Manager' }
    ],
    contactCTA: "Let's build something amazing together. I'm always open to new opportunities and collaborations.",
    skills: resumeData.skills || [], experience: resumeData.experience || [], education: resumeData.education || []
  };
}

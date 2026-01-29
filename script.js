// Theme toggle
const html = document.documentElement;
const toggle = document.getElementById('themeToggle');
toggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});
const saved = localStorage.getItem('theme');
if (saved) html.setAttribute('data-theme', saved);

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
});

// Close menu when clicking on a link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Floating particles background
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let w, h;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

function createParticles(count = 80) {
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 2 + 0.6,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6,
    hue: Math.random() < 0.5 ? 190 : 260
  }));
}
createParticles();

function draw() {
  ctx.clearRect(0, 0, w, h);
  // subtle gradient
  const grad = ctx.createRadialGradient(w*0.1, h*0.1, 0, w*0.1, h*0.1, w*0.8);
  grad.addColorStop(0, 'rgba(34, 211, 238, 0.06)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > w) p.vx *= -1;
    if (p.y < 0 || p.y > h) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, 0.7)`;
    ctx.shadowColor = `hsla(${p.hue}, 100%, 70%, 0.8)`;
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  // connect nearby particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i], b = particles[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 120) {
        ctx.strokeStyle = 'rgba(167, 139, 250, 0.12)';
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(draw);
}
draw();

// Scroll reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('reveal');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.glass, .project-card, .skill, .about-card').forEach(el => {
  el.style.opacity = 0;
  el.style.transform = 'translateY(12px)';
  observer.observe(el);
});

// Reveal styles injected for smoothness
const style = document.createElement('style');
style.textContent = `
  .reveal { opacity: 1 !important; transform: translateY(0) !important; transition: opacity .5s ease, transform .5s ease; }
`;
document.head.appendChild(style);
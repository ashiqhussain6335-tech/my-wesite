// Mobile nav toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
if(hamburger && mobileMenu){
  hamburger.addEventListener('click',()=>{
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click',()=>{
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });
}

// Active nav link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a=>{
  const href = a.getAttribute('href');
  if(href === currentPage || (currentPage === '' && href === 'index.html')){
    a.classList.add('active');
  }
});

// Fade animation on scroll
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('visible'); observer.unobserve(e.target); }
  });
},{threshold:0.1, rootMargin:'0px 0px -50px 0px'});
document.querySelectorAll('.fade-up,.fade-left,.fade-right,.scale-up').forEach(el=>observer.observe(el));

// Animated counters
function animateCounter(el, target, suffix){
  const duration = 2000;
  let start = null;
  const step = (timestamp)=>{
    if(!start) start = timestamp;
    const progress = Math.min((timestamp - start)/duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if(progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const counterObserver = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const el = e.target;
      animateCounter(el, parseInt(el.dataset.target), el.dataset.suffix || '');
      counterObserver.unobserve(el);
    }
  });
},{threshold:0.5});
document.querySelectorAll('[data-target]').forEach(el=>counterObserver.observe(el));

// Contact form — ACTUALLY SUBMITS via Formspree
const form = document.getElementById('contact-form');
if(form){
  form.addEventListener('submit', function(e){
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending...';
    
    const formData = new FormData(form);
    
    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    }).then(response => {
      if(response.ok){
        btn.textContent = '✓ Message Sent!';
        btn.style.background = '#2563eb';
        form.reset();
        setTimeout(()=>{ btn.textContent = originalText; btn.style.background = ''; btn.disabled = false; }, 4000);
      } else {
        throw new Error('Failed');
      }
    }).catch(()=>{
      btn.textContent = '✗ Error — Try Again';
      btn.style.background = '#e74c3c';
      setTimeout(()=>{ btn.textContent = originalText; btn.style.background = ''; btn.disabled = false; }, 3000);
    });
  });
}

// Particle background
const canvas = document.getElementById('particles-canvas');
if(canvas){
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];
  
  function resize(){
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor(){
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.r = Math.random() * 2 + 0.5;
      this.alpha = Math.random() * 0.4 + 0.1;
    }
    update(){
      this.x += this.vx;
      this.y += this.vy;
      if(this.x < 0 || this.x > w) this.vx *= -1;
      if(this.y < 0 || this.y > h) this.vy *= -1;
    }
    draw(){
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(59, 130, 246, ${this.alpha})`;
      ctx.fill();
    }
  }

  const count = Math.min(60, Math.floor((w * h) / 15000));
  for(let i = 0; i < count; i++) particles.push(new Particle());

  function connectParticles(){
    for(let i = 0; i < particles.length; i++){
      for(let j = i + 1; j < particles.length; j++){
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < 150){
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(59, 130, 246, ${0.06 * (1 - dist/150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate(){
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animate);
  }
  animate();
}

// Parallax
const parallaxBgs = document.querySelectorAll('.parallax-bg');
if(parallaxBgs.length){
  window.addEventListener('scroll', ()=>{
    parallaxBgs.forEach(bg => {
      const rect = bg.parentElement.getBoundingClientRect();
      bg.style.transform = `translateY(${rect.top * 0.3}px)`;
    });
  }, {passive: true});
}

// Nav scroll effect
const nav = document.querySelector('nav');
if(nav){
  window.addEventListener('scroll', ()=>{
    nav.style.background = window.scrollY > 100 ? 'rgba(11,18,32,0.95)' : 'rgba(11,18,32,0.85)';
  }, {passive: true});
}

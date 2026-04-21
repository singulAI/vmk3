  // --- ESTADO ---
  let currentLang = 'pt';
  let typedInstance = null;

  function renderProjects() {
    const el = document.getElementById('project-list');
    if (!el) return;
    DataService.getProjects().then(projects => {
      el.innerHTML = '';
      projects.forEach((p, i) => {
        const media = p.isImage
          ? `<img src="${p.image}" alt="${p.title[currentLang]}" class="project-card-img" loading="lazy"/>`
          : `<iframe style="width:100%;height:220px;border:none" src="https://www.youtube.com/embed/${p.embedId}" allowfullscreen></iframe>`;
        el.innerHTML += `
        <div class="project-card" data-aos="fade-up" data-aos-delay="${i * 80}">
          <a href="${p.link}" target="_blank" style="text-decoration:none;color:inherit">
            <div style="overflow:hidden">${media}</div>
            <div class="project-card-body">
              <h3 class="project-card-title">${p.title[currentLang]}</h3>
              <div class="project-card-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
              </div>
            </div>
          </a>
        </div>`;
      });
    });
  }

  function renderGpts() {
    const el = document.getElementById('gpt-list');
    if (!el) return;
    DataService.getGPTs().then(gpts => {
      el.innerHTML = '';
      gpts.forEach((g, i) => {
        el.innerHTML += `
        <div class="gpt-card" data-aos="fade-up" data-aos-delay="${i * 80}">
          <div class="gpt-card-icon">${g.icon}</div>
          <h3>${g.title[currentLang]}</h3>
          <p>${g.description[currentLang]}</p>
          <a href="${g.link}" target="_blank" class="gpt-btn">${currentLang === 'pt' ? 'Acessar Ferramenta' : 'Access Tool'}</a>
        </div>`;
      });
    });
  }

  function renderBlog() {
    const el = document.getElementById('blog-posts-container');
    if (!el) return;
    DataService.getPosts().then(posts => {
      el.innerHTML = '';
      posts.forEach((p, i) => {
        el.innerHTML += `
        <div class="blog-card" data-aos="fade-up" data-aos-delay="${i * 80}">
          <div class="blog-card-date">${p.date}</div>
          <h3 class="blog-card-title">${p.title}</h3>
          <p class="blog-card-excerpt">${p.excerpt || ''}</p>
        </div>`;
      });
    });
  }

  let chartInstance = null;
  function renderBI() {
    const canvas = document.getElementById('performanceChart');
    if (!canvas) return;
    DataService.getMetricasBI().then(data => {
      if (chartInstance) chartInstance.destroy();
      chartInstance = new Chart(canvas, {
        type: 'line',
        data: data,
        options: {
          responsive: true,
          plugins: { legend: { labels: { color: '#fff' } } },
          scales: {
            x: { ticks: { color: 'rgba(255,255,255,.6)' }, grid: { color: 'rgba(255,255,255,.05)' } },
            y: { ticks: { color: 'rgba(255,255,255,.6)' }, grid: { color: 'rgba(255,255,255,.05)' } }
          }
        }
      });
    });
  }

  function updateTyped() {
    if (typedInstance) typedInstance.destroy();
    const strings = currentLang==='pt'
      ? ['Especialista em Marketing Digital','Gestor de Tráfego Pago','Consultor de Performance']
      : ['Digital Marketing Specialist','Paid Traffic Manager','Performance Consultant'];
    typedInstance = new Typed('#typed-title', {strings, typeSpeed:50, backSpeed:30, loop:true});
  }

  function updateTexts() {
    document.querySelectorAll('[data-lang]').forEach(el => {
      const map = {};
      el.dataset.lang.split('|').forEach(item => {
        const idx = item.indexOf(':');
        map[item.slice(0,idx)] = item.slice(idx+1);
      });
      const val = map[currentLang] || map['pt'];
      if(val) el.innerHTML = val;
    });
  }

  function changeLang(lang) {
    currentLang = lang;
    document.getElementById('btn-pt').classList.toggle('active', lang==='pt');
    document.getElementById('btn-en').classList.toggle('active', lang==='en');
    updateTexts(); updateTyped(); renderProjects(); renderGpts();
  }

  function toggleDrawer(id) {
    const d = document.getElementById(id);
    const o = document.getElementById('overlay');
    const open = d.style.transform === 'translateX(0px)' || d.style.transform === 'translateX(0%)' || (d.style.transform==='' && !d.classList.contains('init'));
    closeAllDrawers();
    if (!open || d.style.transform==='translateX(100%)') {
      d.style.transform = 'translateX(0)';
      o.style.display = 'block';
    }
    d.classList.add('init');
  }

  function closeAllDrawers() {
    document.querySelectorAll('.drawer').forEach(d => { d.style.transform = 'translateX(100%)'; });
    document.getElementById('overlay').style.display = 'none';
  }

  function toggleMobileMenu() {
    document.getElementById('nav-links').classList.toggle('open');
  }
  function closeMobileMenu() {
    document.getElementById('nav-links').classList.remove('open');
  }

  // Scroll nav
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
  });

  // Custom cursor
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; cursor.style.left=mx+'px'; cursor.style.top=my+'px'; });
  function animRing() {
    rx += (mx-rx)*.12; ry += (my-ry)*.12;
    ring.style.left=rx+'px'; ring.style.top=ry+'px';
    requestAnimationFrame(animRing);
  }
  animRing();
  document.querySelectorAll('a,button,.skill-tag,.project-card,.gpt-card,.fab').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.style.transform='translate(-50%,-50%) scale(2)'; ring.style.transform='translate(-50%,-50%) scale(1.5)'; ring.style.opacity='.8'; });
    el.addEventListener('mouseleave', () => { cursor.style.transform='translate(-50%,-50%) scale(1)'; ring.style.transform='translate(-50%,-50%) scale(1)'; ring.style.opacity='.5'; });
  });

  document.addEventListener('DOMContentLoaded', () => {
    AOS.init({duration:700, easing:'ease-out-cubic', once:true});
    changeLang('pt');
    renderBlog();
    renderBI();
  });

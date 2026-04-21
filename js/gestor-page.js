  let sessionGestor = null;
  let editingPostId = null;
  let chartInstance = null;

  function fazerLogin() {
    const email = document.getElementById('login-email').value.trim();
    const senha = document.getElementById('login-senha').value;
    DataService.loginGestor(email, senha).then(res => {
      if (res.success) {
        sessionGestor = res;
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('dashboard-screen').style.display = 'block';
        document.getElementById('nav-username').textContent = res.email;
        document.getElementById('btn-logout').style.display = 'inline-block';
        carregarTudo();
      } else {
        document.getElementById('login-error').style.display = 'block';
      }
    });
  }

  function logout() {
    sessionGestor = null;
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('dashboard-screen').style.display = 'none';
    document.getElementById('btn-logout').style.display = 'none';
    document.getElementById('login-senha').value = '';
  }

  function openTab(id) {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + id).classList.add('active');
    event.target.classList.add('active');
  }

  function carregarTudo() {
    carregarProjetosImg();
    carregarProjetosTbl();
    carregarPosts();
    carregarBI();
    carregarClientes();
    carregarDemandas();
    carregarAvaliacoes();
  }

  // ── IMAGENS ──────────────────────────────────────────────
  function atualizarHero() {
    const url = document.getElementById('img-hero-url').value.trim();
    if (!url) return;
    DataService.atualizarImagemHero(url).then(() => mostrarOk('hero-ok'));
  }

  function carregarProjetosImg() {
    DataService.getProjects().then(ps => {
      document.getElementById('kpi-projetos').textContent = ps.length;
      const body = document.getElementById('projetos-img-body');
      body.innerHTML = ps.map(p => `
        <tr>
          <td>${p.title}</td>
          <td><img class="img-preview" src="${p.img}" alt="" onerror="this.style.opacity='.2'"/></td>
          <td><input type="text" id="img-url-${p.id}" value="${p.img}" style="background:#0a0a0a;border:1px solid rgba(255,255,255,.12);border-radius:6px;padding:.4rem .7rem;color:#fff;font-size:.82rem;width:220px;outline:none"/></td>
          <td><button class="btn-edit" onclick="salvarImgProjeto(${p.id})">Salvar</button></td>
        </tr>`).join('');
    });
  }

  function salvarImgProjeto(id) {
    const url = document.getElementById('img-url-' + id).value.trim();
    DataService.atualizarImagemProjeto(id, url).then(() => carregarProjetosImg());
  }

  // ── PROJETOS ─────────────────────────────────────────────
  function carregarProjetosTbl() {
    DataService.getProjects().then(ps => {
      const body = document.getElementById('projetos-body');
      body.innerHTML = ps.map(p => `
        <tr>
          <td>${p.title}</td>
          <td>${p.categoria || '—'}</td>
          <td><a href="${p.link}" target="_blank" style="font-size:.8rem">${p.link ? 'Abrir ↗' : '—'}</a></td>
          <td><button class="btn-edit">Editar</button></td>
        </tr>`).join('');
    });
  }

  // ── BLOG ─────────────────────────────────────────────────
  function carregarPosts() {
    DataService.getPosts().then(posts => {
      document.getElementById('kpi-posts').textContent = posts.length;
      const body = document.getElementById('posts-body');
      body.innerHTML = posts.map(p => `
        <tr>
          <td>${p.title}</td>
          <td>${p.date}</td>
          <td style="display:flex;gap:.5rem">
            <button class="btn-edit" onclick="editarPost(${p.id})">Editar</button>
            <button class="btn-del" onclick="deletarPost(${p.id})">Excluir</button>
          </td>
        </tr>`).join('');
    });
  }

  function salvarPost() {
    const titulo = document.getElementById('post-titulo').value.trim();
    const resumo = document.getElementById('post-resumo').value.trim();
    const data = document.getElementById('post-data').value.trim();
    if (!titulo) return;
    const op = editingPostId
      ? DataService.updatePost(editingPostId, { title: titulo, excerpt: resumo, date: data })
      : DataService.addPost({ title: titulo, excerpt: resumo, date: data });
    op.then(() => {
      cancelarPost();
      carregarPosts();
      mostrarOk('post-ok');
    });
  }

  function editarPost(id) {
    DataService.getPosts().then(posts => {
      const p = posts.find(x => x.id === id);
      if (!p) return;
      editingPostId = id;
      document.getElementById('post-titulo').value = p.title;
      document.getElementById('post-resumo').value = p.excerpt || '';
      document.getElementById('post-data').value = p.date || '';
      document.getElementById('form-post-title').textContent = 'Editar Post';
      document.getElementById('btn-cancelar-post').style.display = 'inline-block';
    });
  }

  function deletarPost(id) {
    if (!confirm('Excluir este post?')) return;
    DataService.deletePost(id).then(carregarPosts);
  }

  function cancelarPost() {
    editingPostId = null;
    ['post-titulo','post-resumo','post-data'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('form-post-title').textContent = 'Novo Post';
    document.getElementById('btn-cancelar-post').style.display = 'none';
  }

  // ── BI ────────────────────────────────────────────────────
  function carregarBI() {
    DataService.getMetricasBI().then(m => {
      renderBIInputs(m);
      renderGestorChart(m);
    });
  }

  function renderBIInputs(m) {
    const container = document.getElementById('bi-inputs');
    container.innerHTML = m.labels.map((label, i) => `
      <div>
        <label>${label}</label>
        <input type="number" id="bi-val-${i}" value="${m.valores[i]}"/>
      </div>`).join('');
  }

  function salvarBI() {
    DataService.getMetricasBI().then(m => {
      const novosValores = m.labels.map((_, i) => Number(document.getElementById('bi-val-' + i).value));
      DataService.updateMetricasBI({ ...m, valores: novosValores }).then(() => {
        DataService.getMetricasBI().then(updated => {
          renderGestorChart(updated);
          mostrarOk('bi-ok');
        });
      });
    });
  }

  function renderGestorChart(m) {
    const ctx = document.getElementById('gestorChart').getContext('2d');
    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: m.labels,
        datasets: [{
          label: 'Métricas',
          data: m.valores,
          backgroundColor: 'rgba(204,255,0,.5)',
          borderColor: '#CCFF00',
          borderWidth: 2,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: '#888' } } },
        scales: {
          x: { ticks: { color: '#888' }, grid: { color: 'rgba(255,255,255,.04)' } },
          y: { ticks: { color: '#888' }, grid: { color: 'rgba(255,255,255,.04)' } }
        }
      }
    });
  }

  // ── CLIENTES ─────────────────────────────────────────────
  function carregarClientes() {
    DataService.listarClientes().then(clientes => {
      document.getElementById('kpi-clientes').textContent = clientes.length;
      const body = document.getElementById('clientes-body');
      body.innerHTML = clientes.map(c => `
        <tr>
          <td>${c.nome}</td>
          <td>${c.email}</td>
          <td>${c.desde}</td>
          <td>${c.demandas}</td>
        </tr>`).join('');
    });
  }

  // ── DEMANDAS ─────────────────────────────────────────────
  function carregarDemandas() {
    DataService.getDemandas().then(demandas => {
      document.getElementById('kpi-demandas').textContent = demandas.length;
      const body = document.getElementById('demandas-body');
      if (!demandas.length) {
        body.innerHTML = '<tr><td colspan="6" style="color:var(--gray);padding:1rem">Sem demandas abertas.</td></tr>';
        return;
      }
      body.innerHTML = demandas.map(d => `
        <tr>
          <td>${d.cliente || '—'}</td>
          <td>${d.assunto}</td>
          <td>${d.servico}</td>
          <td>${d.prioridade}</td>
          <td>${d.data}</td>
          <td><span class="badge badge-open">${d.status}</span></td>
        </tr>`).join('');
    });
  }

  // ── AVALIAÇÕES ───────────────────────────────────────────
  function carregarAvaliacoes() {
    // consolidado mockado — em produção: GET /api/avaliacoes/all
    const mock = [
      { cliente: 'Cliente Demo', servico: 'Tráfego Pago', nota: 5 },
      { cliente: 'Cliente Demo', servico: 'Consultoria IA', nota: 4 }
    ];
    const body = document.getElementById('avaliacoes-body');
    body.innerHTML = mock.map(a => `
      <tr>
        <td>${a.cliente}</td>
        <td>${a.servico}</td>
        <td>${'★'.repeat(a.nota)}${'☆'.repeat(5 - a.nota)}</td>
      </tr>`).join('');
  }

  // ── HELPERS ──────────────────────────────────────────────
  function mostrarOk(id) {
    const el = document.getElementById(id);
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 3000);
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !sessionGestor) fazerLogin();
  });

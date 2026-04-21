  let sessionUser = null;

  function fazerLogin() {
    const email = document.getElementById('login-email').value.trim();
    const senha = document.getElementById('login-senha').value;
    DataService.loginCliente(email, senha).then(res => {
      if (res.success) {
        sessionUser = res;
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('dashboard-screen').style.display = 'block';
        document.getElementById('dash-nome').textContent = res.nome.toUpperCase();
        document.getElementById('nav-username').textContent = res.email;
        document.getElementById('btn-logout').style.display = 'inline-block';
        carregarTudo();
      } else {
        document.getElementById('login-error').style.display = 'block';
      }
    });
  }

  function logout() {
    sessionUser = null;
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('dashboard-screen').style.display = 'none';
    document.getElementById('btn-logout').style.display = 'none';
    document.getElementById('nav-username').textContent = '';
    document.getElementById('login-senha').value = '';
  }

  function openTab(id) {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + id).classList.add('active');
    event.target.classList.add('active');
    if (id === 'demandas') carregarDemandas();
  }

  function carregarTudo() {
    carregarDocumentos();
    carregarContratos();
    carregarRelatorios();
    carregarAvaliacoes();
  }

  function carregarDocumentos() {
    DataService.getDocumentos().then(docs => {
      const el = document.getElementById('lista-documentos');
      el.innerHTML = docs.map(d => `
        <div class="card-item">
          <span class="card-item-name">📄 ${d.nome}</span>
          <button class="download-btn" onclick="window.open('${d.url}')">Baixar</button>
        </div>`).join('');
    });
  }

  function carregarContratos() {
    DataService.getContratos().then(contratos => {
      const el = document.getElementById('lista-contratos');
      el.innerHTML = contratos.map(c => `
        <div class="card-item">
          <span class="card-item-name">📋 ${c.nome}</span>
          <span class="badge ${c.assinado ? 'badge-ok' : 'badge-pending'}">${c.assinado ? 'Assinado' : 'Pendente'}</span>
        </div>`).join('');
    });
  }

  function carregarRelatorios() {
    DataService.getRelatorios().then(rels => {
      const el = document.getElementById('lista-relatorios');
      el.innerHTML = rels.map(r => `
        <div class="card-item">
          <span class="card-item-name">📊 ${r.nome}</span>
          <button class="download-btn" onclick="window.open('${r.url}')">Visualizar</button>
        </div>`).join('');
    });
  }

  function carregarDemandas() {
    DataService.getDemandas().then(demandas => {
      const el = document.getElementById('lista-demandas');
      if (!demandas.length) {
        el.innerHTML = '<p class="empty-state">Nenhuma demanda aberta ainda.</p>';
        return;
      }
      el.innerHTML = `<table class="demandas-table">
        <thead><tr><th>Assunto</th><th>Serviço</th><th>Prioridade</th><th>Data</th><th>Status</th></tr></thead>
        <tbody>${demandas.map(d => `
          <tr>
            <td>${d.assunto}</td>
            <td>${d.servico}</td>
            <td>${d.prioridade}</td>
            <td>${d.data}</td>
            <td><span class="badge badge-open">${d.status}</span></td>
          </tr>`).join('')}
        </tbody></table>`;
    });
  }

  function enviarDemanda() {
    const assunto = document.getElementById('sac-assunto').value.trim();
    const servico = document.getElementById('sac-servico').value;
    const prioridade = document.getElementById('sac-prioridade').value;
    const descricao = document.getElementById('sac-descricao').value.trim();
    if (!assunto || !descricao) return alert('Preencha assunto e descrição.');
    DataService.enviarDemanda({ assunto, servico, prioridade, descricao }).then(() => {
      document.getElementById('sac-success').style.display = 'block';
      document.getElementById('sac-assunto').value = '';
      document.getElementById('sac-descricao').value = '';
      setTimeout(() => document.getElementById('sac-success').style.display = 'none', 3000);
    });
  }

  function carregarAvaliacoes() {
    DataService.getAvaliacoes().then(av => {
      renderStars('stars-trafico', av.trafico || 0);
      renderStars('stars-consultoria', av.consultoria || 0);
    });
  }

  function renderStars(containerId, nota) {
    const el = document.getElementById(containerId);
    const servico = el.dataset.servico;
    el.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      const s = document.createElement('span');
      s.className = 'star' + (i <= nota ? ' active' : '');
      s.textContent = '★';
      s.dataset.val = i;
      s.onclick = () => {
        DataService.salvarAvaliacao(servico, i).then(() => renderStars(containerId, i));
      };
      el.appendChild(s);
    }
  }

  // Login via Enter
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !sessionUser) fazerLogin();
  });

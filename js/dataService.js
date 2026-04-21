// js/dataService.js
// =======================================================
// MOCK SERVICE — substituir por chamadas fetch/API quando
// o backend estiver pronto.
//
// GUIA DE MIGRAÇÃO PARA BACKEND REAL
// ─────────────────────────────────────────────────────
// 1. Defina a BASE_URL abaixo (ex: 'https://api.seusite.com')
// 2. Altere USE_MOCK para false
// 3. Cada função já possui o endpoint REST equivalente
//    documentado como comentário ENDPOINT:.
// 4. Todas as funções retornam Promise — nenhum consumidor
//    precisa ser alterado após a migração.
// 5. Autenticação: adicione o header Authorization:
//    Bearer <token> nas chamadas autenticadas (Auth).
//
// ENDPOINTS ESPERADOS (REST/JSON)
// ─────────────────────────────────────────────────────
// GET    /api/projects              → lista de projetos
// PUT    /api/projects/:id          → atualiza projeto
// GET    /api/gpts                  → lista de GPTs
// GET    /api/posts                 → posts do blog
// POST   /api/posts                 → novo post
// PUT    /api/posts/:id             → editar post
// DELETE /api/posts/:id             → excluir post
// GET    /api/bi/metricas           → dados do gráfico BI
// PUT    /api/bi/metricas           → atualiza métricas BI
// POST   /api/auth/cliente          → login cliente
// POST   /api/auth/gestor           → login gestor
// GET    /api/cliente/documentos    → (Auth)
// GET    /api/cliente/contratos     → (Auth)
// GET    /api/cliente/relatorios    → (Auth)
// GET    /api/cliente/avaliacoes    → (Auth)
// POST   /api/cliente/avaliacoes    → (Auth) salvar avaliação
// POST   /api/cliente/demandas      → (Auth) abrir demanda
// GET    /api/cliente/demandas      → (Auth) listar demandas
// GET    /api/gestor/clientes       → (Auth) listar clientes
// PUT    /api/gestor/hero           → (Auth) atualizar hero
// PUT    /api/gestor/projetos/:id/imagem → (Auth)
// =======================================================

const USE_MOCK = true; // ← altere para false ao integrar backend
const BASE_URL = 'https://api.seusite.com'; // ← sua URL de produção

// ── localStorage helpers (persistência gestor → portfólio) ──────
function _lsGet(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch(e) { return fallback; }
}
function _lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch(e) {}
}

// ========== MOCK DATA ==========

const mockProjects = [
  {
    id: 'grupo-win',
    title: { pt: 'Grupo Win', en: 'Grupo Win' },
    image: 'assets/images/projeto-grupo-win.jpg',
    link: '#',
    isImage: true
  },
  {
    id: 'anjo-digital',
    title: { pt: 'Anjo Digital', en: 'Anjo Digital' },
    image: 'assets/images/projeto-anjo.jpg',
    link: '#',
    isImage: true
  },
  {
    id: 'sexta-pizza',
    title: { pt: 'Sexta da Pizza', en: 'Pizza Friday' },
    image: 'assets/images/projeto-sexta-pizza.svg',
    link: '#',
    isImage: true
  },
  {
    id: 'solucoes-atendimento',
    title: { pt: 'Soluções de Atendimento Inteligente', en: 'Smart Service Solutions' },
    image: 'assets/images/projeto-resposta-inteligente.jpg',
    link: '#',
    isImage: true
  },
  {
    id: 'singul-ai',
    title: { pt: 'Singul AI', en: 'Singul AI' },
    image: 'assets/images/projeto-singul-ai.svg',
    link: '#',
    isImage: true
  }
];

const mockGPTs = [
  {
    id: 'mentor-gpt',
    title: { pt: 'Mentor de Marketing & IA', en: 'Marketing & AI Mentor' },
    description: {
      pt: 'Um assistente de IA focado em responder dúvidas e aprimorar estratégias de marketing digital e uso de inteligência artificial em campanhas.',
      en: 'An AI assistant focused on answering questions and improving digital marketing strategies and the use of artificial intelligence in campaigns.'
    },
    link: '#',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>`
  }
];

const mockPosts = [
  { id: 1, title: 'Como aumentar ROI com tráfego pago', date: '10/04/2025', excerpt: 'Estratégias práticas para maximizar retorno em campanhas pagas.' },
  { id: 2, title: 'Automação de marketing com IA', date: '05/04/2025', excerpt: 'Como usar inteligência artificial para automatizar processos de marketing.' },
  { id: 3, title: 'Funil de vendas que converte', date: '28/03/2025', excerpt: 'Construa um funil eficiente do topo ao fundo com táticas comprovadas.' }
];

const mockMetricasBI = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  datasets: [
    {
      label: 'Conversões',
      data: [12, 19, 15, 27, 32, 40],
      borderColor: '#CCFF00',
      backgroundColor: 'rgba(204,255,0,0.1)',
      tension: 0.4,
      fill: true
    }
  ]
};

let mockAvaliacoes = { trafico: 4, consultoria: 5 };
let mockDemandas = [];

// ========== DATA SERVICE ==========

const DataService = {

  // --- Projetos e GPTs ---
  // ENDPOINT: GET /api/projects
  getProjects: () => Promise.resolve(JSON.parse(JSON.stringify(_lsGet('vmk3_projects', mockProjects)))),
  // ENDPOINT: PUT /api/projects/:id  body: { title, image, link, ... }
  updateProject: (id, data) => {
    const projs = _lsGet('vmk3_projects', mockProjects);
    const idx = projs.findIndex(p => p.id === id);
    if (idx !== -1) Object.assign(projs[idx], data);
    _lsSet('vmk3_projects', projs);
    return Promise.resolve(projs[idx]);
  },

  // ENDPOINT: GET /api/gpts
  getGPTs: () => Promise.resolve(JSON.parse(JSON.stringify(mockGPTs))),

  // --- Blog ---
  // ENDPOINT: GET /api/posts
  getPosts: () => Promise.resolve(JSON.parse(JSON.stringify(_lsGet('vmk3_posts', mockPosts)))),
  // ENDPOINT: POST /api/posts  body: { title, excerpt, date }
  addPost: (post) => {
    const posts = _lsGet('vmk3_posts', mockPosts);
    const nova = { id: Date.now(), ...post };
    posts.unshift(nova);
    _lsSet('vmk3_posts', posts);
    return Promise.resolve(nova);
  },
  // ENDPOINT: PUT /api/posts/:id  body: { title, excerpt, date }
  updatePost: (id, data) => {
    const posts = _lsGet('vmk3_posts', mockPosts);
    const idx = posts.findIndex(p => p.id === id);
    if (idx !== -1) Object.assign(posts[idx], data);
    _lsSet('vmk3_posts', posts);
    return Promise.resolve(posts[idx]);
  },
  // ENDPOINT: DELETE /api/posts/:id
  deletePost: (id) => {
    const posts = _lsGet('vmk3_posts', mockPosts);
    const idx = posts.findIndex(p => p.id === id);
    if (idx !== -1) posts.splice(idx, 1);
    _lsSet('vmk3_posts', posts);
    return Promise.resolve();
  },

  // --- BI ---
  // ENDPOINT: GET /api/bi/metricas
  getMetricasBI: () => {
    const stored = _lsGet('vmk3_bi', null);
    if (stored) return Promise.resolve(JSON.parse(JSON.stringify(stored)));
    const base = JSON.parse(JSON.stringify(mockMetricasBI));
    base.valores = base.datasets[0].data.slice();
    return Promise.resolve(base);
  },
  // ENDPOINT: PUT /api/bi/metricas  body: { labels, valores }
  updateMetricasBI: (novasMetricas) => {
    const current = _lsGet('vmk3_bi', JSON.parse(JSON.stringify(mockMetricasBI)));
    if (!current.valores) current.valores = (current.datasets && current.datasets[0]) ? current.datasets[0].data.slice() : [];
    if (novasMetricas.valores) {
      current.valores = novasMetricas.valores;
      if (current.datasets && current.datasets[0]) current.datasets[0].data = novasMetricas.valores;
    }
    _lsSet('vmk3_bi', current);
    return Promise.resolve();
  },

  // --- Autenticação ---
  // ENDPOINT: POST /api/auth/cliente  body: { email, senha }  → { token, nome, email }
  loginCliente: (email, senha) => {
    if (email === 'cliente@email.com' && senha === '123456')
      return Promise.resolve({ success: true, nome: 'Cliente Exemplo', email });
    return Promise.resolve({ success: false, message: 'Credenciais inválidas.' });
  },
  // ENDPOINT: POST /api/auth/gestor  body: { email, senha }  → { token }
  loginGestor: (email, senha) => {
    if (email === 'gestor@email.com' && senha === 'admin123')
      return Promise.resolve({ success: true });
    return Promise.resolve({ success: false, message: 'Acesso negado.' });
  },

  // --- Área do Cliente (todas requerem token no header Authorization) ---
  // ENDPOINT: GET /api/cliente/documentos
  getDocumentos: () => Promise.resolve([
    { nome: 'Manual de Serviços', url: '#' },
    { nome: 'Guia de Boas Práticas', url: '#' }
  ]),
  // ENDPOINT: GET /api/cliente/contratos
  getContratos: () => Promise.resolve([
    { nome: 'Contrato Tráfego Pago', assinado: true },
    { nome: 'Contrato Consultoria IA', assinado: false }
  ]),
  // ENDPOINT: GET /api/cliente/relatorios
  getRelatorios: () => Promise.resolve([
    { nome: 'Relatório Mensal – Março 2025', url: '#' },
    { nome: 'Relatório Mensal – Fevereiro 2025', url: '#' }
  ]),
  // ENDPOINT: GET /api/cliente/avaliacoes
  getAvaliacoes: () => Promise.resolve({ ...mockAvaliacoes }),
  // ENDPOINT: POST /api/cliente/avaliacoes  body: { servico, nota }
  salvarAvaliacao: (servico, nota) => {
    mockAvaliacoes[servico] = nota;
    return Promise.resolve();
  },
  // ENDPOINT: POST /api/cliente/demandas  body: { assunto, servico, prioridade, descricao }
  enviarDemanda: (demanda) => {
    const nova = { id: Date.now(), ...demanda, status: 'pendente', data: new Date().toLocaleDateString('pt-BR') };
    mockDemandas.push(nova);
    return Promise.resolve(nova);
  },
  // ENDPOINT: GET /api/cliente/demandas
  getDemandas: () => Promise.resolve(JSON.parse(JSON.stringify(mockDemandas))),

  // --- Gestor (requer token gestor) ---
  // ENDPOINT: GET /api/gestor/clientes
  listarClientes: () => Promise.resolve([
    { email: 'cliente@email.com', nome: 'Cliente Exemplo', plano: 'Tráfego Pago', desde: 'Jan 2025', demandas: 0 }
  ]),
  // ENDPOINT: PUT /api/gestor/hero  body: { url }
  atualizarImagemHero: (url) => {
    localStorage.setItem('vmk3_hero_img', url);
    return Promise.resolve({ success: true, url });
  },
  // ENDPOINT: PUT /api/gestor/projetos/:projetoId/imagem  body: { url }
  atualizarImagemProjeto: (projetoId, url) => {
    const projs = _lsGet('vmk3_projects', mockProjects);
    const idx = projs.findIndex(p => p.id === projetoId);
    if (idx !== -1) projs[idx].image = url;
    _lsSet('vmk3_projects', projs);
    return Promise.resolve();
  }
};

// Expor globalmente (sem módulos ES)
window.DataService = DataService;

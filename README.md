# VMKT — Marketing Digital Portfolio

Portfolio digital de **Vitor Alves** — Especialista em Marketing Digital, Gestor de Tráfego Pago e Consultor de Performance.

## 🎯 Visão Geral

VMKT é um site de portfólio de alta performance construído com **HTML5, CSS3 e JavaScript vanilla**. Design brutalist-editorial com tema **black & yellow**, oferecendo experiência visual única e profissional.

## ✨ Características

- **Design Black & Yellow** — Paleta distinctive com amarelo neon (#CCFF00)
- **Splash Page Interativa** — Página de entrada com rastro de cor no cursor
- **Reveal de Cor** — Imagem em grayscale que revela cores no hover
- **100% Responsivo** — Mobile, tablet, desktop
- **Bilíngue** — Português e Inglês
- **Integração Typebot** — Chat interativo
- **Carrossel de Logos** — Clientes e parceiros
- **Performance Otimizada** — Sem dependências externas desnecessárias

## 📁 Estrutura

```
vmkt/
├── index.html          # Splash page (entrada)
├── portfolio.html      # Portfolio principal
├── logo-dark.png       # Logo branco/cinza
├── logo-yellow.png     # Logo amarelo neon
├── hero-image.jpg      # Imagem hero
└── README.md          # Este arquivo
```

## 🎨 Design

| Elemento | Cor | Hex |
|----------|-----|-----|
| Fundo | Preto | `#080808` |
| Acento | Amarelo Neon | `#CCFF00` |
| Texto | Branco | `#FFFFFF` |
| Secundário | Cinza | `#666666` |

**Tipografia:**
- Bebas Neue — Títulos
- Outfit — Corpo
- Space Mono — Labels

## 🚀 Deploy

### Hostinger VPS
```bash
scp index.html portfolio.html logo-*.png hero-image.jpg usuario@ip-vps:/var/www/html/
```

### Git
```bash
git add .
git commit -m "deploy: vmkt portfolio"
git push origin main
```

### Netlify / Vercel
Drag & drop diretamente na plataforma.

## 🔧 Personalização

### Alterar Logo
Substitua `logo-dark.png` e `logo-yellow.png`

### Alterar Imagem Hero
Substitua `hero-image.jpg`

### Cores
Busque e substitua nos arquivos HTML:
- `#080808` → cor de fundo
- `#CCFF00` → cor de acento

### Typebot ID
Localize no `portfolio.html` e atualize:
```javascript
const typebot = new Typebot({
  id: 'SEU_ID'
});
```

## 📱 Responsividade

- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

## 🔗 Links

- **Site:** [rodrigo.run](https://rodrigo.run)
- **Email:** contato@rodrigoalves.dev
- **GitHub:** [frodrigoalves](https://github.com/frodrigoalves)

## ⚙️ Tecnologias

- HTML5
- CSS3 (Grid, Flexbox)
- JavaScript Vanilla (ES6+)
- Canvas API
- AOS (Animate On Scroll)
- Typed.js

## 📄 Licença

Projeto pessoal e profissional de Vitor Alves.

---
**Versão:** 1.0.0 | **Atualizado:** Abril 2025

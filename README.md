# 🚀 Portfólio Profissional - Higor Batista

<div align="center">

![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?style=for-the-badge&logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1.14-38B2AC?style=for-the-badge&logo=tailwind-css)

**Portfólio interativo com integração à API do GitHub para exibição dinâmica de projetos e estatísticas**

[📫 Contato](mailto:dev.higorxyz@gmail.com) • [💼 LinkedIn](https://www.linkedin.com/in/higorbatista) • [🐙 GitHub](https://github.com/higorxyz)

</div>

---

## ✨ Funcionalidades

- 🌓 **Tema Claro/Escuro** com alternância suave
- 🌍 **Multilíngue** (Português/Inglês)
- 🐙 **Integração GitHub API** para projetos e estatísticas em tempo real, via proxy serverless com cache (veja [Arquitetura da API](#-arquitetura-da-api))
- 📈 **Gráfico de contribuições** fiel ao layout do GitHub
- 🔍 **Busca e filtros** de projetos por tecnologia
- 📝 **Visualizador de README** integrado, por repositório
- 📄 **Visualizador de currículo em PDF** com preview embutido (PT/EN)
- 💌 **Formulário de contato** funcional (EmailJS)
- ✅ **100% responsivo**

---

## 🛠️ Tecnologias

- **React 19** + **Vite 7**
- **Tailwind CSS 4** + Custom CSS
- **Lucide Icons** + **React Icons**
- **GitHub API** (via Vercel Serverless Functions) + **EmailJS**
- **pdf.js** para renderização do currículo em PDF
- **Context API** (Tema/Idioma)
- **Vercel Serverless Functions** (Node) para proxy e cache da API do GitHub

---

## 🔌 Arquitetura da API

O front-end **não** chama `api.github.com` diretamente do navegador. Antes disso quebrava em rede compartilhada (faculdade, empresa): o GitHub limita a 60 requisições/hora **por IP**, e todo mundo naquela rede compartilha o mesmo IP de saída.

Agora existem duas Vercel Serverless Functions em `/api` que funcionam como proxy:

| Rota | Função | Cache |
|---|---|---|
| `GET /api/github-stats` | Busca perfil + repositórios do GitHub | 5 min (CDN da Vercel) |
| `GET /api/github-readme?repo=nome` | Busca o README de um repositório específico | 10 min (CDN da Vercel) |

Essas funções rodam no servidor, então:
- Um token do GitHub (opcional, mas recomendado) pode ser usado sem nunca ser exposto no bundle do cliente.
- N visitantes = 1 chamada real à API do GitHub, graças ao cache na CDN.

⚠️ **`npm run dev` (Vite puro) não serve `/api`.** Para testar essas funções localmente, use `vercel dev`, ou confie no ambiente de preview/produção da Vercel.

---

## 🚀 Como Usar

### Instalação

```bash
# Clone o repositório
git clone https://github.com/higorxyz/portfolio.git
cd portfolio

# Instale as dependências
npm install

# Rode o projeto (front-end apenas, sem /api — veja acima)
npm run dev
```

### Variáveis de ambiente

Configure em `.env` (local) ou em Project → Settings → Environment Variables (Vercel):

```bash
# GitHub API (opcional, mas recomendado — evita rate limit compartilhado)
# NUNCA prefixar com VITE_, ou o token vaza no bundle do cliente
GITHUB_TOKEN=seu_token_aqui

# EmailJS (obrigatório para o formulário de contato funcionar)
VITE_EMAILJS_SERVICE_ID=seu_service_id
VITE_EMAILJS_TEMPLATE_ID=seu_template_id
VITE_EMAILJS_PUBLIC_KEY=sua_public_key
```

---

## 📂 Estrutura

```
api/                          # Vercel Serverless Functions (proxy + cache da GitHub API)
├── github-stats.js
└── github-readme.js

src/
├── components/
│   ├── common/               # LoadingScreen, Portal
│   ├── forms/                # SearchBar
│   ├── modals/                # ProjectModal, ReadmeViewer, CVPreviewModal
│   ├── navigation/            # NavigationBar, ThemeToggle, LanguageToggle
│   ├── sections/               # Hero, Projects, ContributionGraph, etc.
│   └── ui/                     # Skeleton e componentes visuais
├── config/                     # EmailJS, constantes (CV, GitHub, temas, idiomas)
├── contexts/
│   ├── LanguageContext.js/.jsx  # Contexto e Provider de idioma
│   └── ThemeContext.js/.jsx     # Contexto e Provider de tema
├── hooks/
│   ├── useGitHubData.js
│   ├── useLanguage.js
│   ├── useTheme.js
│   ├── useProjectFilters.js
│   ├── useBodyScrollLock.js
│   ├── useCounter.js
│   ├── useIntersectionObserver.js
│   └── outros hooks utilitários
├── styles/                     # CSS global, tema e Tailwind
└── App.jsx / main.jsx          # Entrada da aplicação
```

---

## 🎨 Personalização

**Trocar username do GitHub** em `src/config/constants.js`:
```javascript
export const GITHUB_CONFIG = {
  username: 'seu-username',
  apiUrl: 'https://api.github.com'
};
```
> Nota: o `api/github-stats.js` e o `api/github-readme.js` também têm o username fixo no topo do arquivo (`GITHUB_USERNAME`) — ajuste nos dois lugares.

**Alterar cores:** a partir do Tailwind CSS 4 não há mais `tailwind.config.js` — as cores de destaque (roxo/rosa) estão nas classes utilitárias diretamente nos componentes (ex.: `from-purple-500`, `text-accent-signal`), e as cores de tema claro/escuro ficam em `src/styles/theme.css` como variáveis CSS.

**Adicionar idiomas** em `src/contexts/LanguageContext.jsx`

**Trocar o PDF do currículo** em `src/config/constants.js` (`CV_FILES`), um arquivo por idioma.

---

## 👨‍💻 Autor

**Higor Batista**

- 💼 [LinkedIn](https://www.linkedin.com/in/higorbatista)
- 🐙 [GitHub](https://github.com/higorxyz)
- 📷 [Instagram](https://www.instagram.com/higorxyz/)
- 📧 dev.higorxyz@gmail.com

---

<div align="center">

**Desenvolvido por Higor Batista**

</div>

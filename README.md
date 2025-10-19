# 🚀 Portfólio Profissional - Higor Batista

<div align="center">

![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?style=for-the-badge&logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1.14-38B2AC?style=for-the-badge&logo=tailwind-css)

**Portfólio interativo com integração GitHub API para exibição dinâmica de projetos e estatísticas**

[📫 Contato](mailto:dev.higorxyz@gmail.com) • [💼 LinkedIn](https://www.linkedin.com/in/higorbatista) • [🐙 GitHub](https://github.com/higorxyz)

</div>

---

## ✨ Funcionalidades

- 🌓 **Tema Claro/Escuro** com alternância suave
- 🌍 **Multilíngue** (Português/Inglês)
- 🎯 **Cursor customizado** em forma de ponto animado e sem interferir em cliques
- 🐙 **Integração GitHub API** para projetos e estatísticas em tempo real
- 📈 **Gráfico de contribuições** fiel ao layout do GitHub
- 🔍 **Busca e filtros** de projetos por tecnologia
- 📝 **Visualizador de README** integrado
- 💌 **Formulário de contato** funcional (EmailJS)
- ✅ **100% responsivo**

---

## 🛠️ Tecnologias

- **React 19** + **Vite 7**
- **Tailwind CSS 4** + Custom CSS
- **Lucide Icons**
- **GitHub API** + **EmailJS**
- **Context API** (Tema/Idioma)
- **Canvas API** (Animações)

---

## 🚀 Como Usar

### Instalação

```bash
# Clone o repositório
git clone https://github.com/higorxyz/portfolio.git
cd portfolio

# Instale as dependências
npm install

# Rode o projeto
npm run dev
```

### Configuração

Configure o EmailJS em `src/config/emailConfig.js`:

```javascript
export const EMAIL_CONFIG = {
  serviceId: 'seu_service_id',
  templateId: 'seu_template_id',
  publicKey: 'sua_public_key'
};
```

---

## 📂 Estrutura

```
src/
├── assets/                  # Imagens e cursores
├── components/
│   ├── common/              # CustomCursor, LoadingScreen, Portal
│   ├── forms/               # SearchBar
│   ├── modals/              # ProjectModal, ReadmeViewer
│   ├── navigation/          # NavigationBar, ThemeToggle, LanguageToggle
│   ├── sections/            # Hero, Projects, ContributionGraph, etc.
│   └── ui/                  # Skeleton e componentes visuais
├── config/                  # Constantes e configurações (EmailJS)
├── contexts/
│   ├── LanguageContext.js   # Instância do contexto de idioma
│   ├── LanguageContext.jsx  # Provider de idioma
│   ├── ThemeContext.js      # Instância do contexto de tema
│   └── ThemeContext.jsx     # Provider de tema
├── hooks/
│   ├── useGitHubData.js
│   ├── useLanguage.js
│   ├── useTheme.js
│   ├── useParticleBackground.js
│   ├── useProjectFilters.js
│   ├── useBodyScrollLock.js
│   └── outros hooks utilitários
├── styles/                  # CSS global, tema e Tailwind
└── App.jsx / main.jsx       # Entrada da aplicação
```

---

## 🎨 Personalização

**Trocar username do GitHub** em `src/App.jsx` ajustando a constante:
```javascript
const username = 'seu-username';
```

**Alterar cores** em `tailwind.config.js`:
```javascript
colors: {
  primary: '#a855f7',
  secondary: '#ec4899',
}
```

**Adicionar idiomas** em `src/contexts/LanguageContext.jsx`

---

## 👨‍💻 Autor

**Higor Batista**

- 💼 [LinkedIn](https://www.linkedin.com/in/higorbatista)
- 🐙 [GitHub](https://github.com/higorxyz)
- 📷 [Instagram](https://www.instagram.com/higorxyz/)
- 📧 dev.higorxyz@gmail.com

---

<div align="center">

**Desenvolvido com 💜 por Higor Batista**

</div>


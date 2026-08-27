export const languageColors = {
  // Linguagens principais
  'JavaScript': '#F7DF1E',
  'TypeScript': '#3178C6',
  'Python': '#3776AB',
  'Java': '#007396',
  'C++': '#00599C',
  'CPP': '#00599C',
  'C#': '#239120',
  'CSharp': '#239120',
  'C': '#A8B9CC',
  'Ruby': '#CC342D',
  'PHP': '#777BB4',
  'Swift': '#FA7343',
  'Kotlin': '#7F52FF',
  'Go': '#00ADD8',
  'Rust': '#000000',
  'Dart': '#0175C2',
  'R': '#276DC3',
  'Scala': '#DC322F',
  'Elixir': '#4B275F',
  'Haskell': '#5D4F85',
  'Lua': '#2C2D72',
  'Perl': '#39457E',
  'Groovy': '#4298B8',

  // SQL e Bancos de Dados
  'SQL': '#00618A',
  'PLSQL': '#F80000',
  'PL/SQL': '#F80000',
  'T-SQL': '#CC2927',
  'MySQL': '#4479A1',
  'PostgreSQL': '#4169E1',
  'MongoDB': '#47A248',
  'SQLite': '#003B57',
  'Redis': '#DC382D',
  'MariaDB': '#003545',
  'Oracle': '#F80000',

  // Frontend
  'HTML': '#E34F26',
  'CSS': '#1572B6',
  'React': '#61DAFB',
  'Vue': '#4FC08D',
  'Angular': '#DD0031',
  'Svelte': '#FF3E00',
  'Next.js': '#000000',
  'Nuxt.js': '#00DC82',
  'Gatsby': '#663399',

  // Backend
  'Node.js': '#339933',
  'Express': '#000000',
  'Django': '#092E20',
  'Flask': '#000000',
  'Spring': '#6DB33F',
  'Laravel': '#FF2D20',

  // Notebooks e Scripts
  'Jupyter Notebook': '#F37626',
  'IPYNB': '#F37626',
  'Shell': '#89E051',
  'Bash': '#4EAA25',
  'PowerShell': '#012456',

  // Outros
  'Markdown': '#000000',
  'Docker': '#2496ED',
  'Kubernetes': '#326CE5',
  'Git': '#F05032',
  'GraphQL': '#E10098',
  
  // Fallback
  'default': '#A78BFA'
};

// Overrides para modo claro: só as cores que têm contraste < 3:1
// sobre fundo branco (#ffffff). As que não estão aqui já passam.
const lightOverrides = {
  'JavaScript': '#a16207',   // Amarelo → dourado escuro (4.6:1)
  'C': '#5b6b7d',           // Cinza claro → cinza chumbo (4.5:1)
  'React': '#0284c7',       // Ciano claro → sky-600 (4.5:1)
  'Shell': '#3d7a1c',       // Verde claro → verde floresta (4.6:1)
  'Vue': '#1a7a5a',         // Verde médio → verde escuro (4.5:1)
  'Nuxt.js': '#059669',     // Verde neon → emerald-600 (4.5:1)
  'Go': '#0e7490',          // Ciano → cyan-700 (4.5:1)
  'default': '#7c3aed',     // Violeta claro → violet-600 (4.5:1)
};

export const getLanguageColor = (language, isDark = true) => {
  if (!isDark && lightOverrides[language]) {
    return lightOverrides[language];
  }
  return languageColors[language] || languageColors['default'];
};

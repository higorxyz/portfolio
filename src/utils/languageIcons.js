import { 
  SiJavascript, SiTypescript, SiPython, SiCplusplus,
  SiC, SiRuby, SiPhp, SiSwift, SiKotlin, SiGo, SiRust, SiDart,
  SiR, SiScala, SiElixir, SiHaskell, SiLua, SiPerl,
  SiHtml5, SiCss3, SiReact, SiVuedotjs, SiAngular, SiSvelte,
  SiNextdotjs, SiNuxtdotjs, SiGatsby,
  SiNodedotjs, SiExpress, SiDjango, SiFlask, SiSpring, SiLaravel,
  SiPostgresql, SiMongodb, SiSqlite, SiRedis, SiMariadb,
  SiOracle, SiDocker, SiKubernetes, SiGit,
  SiGraphql, SiMarkdown, SiJupyter, SiGnubash
} from 'react-icons/si';

import { 
  FaDatabase, FaCode, FaTerminal, FaHashtag, FaJava 
} from 'react-icons/fa';

import { DiMsqlServer, DiMysql } from 'react-icons/di';
import { VscTerminalPowershell } from 'react-icons/vsc';


export const languageIcons = {
  // Linguagens principais
  'JavaScript': SiJavascript,
  'TypeScript': SiTypescript,
  'Python': SiPython,
  'Java': FaJava,
  'C++': SiCplusplus,
  'CPP': SiCplusplus,
  'C#': FaHashtag,
  'CSharp': FaHashtag,
  'C': SiC,
  'Ruby': SiRuby,
  'PHP': SiPhp,
  'Swift': SiSwift,
  'Kotlin': SiKotlin,
  'Go': SiGo,
  'Rust': SiRust,
  'Dart': SiDart,
  'R': SiR,
  'Scala': SiScala,
  'Elixir': SiElixir,
  'Haskell': SiHaskell,
  'Lua': SiLua,
  'Perl': SiPerl,
  'Groovy': FaCode,
  
  // SQL e Databases
  'SQL': FaDatabase,
  'PLSQL': SiOracle,
  'PL/SQL': SiOracle,
  'T-SQL': DiMsqlServer,
  'MySQL': DiMysql,
  'PostgreSQL': SiPostgresql,
  'SQLite': SiSqlite,
  'MariaDB': SiMariadb,
  'Redis': SiRedis,
  'MongoDB': SiMongodb,
  
  // Frontend
  'HTML': SiHtml5,
  'CSS': SiCss3,
  'React': SiReact,
  'Vue': SiVuedotjs,
  'Angular': SiAngular,
  'Svelte': SiSvelte,
  'Next.js': SiNextdotjs,
  'Nuxt.js': SiNuxtdotjs,
  'Gatsby': SiGatsby,
  
  // Backend
  'Node.js': SiNodedotjs,
  'Express': SiExpress,
  'Django': SiDjango,
  'Flask': SiFlask,
  'Spring': SiSpring,
  'Laravel': SiLaravel,
  
  // Notebooks e Scripts
  'Jupyter Notebook': SiJupyter,
  'IPYNB': SiJupyter,
  'Shell': SiGnubash,
  'Bash': SiGnubash,
  'PowerShell': VscTerminalPowershell,
  
  // Outros
  'Markdown': SiMarkdown,
  'Docker': SiDocker,
  'Kubernetes': SiKubernetes,
  'Git': SiGit,
  'GraphQL': SiGraphql,
  
  // Fallbacks
  'default': FaCode
};

export const getLanguageIcon = (language) => {
  if (!language) return languageIcons['default'];
  
  if (languageIcons[language]) return languageIcons[language];
  
  const upperLanguage = language.toUpperCase();
  const lowerLanguage = language.toLowerCase();
  
  if (upperLanguage.includes('SQL') && !upperLanguage.includes('NOSQL')) return SiOracle;
  if (lowerLanguage.includes('notebook') || lowerLanguage === 'ipynb') return SiJupyter;
  if (lowerLanguage.includes('shell') || lowerLanguage === 'bash' || lowerLanguage === 'sh') return SiGnubash;
  if (lowerLanguage.includes('c++') || lowerLanguage === 'cpp') return SiCplusplus;
  
  return languageIcons['default'];
};

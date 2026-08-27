// Projetos em destaque — curados à mão, não vêm da API do GitHub.
// A API só traz metadado (stars, forks, data) — a curadoria aqui é sobre
// dar contexto de verdade: por que cada um existe e o que ele realmente
// exercita tecnicamente.
export const FEATURED_PROJECTS = [
  {
    key: 'telaviva',
    titleKey: 'featured.telaviva.title',
    whyKey: 'featured.telaviva.why',
    tech: ['React', 'React Query', 'Tailwind CSS'],
    demo: 'https://telaviva.vercel.app',
    github: 'https://github.com/higorxyz/telaviva',
  },
  {
    key: 'fordCyber',
    titleKey: 'featured.fordCyber.title',
    whyKey: 'featured.fordCyber.why',
    tech: ['Next.js', 'TypeScript', 'PostgreSQL'],
    demo: 'https://fordvision-cyber.vercel.app',
    github: 'https://github.com/higorxyz/fordCyber',
  },
  {
    key: 'cleverBudget',
    titleKey: 'featured.cleverBudget.title',
    whyKey: 'featured.cleverBudget.why',
    tech: ['.NET 9', 'ASP.NET Core', 'Clean Architecture'],
    demo: null, // API sem interface própria — deploy é via Railway, sem URL fixa pública
    github: 'https://github.com/higorxyz/CleverBudget',
  },
  {
    key: 'ecoTrack',
    titleKey: 'featured.ecoTrack.title',
    whyKey: 'featured.ecoTrack.why',
    tech: ['React', 'Firebase', 'Chart.js'],
    demo: 'https://ecotrack1.vercel.app',
    github: 'https://github.com/higorxyz/ecoTrack',
  },
];

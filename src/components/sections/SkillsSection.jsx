import { Code } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export const SkillsSection = () => {
  const { t } = useLanguage();

  const skillsData = {
    'Linguagens & Frameworks': [
      { name: 'JavaScript', icon: 'js' },
      { name: 'Python', icon: 'python' },
      { name: 'C++', icon: 'cpp' },
      { name: 'Java', icon: 'java' },
      { name: 'C#', icon: 'cs' },
      { name: 'React', icon: 'react' },
      { name: 'Next.js', icon: 'nextjs' },
      { name: 'Node.js', icon: 'nodejs' },
      { name: 'Express', icon: 'express' },
      { name: 'Tailwind', icon: 'tailwind' },
      { name: 'Vite', icon: 'vite' },
      { name: 'Redux', icon: 'redux' },
      { name: 'Material UI', icon: 'materialui' },
      { name: 'Prisma', icon: 'prisma' }
    ],
    'Databases & Ferramentas': [
      { name: 'MySQL', icon: 'mysql' },
      { name: 'PostgreSQL', icon: 'postgresql' },
      { name: 'MongoDB', icon: 'mongodb' },
      { name: 'Supabase', icon: 'supabase' },
      { name: 'Git', icon: 'git' },
      { name: 'GitHub', icon: 'github' },
      { name: 'VS Code', icon: 'vscode' },
      { name: 'Figma', icon: 'figma' },
      { name: 'Postman', icon: 'postman' },
      { name: 'npm', icon: 'npm' }
    ]
  };

  return (
    <section id="skills" className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
          <Code className="text-purple-500 w-7 h-7" />
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            {t('skills.title')}
          </h3>
        </div>
        <p className="text-center text-gray-400 mb-6 sm:mb-10 text-sm sm:text-base">
          {t('skills.subtitle')}
        </p>

        {/* Skills Grid */}
        <div className="space-y-8 sm:space-y-10">
          {Object.entries(skillsData).map(([category, techs]) => (
            <div key={category}>
              <h4 className="text-base sm:text-lg font-semibold text-purple-300 mb-4 text-center">
                {category}
              </h4>
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-3 sm:gap-4">
                {techs.map((tech, index) => (
                  <div
                    key={`${tech.name}-${index}`}
                    className="group card-motion bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/30 rounded-xl p-3 sm:p-4 hover:bg-gradient-to-br hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300 flex flex-col items-center gap-2"
                  >
                    <img 
                      src={`https://skillicons.dev/icons?i=${tech.icon}`}
                      alt={tech.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="text-xs sm:text-sm font-medium text-gray-300 text-center leading-tight group-hover:text-purple-400 transition-colors duration-300">
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
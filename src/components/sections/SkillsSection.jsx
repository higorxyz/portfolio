import { Code } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export const SkillsSection = () => {
  const { t } = useLanguage();

  const skillsData = [
    {
      title: t('skills.programming'),
      accent: 'trace',
      skills: [
        { name: 'Python', icon: 'python' },
        { name: 'C#', icon: 'cs' },
        { name: 'JavaScript', icon: 'js' },
        { name: 'TypeScript', icon: 'ts' },
        { name: 'SQL', mark: 'SQL' }
      ]
    },
    {
      title: t('skills.backend'),
      accent: 'signal',
      skills: [
        { name: 'ASP.NET Core', icon: 'dotnet' },
        { name: '.NET', icon: 'dotnet' },
        { name: 'Node.js', icon: 'nodejs' },
        { name: 'REST APIs', mark: 'API' },
        { name: 'Entity Framework Core', mark: 'EF' },
        { name: 'JWT', mark: 'JWT' }
      ]
    },
    {
      title: t('skills.frontend'),
      accent: 'trace',
      skills: [
        { name: 'React', icon: 'react' },
        { name: 'Next.js', icon: 'nextjs' },
        { name: 'Vite', icon: 'vite' },
        { name: 'Tailwind CSS', icon: 'tailwind' }
      ]
    },
    {
      title: t('skills.data'),
      accent: 'signal',
      skills: [
        { name: 'PostgreSQL', icon: 'postgresql' },
        { name: 'MySQL', icon: 'mysql' },
        { name: 'MongoDB', icon: 'mongodb' },
        { name: 'Machine Learning', mark: 'ML' },
        { name: 'Data Analysis', mark: 'DA' }
      ]
    },
    {
      title: t('skills.tools'),
      accent: 'trace',
      skills: [
        { name: 'Git', icon: 'git' },
        { name: 'GitHub', icon: 'github' },
        { name: 'Docker', icon: 'docker' }
      ]
    }
  ];

  return (
    <section id="skills" className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
            <span className="font-mono text-xs text-accent-signal">03 /</span>
            <Code className="text-accent-trace w-5 h-5 sm:w-6 sm:h-6" />
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary">
              {t('skills.title')}
            </h3>
          </div>
          <p className="text-center sm:text-left text-text-secondary text-sm sm:text-base max-w-2xl sm:pl-10">
            {t('skills.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-16 items-start">
          <div className="border-t border-line">
            {skillsData.map(({ title, accent, skills }, groupIndex) => (
              <div key={title} className="py-5 sm:py-6 border-b border-line">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`font-mono text-xs ${accent === 'signal' ? 'text-accent-signal' : 'text-accent-trace'}`}>
                    0{groupIndex + 1}
                  </span>
                  <h4 className="font-mono text-sm sm:text-base font-semibold text-text-primary">{title}</h4>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2 pl-8">
                  {skills.map((skill) => (
                    <span key={skill.name} className="group inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
                      <span className={`w-1.5 h-1.5 rounded-full ${accent === 'signal' ? 'bg-accent-signal' : 'bg-accent-trace'} opacity-60 group-hover:opacity-100`} />
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:pt-5">
            <p className="font-mono text-xs text-accent-signal mb-4">{t('skills.noteLabel')}</p>
            <p className="text-2xl sm:text-3xl md:text-4xl font-display font-bold leading-tight text-text-primary mb-6">
              {t('skills.noteTitle')}
            </p>
            <p className="text-text-secondary text-sm sm:text-base leading-relaxed max-w-xl mb-8">
              {t('skills.noteText')}
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-3 font-mono text-xs text-text-secondary">
              <span><strong className="text-accent-trace">01</strong> {t('skills.noteOne')}</span>
              <span><strong className="text-accent-trace">02</strong> {t('skills.noteTwo')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
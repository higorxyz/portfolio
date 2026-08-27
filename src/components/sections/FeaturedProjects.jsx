import { ExternalLink, Github, Sparkles } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { FEATURED_PROJECTS } from '../../config';

export const FeaturedProjects = () => {
  const { t } = useLanguage();

  return (
    <div className="mb-10 sm:mb-14">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Sparkles className="w-4 h-4 text-accent-signal-text" />
        <span className="font-mono text-xs sm:text-sm text-text-secondary uppercase tracking-wide">
          {t('featured.label')}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {FEATURED_PROJECTS.map((project) => (
          <div
            key={project.key}
            className="border border-line bg-bg-surface rounded-lg p-5 sm:p-6 flex flex-col"
          >
            <h3 className="text-lg sm:text-xl font-bold text-text-primary mb-2">
              {t(project.titleKey)}
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed mb-4 flex-1">
              {t(project.whyKey)}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 rounded border border-line font-mono text-[10px] sm:text-xs text-accent-trace-text"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-accent-signal-text hover:opacity-80 transition-opacity"
                >
                  <ExternalLink size={14} /> {t('featured.viewLive')}
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                >
                  <Github size={14} /> {t('featured.viewCode')}
                </a>
              )}
              {!project.demo && !project.github && (
                <span className="text-xs text-text-secondary italic">{t('featured.private')}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

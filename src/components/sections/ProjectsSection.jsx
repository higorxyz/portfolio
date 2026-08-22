import { useMemo } from 'react';
import { Briefcase, Filter, Star, GitFork, Github, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useProjectFilters } from '../../hooks/useProjectFilters';
import { ProjectCardSkeleton } from '../ui';
import { SearchBar } from '../forms';
import { ReadmeViewer } from '../modals';
import { ContributionGraph } from '.';
import { getLanguageColor } from '../../utils/languageColors';
import { getLanguageIcon } from '../../utils/languageIcons';

export const ProjectsSection = ({ projects, loading, onSelectProject, username = 'higorxyz' }) => {
  const { t } = useLanguage();
  const { filterTech, setFilterTech, searchTerm, setSearchTerm, filteredProjects, allTechs } = useProjectFilters(projects);

  const resultsCount = filteredProjects.length;
  const technologies = useMemo(() => allTechs, [allTechs]);

  return (
    <section id="projetos" className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-2">
            <span className="font-mono text-xs text-accent-signal">02 /</span>
            <Briefcase className="text-accent-trace w-5 h-5 sm:w-6 sm:h-6" />
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary">
              {t('projects.title')}
            </h3>
          </div>
        <p className="text-center sm:text-left text-text-secondary mb-6 sm:mb-10 text-sm sm:text-base sm:pl-11">
          {t('projects.subtitle')}
          {!loading && <span className="text-accent-trace font-semibold"> {t('projects.autoUpdate')}</span>}
        </p>
        </div>

        <SearchBar
          onSearch={setSearchTerm}
          placeholder={t('projects.search')}
          totalResults={searchTerm ? resultsCount : undefined}
        />

        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-10 flex-wrap px-2">
          <Filter size={18} className="text-accent-trace hidden sm:block" />
          {technologies.map((tech) => (
            <button
              key={tech}
              onClick={() => setFilterTech(tech)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold text-xs sm:text-sm ${
                filterTech === tech
                  ? 'bg-accent-signal shadow-lg '
                  : 'bg-bg-surface border border-line hover:bg-bg-surface'
              }`}
            >
              {tech}
            </button>
          ))}
        </div>

        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[...Array(6)].map((_, index) => (
              <ProjectCardSkeleton key={index} />
            ))}
          </div>
        )}

        {!loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {filteredProjects.map((project, index) => {
              const ProjectIcon = getLanguageIcon(project.language);
              return (
                <div
                  key={`${project.repoName}-${index}`}
                  className={`card-motion transform bg-bg-surface border border-line rounded-lg p-4 sm:p-6 hover:-translate-y-1 shadow-subtle-lg hover:shadow-subtle-2xl relative overflow-hidden group flex flex-col cursor-pointer ${
                    project.featured ? 'ring-2 ring-accent-signal' : ''
                  }`}
                  onClick={() => onSelectProject(project)}
                >
                  <div className="flex justify-between items-start mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <ProjectIcon 
                        size={40} 
                        className="sm:w-10 sm:h-10 w-9 h-9 group-hover:scale-125 transition-transform" 
                        style={{ color: getLanguageColor(project.language) }}
                      />
                      <div>
                        <span 
                          className="font-semibold text-xs sm:text-sm"
                          style={{ color: getLanguageColor(project.language) }}
                        >
                          {project.language || 'Code'}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 sm:gap-2 items-end">
                      {project.preview ? (
                        <div className="bg-accent-trace/15 text-accent-trace px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold">
                          {t('projects.preview')}
                        </div>
                      ) : project.featured && (
                        <div className="bg-accent-signal px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <Star size={12} className="sm:w-3.5 sm:h-3.5" /> {t('projects.featured')}
                        </div>
                      )}
                      <span
                        className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold ${
                          project.status === 'live'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                            : project.status === 'repo'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                        }`}
                      >
                        {project.status === 'live' ? t('projects.live') : project.status === 'repo' ? t('projects.repo') : t('projects.beta')}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 group-hover:text-accent-trace transition-colors">
                    {project.title}
                  </h4>
                  <div className="text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed flex-grow" onClick={(event) => event.stopPropagation()}>
                    <ReadmeViewer
                      repoName={project.repoName}
                      description={project.description}
                      projectTitle={project.title}
                    />
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 text-xs text-text-secondary mb-3 sm:mb-4">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="sm:w-3.5 sm:h-3.5 text-yellow-400" fill="currentColor" />
                      <span>{project.visits || project.stars || 0}</span>
                    </div>
                    {project.forks > 0 && (
                      <div className="flex items-center gap-1">
                        <GitFork size={12} className="sm:w-3.5 sm:h-3.5 text-blue-400" />
                        <span>{project.forks}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4 min-h-[28px] sm:min-h-[32px]">
                    {project.tech.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 sm:px-3 py-0.5 sm:py-1 bg-bg-surface text-accent-trace border border-line rounded-full text-xs hover:bg-bg-surface transition-colors flex items-center"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-auto">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(event) => event.stopPropagation()}
                      className="flex-1 px-3 sm:px-4 py-2 bg-accent-signal rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 hover:scale-105 transition-transform"
                    >
                      <ExternalLink size={14} className="sm:w-4 sm:h-4" /> {project.status === 'live' ? t('projects.viewSite') : t('projects.viewRepo')}
                    </a>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(event) => event.stopPropagation()}
                      className="px-3 sm:px-4 py-2 bg-bg-surface border border-line rounded-lg hover:bg-bg-surface transition-colors flex items-center justify-center"
                    >
                      <Github size={14} className="sm:w-4 sm:h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {resultsCount === 0 && !loading && (
          <div className="border border-line border-dashed bg-bg-surface/40 px-6 py-10 sm:py-14 text-center">
            <p className="font-mono text-xs text-accent-signal mb-3">PROJECTS / NO DATA</p>
            <p className="text-text-secondary text-base sm:text-lg">{t('projects.noData')}</p>
            <p className="text-text-secondary/70 text-sm mt-2">{t('projects.noDataHint')}</p>
          </div>
        )}

        <div className="text-center mt-8 sm:mt-12">
          <a
            href="https://github.com/higorxyz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-accent-signal rounded-full font-bold text-sm sm:text-base lg:text-lg hover:scale-110 transition-transform shadow-subtle-lg"
          >
            <Github size={20} className="sm:w-5 sm:h-5" /> {t('projects.viewMoreGitHub')}
          </a>
        </div>

        <div className="mt-12 sm:mt-16">
          <ContributionGraph username={username} />
        </div>
      </div>
    </section>
  );
};
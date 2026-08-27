import { useState, useEffect } from 'react';
import { X, Github, ExternalLink, Star, GitFork, Eye, Calendar, Code, FileText } from 'lucide-react';
import Portal from '../common/Portal';
import { ReadmeViewer } from './ReadmeViewer';
import { useLanguage } from '../../hooks/useLanguage';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { useModalA11y } from '../../hooks/useModalA11y';

export const ProjectModal = ({ project, isOpen, onClose }) => {
  const { t, language } = useLanguage();
  const locale = language === 'en' ? 'en-US' : 'pt-BR';
  const [readme, setReadme] = useState(null);
  const [loadingReadme, setLoadingReadme] = useState(false);
  const [readmeNotFound, setReadmeNotFound] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useBodyScrollLock(isOpen);
  const containerRef = useModalA11y(isOpen, onClose);

  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < 640);
      }, 150);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setReadme(null);
    setLoadingReadme(false);
    setReadmeNotFound(false);
  }, [project?.repoName]);

  useEffect(() => {
    const fetchReadme = async () => {
      if (isOpen && project?.repoName) {
        setLoadingReadme(true);
        try {
          const response = await fetch(
            `/api/github-readme?repo=${encodeURIComponent(project.repoName)}`
          );

          if (response.ok) {
            const html = await response.text();
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const text = tempDiv.textContent || tempDiv.innerText || '';
            setReadme(text);
            setReadmeNotFound(false);
          } else {
            setReadmeNotFound(true);
          }
        } catch (error) {
          console.error('Erro ao buscar README:', error);
          setReadmeNotFound(true);
        } finally {
          setLoadingReadme(false);
        }
      }
    };

    fetchReadme();
  }, [isOpen, project?.repoName]);

  if (!isOpen || !project) return null;

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[10000] flex items-center justify-center p-2 sm:p-4 md:p-8 bg-black/70 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      >
        <div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
          tabIndex={-1}
          className="relative w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] border rounded-lg shadow-2xl overflow-hidden animate-scaleIn bg-bg-surface border-line outline-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header do Modal */}
          <div className="sticky top-0 z-10 border-b border-line p-4 sm:p-5 bg-bg-surface">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                <div className="p-2 flex-shrink-0 text-accent-trace-text">
                  <Code className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-0.5 sm:mb-1 text-text-primary truncate">
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary">
                    {t('modal.projectDetails')}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0 transition-colors hover:bg-bg-surface-hover text-text-secondary hover:text-accent-signal-text"
                aria-label={t('modal.close')}
                title={t('modal.close')}
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          {/* Conteúdo do Modal */}
          <div className="overflow-y-auto max-h-[calc(95vh-82px)] sm:max-h-[calc(90vh-92px)] p-4 sm:p-6 md:p-8 bg-bg-primary">

            {/* Preview AO VIVO do Site */}
            {project.demo && (
              <div className="mb-4 sm:mb-6 flex justify-center">
                <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-line shadow-xl w-full max-w-[95%] sm:max-w-[700px]">
                  <div className="p-2 sm:p-3 flex items-center gap-1.5 sm:gap-2 bg-bg-surface">
                    <div className="flex gap-1 sm:gap-2">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500" />
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500" />
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs truncate bg-bg-primary text-accent-trace-text font-medium">
                      {project.demo}
                    </div>
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 sm:px-3 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium transition-colors whitespace-nowrap bg-accent-signal text-on-accent hover:opacity-90"
                    >
                      {t('modal.open')} ↗
                    </a>
                  </div>
                  <div className="relative w-full h-[300px] sm:h-[500px] overflow-hidden bg-bg-surface flex items-start justify-center">
                    <iframe
                      src={project.demo}
                      className="absolute top-0 left-0"
                      style={{
                        width: isMobile ? '375px' : '1400px',
                        height: isMobile ? '667px' : '1000px',
                        border: 'none',
                        pointerEvents: 'none',
                        transform: isMobile ? 'scale(1)' : 'scale(0.5)',
                        transformOrigin: isMobile ? 'top center' : '0 0',
                      }}
                      title={`Preview de ${project.title}`}
                      sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                      loading="lazy"
                    />
                    {/* Overlay clicável — o iframe tem pointer-events desligado
                        (é só preview visual), então o clique real acontece
                        aqui, abrindo o site de verdade em nova aba. */}
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 z-10 cursor-pointer"
                      title={`Abrir ${project.title} em nova aba`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* README Resumido */}
            <div className="border-b border-line pb-5 sm:pb-6 mb-5 sm:mb-6">
              <h4 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 flex items-center gap-2 text-accent-trace-text">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                {t('modal.readme')}
              </h4>
              {loadingReadme ? (
                <p className="leading-relaxed text-sm sm:text-base text-text-secondary">
                  {t('modal.loading')}
                </p>
              ) : readmeNotFound ? (
                <p className="leading-relaxed italic text-sm sm:text-base text-text-secondary">
                  {t('modal.noReadme')}
                </p>
              ) : readme ? (
                <div>
                  <p className="leading-relaxed text-sm sm:text-base text-text-secondary">
                    {readme.length > 200 ? `${readme.substring(0, 200)}...` : readme}
                  </p>
                  {readme.length > 200 && (
                    <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                      <ReadmeViewer
                        repoName={project.repoName}
                        description={project.description}
                        projectTitle={project.title}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <p className="leading-relaxed text-sm sm:text-base text-text-secondary">
                  {project.description || 'Projeto desenvolvido no GitHub'}
                </p>
              )}
            </div>

            {/* Estatísticas */}
            <div className="border-b border-line pb-5 sm:pb-6 mb-5 sm:mb-6">
              <h4 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-accent-trace-text">
                {t('modal.stats')}
              </h4>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border border-line bg-bg-surface">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-accent-signal-text" />
                  <div className="min-w-0">
                    <p className="text-xs text-text-secondary font-semibold">{t('modal.stars')}</p>
                    <p className="font-bold text-sm sm:text-base text-text-primary">
                      {project.stars || 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border border-line bg-bg-surface">
                  <GitFork className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-accent-trace-text" />
                  <div className="min-w-0">
                    <p className="text-xs text-text-secondary font-semibold">{t('modal.forks')}</p>
                    <p className="font-bold text-sm sm:text-base text-text-primary">
                      {project.forks || 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border border-line bg-bg-surface">
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-accent-trace-text" />
                  <div className="min-w-0">
                    <p className="text-xs text-text-secondary font-semibold">{t('modal.watchers')}</p>
                    <p className="font-bold text-sm sm:text-base text-text-primary">
                      {project.watchers || 0}
                    </p>
                  </div>
                </div>

                {project.language && (
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border border-line bg-bg-surface">
                    <Code className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-accent-trace-text" />
                    <div className="min-w-0">
                      <p className="text-xs text-text-secondary font-semibold">{t('modal.language')}</p>
                      <p className="font-bold text-sm sm:text-base truncate text-text-primary">
                        {project.language}
                      </p>
                    </div>
                  </div>
                )}

                {project.createdAt && (
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border border-line bg-bg-surface">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-accent-signal-text" />
                    <div className="min-w-0">
                      <p className="text-xs text-text-secondary font-semibold">{t('modal.created')}</p>
                      <p className="font-bold text-xs sm:text-sm text-text-primary">
                        {new Date(project.createdAt).toLocaleDateString(locale)}
                      </p>
                    </div>
                  </div>
                )}

                {project.updatedAt && (
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border border-line bg-bg-surface">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-accent-signal-text" />
                    <div className="min-w-0">
                      <p className="text-xs text-text-secondary font-semibold">{t('modal.updated')}</p>
                      <p className="font-bold text-xs sm:text-sm text-text-primary">
                        {new Date(project.updatedAt).toLocaleDateString(locale)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tecnologias */}
            {project.tech && project.tech.length > 0 && (
              <div className="border-b border-line pb-5 sm:pb-6 mb-5 sm:mb-6">
                <h4 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-accent-trace-text">
                  {t('modal.technologies')}
                </h4>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {project.tech.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold text-xs sm:text-sm transition-all duration-200 border border-line bg-bg-surface text-text-primary hover:border-accent-signal"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            <div className="pb-2">
              <h4 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-accent-trace-text">
                {t('modal.links')}
              </h4>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors border border-line bg-bg-surface text-text-primary hover:border-accent-signal"
                  >
                    <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" /> {t('modal.viewDemo')}
                  </a>
                )}
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors bg-accent-signal text-on-accent hover:opacity-90"
                >
                  <Github className="w-4 h-4 sm:w-5 sm:h-5" /> {t('modal.viewGithub')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

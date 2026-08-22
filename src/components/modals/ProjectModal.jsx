import { useState, useEffect } from 'react';
import { X, Github, ExternalLink, Star, GitFork, Eye, Calendar, Code, FileText } from 'lucide-react';
import Portal from '../common/Portal';
import { ReadmeViewer } from './ReadmeViewer';
import { useTheme } from '../../hooks/useTheme';
import { useLanguage } from '../../hooks/useLanguage';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

export const ProjectModal = ({ project, isOpen, onClose }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isDarkMode = theme === 'dark';
  const [readme, setReadme] = useState(null);
  const [loadingReadme, setLoadingReadme] = useState(false);
  const [readmeNotFound, setReadmeNotFound] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useBodyScrollLock(isOpen);

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
  }, [project?.id]);

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

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  return (
    <Portal>
      <div 
        className="fixed inset-0 z-[10000] flex items-center justify-center p-2 sm:p-4 md:p-8 bg-black/70 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      >
        <div 
          className={`
            relative w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh]
             
            border
            rounded-lg
            shadow-2xl 
            overflow-hidden
            animate-scaleIn
            bg-bg-surface border-line
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header do Modal */}
          <div className="sticky top-0 z-10 border-b border-line p-4 sm:p-5 bg-bg-surface">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                <div className="p-2 flex-shrink-0 text-accent-trace">
                  <Code className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-0.5 sm:mb-1 text-text-primary truncate">
                    {project.title}
                  </h3>
                  <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-text-secondary' : 'text-accent-trace'}`}>
                    {t('modal.projectDetails')}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`
                  w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0
                  transition-colors hover:bg-bg-surface-hover text-text-secondary hover:text-accent-signal
                `}
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
                <div className={`rounded-xl sm:rounded-2xl overflow-hidden border-2 shadow-xl w-full max-w-[95%] sm:max-w-[700px] ${
                  isDarkMode ? 'border-line ' : 'border-line '
                } ${isMobile ? 'cursor-none' : ''}`}>
                <div className={`p-2 sm:p-3 flex items-center gap-1.5 sm:gap-2 ${
                  isDarkMode ? 'bg-gradient-to-r from-bg-surface to-bg-surface' : 'bg-gradient-to-r from-bg-surface to-bg-surface'
                }`}>
                  <div className="flex gap-1 sm:gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className={`flex-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs truncate ${
                    isDarkMode ? 'bg-bg-primary text-accent-trace font-medium' : 'bg-white/80 text-gray-700 font-medium'
                  }`}>
                    {project.demo}
                  </div>
                  <a 
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium transition-colors whitespace-nowrap ${
                      isDarkMode 
                        ? 'bg-accent-signal/80 text-text-primary hover:bg-bg-surface' 
                        : 'bg-bg-surface text-text-primary hover:bg-accent-signal'
                    }`}
                  >
                    {t('modal.open')} ↗
                  </a>
                </div>
                <div className={`relative w-full h-[300px] sm:h-[500px] overflow-hidden bg-bg-surface flex items-start justify-center ${isMobile ? 'cursor-none' : ''}`} style={isMobile ? { cursor: 'none !important' } : {}}>
                  <iframe
                    src={project.demo}
                    className={isMobile ? 'cursor-none' : 'absolute top-0 left-0'}
                    style={{
                      width: isMobile ? '375px' : '1400px',
                      height: isMobile ? '667px' : '1000px',
                      border: 'none',
                      pointerEvents: 'none',
                      transform: isMobile ? 'scale(1)' : 'scale(0.5)',
                      transformOrigin: isMobile ? 'top center' : '0 0',
                      cursor: isMobile ? 'none' : 'default'
                    }}
                    title={`Preview de ${project.title}`}
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    loading="lazy"
                  />
                  {/* Overlay clicável para manter cursor customizado e abrir link */}
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 z-10 cursor-pointer"
                    title="Clique para abrir o site em nova aba"
                  ></a>
                </div>
                </div>
              </div>
            )}

            {/* README Resumido */}
            <div className="border-b border-line pb-5 sm:pb-6 mb-5 sm:mb-6">
              <h4 className={`text-lg sm:text-xl font-bold mb-2 sm:mb-3 flex items-center gap-2 ${isDarkMode ? 'text-accent-trace' : 'text-accent-trace'}`}>
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                {t('modal.readme')}
              </h4>
              {loadingReadme ? (
                <p className={`leading-relaxed text-sm sm:text-base ${isDarkMode ? 'text-text-secondary' : 'text-gray-700'}`}>
                  {t('modal.loading')}
                </p>
              ) : readmeNotFound ? (
                <p className={`leading-relaxed italic text-sm sm:text-base ${isDarkMode ? 'text-text-secondary' : 'text-gray-600'}`}>
                  {t('modal.noReadme')}
                </p>
              ) : readme ? (
                <div>
                  <p className={`leading-relaxed text-sm sm:text-base ${isDarkMode ? 'text-text-secondary' : 'text-gray-800'}`}>
                    {readme.length > 200 ? `${readme.substring(0, 200)}...` : readme}
                  </p>
                  {readme.length > 200 && (
                    <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                      <ReadmeViewer 
                        username="higorxyz"
                        repoName={project.repoName}
                        description={project.description}
                        projectTitle={project.title}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <p className={`leading-relaxed text-sm sm:text-base ${isDarkMode ? 'text-text-secondary' : 'text-gray-700'}`}>
                  {project.description || 'Projeto desenvolvido no GitHub'}
                </p>
              )}
            </div>

            {/* Estatísticas */}
            <div className="border-b border-line pb-5 sm:pb-6 mb-5 sm:mb-6">
              <h4 className={`text-lg sm:text-xl font-bold mb-3 sm:mb-4 ${isDarkMode ? 'text-accent-trace' : 'text-accent-trace'}`}>
                {t('modal.stats')}
              </h4>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border border-line bg-bg-primary">
                  <Star className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                  <div className="min-w-0">
                    <p className={`text-xs ${isDarkMode ? 'text-yellow-300 font-semibold' : 'text-yellow-800 font-semibold'}`}>{t('modal.stars')}</p>
                    <p className={`font-bold text-sm sm:text-base ${isDarkMode ? 'text-yellow-100' : 'text-yellow-900'}`}>
                      {project.stars || 0}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border border-line bg-bg-primary">
                  <GitFork className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <div className="min-w-0">
                    <p className={`text-xs ${isDarkMode ? 'text-blue-300 font-semibold' : 'text-blue-800 font-semibold'}`}>{t('modal.forks')}</p>
                    <p className={`font-bold text-sm sm:text-base ${isDarkMode ? 'text-blue-100' : 'text-blue-900'}`}>
                      {project.forks || 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border border-line bg-bg-primary">
                  <Eye className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                  <div className="min-w-0">
                    <p className={`text-xs ${isDarkMode ? 'text-green-300 font-semibold' : 'text-green-800 font-semibold'}`}>{t('modal.watchers')}</p>
                    <p className={`font-bold text-sm sm:text-base ${isDarkMode ? 'text-green-100' : 'text-green-900'}`}>
                      {project.watchers || 0}
                    </p>
                  </div>
                </div>

                {project.language && (
                  <div className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border ${
                    isDarkMode ? 'bg-gradient-to-br from-bg-surface to-bg-surface border-line' : 'bg-gradient-to-br from-bg-surface to-bg-surface border-line'
                  }`}>
                    <Code className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${isDarkMode ? 'text-accent-trace' : 'text-accent-trace'}`} />
                    <div className="min-w-0">
                      <p className={`text-xs ${isDarkMode ? 'text-accent-trace font-semibold' : 'text-accent-trace font-semibold'}`}>{t('modal.language')}</p>
                      <p className={`font-bold text-sm sm:text-base truncate ${isDarkMode ? 'text-accent-trace' : 'text-accent-trace'}`}>
                        {project.language}
                      </p>
                    </div>
                  </div>
                )}

                {project.createdAt && (
                  <div className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border ${
                    isDarkMode ? 'bg-gradient-to-br from-bg-surface to-bg-surface border-line' : 'bg-gradient-to-br from-bg-surface to-bg-surface border-line'
                  }`}>
                    <Calendar className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${isDarkMode ? 'text-accent-signal' : 'text-accent-signal'}`} />
                    <div className="min-w-0">
                      <p className={`text-xs ${isDarkMode ? 'text-accent-signal font-semibold' : 'text-accent-signal font-semibold'}`}>{t('modal.created')}</p>
                      <p className={`font-bold text-xs sm:text-sm ${isDarkMode ? 'text-accent-signal' : 'text-accent-signal'}`}>
                        {new Date(project.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                )}

                {project.updatedAt && (
                  <div className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border ${
                    isDarkMode ? 'bg-gradient-to-br from-orange-900/30 to-orange-800/20 border-orange-600/40' : 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300'
                  }`}>
                    <Calendar className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                    <div className="min-w-0">
                      <p className={`text-xs ${isDarkMode ? 'text-orange-300 font-semibold' : 'text-orange-800 font-semibold'}`}>{t('modal.updated')}</p>
                      <p className={`font-bold text-xs sm:text-sm ${isDarkMode ? 'text-orange-100' : 'text-orange-900'}`}>
                        {new Date(project.updatedAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tecnologias */}
            {project.tech && project.tech.length > 0 && (
              <div className="border-b border-line pb-5 sm:pb-6 mb-5 sm:mb-6">
                <h4 className={`text-lg sm:text-xl font-bold mb-3 sm:mb-4 ${isDarkMode ? 'text-accent-trace' : 'text-accent-trace'}`}>
                  {t('modal.technologies')}
                </h4>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {project.tech.map((tech, index) => (
                    <span
                      key={index}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold text-xs sm:text-sm transition-all duration-200 border ${
                        isDarkMode 
                          ? 'bg-accent-signal !text-text-primary border-line shadow-md  hover:shadow-lg hover: hover:scale-105' 
                          : 'bg-accent-signal !text-text-primary border-line shadow-md  hover:shadow-lg hover: hover:scale-105'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            <div className="pb-2">
              <h4 className={`text-lg sm:text-xl font-bold mb-3 sm:mb-4 ${isDarkMode ? 'text-accent-trace' : 'text-accent-trace'}`}>
                {t('modal.links')}
              </h4>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 border-2 ${
                      isDarkMode 
                        ? 'bg-gradient-to-r from-bg-surface to-bg-surface !text-text-primary border-line shadow-lg  hover:shadow-xl hover: hover:scale-105' 
                        : 'bg-gradient-to-r from-bg-surface to-bg-surface !text-text-primary border-line shadow-lg  hover:shadow-xl hover: hover:scale-105'
                    }`}
                  >
                    <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" /> {t('modal.viewDemo')}
                  </a>
                )}
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 border-2 ${
                    isDarkMode 
                      ? 'bg-accent-signal !text-text-primary border-line shadow-lg  hover:shadow-xl hover: hover:scale-105' 
                      : 'bg-accent-signal !text-text-primary border-line shadow-lg  hover:shadow-xl hover: hover:scale-105'
                  }`}
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

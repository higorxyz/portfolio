import { useState, useEffect } from 'react';
import { FileText, Loader, X } from 'lucide-react';
import DOMPurify from 'dompurify';
import Portal from '../common/Portal';
import { useTheme } from '../../hooks/useTheme';
import { useLanguage } from '../../hooks/useLanguage';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { useModalA11y } from '../../hooks/useModalA11y';

export const ReadmeViewer = ({ repoName, description, projectTitle }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  // Só usado pra alternar a classe .dark-theme no HTML do README (ver
  // src/styles/index.css .dark-theme .readme-content) — o resto do
  // componente já usa os tokens de cor, que trocam sozinhos por tema.
  const isDarkMode = theme === 'dark';
  const [readme, setReadme] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useBodyScrollLock(isModalOpen);
  const containerRef = useModalA11y(isModalOpen, () => setIsModalOpen(false));

  useEffect(() => {
    setReadme(null);
    setError(false);
  }, [repoName]);

  const fetchReadme = async () => {
    setLoading(true);
    try {
      // Antes batia direto em api.github.com/repos/.../readme do navegador.
      // Agora passa por /api/github-readme, que roda no servidor e cacheia.
      const response = await fetch(
        `/api/github-readme?repo=${encodeURIComponent(repoName)}`
      );

      if (!response.ok) {
        throw new Error('README não encontrado');
      }

      const html = await response.text();
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      
      const links = tempDiv.querySelectorAll('a');
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href.startsWith('#') || href.startsWith('http://localhost'))) {
          const textNode = document.createTextNode(link.textContent);
          link.parentNode.replaceChild(textNode, link);
        } else if (href && href.startsWith('http')) {
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        }
      });
      
      setReadme(DOMPurify.sanitize(tempDiv.innerHTML));
      setError(false);
    } catch (err) {
      console.error('Erro ao buscar README:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    if (!readme && !error && repoName) {
      fetchReadme();
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (!repoName) {
    return <p className="text-text-secondary text-sm">{description}</p>;
  }

  return (
    <>
      <div className="space-y-2">
        {description && description !== 'Projeto desenvolvido no GitHub' && (
          <p className="text-text-secondary text-sm">{description}</p>
        )}

        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 text-sm text-accent-trace-text hover:opacity-80 transition-colors duration-200"
        >
          <FileText className="w-4 h-4" />
          <span>{t('readme.viewFull')}</span>
        </button>
      </div>

      {isModalOpen && (
        <Portal>
          <div
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-8 backdrop-blur-[2px] animate-fadeIn bg-black/70"
            onClick={handleCloseModal}
          >
            <div
              ref={containerRef}
              role="dialog"
              aria-modal="true"
              aria-label={projectTitle || 'README'}
              tabIndex={-1}
              className="relative w-full h-full max-w-6xl border rounded-lg shadow-2xl overflow-hidden animate-scaleIn bg-bg-surface border-line outline-none"
              onClick={(e) => e.stopPropagation()}
            >
            {/* Header do Modal */}
            <div className="sticky top-0 z-10 border-b border-line p-4 sm:p-5 bg-bg-surface">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 flex-shrink-0 text-accent-trace-text">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-2xl font-bold mb-1 text-text-primary truncate">
                      {projectTitle || 'README'}
                    </h3>
                    <p className="text-xs sm:text-sm text-accent-trace-text">{t('readme.title')}</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors hover:bg-bg-surface-hover text-text-secondary hover:text-accent-signal-text"
                  title={t('readme.close')}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Conteúdo do Modal */}
            <div className="overflow-y-auto h-[calc(100%-82px)] p-4 sm:p-6 md:p-8 bg-bg-primary">
              {loading && (
                <div className="flex flex-col items-center justify-center gap-4 py-32 text-text-secondary">
                  <Loader className="w-12 h-12 animate-spin text-accent-trace-text" />
                  <span className="text-lg">{t('readme.loading')}</span>
                </div>
              )}

              {error && !loading && (
                <div className="text-center py-24">
                  <div className="inline-block p-6 border border-line bg-bg-surface">
                    <p className="text-base mb-3 text-accent-signal-text">
                      {t('readme.notAvailable')}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {t('readme.noFile')}
                    </p>
                  </div>
                </div>
              )}

              {readme && !loading && (
                <div className="max-w-4xl mx-auto border border-line bg-bg-surface p-5 sm:p-8">
                  <div 
                    className={`readme-content prose max-w-none ${isDarkMode ? 'dark-theme' : ''}`}
                    dangerouslySetInnerHTML={{ __html: readme }}
                  />
                </div>
              )}
            </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
};

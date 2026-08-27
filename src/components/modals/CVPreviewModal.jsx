import { useEffect, useRef, useState, useCallback } from 'react';
import { Download, X, ZoomIn, ZoomOut, FileText } from 'lucide-react';
import Portal from '../common/Portal';
import { useLanguage } from '../../hooks/useLanguage';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { useModalA11y } from '../../hooks/useModalA11y';
import { CV_FILES } from '../../config';

let pdfjsPromise;

const loadPdfJs = () => {
  if (!pdfjsPromise) {
    pdfjsPromise = Promise.all([
      import('pdfjs-dist'),
      import('pdfjs-dist/build/pdf.worker.min.mjs?url')
    ]).then(([pdfjsLib, worker]) => {
      pdfjsLib.GlobalWorkerOptions.workerSrc = worker.default;
      return pdfjsLib;
    });
  }

  return pdfjsPromise;
};

// Uma <canvas> por página do PDF, empilhadas verticalmente — funciona
// igual pra currículo de 1 página (caso atual) ou de várias (se crescer).
const PdfPageCanvas = ({ page, scale, onRendered, onError }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let isMounted = true;
    const viewport = page.getViewport({ scale });
    const context = canvas.getContext('2d', { alpha: false });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const renderTask = page.render({ canvasContext: context, viewport });

    renderTask.promise
      .then(() => {
        if (isMounted) onRendered();
      })
      .catch((error) => {
        if (error?.name !== 'RenderingCancelledException') {
          console.error('Erro ao desenhar página do currículo:', error);
          if (isMounted) onError();
        }
      });

    return () => {
      isMounted = false;
      renderTask.cancel();
    };
  }, [page, scale, onRendered, onError]);

  return <canvas ref={canvasRef} className="max-w-full h-auto shadow-2xl" />;
};

export const CVPreviewModal = ({ isOpen, onClose }) => {
  const { language, t } = useLanguage();
  useBodyScrollLock(isOpen);
  const containerRef = useModalA11y(isOpen, onClose);
  const [scale, setScale] = useState(1);
  const [pages, setPages] = useState([]);
  const [renderedCount, setRenderedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const cv = CV_FILES[language] || CV_FILES.pt;

  useEffect(() => {
    if (!isOpen) {
      setPages([]);
      return undefined;
    }

    let isMounted = true;
    setIsLoading(true);
    setHasError(false);
    setPages([]);
    setRenderedCount(0);

    const loadDocument = async () => {
      try {
        const pdfjsLib = await loadPdfJs();
        const response = await fetch(cv.path);
        if (!response.ok) throw new Error('Falha ao carregar o PDF');
        const documentData = await response.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: documentData }).promise;

        const allPages = await Promise.all(
          Array.from({ length: pdf.numPages }, (_, index) => pdf.getPage(index + 1))
        );

        if (isMounted) setPages(allPages);
      } catch (error) {
        console.error('Erro ao renderizar currículo:', error);
        if (isMounted) {
          setIsLoading(false);
          setHasError(true);
        }
      }
    };

    loadDocument();
    return () => {
      isMounted = false;
    };
  }, [cv.path, isOpen]);

  const handlePageRendered = useCallback(() => {
    setRenderedCount((count) => count + 1);
  }, []);

  const handlePageError = useCallback(() => {
    setHasError(true);
  }, []);

  useEffect(() => {
    if (pages.length > 0 && renderedCount >= pages.length) {
      setIsLoading(false);
    }
  }, [pages.length, renderedCount]);

  if (!isOpen) return null;

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-label={t('cv.label')}
          tabIndex={-1}
          className="bg-bg-surface border border-line rounded-lg w-full max-w-5xl h-[92vh] max-h-[960px] flex flex-col overflow-hidden shadow-2xl outline-none"
          onClick={(event) => event.stopPropagation()}
        >
          <header className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-line bg-bg-surface">
            <span className="text-sm sm:text-base font-mono font-medium text-text-primary truncate">
              <span className="text-accent-signal-text">CV / </span>{t('cv.label')}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setScale((currentScale) => Math.max(0.75, currentScale - 0.15))}
                aria-label={t('cv.zoomOut')}
                title={t('cv.zoomOut')}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-bg-surface-hover text-text-secondary transition-colors"
              >
                <ZoomOut size={17} />
              </button>
              <span className="hidden sm:inline font-mono text-xs text-text-secondary min-w-10 text-center">
                {Math.round(scale * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setScale((currentScale) => Math.min(2, currentScale + 0.15))}
                aria-label={t('cv.zoomIn')}
                title={t('cv.zoomIn')}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-bg-surface-hover text-text-secondary transition-colors"
              >
                <ZoomIn size={17} />
              </button>
              <a
                href={cv.path}
                download={cv.fileName}
                aria-label={t('cv.download')}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-bg-surface-hover text-accent-trace-text transition-colors"
              >
                <Download size={18} />
              </a>
              <button
                type="button"
                onClick={onClose}
                aria-label={t('modal.close')}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-bg-surface-hover text-text-secondary transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </header>

          <div className="relative flex-1 overflow-auto bg-bg-primary p-4 sm:p-8">
            <div className="min-h-full flex flex-col items-center gap-4">
              {pages.map((page, index) => (
                <PdfPageCanvas
                  key={index}
                  page={page}
                  scale={scale}
                  onRendered={handlePageRendered}
                  onError={handlePageError}
                />
              ))}

              {isLoading && !hasError && (
                <div className="flex flex-col items-center gap-3 py-24 text-text-secondary">
                  <FileText className="text-accent-trace-text animate-pulse" size={28} />
                  <span className="font-mono text-xs">{t('cv.loading')}</span>
                </div>
              )}
              {hasError && (
                <div className="flex flex-col items-center gap-3 py-24 text-center text-text-secondary">
                  <FileText className="text-accent-signal-text" size={28} />
                  <span className="font-mono text-xs">{t('cv.error')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

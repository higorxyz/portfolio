import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

// Hook compartilhado pelos modais (ProjectModal, ReadmeViewer, CVPreviewModal):
// - Esc fecha o modal
// - Tab/Shift+Tab ficam presos dentro do modal (focus trap)
// - Foco vai pro primeiro elemento focável ao abrir
// - Foco volta pra quem abriu o modal ao fechar
export const useModalA11y = (isOpen, onClose) => {
  const containerRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    previouslyFocused.current = document.activeElement;

    const container = containerRef.current;
    const getFocusable = () =>
      container ? Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)) : [];

    const firstFocusable = getFocusable()[0];
    (firstFocusable || container)?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !container) return;

      const items = getFocusable();
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused.current?.focus?.();
    };
  }, [isOpen, onClose]);

  return containerRef;
};

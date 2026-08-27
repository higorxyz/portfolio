import { useEffect, useRef } from 'react';

/**
 * Hook de Parallax de Alta Performance (Zero-Glitch, Determinístico):
 * 
 * Correções definitivas:
 * 1. Mede a posição estática real no documento (staticDocTop) no load/resize.
 *    Durante o scroll, ZERO chamadas a getBoundingClientRect() — elimina loops e reflows.
 * 2. Elimina IntersectionObserver flapping nas bordas: a visibilidade é verificada
 *    por cálculo de viewport com buffer de segurança (250px).
 * 3. Trata overscroll/rubber-banding no topo e no rodapé, clampando window.scrollY.
 * 
 * @param {number} speed - Velocidade relativa da camada (ex: 0.14 = 14%)
 * @param {object} options - Opções (clamp: [min, max], mode: 'center' | 'top')
 */
export const useParallax = (speed = 0.15, options = {}) => {
  const targetRef = useRef(null);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    // Respeita acessibilidade do usuário
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Desativa em mobile (<768px) para preservar inércia nativa do toque
    const isMobile = window.innerWidth < 768;

    if (prefersReducedMotion || isMobile) {
      el.style.transform = '';
      return;
    }

    // Posição estática invariante no documento
    let staticDocTop = 0;
    let elHeight = 0;

    const measure = () => {
      // Salva transform atual e zera momentaneamente para ler geometria estática real
      const prevTransform = el.style.transform;
      el.style.transform = 'none';
      const rect = el.getBoundingClientRect();
      staticDocTop = rect.top + window.scrollY;
      elHeight = rect.height;
      el.style.transform = prevTransform;
    };

    measure();

    let ticking = false;

    const updatePosition = () => {
      if (!el) return;

      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const maxScroll = Math.max(0, docHeight - windowHeight);

      // Trava scrollY entre 0 e maxScroll para eliminar glitches de overscroll/bounce
      const scrollY = Math.max(0, Math.min(window.scrollY, maxScroll));

      // Buffer de segurança para evitar cortes e manter cálculos suaves nas bordas
      const buffer = 300;
      const elTopInView = staticDocTop - scrollY;
      const elBottomInView = elTopInView + elHeight;

      if (elBottomInView < -buffer || elTopInView > windowHeight + buffer) {
        return; // Fora do campo de visão estendido: não precisa mover
      }

      let offset = 0;

      if (options.mode === 'top') {
        // Ancorado no topo da página (Hero): no topo absoluto (scrollY=0), offset é 0
        offset = scrollY * speed;
      } else {
        // Ancorado no centro visual: offset é 0 quando o elemento atinge o centro da tela
        const staticCenter = staticDocTop + elHeight / 2;
        const viewportCenter = scrollY + windowHeight / 2;
        const distanceFromCenter = staticCenter - viewportCenter;
        offset = -distanceFromCenter * speed;
      }

      if (options.clamp) {
        const [min, max] = options.clamp;
        offset = Math.max(min, Math.min(max, offset));
      }

      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updatePosition();
          ticking = false;
        });
        ticking = true;
      }
    };

    const onResize = () => {
      if (window.innerWidth < 768) {
        el.style.transform = '';
      } else {
        measure();
        updatePosition();
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    updatePosition();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (el) el.style.transform = '';
    };
  }, [speed, options]);

  return targetRef;
};

import { useEffect, useRef } from 'react';

// Barra de progresso desacoplada do estado do React:
// Atualiza transform: scaleX diretamente na GPU via requestAnimationFrame
// sem causar re-render no componente App durante a rolagem da página.
export const ScrollProgressBar = () => {
  const barRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      if (!barRef.current) return;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? Math.min(Math.max(window.scrollY / totalHeight, 0), 1) : 0;
      barRef.current.style.transform = `scaleX(${progress})`;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          update();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 right-0 h-[2.5px] z-[100] bg-accent-signal origin-left pointer-events-none will-change-transform"
      style={{ transform: 'scaleX(0)' }}
      aria-hidden="true"
    />
  );
};


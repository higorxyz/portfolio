import { useMemo } from 'react';
import { Terminal, Rocket, Mail, Github, Linkedin, Instagram, ChevronDown, ArrowUpRight, Circle } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useParallax } from '../../hooks/useParallax';

export const HeroSection = ({ onNavigate }) => {
  const { t } = useLanguage();
  const roles = useMemo(() => [t('hero.role1'), t('hero.role2')], [t]);

  // Parallax multicamadas intenso e fluido:
  // - gridRef: fundo milimetrado desliza a 35% da rolagem (profundidade profunda)
  // - glowRef: aura luminosa desliza a 24%
  // - cardRef: card do terminal flutua com destaque a 18%
  // - conteúdo textual: plano zero estável
  const gridRef = useParallax(0.35, { mode: 'top', clamp: [-250, 250] });
  const glowRef = useParallax(0.24, { mode: 'top', clamp: [-180, 180] });
  const cardRef = useParallax(0.18, { mode: 'top', clamp: [-150, 150] });

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 pt-20 sm:pt-24 pb-12 sm:pb-16 overflow-hidden"
    >
      {/* Grid Blueprint com Parallax expressivo de profundidade */}
      <div
        ref={gridRef}
        className="absolute -top-48 -bottom-48 inset-x-0 bg-blueprint-grid pointer-events-none will-change-transform"
        aria-hidden="true"
      />

      {/* Halos de iluminação com Parallax multicamadas */}
      <div
        ref={glowRef}
        className="absolute top-1/4 -right-24 w-[420px] h-[420px] bg-accent-trace/12 rounded-full blur-3xl pointer-events-none will-change-transform"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-16 left-10 w-96 h-96 bg-accent-signal/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto w-full grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-center">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm text-accent-trace-text border border-line bg-bg-surface/70 px-3 py-1.5 mb-6 sm:mb-8">
            <Terminal size={14} />
            <span>{roles.join(' / ')}</span>
          </div>

          <p className="font-mono text-xs sm:text-sm text-accent-signal-text mb-3 tracking-normal">01 / {t('hero.eyebrow')}</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-5 sm:mb-6 leading-[1.05] text-text-primary max-w-2xl">
            {t('hero.headline')}
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-text-secondary mb-8 sm:mb-10 max-w-2xl leading-relaxed">
            {t('hero.description')}
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-10 sm:mb-12">
            <button
              onClick={() => onNavigate('projetos')}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-accent-signal text-on-accent font-display font-bold text-sm sm:text-base flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Rocket size={18} /> {t('hero.viewProjects')}
            </button>
            <button
              onClick={() => onNavigate('contato')}
              className="w-full sm:w-auto card-motion transform px-6 py-3 rounded-lg border border-line bg-transparent text-text-primary font-display font-bold text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-bg-surface"
            >
              <Mail size={18} /> {t('hero.contact')}
            </button>
          </div>

          <div className="flex gap-3 sm:gap-4">
            <a
              href="https://github.com/higorxyz"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="card-motion transform w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-bg-surface border border-line flex items-center justify-center hover:border-accent-signal hover:-translate-y-1"
            >
              <Github size={20} className="sm:w-6 sm:h-6 text-text-primary" />
            </a>
            <a
              href="https://www.linkedin.com/in/higorbatista"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="card-motion transform w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-bg-surface border border-line flex items-center justify-center hover:border-accent-signal hover:-translate-y-1"
            >
              <Linkedin size={20} className="sm:w-6 sm:h-6 text-text-primary" />
            </a>
            <a
              href="https://www.instagram.com/higorxyz/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="card-motion transform w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-bg-surface border border-line flex items-center justify-center hover:border-accent-signal hover:-translate-y-1"
            >
              <Instagram size={20} className="sm:w-6 sm:h-6 text-text-primary" />
            </a>
            <a
              href="mailto:dev.higorxyz@gmail.com"
              aria-label="Email"
              className="card-motion transform w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-bg-surface border border-line flex items-center justify-center hover:border-accent-signal hover:-translate-y-1"
            >
              <Mail size={20} className="sm:w-6 sm:h-6 text-text-primary" />
            </a>
          </div>
        </div>

        {/* Card do Terminal com Parallax marcante e flutuação suave */}
        <div ref={cardRef} className="relative hidden md:block will-change-transform">
          <div className="relative border border-line bg-bg-surface shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-line font-mono text-xs text-text-secondary">
              <Circle size={9} fill="currentColor" className="text-accent-trace-text" />
              <span>higorxyz / build-log</span>
              <span className="ml-auto text-accent-trace-text">ONLINE</span>
            </div>
            <div className="p-5 sm:p-7 font-mono text-xs sm:text-sm leading-8">
              <p className="text-text-secondary"><span className="text-accent-signal-text">$</span> cat current-focus.json</p>
              <p className="text-text-primary pl-4">{'{'}</p>
              <p className="text-text-secondary pl-8"><span className="text-accent-trace-text">"studying"</span>: "Software Engineering / FIAP",</p>
              <p className="text-text-secondary pl-8"><span className="text-accent-trace-text">"building"</span>: "web apps + REST APIs",</p>
              <p className="text-text-secondary pl-8"><span className="text-accent-trace-text">"exploring"</span>: "AI, ML + data"</p>
              <p className="text-text-primary pl-4">{'}'}</p>
              <div className="mt-5 pt-4 border-t border-line flex items-center justify-between text-xs">
                <span className="text-text-secondary">{t('hero.availability')}</span>
                <ArrowUpRight size={16} className="text-accent-signal-text" />
              </div>
            </div>
          </div>
        </div>

        <ChevronDown
          className="w-8 h-8 sm:w-10 sm:h-10 text-text-secondary lg:col-span-2 mx-auto animate-bounce cursor-pointer"
          onClick={() => onNavigate('sobre')}
        />
      </div>
    </section>
  );
};

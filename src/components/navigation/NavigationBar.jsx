import { useState, useRef, useEffect } from 'react';
import { Menu, X, Terminal, Download } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useLanguage } from '../../hooks/useLanguage';
import { ThemeToggle, LanguageToggle } from '.';

const SECTION_KEYS = ['home', 'sobre', 'projetos', 'skills', 'contato'];
const TRANSLATION_KEYS = {
  home: 'home',
  sobre: 'about',
  projetos: 'projects',
  skills: 'skills',
  contato: 'contact'
};

export const NavigationBar = ({ activeSection, onNavigate, onDownloadCV }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const buttonRefs = useRef({});
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const handleNavigate = (section) => {
    onNavigate(section);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const updateIndicator = () => {
      const activeEl = buttonRefs.current[activeSection];
      if (activeEl) {
        setIndicatorStyle({
          left: activeEl.offsetLeft,
          width: activeEl.offsetWidth,
          opacity: 1
        });
      } else {
        setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
      }
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator, { passive: true });
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeSection]);

  return (
    <nav aria-label={t('nav.main')} className={`fixed w-full z-50 border-b backdrop-blur-md ${
      theme === 'dark' ? 'bg-bg-primary/90 border-line' : 'bg-white/85 border-line'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-accent-signal-text text-sm">_</span>
            <Terminal className="text-accent-trace-text w-5 h-5" />
            <span className="text-lg sm:text-xl font-bold text-text-primary tracking-normal">
              higorxyz
            </span>
          </div>

          {/* Desktop Navigation com linha deslizante suave */}
          <div className="relative hidden md:flex items-center gap-6 lg:gap-8">
            {SECTION_KEYS.map((section) => (
              <button
                key={section}
                ref={(el) => { buttonRefs.current[section] = el; }}
                onClick={() => handleNavigate(section)}
                className={`capitalize py-2 transition-colors duration-300 ease-out text-sm lg:text-base focus-visible:outline-none ${
                  activeSection === section
                    ? 'text-accent-trace-text font-semibold'
                    : 'text-text-secondary hover:text-accent-trace-text'
                }`}
              >
                {t(`nav.${TRANSLATION_KEYS[section] || section}`)}
              </button>
            ))}

            {/* Linha indicadora deslizante contínua */}
            <span
              className="absolute bottom-0 h-0.5 bg-accent-signal transition-all duration-300 ease-out pointer-events-none rounded-full"
              style={{
                transform: `translateX(${indicatorStyle.left}px)`,
                width: `${indicatorStyle.width}px`,
                opacity: indicatorStyle.opacity
              }}
              aria-hidden="true"
            />
          </div>

          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            <LanguageToggle />
            <ThemeToggle />
            <button
              onClick={onDownloadCV}
              className="px-3 lg:px-4 py-1.5 border border-line bg-bg-surface hover:bg-bg-surface-hover font-medium text-xs lg:text-sm flex items-center gap-1.5 transition-colors"
            >
              <Download size={14} className="lg:w-4 lg:h-4" /> {t('about.downloadCV')}
            </button>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <LanguageToggle />
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="p-2"
              aria-label={isMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-3 pt-3 pb-2 border-t border-line flex flex-col gap-1 animate-fadeIn">
            {SECTION_KEYS.map((section) => (
              <button
                key={section}
                onClick={() => handleNavigate(section)}
                className={`capitalize text-left py-2.5 px-3 rounded-lg transition-all duration-200 ease-out ${
                  activeSection === section
                    ? 'text-accent-trace-text bg-bg-surface font-semibold border-l-2 border-accent-signal'
                    : 'text-text-secondary hover:text-accent-trace-text hover:bg-bg-surface/60'
                }`}
              >
                {t(`nav.${TRANSLATION_KEYS[section] || section}`)}
              </button>
            ))}
            <button
              onClick={() => {
                onDownloadCV();
                setIsMenuOpen(false);
              }}
              className="mt-2 px-4 py-2 rounded-lg border border-line bg-bg-surface hover:bg-bg-surface font-medium text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Download size={16} /> {t('about.downloadCV')}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

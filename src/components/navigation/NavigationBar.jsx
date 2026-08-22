import { useState } from 'react';
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

  const handleNavigate = (section) => {
    onNavigate(section);
    setIsMenuOpen(false);
  };

  return (
    <nav aria-label={t('nav.main')} className={`fixed w-full z-50 border-b backdrop-blur-md ${
      theme === 'dark' ? 'bg-bg-primary/90 border-line' : 'bg-white/85 border-line'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-accent-signal text-sm">_</span>
            <Terminal className="text-accent-trace w-5 h-5" />
            <span className="text-lg sm:text-xl font-bold text-text-primary tracking-normal">
              higorxyz
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {SECTION_KEYS.map((section) => (
              <button
                key={section}
                onClick={() => handleNavigate(section)}
                className={`capitalize relative py-2 transition-colors text-sm lg:text-base ${
                  activeSection === section ? 'text-accent-trace' : 'hover:text-accent-trace'
                }`}
              >
                {t(`nav.${TRANSLATION_KEYS[section] || section}`)}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-accent-signal transition-all ${
                    activeSection === section ? 'w-full' : 'w-0'
                  }`}
                />
              </button>
            ))}
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
            <button onClick={() => setIsMenuOpen((prev) => !prev)} className="p-2">
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
                className={`capitalize text-left py-2 px-3 transition-colors ${
                  activeSection === section
                    ? 'text-accent-trace bg-bg-surface'
                    : 'hover:text-accent-trace hover:bg-bg-surface'
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

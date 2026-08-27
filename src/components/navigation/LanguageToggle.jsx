import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Globe, Check } from 'lucide-react';

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const languages = [
    { code: 'pt', label: 'PT', fullName: 'Português' },
    { code: 'en', label: 'EN', fullName: 'English' }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botão principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors duration-200 bg-bg-surface hover:bg-bg-surface-hover border-line"
        aria-label={`${language.toUpperCase()} — ${language === 'pt' ? 'idioma selecionado, clique para trocar' : 'selected language, click to change'}`}
        aria-expanded={isOpen}
      >
        <Globe size={14} className="text-accent-trace-text" />
        <span className="text-sm font-semibold text-accent-trace-text">
          {language.toUpperCase()}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-36 border rounded-lg shadow-2xl overflow-hidden z-50 animate-fadeIn bg-bg-surface border-line">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${
                language === lang.code
                  ? 'bg-bg-surface-hover text-accent-trace-text'
                  : 'text-text-secondary hover:bg-bg-surface-hover hover:text-accent-trace-text'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{lang.label}</span>
                <span className="text-xs text-text-secondary">{lang.fullName}</span>
              </div>
              {language === lang.code && <Check size={16} className="text-accent-trace-text" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;

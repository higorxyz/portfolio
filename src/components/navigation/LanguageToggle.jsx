import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useTheme } from '../../hooks/useTheme';
import { Globe, Check } from 'lucide-react';

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isDark = theme === 'dark';

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
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors duration-200 ${
          isDark
            ? 'bg-bg-surface hover:bg-bg-surface border-line'
            : 'bg-bg-surface hover:bg-bg-surface border-line'
        }`}
        aria-label={language === 'pt' ? 'Selecionar idioma' : 'Select language'}
      >
        <Globe size={14} className={isDark ? 'text-accent-trace' : 'text-accent-trace'} />
        <span className={`text-sm font-semibold ${isDark ? 'text-accent-trace' : 'text-accent-trace'}`}>
          {language.toUpperCase()}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute top-full mt-2 right-0 w-36  border rounded-lg shadow-2xl overflow-hidden z-50 animate-fadeIn ${
          isDark
            ? 'bg-bg-primary border-line '
            : 'bg-white border-line '
        }`}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${
                language === lang.code
                  ? isDark
                    ? 'bg-bg-surface text-accent-trace'
                    : 'bg-bg-surface text-accent-trace'
                  : isDark
                    ? 'text-text-secondary hover:bg-bg-surface hover:text-accent-trace'
                    : 'text-gray-700 hover:bg-bg-surface hover:text-accent-trace'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{lang.label}</span>
                <span className={`text-xs ${isDark ? 'text-text-secondary' : 'text-text-secondary'}`}>
                  {lang.fullName}
                </span>
              </div>
              {language === lang.code && (
                <Check size={16} className={isDark ? 'text-accent-trace' : 'text-accent-trace'} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;


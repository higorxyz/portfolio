import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useLanguage } from '../../hooks/useLanguage';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === 'dark';
  return (
    <button
      onClick={toggleTheme}
      className="w-9 h-9 flex items-center justify-center rounded-lg border border-line bg-bg-surface text-accent-trace-text transition-colors hover:bg-bg-surface-hover hover:border-accent-trace hover:text-accent-trace-text focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-trace focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
      aria-label={t(isDark ? 'theme.switchLight' : 'theme.switchDark')}
      title={t(isDark ? 'theme.switchLight' : 'theme.switchDark')}
    >
      {isDark ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
};
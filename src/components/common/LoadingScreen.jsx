import { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export const LoadingScreen = ({ onLoadingComplete }) => {
  const { t } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [showText, setShowText] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [isExiting, setIsExiting] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return Math.min(prev + 1.5, 100);
      });
    }, 50);

    setTimeout(() => setShowText(true), 300);

    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    const messages = [
      t('loading.init'),
      t('loading.projects'),
      t('loading.github'),
      t('loading.experience'),
      t('loading.almost'),
    ];

    const messageIndex = Math.min(
      Math.floor((progress / 100) * messages.length),
      messages.length - 1
    );
    setLoadingText(messages[messageIndex]);

    if (progress >= 100 && !hasCompleted) {
      setHasCompleted(true);
      setIsExiting(true);
      onLoadingComplete();
    }
  }, [progress, onLoadingComplete, hasCompleted, t]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-bg-primary transition-opacity duration-700 ease-out ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Grid de fundo, mesmo padrão do Hero — sem partículas soltas */}
      <div className="absolute inset-0 bg-blueprint-grid pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 flex flex-col items-center px-6 max-w-md w-full">
        <div
          className={`mb-8 transform transition-all duration-1000 ${
            showText ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}
        >
          <div className="relative w-24 h-24 flex items-center justify-center border border-line rounded-lg bg-bg-surface">
            <Terminal className="w-10 h-10 text-accent-trace-text animate-pulse" />
            <span
              className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rounded-full bg-accent-signal animate-pulse-signal"
              aria-hidden="true"
            />
          </div>
        </div>

        <div
          className={`text-center mb-8 transition-all duration-700 ${
            showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-2xl font-display font-bold text-text-primary mb-2">@higorxyz</h2>
          <p className="text-text-secondary text-sm font-mono animate-pulse">{loadingText}</p>
        </div>

        <div
          className={`w-full transition-all duration-700 ${
            showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="relative w-full h-1.5 bg-bg-surface rounded-full overflow-hidden border border-line">
            <div
              className="h-full bg-accent-signal rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between items-center mt-2 text-xs">
            <span className="text-accent-trace-text font-mono">{Math.floor(progress)}%</span>
            <span className="text-text-secondary font-mono">{t('loading.loading')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

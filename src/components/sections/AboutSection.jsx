import { User, GraduationCap, Braces } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useParallax } from '../../hooks/useParallax';
import { CodeHighlight } from './CodeHighlight';

export const AboutSection = ({ stats }) => {
  const { t } = useLanguage();
  // Parallax refinado e com profundidade visível (sem glitch de transform inline)
  const codeCardRef = useParallax(0.14, { clamp: [-100, 100] });
  const bioRef = useParallax(-0.05, { clamp: [-45, 45] });

  const codeBlock = t('about.codeBlock')
    .replace('{repos}', stats.publicRepos)
    .replace('{stars}', stats.totalStars);

  return (
    <section id="sobre" className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-2">
            <span className="font-mono text-xs text-accent-signal-text">01 /</span>
            <User className="text-accent-trace-text w-5 h-5 sm:w-6 sm:h-6" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary">
              {t('about.title')}
            </h2>
          </div>
          <p className="text-center sm:text-left text-text-secondary text-sm sm:text-base max-w-xl sm:pl-11">
            {t('about.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
          {/* Coluna da esquerda com leve contraponto de profundidade */}
          <div ref={bioRef} className="space-y-4 sm:space-y-5 will-change-transform">
            <div className="card-motion bg-bg-surface border-l-2 border-l-accent-signal border-y border-r border-line p-4 sm:p-6 rounded-r-xl sm:rounded-r-2xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
              <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-4 sm:mb-5">
                {t('about.card1.text')}
              </p>
              <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-4 sm:mb-5">
                {t('about.card2.text')}
              </p>
              <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
                {t('about.card3.text')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="card-motion bg-bg-surface border border-line border-t-accent-trace p-4 sm:p-6 rounded-lg hover:-translate-y-1 text-center transition-all duration-300">
                <GraduationCap className="text-accent-trace-text w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2" />
                <p className="font-bold text-base sm:text-xl">{t('about.education')}</p>
                <p className="text-text-secondary text-xs sm:text-sm">{t('about.degree')}</p>
              </div>
              <div className="card-motion bg-bg-surface border border-line border-t-accent-signal p-4 sm:p-6 rounded-lg hover:-translate-y-1 text-center transition-all duration-300">
                <Braces className="text-accent-signal-text w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2" />
                <p className="font-bold text-base sm:text-xl">{t('about.web')}</p>
                <p className="text-text-secondary text-xs sm:text-sm">{t('about.apis')}</p>
              </div>
            </div>
          </div>

          {/* Console de código com parallax fluido e zero glitch */}
          <div
            ref={codeCardRef}
            className="h-full rounded-lg overflow-hidden shadow-2xl hover:shadow-subtle-xl transition-shadow duration-300 will-change-transform about-console"
          >
            <div className="flex gap-2 px-3 sm:px-4 py-2 sm:py-3 about-console-bar border-b border-line">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/80" />
            </div>
            <pre className="p-3.5 sm:p-6 font-mono text-[11px] sm:text-sm md:text-base overflow-x-auto whitespace-pre-wrap about-console-code leading-relaxed">
              <CodeHighlight code={codeBlock} />
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};

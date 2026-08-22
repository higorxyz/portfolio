import { Rocket, Star, GitFork, Award } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { useCounter } from '../../hooks/useCounter';
import { StatCardSkeleton } from '../ui';

// Elemento-assinatura do site: os dados vêm ao vivo da API do GitHub
// (via /api/github-stats), então o visual assume isso — um painel de
// status/monitoramento em vez de cards genéricos de "conquista".
export const StatsSection = ({ stats, loading, error }) => {
  const { t } = useLanguage();
  const [statsRef, statsVisible] = useIntersectionObserver();

  const projectsCount = useCounter(stats.publicRepos, 2000, statsVisible && !loading);
  const starsCount = useCounter(stats.totalStars, 2000, statsVisible && !loading);
  const forksCount = useCounter(stats.totalForks, 2000, statsVisible && !loading);

  const metrics = [
    { icon: <Rocket className="w-5 h-5 text-accent-trace mb-2 sm:mb-3" />, value: error ? '—' : projectsCount, label: t('stats.projects') },
    { icon: <Star className="w-5 h-5 text-accent-trace mb-2 sm:mb-3" />, value: error ? '—' : starsCount, label: t('stats.stars') },
    { icon: <GitFork className="w-5 h-5 text-accent-trace mb-2 sm:mb-3" />, value: error ? '—' : forksCount, label: t('stats.forks') },
    { icon: <Award className="w-5 h-5 text-accent-trace mb-2 sm:mb-3" />, value: 2, suffix: '+', label: t('stats.experience') },
  ];

  return (
    <section ref={statsRef} className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="border border-line rounded-xl overflow-hidden bg-bg-surface">
          <div className="flex items-center gap-2 px-4 sm:px-6 py-3 border-b border-line font-mono text-xs sm:text-sm text-text-secondary">
            <span
              className="w-2 h-2 rounded-full bg-accent-trace animate-pulse-signal"
              aria-hidden="true"
            />
            <span>{t('stats.liveLabel')}</span>
            <span className="ml-auto">github.com/higorxyz</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y divide-line lg:divide-y-0 lg:divide-x">
            {loading
              ? [...Array(4)].map((_, index) => <StatCardSkeleton key={index} />)
              : metrics.map(({ icon, value, label, suffix = '' }) => (
                  <div key={label} className="p-4 sm:p-6 md:p-8 border-line">
                    {icon}
                    <div className="font-mono text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary mb-1">
                      {value}
                      {suffix}
                    </div>
                    <p className="text-text-secondary text-xs sm:text-sm">{label}</p>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
};

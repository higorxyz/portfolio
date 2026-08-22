import { User, GraduationCap, Braces } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export const AboutSection = ({ stats }) => {
  const { t } = useLanguage();

  const codeBlock = t('about.codeBlock')
    .replace('{repos}', stats.publicRepos)
    .replace('{stars}', stats.totalStars);

  return (
    <section id="sobre" className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-2">
            <span className="font-mono text-xs text-accent-signal">01 /</span>
            <User className="text-accent-trace w-5 h-5 sm:w-6 sm:h-6" />
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary">
              {t('about.title')}
            </h3>
          </div>
          <p className="text-center sm:text-left text-text-secondary text-sm sm:text-base max-w-xl sm:pl-11">
            {t('about.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
          <div className="space-y-4 sm:space-y-5">
            <div className="card-motion transform bg-bg-surface border-l-2 border-l-accent-signal border-y border-r border-line p-4 sm:p-6 rounded-r-xl sm:rounded-r-2xl hover:-translate-y-1 hover:shadow-2xl">
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
              <div className="card-motion transform bg-bg-surface border border-line border-t-accent-trace p-4 sm:p-6 rounded-lg hover:-translate-y-1 text-center">
                <GraduationCap className="text-accent-trace w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2" />
                <p className="font-bold text-base sm:text-xl">{t('about.education')}</p>
                <p className="text-text-secondary text-xs sm:text-sm">{t('about.degree')}</p>
              </div>
              <div className="card-motion transform bg-bg-surface border border-line border-t-accent-signal p-4 sm:p-6 rounded-lg hover:-translate-y-1 text-center">
                <Braces className="text-accent-signal w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2" />
                <p className="font-bold text-base sm:text-xl">{t('about.web')}</p>
                <p className="text-text-secondary text-xs sm:text-sm">{t('about.apis')}</p>
              </div>
            </div>
          </div>

          <div className="card-motion transform h-full bg-bg-primary border border-line rounded-lg overflow-hidden hover:shadow-2xl">
            <div className="flex gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500" />
            </div>
            <pre className="p-4 sm:p-6 text-accent-trace font-mono text-sm sm:text-base overflow-x-auto whitespace-pre-wrap">
{codeBlock}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};

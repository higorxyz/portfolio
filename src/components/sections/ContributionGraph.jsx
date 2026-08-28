import { useState, useEffect, useMemo, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useLanguage } from '../../hooks/useLanguage';

const CELL_SIZE = 13;
const CELL_GAP = 3;
const MONTH_LABEL_HEIGHT = 18;
const SIDE_LABEL_WIDTH = 28;
const LABEL_GAP = 12;

const buildTimeline = (map, locale) => {
  const weeks = [];
  const months = [];
  const days = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endDate = new Date(today);
  const endDay = endDate.getDay();
  const adjustedEnd = new Date(endDate);
  adjustedEnd.setDate(endDate.getDate() + (6 - endDay));

  const startDate = new Date(adjustedEnd);
  startDate.setDate(adjustedEnd.getDate() - ((53 * 7) - 1));

  const current = new Date(startDate);
  let previousMonth = null;
  let lastLabelWeek = -1;

  for (let weekIndex = 0; weekIndex < 53; weekIndex += 1) {
    const week = [];

    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const dateKey = current.toISOString().split('T')[0];
      const dateClone = new Date(current);
      const count = map.get(dateKey) || 0;

      week.push({
        date: dateClone,
        dateKey,
        count,
        weekIndex,
        dayIndex
      });

      days.push({
        date: dateClone,
        count
      });

      if (dayIndex === 0) {
        const month = dateClone.getMonth();
        const shouldRenderLabel =
          weekIndex === 0 || (month !== previousMonth && weekIndex - lastLabelWeek >= 2);

        if (shouldRenderLabel) {
          months.push({
            label: dateClone
              .toLocaleString(locale, { month: 'short' })
              .replace('.', ''),
            weekIndex
          });
          lastLabelWeek = weekIndex;
        }

        previousMonth = month;
      }

      current.setDate(current.getDate() + 1);
    }

    weeks.push(week);
  }

  return { weeks, months, days };
};

const calculateCurrentStreak = (days) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  let streak = 0;

  for (let index = days.length - 1; index >= 0; index -= 1) {
    const day = days[index];
    if (day.date > now) {
      continue;
    }

    if (day.count > 0) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
};

const calculateLongestStreak = (days) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  let current = 0;
  let longest = 0;

  days.forEach((day) => {
    if (day.date > now) {
      return;
    }

    if (day.count > 0) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  });

  return longest;
};

export const ContributionGraph = ({ username = 'higorxyz' }) => {
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [contributionMap, setContributionMap] = useState(() => new Map());

  const isDarkMode = theme === 'dark';
  const locale = language === 'en' ? 'en-US' : 'pt-BR';
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    // No mobile, posiciona o scroll automaticamente nas semanas mais recentes
    if (scrollContainerRef.current && window.innerWidth < 768) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, [loading, timeline]);

  useEffect(() => {
    let isMounted = true;

    const fetchContributions = async () => {
      setLoading(true);

      const requestFallback = async () => {
        try {
          // Antes batia direto em api.github.com/.../events do navegador.
          // Agora passa por /api/github-events (servidor + cache).
          const response = await fetch('/api/github-events');

          if (!response.ok) {
            return null;
          }

          const { events } = await response.json();
          const map = new Map();

          events.forEach((event) => {
            const date = new Date(event.created_at);
            date.setHours(0, 0, 0, 0);
            const dateKey = date.toISOString().split('T')[0];
            map.set(dateKey, (map.get(dateKey) || 0) + 1);
          });

          return map;
        } catch (fallbackError) {
          console.error('Erro no fallback:', fallbackError);
          return null;
        }
      };

      try {
        const response = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${username}?y=last`
        );

        if (!response.ok) {
          throw new Error('Erro ao buscar contribuições');
        }

        const data = await response.json();
        const map = new Map();

        data.contributions.forEach(({ date, count }) => {
          map.set(date, count);
        });

        if (isMounted) {
          setContributionMap(map);
        }
      } catch (error) {
        console.error('Erro ao buscar contribuições:', error);
        const fallbackMap = await requestFallback();
        if (isMounted && fallbackMap) {
          setContributionMap(fallbackMap);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchContributions();

    return () => {
      isMounted = false;
    };
  }, [username]);

  const timeline = useMemo(
    () => buildTimeline(contributionMap, locale),
    [contributionMap, locale]
  );

  const totalContributions = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return timeline.days.reduce((sum, day) => (
      day.date <= now ? sum + day.count : sum
    ), 0);
  }, [timeline.days]);

  const currentStreak = useMemo(
    () => calculateCurrentStreak(timeline.days),
    [timeline.days]
  );

  const longestStreak = useMemo(
    () => calculateLongestStreak(timeline.days),
    [timeline.days]
  );

  const dayLabels = language === 'en'
    ? ['Mon', 'Wed', 'Fri']
    : ['Seg', 'Qua', 'Sex'];

  const dayLabelIndexes = [1, 3, 5];

  const getContributionColors = (count) => {
    const darkPalette = [
      { max: 0, bg: '#162232', border: '#22334a' },
      { max: 2, bg: '#542d1f', border: '#783c27' },
      { max: 5, bg: '#9a4220', border: '#be5326' },
      { max: 8, bg: '#e05925', border: '#f66a31' },
      { max: Infinity, bg: '#ff7b42', border: '#ffa57a' }
    ];

    const lightPalette = [
      { max: 0, bg: '#f6f8fa', border: '#eaecef' },
      { max: 2, bg: '#ffeede', border: '#ffd8c2' },
      { max: 5, bg: '#ffc7a8', border: '#ffaa80' },
      { max: 8, bg: '#ffa175', border: '#ff8350' },
      { max: Infinity, bg: '#f97316', border: '#ea580c' }
    ];

    const palette = isDarkMode ? darkPalette : lightPalette;
    return palette.find((tone) => count <= tone.max) || palette[palette.length - 1];
  };

  const legendSteps = [0, 2, 5, 8, 12];

  const formatStreak = (value, kind) => {
    if (language === 'en') {
      const dayWord = value === 1 ? 'day' : 'days';
      return `${kind === 'current' ? 'Current streak' : 'Longest streak'}: ${value} ${dayWord}`;
    }

    const dayWord = value === 1 ? 'dia' : 'dias';
    return `${kind === 'current' ? 'Sequência atual' : 'Maior sequência'}: ${value} ${dayWord}`;
  };

  if (loading) {
    return (
      <div className={`rounded-lg p-4 sm:p-6 border ${
        'bg-bg-surface border-line shadow-lg'
      }`}>
        <h3 className={`text-xs sm:text-sm font-normal mb-3 sm:mb-4 ${
          'text-text-secondary'
        }`}>
          {t('contributions.loading')}
        </h3>
        <div className="flex items-center justify-center py-12 sm:py-20">
          <div className={`animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 ${
            'border-line border-t-transparent'
          }`} />
        </div>
      </div>
    );
  }

  const graphWidth = timeline.weeks.length
    ? (timeline.weeks.length * (CELL_SIZE + CELL_GAP)) - CELL_GAP
    : 0;
  const gridHeight = (CELL_SIZE * 7) + (CELL_GAP * 6);
  const totalContentWidth = graphWidth + SIDE_LABEL_WIDTH + LABEL_GAP;
  const infoWidthStyle = graphWidth
    ? { width: totalContentWidth, maxWidth: '100%', margin: '0 auto' }
    : { width: '100%', margin: '0 auto' };
  const graphRowStyle = graphWidth
    ? { width: totalContentWidth, maxWidth: '100%', margin: '0 auto' }
    : { width: '100%', margin: '0 auto' };

  const contributionsLabelSingular = t('contributions.contribution');
  const contributionsLabelPlural = t('contributions.contributions');

  const totalFormatted = totalContributions.toLocaleString(locale);

  return (
    <div className={`rounded-lg p-4 sm:p-5 border ${
      'bg-bg-surface border-line shadow-lg'
    }`}>
      <div className="flex flex-col items-center gap-2">
        <div className="w-full max-w-[940px] flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 border-b border-line pb-4">
          <div>
            <p className="font-mono text-xs text-accent-signal-text mb-1">GITHUB / ACTIVITY</p>
            <h3 className="text-base sm:text-lg font-semibold text-text-primary">{t('contributions.heading')}</h3>
          </div>
          <span className="font-mono text-[10px] sm:text-xs text-text-secondary">github.com/{username}</span>
        </div>
        <div
          className={`w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm sm:text-base ${
          'text-text-secondary'
        }`}
          style={infoWidthStyle}
        >
          <span className="text-center sm:text-left font-medium text-text-primary">
            {totalFormatted} {t('contributions.title')}
          </span>
          <div className={`flex items-center justify-center sm:justify-end gap-3 text-xs sm:text-sm ${
            'text-text-secondary'
          }`}>
            <span>{formatStreak(currentStreak, 'current')}</span>
            <span>{formatStreak(longestStreak, 'longest')}</span>
          </div>
        </div>

        <div ref={scrollContainerRef} className="w-full overflow-x-auto contribution-graph-scroll">
          <div className="min-w-max mx-auto px-2">
            <div className="flex gap-3" style={graphRowStyle}>
              <div
                className="relative"
                style={{ width: SIDE_LABEL_WIDTH, height: gridHeight + MONTH_LABEL_HEIGHT }}
              >
                {dayLabelIndexes.map((dayIndex, idx) => {
                  const top = (dayIndex * (CELL_SIZE + CELL_GAP)) + (CELL_SIZE / 2) + MONTH_LABEL_HEIGHT;
                  return (
                    <span
                      key={dayIndex}
                      className={`absolute left-0 -translate-y-1/2 text-[9px] sm:text-[11px] ${
                        'text-text-secondary'
                      }`}
                      style={{ top }}
                    >
                      {dayLabels[idx]}
                    </span>
                  );
                })}
              </div>

              <div
                className="relative"
                style={{ width: graphWidth, paddingTop: MONTH_LABEL_HEIGHT }}
              >
                <div
                  className="absolute top-0 left-0 right-0"
                  style={{ height: MONTH_LABEL_HEIGHT }}
                >
                  {timeline.months.map((month) => (
                    <span
                      key={`${month.label}-${month.weekIndex}`}
                      className={`absolute text-[9px] sm:text-[11px] ${
                        'text-text-secondary'
                      }`}
                      style={{ left: month.weekIndex * (CELL_SIZE + CELL_GAP) }}
                    >
                      {month.label}
                    </span>
                  ))}
                </div>

                <div className="flex gap-[3px]">
                  {timeline.weeks.map((week) => (
                    <div key={week[0].dateKey} className="flex flex-col gap-[3px]">
                      {week.map((day) => {
                        const { bg, border } = getContributionColors(day.count);
                        const dateLabel = day.date.toLocaleDateString(locale, {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        });

                        const contributionLabel = day.count === 1
                          ? contributionsLabelSingular
                          : contributionsLabelPlural;

                        return (
                          <div
                            key={day.dateKey}
                            className={`rounded-[2px] transition-transform duration-150 ease-out hover:scale-110`}
                            style={{
                              width: CELL_SIZE,
                              height: CELL_SIZE,
                              backgroundColor: bg,
                              border: `1px solid ${border}`
                            }}
                            title={`${dateLabel}: ${day.count} ${contributionLabel}`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`w-full flex items-center justify-between sm:justify-end gap-1 text-[9px] sm:text-[11px] ${
          'text-text-secondary'
        }`}
          style={infoWidthStyle}
        >
          <span className="sm:hidden font-mono text-[9px] text-accent-trace-text">
            {language === 'en' ? '← scroll for history' : '← deslize p/ histórico'}
          </span>
          <div className="flex items-center gap-1">
            <span>{t('contributions.less')}</span>
          {legendSteps.map((step) => {
            const { bg, border } = getContributionColors(step);
            return (
              <span
                key={step}
                className="rounded-[2px]"
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  backgroundColor: bg,
                  border: `1px solid ${border}`
                }}
              />
            );
          })}
          <span>{t('contributions.more')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
import { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import { ArrowUp, X } from 'lucide-react';
import { useGitHubData } from './hooks/useGitHubData';
import { useLanguage } from './hooks/useLanguage';
import { useTheme } from './hooks/useTheme';
import {
  HeroSection,
  StatsSection,
  AboutSection,
  ProjectsSection,
  SkillsSection,
  ContactSection
} from './components/sections';
import { NavigationBar } from './components/navigation';
import { LoadingScreen, ScrollProgressBar } from './components/common';
// ProjectModal só é usado quando o usuário abre um card de projeto — não precisa
// ir no bundle inicial. O nome nomeado exige o .then() pra virar default export.
const ProjectModal = lazy(() =>
  import('./components/modals/ProjectModal').then((m) => ({ default: m.ProjectModal }))
);
import { CV_FILES } from './config';
const CVPreviewModal = lazy(() =>
  import('./components/modals/CVPreviewModal').then((m) => ({ default: m.CVPreviewModal }))
);

function App() {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState('home');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isCVPreviewOpen, setIsCVPreviewOpen] = useState(false);
  const [isErrorDismissed, setIsErrorDismissed] = useState(false);


  const username = 'higorxyz';
  const { repos: githubRepos, stats, languages, loading, error } = useGitHubData();

  useEffect(() => {
    document.documentElement.lang = language === 'en' ? 'en' : 'pt-BR';
  }, [language]);

  useEffect(() => {
    setIsErrorDismissed(false);
  }, [error]);

  const projects = useMemo(() => {
    if (loading) {
      return [
        {
          title: t('loading.loading'),
          description: t('loading.projects'),
          tech: ['GitHub', 'API'],
          link: 'https://github.com/higorxyz',
          status: 'loading',
          visits: '---',
          github: 'https://github.com/higorxyz',
          featured: false
        }
      ];
    }
    if (githubRepos.length === 0 && error) {
      return [
        {
          title: t('projects.previewTitle'),
          description: t('projects.previewDescription'),
          tech: ['React', 'TypeScript', 'REST API'],
          link: 'https://github.com/higorxyz',
          status: 'preview',
          visits: '12',
          stars: 12,
          forks: 3,
          github: 'https://github.com/higorxyz',
          featured: false,
          preview: true,
          repoName: ''
        }
      ];
    }
    return githubRepos;
  }, [githubRepos, loading, error, t]);

  const skills = useMemo(() => {
    if (loading || languages.length === 0) {
      return [{ name: t('loading.loading'), level: 0, category: 'Loading' }];
    }
    return languages;
  }, [languages, loading, t]);

  useEffect(() => {
    let ticking = false;

    const updateActiveSection = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // 1. Próximo ao topo da página -> 'home'
      if (scrollY < 120) {
        setActiveSection((prev) => (prev !== 'home' ? 'home' : prev));
        return;
      }

      // 2. Próximo ao final da página -> 'contato' (garante ativação no rodapé)
      if (windowHeight + scrollY >= docHeight - 80) {
        setActiveSection((prev) => (prev !== 'contato' ? 'contato' : prev));
        return;
      }

      // 3. Linha de leitura suave a 35% da altura da viewport
      const triggerY = scrollY + windowHeight * 0.35;
      const sections = ['home', 'sobre', 'projetos', 'skills', 'contato'];

      for (let i = sections.length - 1; i >= 0; i--) {
        const id = sections[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top + scrollY;
          if (top <= triggerY) {
            setActiveSection((prev) => (prev !== id ? id : prev));
            return;
          }
        }
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowScrollTop(window.scrollY > 500);

          if (!isScrolling) {
            updateActiveSection();
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateActiveSection();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolling]);

  const scrollToSection = useCallback((section) => {
    setActiveSection(section);
    setIsScrolling(true);

    const element = document.getElementById(section);
    if (element) {
      const navOffset = 70;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: Math.max(0, elementPosition - navOffset),
        behavior: 'smooth'
      });
      setTimeout(() => setIsScrolling(false), 800);
    } else {
      setIsScrolling(false);
    }
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openCV = useCallback(() => {
    // <iframe> de PDF é inconsistente em navegador mobile (muitos só
    // baixam em vez de exibir) — abaixo do breakpoint md, pula direto
    // pro download/abrir em nova aba em vez de tentar o preview.
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    if (isMobile) {
      const cv = CV_FILES[language] || CV_FILES.pt;
      const link = document.createElement('a');
      link.href = cv.path;
      link.download = cv.fileName;
      link.click();
      return;
    }
    setIsCVPreviewOpen(true);
  }, [language]);

  const closeCVPreview = useCallback(() => setIsCVPreviewOpen(false), []);

  const handleProjectSelect = useCallback((project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProject(null);
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary relative">

       <div className={`transition-opacity duration-700 ease-out ${isInitialLoading ? 'opacity-0' : 'opacity-100'}`}>
        {error && !isErrorDismissed && (
          <div role="status" className={`fixed top-20 right-4 sm:right-6 max-w-xs bg-bg-surface border px-3 py-2 text-xs shadow-lg z-50 ${
            theme === 'dark' ? 'border-yellow-500/60 text-yellow-300' : 'border-yellow-600/60 text-yellow-800'
          }`}>
             <div className="flex items-start gap-3">
               <span><span className="font-mono text-yellow-500">STATUS / </span>{t(error)}</span>
               <button
                 type="button"
                 onClick={() => setIsErrorDismissed(true)}
                 aria-label={t('modal.close')}
                 className="shrink-0 text-current/70 hover:text-current"
               >
                 <X size={14} />
               </button>
             </div>
          </div>
        )}

        <ScrollProgressBar />

        <div className="relative z-10 overflow-x-hidden max-w-full">
          <NavigationBar
            activeSection={activeSection}
            onNavigate={scrollToSection}
            onDownloadCV={openCV}
          />

          <main>
            <HeroSection onNavigate={scrollToSection} />
            <StatsSection stats={stats} loading={loading} error={error} />
            <AboutSection stats={stats} />
            <ProjectsSection
              projects={projects}
              loading={loading}
              onSelectProject={handleProjectSelect}
              username={username}
            />
            <SkillsSection skills={skills} loading={loading} />
            <ContactSection />
          </main>

          <footer className="border-t border-line py-6 sm:py-8 px-4 sm:px-6 text-center">
            <div className="max-w-7xl mx-auto">
              <p className="text-text-secondary mb-2 text-sm sm:text-base">
                {t('footer.made')}
              </p>
              <p className="text-text-secondary text-xs sm:text-sm mb-3 sm:mb-4">
                &copy; {new Date().getFullYear()} Higor Batista. {t('footer.rights')}
              </p>
            </div>
          </footer>

          {showScrollTop && (
            <button
              onClick={scrollToTop}
              className="fixed bottom-6 sm:bottom-8 right-6 sm:right-8 w-12 h-12 sm:w-14 sm:h-14 bg-accent-signal text-on-accent rounded-full flex items-center justify-center shadow-2xl hover:scale-110 hover:-translate-y-2 z-50"
            >
              <ArrowUp size={20} className="sm:w-6 sm:h-6" />
            </button>
          )}

        </div>
      </div>

      {isInitialLoading && (
        <LoadingScreen onLoadingComplete={() => setIsInitialLoading(false)} />
      )}

      {isModalOpen && (
        <Suspense fallback={null}>
          <ProjectModal
            project={selectedProject}
            isOpen={isModalOpen}
            onClose={handleModalClose}
          />
        </Suspense>
      )}

      {isCVPreviewOpen && (
        <Suspense fallback={null}>
          <CVPreviewModal isOpen={isCVPreviewOpen} onClose={closeCVPreview} />
        </Suspense>
      )}
    </div>
  );
}

export default App;

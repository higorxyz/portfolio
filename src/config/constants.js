// Um PDF por idioma. Trocar o toggle PT/EN troca automaticamente qual
// arquivo o botão de CV abre/baixa (ver hooks/useCVFile.js).
export const CV_FILES = {
  pt: {
    path: '/cv/curriculo-higor-batista-pt.pdf',
    fileName: 'Curriculo-Higor-Batista.pdf'
  },
  en: {
    path: '/cv/higor-batista-resume-en.pdf',
    fileName: 'Higor-Batista-Resume.pdf'
  }
};

export const GITHUB_CONFIG = {
  username: 'higorxyz',
  apiUrl: 'https://api.github.com'
};

export const ANIMATION_DELAYS = {
  short: 100,
  medium: 200,
  long: 300
};

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

export const LANGUAGES = {
  PT: 'pt',
  EN: 'en'
};

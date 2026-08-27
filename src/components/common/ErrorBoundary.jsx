import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

// Class components não podem usar hooks — não dá pra chamar useLanguage()
// aqui. Em vez disso, lê direto do localStorage pra decidir o idioma.
const ERROR_TEXT = {
  pt: {
    title: 'Algo deu errado',
    description: 'Ocorreu um erro inesperado ao carregar a página. Tenta recarregar — se persistir, me avisa em',
    reload: 'Recarregar página'
  },
  en: {
    title: 'Something went wrong',
    description: 'An unexpected error occurred while loading the page. Try reloading — if it persists, let me know at',
    reload: 'Reload page'
  }
};

const getLanguage = () => {
  try {
    const saved = localStorage.getItem('language');
    return saved === 'en' ? 'en' : 'pt';
  } catch {
    return 'pt';
  }
};

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Erro não tratado na aplicação:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const text = ERROR_TEXT[getLanguage()];
      return (
        <div className="min-h-screen flex items-center justify-center bg-bg-primary text-text-primary px-4">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-10 h-10 mx-auto mb-4 text-accent-signal-text" />
            <h1 className="font-display text-xl font-bold mb-2">{text.title}</h1>
            <p className="text-text-secondary text-sm mb-6">
              {text.description}{' '}
              <a href="mailto:dev.higorxyz@gmail.com" className="text-accent-trace-text underline">
                dev.higorxyz@gmail.com
              </a>
              .
            </p>
            <button
              onClick={this.handleReload}
              className="px-5 py-2.5 rounded-lg bg-accent-signal text-on-accent font-display font-bold text-sm hover:opacity-90 transition-opacity"
            >
              {text.reload}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

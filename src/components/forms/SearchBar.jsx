import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export const SearchBar = ({ onSearch, totalResults, placeholder }) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="relative">
        {/* Input de busca */}
        <div
          className={`
            relative flex items-center gap-3 
            bg-bg-primary  
            border border-line 
            rounded-xl px-4 py-3
            transition-all duration-300 card-motion-input
            ${isFocused ? 'shadow-subtle-xl border-line' : 'shadow-subtle'}
          `}
        >
          {/* Ícone de busca */}
          <Search 
            className={`
              w-5 h-5 transition-colors duration-300
              ${isFocused || searchTerm ? 'text-accent-trace' : 'text-text-secondary'}
            `}
          />

          {/* Input */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder || t('projects.search')}
            className="flex-1 bg-transparent 
 text-text-primary placeholder-gray-400
 outline-none text-sm"
          />

          {/* Botão de limpar */}
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="p-1 rounded-lg
 bg-bg-surface hover:bg-bg-surface
 text-accent-trace hover:text-accent-trace
 transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Indicador de resultados */}
        {searchTerm && (
          <div className="mt-2 text-center">
            <span className="text-sm text-text-secondary">
              {totalResults === 0 ? (
                <span className="text-yellow-400">{t('projects.noResults')}</span>
              ) : totalResults === 1 ? (
                <span className="text-accent-trace">{t('projects.oneResult')}</span>
              ) : (
                <span className="text-accent-trace">{t('projects.multipleResults').replace('{count}', totalResults)}</span>
              )}
            </span>
          </div>
        )}
      </div>

      {/* Dicas de busca */}
      {isFocused && !searchTerm && (
        <div className="mt-4 p-4 bg-bg-surface border border-line rounded-lg">
          <p className="text-xs text-text-secondary mb-2">{t('projects.searchTips')}</p>
          <ul className="text-xs text-text-secondary space-y-1">
            <li>{t('projects.tip1')}</li>
            <li>{t('projects.tip2')}</li>
            <li>{t('projects.tip3')}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

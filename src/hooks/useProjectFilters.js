import { useMemo, useState, useCallback } from 'react';

const PAGE_SIZE = 6;

export const useProjectFilters = (projects = []) => {
  const [filterTech, setFilterTech] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const allTechs = useMemo(() => (
    ['all', ...new Set(projects.flatMap((project) => project.tech || []))]
  ), [projects]);

  const filteredProjects = useMemo(() => {
    let filtered = projects || [];

    if (filterTech !== 'all') {
      filtered = filtered.filter((project) => project.tech && project.tech.includes(filterTech));
    }

    if (searchTerm && searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((project) => {
        const { name, title, tech = [], description = '' } = project;
        const matchName = name && name.toLowerCase().includes(search);
        const matchTitle = title && title.toLowerCase().includes(search);
        const matchTech = tech.some((item) => item && item.toLowerCase().includes(search));
        const matchDesc = description.toLowerCase().includes(search);
        return matchName || matchTitle || matchTech || matchDesc;
      });
    }

    return filtered;
  }, [projects, filterTech, searchTerm]);

  // Reseta contagem visível quando filtros mudam
  const handleSetFilterTech = useCallback((tech) => {
    setFilterTech(tech);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const handleSetSearchTerm = useCallback((term) => {
    setSearchTerm(term);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const showMore = useCallback(() => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  }, []);

  const visibleProjects = useMemo(
    () => filteredProjects.slice(0, visibleCount),
    [filteredProjects, visibleCount]
  );

  return {
    filterTech,
    setFilterTech: handleSetFilterTech,
    searchTerm,
    setSearchTerm: handleSetSearchTerm,
    filteredProjects: visibleProjects,
    totalFiltered: filteredProjects.length,
    hasMore: visibleCount < filteredProjects.length,
    showMore,
    allTechs
  };
};

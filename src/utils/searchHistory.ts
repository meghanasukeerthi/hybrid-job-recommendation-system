
const STORAGE_KEY = 'search_history';
const MAX_KEYWORDS = 5;

interface SearchHistoryEntry {
  query: string;
  timestamp: number;
}

export const getSearchHistory = (): string[] => {
  const history = localStorage.getItem(STORAGE_KEY);
  return history ? JSON.parse(history) : [];
};

export const addSearchKeyword = (keyword: string): void => {
  const history = getSearchHistory();
  if (!history.includes(keyword)) {
    const newHistory = [keyword, ...history].slice(0, MAX_KEYWORDS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  }
};

export const clearSearchHistory = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

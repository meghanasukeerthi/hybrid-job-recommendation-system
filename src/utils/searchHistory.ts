const STORAGE_KEY = 'search_history';
const MAX_KEYWORDS = 5;

export const getSearchHistory = (): string[] => {
  const history = localStorage.getItem(STORAGE_KEY);
  return history ? JSON.parse(history) : [];
};

export const addSearchKeyword = (keyword: string): void => {
  const history = getSearchHistory();
  const newHistory = [keyword, ...history.filter(k => k !== keyword)].slice(0, MAX_KEYWORDS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
};

export const clearSearchHistory = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
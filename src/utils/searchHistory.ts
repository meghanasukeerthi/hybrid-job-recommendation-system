const STORAGE_KEY = 'search_history';
const MAX_KEYWORDS = 5;

interface SearchHistoryEntry {
  query: string;
  timestamp: number;
}

export const getSearchHistory = (): SearchHistoryEntry[] => {
  const history = localStorage.getItem(STORAGE_KEY);
  if (!history) return [];
  const entries = JSON.parse(history);
  return entries.map((query: string | SearchHistoryEntry) => {
    if (typeof query === 'string') {
      return { query, timestamp: Date.now() };
    }
    return query;
  });
};

export const addSearchKeyword = (keyword: string): void => {
  const history = getSearchHistory();
  const newEntry = { query: keyword, timestamp: Date.now() };
  const newHistory = [newEntry, ...history].slice(0, MAX_KEYWORDS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
};

export const clearSearchHistory = (range: string = 'all'): void => {
  const history = getSearchHistory();
  const now = Date.now();
  
  let cutoffTime = now;
  switch (range) {
    case 'last_hour':
      cutoffTime = now - (60 * 60 * 1000);
      break;
    case 'last_day':
      cutoffTime = now - (24 * 60 * 60 * 1000);
      break;
    case 'last_week':
      cutoffTime = now - (7 * 24 * 60 * 60 * 1000);
      break;
    case 'last_month':
      cutoffTime = now - (30 * 24 * 60 * 60 * 1000);
      break;
    case 'all':
      localStorage.removeItem(STORAGE_KEY);
      return;
    default:
      throw new Error('Invalid range specified');
  }

  const filteredHistory = history.filter(entry => entry.timestamp < cutoffTime);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredHistory));
};

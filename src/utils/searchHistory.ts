
const STORAGE_KEY = 'search_history';
const MAX_KEYWORDS = 5;

interface SearchHistoryEntry {
  query: string;
  timestamp: number;
}

export const getSearchHistory = async (): Promise<SearchHistoryEntry[]> => {
  try {
    const response = await fetch('http://localhost:8080/jobs/history', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
      },
    });

    if (!response.ok) {
      // Fallback to local storage if API fails
      const history = localStorage.getItem(STORAGE_KEY);
      if (!history) return [];
      return JSON.parse(history);
    }

    const serverHistory = await response.json();
    // Update local storage with server data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serverHistory));
    return serverHistory;
  } catch (error) {
    // Fallback to local storage on API error
    const history = localStorage.getItem(STORAGE_KEY);
    if (!history) return [];
    return JSON.parse(history);
  }
};

export const addSearchKeyword = async (keyword: string): Promise<void> => {
  const newEntry = { query: keyword, timestamp: Date.now() };
  
  try {
    const response = await fetch('http://localhost:8080/jobs/history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
      },
      body: JSON.stringify(newEntry),
    });

    if (!response.ok) {
      throw new Error('Failed to save search history to server');
    }
  } catch (error) {
    console.error('Error saving to server, falling back to local storage:', error);
    // Fallback to local storage
    const history = await getSearchHistory();
    const newHistory = [newEntry, ...history].slice(0, MAX_KEYWORDS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  }
};

export const clearSearchHistory = async (range: string = 'all'): Promise<void> => {
  try {
    const response = await fetch(`http://localhost:8080/jobs/history/clear?range=${range}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to clear search history on server');
    }
  } catch (error) {
    console.error('Error clearing history on server, falling back to local storage:', error);
    // Fallback to local storage
    const history = await getSearchHistory();
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
  }
};


const STORAGE_KEY = 'search_history';

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
      throw new Error('Failed to fetch search history');
    }

    const serverHistory = await response.json();
    return serverHistory.map((entry: any) => ({
      query: entry.query,
      timestamp: new Date(entry.timestamp).getTime()
    }));
  } catch (error) {
    console.error('Error fetching history:', error);
    return [];
  }
};

export const addSearchKeyword = (keyword: string): void => {
  // Fire and forget - just send to backend to save history
  fetch('http://localhost:8080/jobs/search', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
    },
    // Using query parameter as specified in the controller
    params: { query: keyword }
  }).catch(error => {
    console.error('Error saving search history:', error);
  });
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
      throw new Error('Failed to clear search history');
    }
  } catch (error) {
    console.error('Error clearing history:', error);
    throw error;
  }
};

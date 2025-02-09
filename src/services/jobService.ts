
import { Job, Comment } from "@/types/job";
import { useToast } from "@/hooks/use-toast";

// Fetch all jobs
export const fetchJobs = async (): Promise<Job[]> => {
  const response = await fetch(`http://localhost:8080/alljobs`, {
    credentials: 'include' // Add credentials for session
  });
  
  if (response.status === 401) {
    throw new Error('Please login to view jobs');
  }
  
  if (!response.ok) {
    throw new Error('Failed to fetch jobs');
  }
  
  return response.json();
};

// Like/unlike a job
export const likeJob = async (jobId: number, like: boolean): Promise<Job> => {
  const response = await fetch(`http://localhost:8080/jobs/${jobId}/like?like=${like}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include' // Add credentials for session
  });
  
  if (response.status === 401) {
    throw new Error('Please login to like jobs');
  }
  
  if (!response.ok) {
    throw new Error('Failed to update like status');
  }
  
  return response.json();
};

// Add a comment to a job
export const addComment = async (jobId: number, comment: Omit<Comment, 'id'>): Promise<Job> => {
  const response = await fetch(`http://localhost:8080/jobs/${jobId}/comment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(comment),
    credentials: 'include' // Add credentials for session
  });
  
  if (response.status === 401) {
    throw new Error('Please login to add comments');
  }
  
  if (!response.ok) {
    throw new Error('Failed to add comment');
  }
  
  return response.json();
};

// Track job application
export const trackJob = async (jobId: number): Promise<void> => {
  const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
  if (!appliedJobs.includes(jobId)) {
    appliedJobs.push(jobId);
    localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs));
    window.dispatchEvent(new Event('applicationCountUpdated'));
  }
};

// Helper functions for checking job status
export const isJobBookmarked = (jobId: number): boolean => {
  const bookmarks = JSON.parse(localStorage.getItem('bookmarkedJobs') || '[]');
  return bookmarks.includes(jobId);
};

export const isJobApplied = (jobId: number): boolean => {
  const applications = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
  return applications.includes(jobId);
};

// Bookmark job function
export const bookmarkJob = async (jobId: number): Promise<void> => {
  try {
    const response = await fetch(`http://localhost:8080/jobs/${jobId}/bookmark`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include' // Add credentials for session
    });
    
    if (response.status === 401) {
      throw new Error('Please login to bookmark jobs');
    }
    
    if (!response.ok) {
      throw new Error('Failed to bookmark job');
    }
  } catch (error) {
    // Fallback to localStorage if API fails
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedJobs') || '[]');
    const index = bookmarks.indexOf(jobId);
    
    if (index === -1) {
      bookmarks.push(jobId);
    } else {
      bookmarks.splice(index, 1);
    }
    
    localStorage.setItem('bookmarkedJobs', JSON.stringify(bookmarks));
  }
};

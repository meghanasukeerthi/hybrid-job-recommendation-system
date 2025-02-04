import { Job, Comment } from "@/types/job";

// Fetch all jobs
export const fetchJobs = async (): Promise<Job[]> => {
  try {
    const response = await fetch(`http://localhost:8080/alljobs`);
    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }
    const jobs = await response.json();
    return jobs;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw new Error('Failed to fetch jobs. Please try again later.');
  }
};

// Like/unlike a job
export const likeJob = async (jobId: number, like: boolean): Promise<Job> => {
  try {
    const response = await fetch(`http://localhost:8080/jobs/${jobId}/like?like=${like}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to update like status');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error updating like status:', error);
    throw error;
  }
};

// Add a comment to a job
export const addComment = async (jobId: number, comment: Omit<Comment, 'id'>): Promise<Job> => {
  try {
    const response = await fetch(`http://localhost:8080/jobs/${jobId}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(comment),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add comment');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Track job application
export const trackJob = async (jobId: number): Promise<void> => {
  try {
    const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
    if (!appliedJobs.includes(jobId)) {
      appliedJobs.push(jobId);
      localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs));
      
      // Dispatch custom event for real-time updates
      window.dispatchEvent(new Event('applicationCountUpdated'));
    }
  } catch (error) {
    console.error('Error tracking job application:', error);
    throw error;
  }
};

// Bookmark a job
export const bookmarkJob = async (jobId: number): Promise<Job> => {
  try {
    // For now, we'll just handle bookmarks client-side
    const bookmarkedJobs = JSON.parse(localStorage.getItem('bookmarkedJobs') || '[]');
    if (!bookmarkedJobs.includes(jobId)) {
      bookmarkedJobs.push(jobId);
      localStorage.setItem('bookmarkedJobs', JSON.stringify(bookmarkedJobs));
    }
    
    const response = await fetch(`http://localhost:8080/alljobs`);
    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }
    const jobs = await response.json();
    const job = jobs.find((j: Job) => j.id === jobId);
    
    if (!job) {
      throw new Error('Job not found');
    }
    
    return job;
  } catch (error) {
    console.error('Error bookmarking job:', error);
    throw error;
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

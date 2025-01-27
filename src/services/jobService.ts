import { Job, Comment } from "@/types/job";

export const fetchJobs = async (): Promise<Job[]> => {
  const response = await fetch('http://localhost:8080/alljobs');
  if (!response.ok) {
    throw new Error('Failed to fetch jobs');
  }
  return response.json();
};

export const likeJob = async (jobId: number, isLiked: boolean): Promise<Job> => {
  console.log('Sending like/unlike action:', isLiked ? 'unlike' : 'like');
  
  const response = await fetch(`http://localhost:8080/jobs/${jobId}/like`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      action: isLiked ? 'unlike' : 'like',
      increment: isLiked ? -1 : 1
    })
  });

  if (!response.ok) {
    throw new Error('Failed to update like status');
  }
  return response.json();
};

export const addComment = async (jobId: number, comment: Omit<Comment, 'id'>): Promise<Job> => {
  console.log('Adding comment for job:', jobId);
  console.log('Comment data:', comment);

  const response = await fetch(`http://localhost:8080/jobs/${jobId}/comment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(comment),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Comment submission failed:', errorText);
    throw new Error('Failed to add comment');
  }
  
  const updatedJob = await response.json();
  console.log('Server response after adding comment:', updatedJob);
  return updatedJob;
};

// Add new functions for bookmark and job tracking
export const bookmarkJob = async (jobId: number): Promise<void> => {
  const response = await fetch(`http://localhost:8080/jobs/${jobId}/bookmark`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to bookmark job');
  }
};

export const trackJob = async (jobId: number): Promise<void> => {
  const response = await fetch(`http://localhost:8080/jobs/${jobId}/track`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to track job');
  }
};

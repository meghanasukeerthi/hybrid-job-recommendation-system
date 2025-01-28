import { Job, Comment } from "@/types/job";

export const fetchJobs = async (): Promise<Job[]> => {
  const response = await fetch('http://localhost:8080/alljobs');
  if (!response.ok) {
    throw new Error('Failed to fetch jobs');
  }
  return response.json();
};

export const likeJob = async (jobId: number, isLiked: boolean): Promise<Job> => {
  console.log('Performing like action, current state:', isLiked);
  
  // Using query parameter for like/dislike action
  const response = await fetch(`http://localhost:8080/jobs/${jobId}/like?like=${!isLiked}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    }
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
  // Instead of making an API call, we'll handle this locally
  const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
  if (!appliedJobs.includes(jobId)) {
    appliedJobs.push(jobId);
    localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs));
  }
};
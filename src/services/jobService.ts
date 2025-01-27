import { Job, Comment } from "@/types/job";

export const fetchJobs = async (): Promise<Job[]> => {
  const response = await fetch('http://localhost:8080/alljobs');
  if (!response.ok) {
    throw new Error('Failed to fetch jobs');
  }
  return response.json();
};

export const likeJob = async (jobId: number): Promise<Job> => {
  // Get the current like status from localStorage
  const likedJobs = JSON.parse(localStorage.getItem('likedJobs') || '[]');
  const isLiked = likedJobs.includes(jobId);

  // Send the appropriate action to the backend
  const response = await fetch(`http://localhost:8080/jobs/${jobId}/like`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ action: isLiked ? 'unlike' : 'like' })
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

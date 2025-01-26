import { Job, Comment } from "@/types/job";

export const fetchJobs = async (): Promise<Job[]> => {
  const response = await fetch('http://localhost:8080/alljobs');
  if (!response.ok) {
    throw new Error('Failed to fetch jobs');
  }
  return response.json();
};

export const likeJob = async (jobId: number): Promise<Job> => {
  const response = await fetch(`http://localhost:8080/jobs/${jobId}/like`, {
    method: 'PUT',
  });
  if (!response.ok) {
    throw new Error('Failed to like job');
  }
  return response.json();
};

export const addComment = async (jobId: number, comment: Omit<Comment, 'id'>): Promise<Job> => {
  console.log('Sending comment to backend:', { jobId, comment });
  const response = await fetch(`http://localhost:8080/jobs/${jobId}/comment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: comment.text,
      author: comment.author,
      date: Date.now()
    }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Comment submission failed:', errorText);
    throw new Error('Failed to add comment');
  }
  
  return response.json();
};
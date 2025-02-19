import { Job, JobRecommendation, AppliedJob } from "@/types/job";
import { toast } from "sonner";
import { queryClient } from "@/lib/react-query";

const API_BASE_URL = 'http://localhost:8080';

const getAuthHeaders = () => {
  const token = localStorage.getItem('jwt_token');
  if (!token) {
    throw new Error('Please login to perform this action');
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Reset user interactions
export const resetUserInteractions = async (): Promise<void> => {
  const token = localStorage.getItem('jwt_token');
  if (!token) {
    toast({
      description: "Please login to reset interactions",
      variant: "destructive"
    });
    throw new Error('Authentication required');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/user-interactions/reset`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 403) {
      toast({
        description: "You don't have permission to perform this action",
        variant: "destructive"
      });
      throw new Error('Permission denied');
    }

    if (!response.ok) {
      throw new Error('Failed to reset user interactions');
    }

    // Invalidate relevant queries
    await queryClient.invalidateQueries({ queryKey: ['jobs'] });
    await queryClient.invalidateQueries({ queryKey: ['appliedJobs'] });
    await queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    
    toast({
      description: "Your interactions have been reset successfully"
    });
  } catch (error) {
    console.error('Error resetting user interactions:', error);
    throw error;
  }
};

// Reset all users' interactions (admin only)
export const resetAllUserInteractions = async (): Promise<void> => {
  const token = localStorage.getItem('jwt_token');
  if (!token) {
    toast({
      description: "Please login to reset interactions",
      variant: "destructive"
    });
    throw new Error('Authentication required');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/user-interactions/reset-all`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 403) {
      toast({
        description: "You don't have permission to perform this action",
        variant: "destructive"
      });
      throw new Error('Permission denied');
    }

    if (!response.ok) {
      throw new Error('Failed to reset all user interactions');
    }

    // Invalidate queries
    await queryClient.invalidateQueries({ queryKey: ['jobs'] });
    await queryClient.invalidateQueries({ queryKey: ['appliedJobs'] });
    await queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    
    toast({
      description: "All user interactions have been reset successfully"
    });
  } catch (error) {
    console.error('Error resetting all user interactions:', error);
    throw error;
  }
};

// Fetch content-based recommendations
export const fetchContentBasedRecommendations = async (): Promise<Job[]> => {
  const token = localStorage.getItem('jwt_token');
  if (!token) {
    toast({
      description: "Please login to view recommendations",
      variant: "destructive"
    });
    return [];
  }

  try {
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const response = await fetch(`${API_BASE_URL}/recommendations/content-based`, {
      headers
    });

    if (response.status === 403) {
      toast({
        description: "You don't have permission to view recommendations",
        variant: "destructive"
      });
      return [];
    }

    if (!response.ok) {
      throw new Error('Failed to fetch content-based recommendations');
    }

    const recommendations = await response.json() as JobRecommendation[];
    const allJobs = await fetchJobs();

    return recommendations
      .map(rec => {
        const job = allJobs.find(j => j.id === rec.jobId);
        if (!job) return null;
        return {
          ...job,
          relevanceScore: rec.relevanceScore
        };
      })
      .filter((job): job is Job => Boolean(job));
  } catch (error) {
    console.error('Error fetching content-based recommendations:', error);
    toast({
      description: "Failed to load content-based recommendations",
      variant: "destructive"
    });
    return [];
  }
};

// Fetch collaborative recommendations
export const fetchCollaborativeRecommendations = async (): Promise<Job[]> => {
  const token = localStorage.getItem('jwt_token');
  if (!token) {
    toast({
      description: "Please login to view recommendations",
      variant: "destructive"
    });
    return [];
  }

  try {
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const response = await fetch(`${API_BASE_URL}/recommendations/collaborative`, {
      headers
    });

    if (response.status === 403) {
      toast({
        description: "You don't have permission to view recommendations",
        variant: "destructive"
      });
      return [];
    }

    if (!response.ok) {
      throw new Error('Failed to fetch collaborative recommendations');
    }

    const recommendations = await response.json() as JobRecommendation[];
    const allJobs = await fetchJobs();

    return recommendations
      .map(rec => {
        const job = allJobs.find(j => j.id === rec.jobId);
        if (!job) return null;
        return {
          ...job,
          relevanceScore: rec.relevanceScore
        };
      })
      .filter((job): job is Job => Boolean(job));
  } catch (error) {
    console.error('Error fetching collaborative recommendations:', error);
    toast({
      description: "Failed to load collaborative recommendations",
      variant: "destructive"
    });
    return [];
  }
};

// Fetch all jobs
export const fetchJobs = async (): Promise<Job[]> => {
  const response = await fetch(`${API_BASE_URL}/alljobs`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  if (response.status === 401) {
    throw new Error('Please login to view jobs');
  }
  
  if (!response.ok) {
    throw new Error('Failed to fetch jobs');
  }
  
  return response.json();
};

// Fetch applied jobs
export const fetchAppliedJobs = async (): Promise<{
  job: Job;
  applicationDate: string;
}[]> => {
  const response = await fetch(`${API_BASE_URL}/jobs/applied`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  if (response.status === 401) {
    throw new Error('Please login to view applied jobs');
  }
  
  if (!response.ok) {
    throw new Error('Failed to fetch applied jobs');
  }
  
  return response.json();
};

// Apply for a job
export const applyForJob = async (jobId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/apply`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  
  if (response.status === 401) {
    throw new Error('Please login to apply for jobs');
  }
  
  if (!response.ok) {
    throw new Error('Failed to apply for job');
  }
  
  // Update local storage for application count
  const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
  if (!appliedJobs.includes(jobId)) {
    appliedJobs.push(jobId);
    localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs));
  }
};

// Withdraw job application
export const withdrawApplication = async (jobId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/withdraw`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  
  if (response.status === 401) {
    throw new Error('Please login to withdraw application');
  }
  
  if (!response.ok) {
    throw new Error('Failed to withdraw application');
  }
  
  // Update local storage after withdrawal
  const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
  const updatedJobs = appliedJobs.filter((id: number) => id !== jobId);
  localStorage.setItem('appliedJobs', JSON.stringify(updatedJobs));
  
  window.dispatchEvent(new Event('applicationCountUpdated'));
};

// Like a job
export const likeJob = async (jobId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/like`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  
  if (response.status === 401) {
    throw new Error('Please login to like jobs');
  }
  
  if (!response.ok) {
    throw new Error('Failed to like job');
  }
};

// Dislike a job
export const dislikeJob = async (jobId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/dislike`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  
  if (response.status === 401) {
    throw new Error('Please login to dislike jobs');
  }
  
  if (!response.ok) {
    throw new Error('Failed to dislike job');
  }
};

// Add a comment to a job
export const addComment = async (jobId: number, text: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/comment`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      text: text
    })
  });
  
  if (response.status === 401) {
    throw new Error('Please login to add comments');
  }
  
  if (!response.ok) {
    throw new Error('Failed to add comment');
  }
};

// Track job application
export const trackJob = async (jobId: number): Promise<void> => {
  try {
    await applyForJob(jobId);
    window.dispatchEvent(new Event('applicationCountUpdated'));
  } catch (error) {
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

// Bookmark job function
export const bookmarkJob = async (jobId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/bookmark`, {
      method: 'PUT',
      headers: getAuthHeaders()
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

// Fetch job details by ID
const fetchJobDetails = async (jobId: number): Promise<Job> => {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    console.error(`Failed to fetch job ${jobId}:`, response.status);
    toast.error(`Failed to fetch job details for ID ${jobId}`);
    throw new Error('Failed to fetch job details');
  }

  try {
    const jobData = await response.json();
    return {
      ...jobData,
      salary: jobData.salary?.toString() ?? "Not specified",
      id: jobId, // Ensure ID is set correctly
      category: jobData.category || "fresher", // Provide default category if missing
      requiredSkills: jobData.requiredSkills || [], // Ensure array exists
      comments: jobData.comments || [], // Ensure array exists
      likeCount: jobData.likeCount || 0 // Ensure number exists
    };
  } catch (error) {
    console.error(`Error parsing job ${jobId} data:`, error);
    toast.error(`Error processing job data for ID ${jobId}`);
    throw new Error('Failed to process job details');
  }
};

// Get job details from allJobs array
const getJobFromAllJobs = async (jobId: number, allJobs: Job[]): Promise<Job | null> => {
  const job = allJobs.find(j => j.id === jobId);
  if (!job) {
    console.error(`Job ${jobId} not found in allJobs`);
    return null;
  }
  return {
    ...job,
    salary: job.salary?.toString() ?? "Not specified",
    relevanceScore: 0 // Ensure relevanceScore has a default value
  };
};

export const fetchHybridRecommendations = async (): Promise<Job[]> => {
  try {
    const [contentBased, collaborative] = await Promise.all([
      fetchContentBasedRecommendations(),
      fetchCollaborativeRecommendations()
    ]);

    // Combine and sort recommendations by relevance score
    const hybridJobs = [...contentBased, ...collaborative].sort(
      (a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0)
    );

    // Remove duplicates based on job ID
    const uniqueJobs = Array.from(
      new Map(hybridJobs.map(job => [job.id, job])).values()
    );

    return uniqueJobs;
  } catch (error) {
    console.error('Failed to fetch hybrid recommendations:', error);
    toast.error('Failed to load hybrid recommendations');
    return [];
  }
};

import { Job, Comment } from "@/types/job";

// Fetch all jobs
export const fetchJobs = async (): Promise<Job[]> => {
  try {
    // For development, return mock data since we don't have a backend yet
    return [
      {
        id: 1,
        title: "Senior React Developer",
        company: "Tech Corp",
        location: "San Francisco, CA",
        type: "Full-time",
        description: "We are looking for an experienced React developer...",
        postedDate: Date.now() - 86400000, // 1 day ago
        requiredSkills: ["React", "TypeScript", "Node.js"],
        experienceRequired: { years: 5 },
        comments: [],
        likeCount: 0,
        category: "experienced",
        salary: "120000"
      },
      {
        id: 2,
        title: "Junior Frontend Developer",
        company: "Startup Inc",
        location: "Remote",
        type: "Full-time",
        description: "Great opportunity for a junior developer...",
        postedDate: Date.now() - 172800000, // 2 days ago
        requiredSkills: ["HTML", "CSS", "JavaScript"],
        experienceRequired: { years: 1 },
        comments: [],
        likeCount: 0,
        category: "fresher",
        salary: "70000"
      }
    ];
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw new Error('Failed to fetch jobs. Please try again later.');
  }
};

// Like/unlike a job
export const likeJob = async (jobId: number, isCurrentlyLiked: boolean): Promise<Job> => {
  try {
    // Simulate API call
    const jobs = await fetchJobs();
    const job = jobs.find(j => j.id === jobId);
    
    if (!job) {
      throw new Error('Job not found');
    }

    // Update localStorage
    const likedJobs = JSON.parse(localStorage.getItem('likedJobs') || '[]');
    if (!isCurrentlyLiked) {
      likedJobs.push(jobId);
      job.likeCount += 1;
    } else {
      const index = likedJobs.indexOf(jobId);
      if (index > -1) {
        likedJobs.splice(index, 1);
        job.likeCount -= 1;
      }
    }
    localStorage.setItem('likedJobs', JSON.stringify(likedJobs));
    
    return job;
  } catch (error) {
    console.error('Error updating like status:', error);
    throw error;
  }
};

// Add a comment to a job
export const addComment = async (jobId: number, comment: Omit<Comment, 'id'>): Promise<Job> => {
  try {
    // Simulate API call
    const jobs = await fetchJobs();
    const job = jobs.find(j => j.id === jobId);
    
    if (!job) {
      throw new Error('Job not found');
    }

    const newComment = {
      id: Date.now(),
      ...comment
    };

    job.comments.push(newComment);
    return job;
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
    // Simulate API call
    const jobs = await fetchJobs();
    const job = jobs.find(j => j.id === jobId);
    
    if (!job) {
      throw new Error('Job not found');
    }
    
    // Update localStorage
    const bookmarkedJobs = JSON.parse(localStorage.getItem('bookmarkedJobs') || '[]');
    if (!bookmarkedJobs.includes(jobId)) {
      bookmarkedJobs.push(jobId);
      localStorage.setItem('bookmarkedJobs', JSON.stringify(bookmarkedJobs));
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
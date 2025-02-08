import { Job, Comment } from "@/types/job";

const BACKEND_URL = 'https://your-backend-url.com'; // Replace with your actual backend URL

const mockJobs: Job[] = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp",
    location: "Remote",
    type: "Full-time",
    description: "Looking for an experienced frontend developer with React expertise",
    postedDate: Date.now() - 86400000, // 1 day ago
    requiredSkills: ["React", "TypeScript", "HTML", "CSS"],
    likeCount: 5,
    experienceRequired: { years: 5 },
    comments: [],
    category: "experienced",
    salary: "120000"
  },
  {
    id: 2,
    title: "Full Stack Developer",
    company: "InnovateTech",
    location: "New York",
    type: "Full-time",
    description: "Join our team as a Full Stack Developer",
    postedDate: Date.now() - 172800000, // 2 days ago
    requiredSkills: ["React", "Node.js", "MongoDB", "TypeScript"],
    likeCount: 3,
    experienceRequired: { years: 3 },
    comments: [],
    category: "experienced",
    salary: "110000"
  },
  {
    id: 3,
    title: "React Developer",
    company: "WebSolutions",
    location: "San Francisco",
    type: "Remote",
    description: "Looking for a React developer to join our remote team",
    postedDate: Date.now(),
    requiredSkills: ["React", "JavaScript", "Redux", "CSS"],
    likeCount: 7,
    experienceRequired: { years: 2 },
    comments: [],
    category: "remote",
    salary: "100000"
  }
];

// Fetch all jobs
export const fetchJobs = async (): Promise<Job[]> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/jobs`);
    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }
    const jobs = await response.json();
    return jobs;
  } catch (error) {
    console.log('Using mock data due to API error:', error);
    return mockJobs;
  }
};

// Like/unlike a job
export const likeJob = async (jobId: number, like: boolean): Promise<Job> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/jobs/${jobId}/like?like=${like}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Failed to update like status');
    }
    
    return response.json();
  } catch (error) {
    // Use mock data if API fails
    const job = mockJobs.find(j => j.id === jobId);
    if (job) {
      job.likeCount = like ? job.likeCount + 1 : job.likeCount - 1;
    }
    return job || mockJobs[0];
  }
};

// Add a comment to a job
export const addComment = async (jobId: number, comment: Omit<Comment, 'id'>): Promise<Job> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/jobs/${jobId}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(comment),
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Failed to add comment');
    }
    
    return response.json();
  } catch (error) {
    // Use mock data if API fails
    const job = mockJobs.find(j => j.id === jobId);
    if (job) {
      if (!job.comments) {
        job.comments = [];
      }
      job.comments.push({ ...comment, id: job.comments.length + 1 });
    }
    return job || mockJobs[0];
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

// Helper functions for checking job status
export const isJobBookmarked = (jobId: number): boolean => {
  const bookmarks = JSON.parse(localStorage.getItem('bookmarkedJobs') || '[]');
  return bookmarks.includes(jobId);
};

export const isJobApplied = (jobId: number): boolean => {
  const applications = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
  return applications.includes(jobId);
};

import { Job } from "@/types/job";

export const trackJobApplication = async (jobId: number) => {
  // For now, we'll use localStorage. In a real app, this would be a backend call
  const applications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
  if (!applications.includes(jobId)) {
    applications.push(jobId);
    localStorage.setItem('jobApplications', JSON.stringify(applications));
  }
  return applications;
};

export const bookmarkJob = async (jobId: number) => {
  const bookmarks = JSON.parse(localStorage.getItem('jobBookmarks') || '[]');
  if (!bookmarks.includes(jobId)) {
    bookmarks.push(jobId);
    localStorage.setItem('jobBookmarks', JSON.stringify(bookmarks));
  }
  return bookmarks;
};

export const removeBookmark = async (jobId: number) => {
  const bookmarks = JSON.parse(localStorage.getItem('jobBookmarks') || '[]');
  const updatedBookmarks = bookmarks.filter((id: number) => id !== jobId);
  localStorage.setItem('jobBookmarks', JSON.stringify(updatedBookmarks));
  return updatedBookmarks;
};

export const isJobBookmarked = (jobId: number): boolean => {
  const bookmarks = JSON.parse(localStorage.getItem('jobBookmarks') || '[]');
  return bookmarks.includes(jobId);
};

export const isJobApplied = (jobId: number): boolean => {
  const applications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
  return applications.includes(jobId);
};

import { Job } from "@/types/job";
import { JobFilters } from "@/components/JobFilters";

export const filterJobs = (jobs: Job[], searchQuery: string, filters: JobFilters) => {
  return jobs.filter(job => {
    const matchesSearch = !searchQuery || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filters.type === "all" || job.type === filters.type;
    const matchesLocation = !filters.location || 
      job.location.toLowerCase().includes(filters.location.toLowerCase());
    
    const jobSalary = parseInt(job.salary || "0");
    const matchesMinSalary = !filters.minSalary || jobSalary >= parseInt(filters.minSalary);
    const matchesMaxSalary = !filters.maxSalary || jobSalary <= parseInt(filters.maxSalary);

    return matchesSearch && matchesType && matchesLocation && matchesMinSalary && matchesMaxSalary;
  });
};

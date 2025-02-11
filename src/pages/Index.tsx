
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { WelcomeHeader } from "@/components/WelcomeHeader";
import { useQuery } from "@tanstack/react-query";
import { fetchJobs } from "@/services/jobService";
import { JobSectionsCarousel } from "@/components/JobSectionsCarousel";
import { JobFilters as JobFiltersType } from "@/components/JobFilters";
import { Job } from "@/types/job";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'salaryLowToHigh' | 'salaryHighToLow'>('newest');
  const [filters, setFilters] = useState<JobFiltersType>({
    type: "all",
    location: "",
    minSalary: "",
    maxSalary: "",
  });

  const { data: jobs = [], isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
    retry: 1,
    meta: {
      onError: (error: Error) => {
        if (error.message === 'Please login to view jobs') {
          toast({
            title: "Authentication Required",
            description: "Please login to view jobs",
            variant: "destructive",
          });
          navigate('/login');
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    }
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters: JobFiltersType) => {
    setFilters(newFilters);
  };

  const calculateMatchScore = (job: Job, query: string) => {
    const searchFields = [
      job.title,
      job.company,
      job.description,
      job.location,
      ...(job.requiredSkills || []),
    ];
    
    const lowercaseQuery = query.toLowerCase();
    let matchCount = 0;
    
    searchFields.forEach(field => {
      if (field && field.toLowerCase().includes(lowercaseQuery)) {
        matchCount++;
      }
    });
    
    return matchCount / searchFields.length;
  };

  const filterAndSortJobs = (jobs: Job[]) => {
    let filteredJobs = jobs.filter(job => {
      if (!searchQuery) return true;
      
      const matchScore = calculateMatchScore(job, searchQuery);
      return matchScore >= 0.5; // 50% match threshold
    }).filter(job => {
      const matchesType = filters.type === "all" || job.type === filters.type;
      const matchesLocation = !filters.location || 
        job.location.toLowerCase().includes(filters.location.toLowerCase());
      
      const jobSalary = parseInt(job.salary || "0");
      const matchesMinSalary = !filters.minSalary || jobSalary >= parseInt(filters.minSalary);
      const matchesMaxSalary = !filters.maxSalary || jobSalary <= parseInt(filters.maxSalary);

      return matchesType && matchesLocation && matchesMinSalary && matchesMaxSalary;
    });

    // Apply multiple sort criteria
    return filteredJobs.sort((a, b) => {
      // First sort by the selected sort order
      const salaryA = parseInt(a.salary || "0");
      const salaryB = parseInt(b.salary || "0");
      
      // Combine salary and date sorting
      const salaryDiff = sortOrder.includes('salaryLowToHigh') ? 
        salaryA - salaryB : 
        sortOrder.includes('salaryHighToLow') ? 
          salaryB - salaryA : 0;
          
      const dateDiff = sortOrder.includes('newest') ? 
        b.postedDate - a.postedDate :
        sortOrder.includes('oldest') ?
          a.postedDate - b.postedDate : 0;
          
      // Weighted combination of both criteria
      return salaryDiff * 0.5 + dateDiff * 0.5;
    });
  };

  if (isLoading) {
    return (
      <div className="container py-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8 text-center text-red-500">
        Error loading jobs. Please try again later.
      </div>
    );
  }

  const filteredAndSortedJobs = filterAndSortJobs(jobs);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="container py-8 animate-fade-in">
        <WelcomeHeader 
          onSearch={handleSearch}
          onFilterClick={() => {}}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <div className="mt-6">
          <JobSectionsCarousel 
            allJobs={filteredAndSortedJobs} 
            sortOrder={sortOrder}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;

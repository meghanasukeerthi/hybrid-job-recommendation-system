
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { WelcomeHeader } from "@/components/WelcomeHeader";
import { useQuery } from "@tanstack/react-query";
import { fetchJobs } from "@/services/jobService";
import { JobSectionsCarousel } from "@/components/JobSectionsCarousel";
import { JobFilters as JobFiltersType } from "@/components/JobFilters";
import { ResetInteractionsButtons } from "@/components/ResetInteractionsButtons";
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
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Cache for 30 minutes
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

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFilterChange = useCallback((newFilters: JobFiltersType) => {
    setFilters(newFilters);
  }, []);

  const calculateMatchScore = (job: Job, query: string) => {
    const searchFields = [
      job.title,
      job.company,
      job.description,
      job.location,
      ...(job.requiredSkills || []),
    ];
    
    const queryWords = query.toLowerCase().split(/\s+/);
    let totalMatchScore = 0;
    
    queryWords.forEach(word => {
      searchFields.forEach(field => {
        if (field && field.toLowerCase().includes(word)) {
          totalMatchScore += 1;
        }
      });
    });
    
    const maxPossibleScore = searchFields.length * queryWords.length;
    return totalMatchScore / maxPossibleScore;
  };

  const filterAndSortJobs = useCallback((jobs: Job[]) => {
    let filteredJobs = jobs.filter(job => {
      if (!searchQuery) return true;
      
      const matchScore = calculateMatchScore(job, searchQuery);
      return matchScore >= 0.4; // Changed threshold to 40% for more lenient matching
    }).filter(job => {
      const matchesType = filters.type === "all" || job.type === filters.type;
      const matchesLocation = !filters.location || 
        job.location.toLowerCase().includes(filters.location.toLowerCase());
      
      const jobSalary = parseInt(job.salary || "0");
      const matchesMinSalary = !filters.minSalary || jobSalary >= parseInt(filters.minSalary);
      const matchesMaxSalary = !filters.maxSalary || jobSalary <= parseInt(filters.maxSalary);

      return matchesType && matchesLocation && matchesMinSalary && matchesMaxSalary;
    });

    return filteredJobs.sort((a, b) => {
      const salaryA = parseInt(a.salary || "0");
      const salaryB = parseInt(b.salary || "0");
      
      const salaryDiff = sortOrder.includes('salaryLowToHigh') ? 
        salaryA - salaryB : 
        sortOrder.includes('salaryHighToLow') ? 
          salaryB - salaryA : 0;
          
      const dateDiff = sortOrder.includes('newest') ? 
        b.postedDate - a.postedDate :
        sortOrder.includes('oldest') ?
          a.postedDate - b.postedDate : 0;
          
      return salaryDiff * 0.5 + dateDiff * 0.5;
    });
  }, [searchQuery, filters, sortOrder]);

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
        <ResetInteractionsButtons />
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

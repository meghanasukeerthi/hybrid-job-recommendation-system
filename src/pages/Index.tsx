import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { WelcomeHeader } from "@/components/WelcomeHeader";
import { JobList } from "@/components/JobList";
import { useQuery } from "@tanstack/react-query";
import { fetchJobs } from "@/services/jobService";
import type { Job } from "@/types/job";

const Index = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: jobs = [], isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      return;
    }

    const filtered = jobs.filter(job =>
      job.title.toLowerCase().includes(query.toLowerCase()) ||
      job.company.toLowerCase().includes(query.toLowerCase()) ||
      job.description.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
      toast({
        title: "No matches found",
        description: "Try adjusting your search terms",
        variant: "destructive"
      });
    }
  };

  const handleFilterClick = () => {
    toast({
      title: "Filters",
      description: "Filter functionality coming soon!",
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

  const displayedJobs = searchQuery
    ? jobs.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : jobs;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="container py-8 animate-fade-in">
        <WelcomeHeader 
          onSearch={handleSearch}
          onFilterClick={handleFilterClick}
        />
        <JobList jobs={displayedJobs} />
      </div>
    </div>
  );
};

export default Index;
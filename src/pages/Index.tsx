import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { WelcomeHeader } from "@/components/WelcomeHeader";
import { JobList } from "@/components/JobList";
import { SAMPLE_JOBS } from "@/data/sampleJobs";
import type { Job } from "@/types/job";

const Index = () => {
  const { toast } = useToast();
  const [displayedJobs, setDisplayedJobs] = useState<Job[]>(SAMPLE_JOBS);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setDisplayedJobs(SAMPLE_JOBS);
      return;
    }

    const filtered = SAMPLE_JOBS.filter(job =>
      job.title.toLowerCase().includes(query.toLowerCase()) ||
      job.company.toLowerCase().includes(query.toLowerCase()) ||
      job.description.toLowerCase().includes(query.toLowerCase())
    );

    setDisplayedJobs(filtered);
    
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
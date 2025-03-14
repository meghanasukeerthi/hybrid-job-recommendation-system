
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { JobCard } from "@/components/JobCard";
import { SearchBar } from "@/components/SearchBar";
import { useQuery } from "@tanstack/react-query";
import { fetchJobs } from "@/services/jobService";
import { getSearchHistory } from "@/utils/searchHistory";
import type { Job } from "@/types/job";
import { Button } from "@/components/ui/button";
import { LogIn, ArrowLeft } from "lucide-react";

interface SearchHistoryEntry {
  query: string;
  timestamp: number;
}

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryEntry[]>([]);

  useEffect(() => {
    const loadSearchHistory = async () => {
      const history = await getSearchHistory();
      setSearchHistory(history);
    };
    loadSearchHistory();
  }, []);

  const { data: jobs = [], isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
  });

  const handleSearch = (query: string) => {
    const filtered = jobs.filter((job) =>
      job.title.toLowerCase().includes(query.toLowerCase()) ||
      job.company.toLowerCase().includes(query.toLowerCase()) ||
      job.description.toLowerCase().includes(query.toLowerCase()) ||
      job.requiredSkills.some((skill) =>
        skill.toLowerCase().includes(query.toLowerCase())
      )
    );
    setFilteredJobs(filtered);
  };

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      handleSearch(query);
    } else {
      setFilteredJobs(jobs);
    }
  }, [searchParams, jobs]);

  if (isLoading) {
    return (
      <div className="container py-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    const isAuthError = error instanceof Error && 
      (error.message === 'Please login to view jobs' || error.message.includes('login'));

    if (isAuthError) {
      return (
        <div className="container min-h-[60vh] flex flex-col items-center justify-center">
          <div className="text-center space-y-6 max-w-md mx-auto p-8 rounded-lg bg-card shadow-lg">
            <LogIn className="w-16 h-16 mx-auto text-primary animate-bounce" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Welcome to Job Search!
            </h2>
            <p className="text-muted-foreground">
              To start your job search journey and explore available opportunities, please log in to your account. 
              New here? Creating an account takes just a minute!
            </p>
            <Button 
              onClick={() => navigate('/login')}
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              Login Now
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="container min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto p-8 rounded-lg bg-card shadow-lg">
          <h2 className="text-2xl font-bold text-destructive">Oops!</h2>
          <p className="text-muted-foreground">
            We're having trouble loading the jobs right now. Please try again in a few moments.
          </p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const query = searchParams.get('q');
  const resultCount = filteredJobs.length;

  return (
    <div className="container py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Search Results</h2>
        {query && (
          <p className="text-muted-foreground mb-4">
            Found {resultCount} result{resultCount !== 1 ? 's' : ''} for "{query}"
          </p>
        )}
        <SearchBar onSearch={handleSearch} />
        {searchHistory.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm text-muted-foreground mb-2">Recent Searches:</h3>
            <div className="flex gap-2 justify-center flex-wrap">
              {searchHistory.map((entry, index) => (
                <button
                  key={`${entry.query}-${entry.timestamp}`}
                  onClick={() => handleSearch(entry.query)}
                  className="text-sm px-3 py-1 rounded-full bg-purple-500/10 
                           text-purple-500 hover:bg-purple-500/20 transition-colors"
                >
                  {entry.query}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.map((job) => (
          <JobCard key={job.id} {...job} />
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center text-muted-foreground">
          No jobs found matching your search criteria.
        </div>
      )}
    </div>
  );
};

export default Search;

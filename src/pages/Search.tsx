import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { JobCard } from "@/components/JobCard";
import { SearchBar } from "@/components/SearchBar";
import { SAMPLE_JOBS } from "@/data/sampleJobs";
import { getSearchHistory } from "@/utils/searchHistory";

const Search = () => {
  const [searchParams] = useSearchParams();
  const [filteredJobs, setFilteredJobs] = useState(SAMPLE_JOBS);
  const [searchHistory] = useState(getSearchHistory());

  const handleSearch = (query: string) => {
    const filtered = SAMPLE_JOBS.filter((job) =>
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
    }
  }, [searchParams]);

  return (
    <div className="container py-8 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Search Results</h2>
        <SearchBar onSearch={handleSearch} />
        {searchHistory.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm text-muted-foreground mb-2">Recent Searches:</h3>
            <div className="flex gap-2 justify-center flex-wrap">
              {searchHistory.map((keyword, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(keyword)}
                  className="text-sm px-3 py-1 rounded-full bg-purple-500/10 
                           text-purple-500 hover:bg-purple-500/20 transition-colors"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.map((job, index) => (
          <JobCard key={index} {...job} />
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
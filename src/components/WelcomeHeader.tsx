import { Button } from "@/components/ui/button";
import { ListFilter } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";

interface WelcomeHeaderProps {
  onSearch: (query: string) => void;
  onFilterClick: () => void;
}

export const WelcomeHeader = ({ onSearch, onFilterClick }: WelcomeHeaderProps) => {
  return (
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold mb-4 hover:text-primary transition-colors">
        Find Your Dream Job
      </h2>
      <p className="text-muted-foreground mb-8">
        Browse through thousands of job opportunities tailored to your skills and experience.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
        <SearchBar onSearch={onSearch} className="flex-1" />
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={onFilterClick}
        >
          <ListFilter className="w-5 h-5" />
          Filters
        </Button>
      </div>
    </div>
  );
};
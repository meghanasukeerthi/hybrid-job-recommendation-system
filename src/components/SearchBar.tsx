
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { addSearchKeyword } from "@/utils/searchHistory";

interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
}

export const SearchBar = ({ onSearch, className }: SearchBarProps) => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (query.trim()) {
      addSearchKeyword(query.trim());
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      onSearch(query);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    onSearch(query);
    
    if (!query.trim() && window.location.pathname === '/search') {
      navigate('/');
    }
  };

  return (
    <div className="flex gap-2 w-[180%] mx-auto items-center">
      <form onSubmit={handleSubmit} className={`flex gap-2 flex-1 ${className || ''}`}>
        <div className="flex-1">
          <Input 
            name="search"
            placeholder="Search jobs by title, skills, or description..." 
            className="w-full text-lg h-10"
            onChange={handleChange}
          />
        </div>
        <Button type="submit" className="hover:bg-purple-600 hover:text-white transition-colors h-10 px-6">
          <Search className="w-5 h-5 mr-2" />
          Search
        </Button>
      </form>
      <Button 
        variant="outline" 
        onClick={() => navigate('/search-history')}
        className="hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors h-10"
      >
        <History className="w-5 h-5 mr-2" />
        History
      </Button>
    </div>
  );
};

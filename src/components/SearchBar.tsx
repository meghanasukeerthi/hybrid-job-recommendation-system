import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export const SearchBar = () => {
  return (
    <div className="flex gap-2 max-w-2xl mx-auto">
      <div className="flex-1">
        <Input 
          placeholder="Search jobs by title, company, or keywords..." 
          className="w-full"
        />
      </div>
      <Button>
        <Search className="w-4 h-4 mr-2" />
        Search
      </Button>
    </div>
  );
};
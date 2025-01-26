import { Button } from "@/components/ui/button";
import { ListFilter } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { JobFilters } from "@/components/JobFilters";

interface WelcomeHeaderProps {
  onSearch: (query: string) => void;
  onFilterClick: () => void;
  sortOrder: 'newest' | 'oldest';
  onSortChange: (order: 'newest' | 'oldest') => void;
  filters: JobFilters;
  onFilterChange: (filters: JobFilters) => void;
}

export const WelcomeHeader = ({ 
  onSearch, 
  onFilterClick, 
  sortOrder,
  onSortChange,
  filters,
  onFilterChange
}: WelcomeHeaderProps) => {
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={onFilterClick}
            >
              <ListFilter className="w-5 h-5" />
              Filters
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Job Type</Label>
                <Select
                  value={filters.type}
                  onValueChange={(value) => onFilterChange({ ...filters, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  placeholder="Enter location"
                  value={filters.location}
                  onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Min Salary</Label>
                  <Input
                    type="number"
                    placeholder="Min salary"
                    value={filters.minSalary}
                    onChange={(e) => onFilterChange({ ...filters, minSalary: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Salary</Label>
                  <Input
                    type="number"
                    placeholder="Max salary"
                    value={filters.maxSalary}
                    onChange={(e) => onFilterChange({ ...filters, maxSalary: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DropdownMenuSeparator className="my-4" />
            <div className="space-y-2">
              <DropdownMenuItem onClick={() => onSortChange('newest')}>
                {sortOrder === 'newest' ? '✓ ' : ''}Newest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortChange('oldest')}>
                {sortOrder === 'oldest' ? '✓ ' : ''}Oldest First
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
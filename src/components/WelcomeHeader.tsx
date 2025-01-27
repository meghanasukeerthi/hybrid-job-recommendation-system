import { Button } from "@/components/ui/button";
import { ListFilter, ArrowUpDown, Briefcase, MapPin } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { JobFilters } from "@/components/JobFilters";

interface WelcomeHeaderProps {
  onSearch: (query: string) => void;
  onFilterClick: () => void;
  sortOrder: 'newest' | 'oldest' | 'salaryLowToHigh' | 'salaryHighToLow';
  onSortChange: (order: 'newest' | 'oldest' | 'salaryLowToHigh' | 'salaryHighToLow') => void;
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
              className="flex items-center gap-2 bg-background"
            >
              <ListFilter className="w-5 h-5" />
              Sort & Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-80 p-4 bg-background border shadow-lg" 
            align="end"
            side="bottom"
            sideOffset={5}
          >
            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
            <DropdownMenuGroup className="space-y-1 mb-4">
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => onSortChange('newest')}
              >
                {sortOrder === 'newest' ? '✓ ' : ''}Newest First
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => onSortChange('oldest')}
              >
                {sortOrder === 'oldest' ? '✓ ' : ''}Oldest First
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => onSortChange('salaryLowToHigh')}
              >
                {sortOrder === 'salaryLowToHigh' ? '✓ ' : ''}Salary: Low to High
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => onSortChange('salaryHighToLow')}
              >
                {sortOrder === 'salaryHighToLow' ? '✓ ' : ''}Salary: High to Low
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuLabel>Job Type</DropdownMenuLabel>
            <DropdownMenuGroup className="space-y-1 mb-4">
              {['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'].map((type) => (
                <DropdownMenuItem
                  key={type}
                  className="cursor-pointer"
                  onClick={() => onFilterChange({ ...filters, type: type })}
                >
                  {filters.type === type ? '✓ ' : ''}{type}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  placeholder="Enter location"
                  value={filters.location}
                  onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Min Salary</Label>
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.minSalary}
                    onChange={(e) => onFilterChange({ ...filters, minSalary: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Salary</Label>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maxSalary}
                    onChange={(e) => onFilterChange({ ...filters, maxSalary: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
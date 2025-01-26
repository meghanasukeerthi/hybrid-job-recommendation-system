import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface JobFiltersProps {
  onFilterChange: (filters: JobFilters) => void;
  filters: JobFilters;
}

export interface JobFilters {
  type: string;
  location: string;
  minSalary: string;
  maxSalary: string;
}

export const JobFilters = ({ onFilterChange, filters }: JobFiltersProps) => {
  const handleFilterChange = (key: keyof JobFilters, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg shadow-sm">
      <div className="space-y-2">
        <Label>Job Type</Label>
        <Select
          value={filters.type}
          onValueChange={(value) => handleFilterChange('type', value)}
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
          onChange={(e) => handleFilterChange('location', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Min Salary</Label>
          <Input
            type="number"
            placeholder="Min salary"
            value={filters.minSalary}
            onChange={(e) => handleFilterChange('minSalary', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Max Salary</Label>
          <Input
            type="number"
            placeholder="Max salary"
            value={filters.maxSalary}
            onChange={(e) => handleFilterChange('maxSalary', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
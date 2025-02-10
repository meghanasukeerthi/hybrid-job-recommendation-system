
import { JobFilters as JobFiltersType } from "@/components/JobFilters";

interface JobFiltersSectionProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  sortOrder: 'newest' | 'oldest' | 'salaryLowToHigh' | 'salaryHighToLow';
  onSortChange: (order: 'newest' | 'oldest' | 'salaryLowToHigh' | 'salaryHighToLow') => void;
  filters: JobFiltersType;
  onFilterChange: (filters: JobFiltersType) => void;
}

export const JobFiltersSection = ({
  searchQuery,
  onSearch,
  sortOrder,
  onSortChange,
  filters,
  onFilterChange
}: JobFiltersSectionProps) => {
  return (
    <WelcomeHeader 
      onSearch={onSearch}
      onFilterClick={() => {}}
      sortOrder={sortOrder}
      onSortChange={onSortChange}
      filters={filters}
      onFilterChange={onFilterChange}
    />
  );
};

import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ListFilter } from "lucide-react";

interface JobSalaryFilterProps {
  onSortChange: (order: 'salaryLowToHigh' | 'salaryHighToLow') => void;
  currentSort: string;
}

export const JobSalaryFilter = ({ onSortChange, currentSort }: JobSalaryFilterProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <ListFilter className="h-4 w-4" />
          Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onSortChange('salaryLowToHigh')}>
          {currentSort === 'salaryLowToHigh' ? '✓ ' : ''}Salary: Low to High
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSortChange('salaryHighToLow')}>
          {currentSort === 'salaryHighToLow' ? '✓ ' : ''}Salary: High to Low
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
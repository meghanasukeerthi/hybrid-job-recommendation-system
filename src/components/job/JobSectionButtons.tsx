import { Button } from "@/components/ui/button";

interface JobSectionButtonsProps {
  activeSection: 'all' | 'recommended';
  setActiveSection: (section: 'all' | 'recommended') => void;
  allJobsCount: number;
  recommendedJobsCount: number;
}

export const JobSectionButtons = ({
  activeSection,
  setActiveSection,
  allJobsCount,
  recommendedJobsCount,
}: JobSectionButtonsProps) => {
  return (
    <div className="flex justify-center gap-4 mb-6">
      <Button
        variant={activeSection === 'all' ? 'default' : 'outline'}
        onClick={() => setActiveSection('all')}
        className="min-w-[120px]"
      >
        All Jobs ({allJobsCount})
      </Button>
      <Button
        variant={activeSection === 'recommended' ? 'default' : 'outline'}
        onClick={() => setActiveSection('recommended')}
        className="min-w-[120px]"
      >
        Recommended ({recommendedJobsCount})
      </Button>
    </div>
  );
};
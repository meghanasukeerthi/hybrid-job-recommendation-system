
import { Button } from "@/components/ui/button";

interface JobSectionButtonsProps {
  activeSection: 'all' | 'recommended' | 'content-based' | 'collaborative';
  setActiveSection: (section: 'all' | 'recommended' | 'content-based' | 'collaborative') => void;
  allJobsCount: number;
  recommendedJobsCount: number;
  contentBasedCount: number;
  collaborativeCount: number;
}

export const JobSectionButtons = ({
  activeSection,
  setActiveSection,
  allJobsCount,
  recommendedJobsCount,
  contentBasedCount,
  collaborativeCount,
}: JobSectionButtonsProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-6">
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
        Profile Based ({recommendedJobsCount})
      </Button>
      <Button
        variant={activeSection === 'content-based' ? 'default' : 'outline'}
        onClick={() => setActiveSection('content-based')}
        className="min-w-[120px]"
      >
        Content Based ({contentBasedCount})
      </Button>
      <Button
        variant={activeSection === 'collaborative' ? 'default' : 'outline'}
        onClick={() => setActiveSection('collaborative')}
        className="min-w-[120px]"
      >
        Collaborative ({collaborativeCount})
      </Button>
    </div>
  );
};

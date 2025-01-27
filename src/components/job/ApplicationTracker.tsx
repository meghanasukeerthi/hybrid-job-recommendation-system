import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Job } from "@/types/job";

interface ApplicationTrackerProps {
  jobs: Job[];
}

export const ApplicationTracker = ({ jobs }: ApplicationTrackerProps) => {
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);

  useEffect(() => {
    const storedAppliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
    setAppliedJobs(storedAppliedJobs);
  }, []);

  const appliedCount = appliedJobs.length;
  const totalJobs = jobs.length;

  return (
    <div className="flex items-center gap-4 p-4 bg-card rounded-lg shadow-sm">
      <Badge variant="secondary" className="text-sm">
        Applied: {appliedCount}/{totalJobs}
      </Badge>
      <Badge variant="outline" className="text-sm">
        Success Rate: {totalJobs > 0 ? Math.round((appliedCount / totalJobs) * 100) : 0}%
      </Badge>
    </div>
  );
};
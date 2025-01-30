import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Job } from "@/types/job";
import { format } from 'date-fns';

interface ApplicationTrackerProps {
  jobs: Job[];
}

export const ApplicationTracker = ({ jobs }: ApplicationTrackerProps) => {
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);
  const [appliedJobDetails, setAppliedJobDetails] = useState<Job[]>([]);

  useEffect(() => {
    const storedAppliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
    setAppliedJobs(storedAppliedJobs);
    
    // Get full details of applied jobs
    const details = jobs.filter(job => storedAppliedJobs.includes(job.id));
    setAppliedJobDetails(details);
  }, [jobs]);

  const appliedCount = appliedJobs.length;
  const totalJobs = jobs.length;

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Badge variant="secondary" className="text-sm">
          Applications: {appliedCount}/{totalJobs}
        </Badge>
        <Badge variant="outline" className="text-sm">
          Success Rate: {totalJobs > 0 ? Math.round((appliedCount / totalJobs) * 100) : 0}%
        </Badge>
      </div>
      
      <ScrollArea className="h-[200px] w-full rounded-md border p-4">
        <div className="space-y-2">
          {appliedJobDetails.map((job) => (
            <div key={job.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
              <div className="space-y-1">
                <p className="text-sm font-medium">{job.title}</p>
                <p className="text-xs text-muted-foreground">{job.company}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">
                  Applied: {format(new Date(), 'MMM dd, yyyy')}
                </p>
                <Badge variant="outline" className="text-xs">
                  {job.type}
                </Badge>
              </div>
            </div>
          ))}
          {appliedJobDetails.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No applications yet. Start applying to jobs!
            </p>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};
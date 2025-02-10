
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JobTrackingButton } from "./JobTrackingButton";
import { Job } from "@/types/job";

interface AppliedJobCardProps {
  job: Job;
  applicationDate: number;
}

export const AppliedJobCard = ({ job, applicationDate }: AppliedJobCardProps) => {
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <h4 className="text-xl font-semibold">{job.title}</h4>
            <Badge variant="secondary" className="bg-green-100 text-green-800 w-fit">
              Status: Under Review
            </Badge>
            <p className="text-sm text-muted-foreground">
              Applied {formatDistanceToNow(applicationDate)} ago
            </p>
          </div>
          
          <div className="flex justify-end mt-4">
            <div className="w-1/3">
              <JobTrackingButton 
                jobId={job.id} 
                isAnimating={false}
                isApplied={true}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JobTrackingButton } from "./JobTrackingButton";
import { Building2, MapPin, Calendar } from "lucide-react";

interface AppliedJobCardProps {
  job: {
    job: {
      id: number;
      title: string;
      company: string;
      location: string;
    };
    applicationDate: string;
  };
}

export const AppliedJobCard = ({ job }: AppliedJobCardProps) => {
  return (
    <Card className="w-[70%] mx-auto hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h4 className="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {job.job.title}
                </h4>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  <span>{job.job.company}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{job.job.location}</span>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                Status: Under Review
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <p>
                Applied {formatDistanceToNow(new Date(job.applicationDate))} ago
              </p>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <div className="w-64">
              <JobTrackingButton 
                jobId={job.job.id} 
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

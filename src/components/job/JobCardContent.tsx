
import { JobDetails } from "./JobDetails";
import { JobComments } from "./JobComments";
import { JobTrackingButton } from "./JobTrackingButton";
import { LoadingSpinner } from "../ui/loading-spinner";
import { Comment } from "@/types/job";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface JobCardContentProps {
  description: string;
  requiredSkills: string[];
  experienceRequired: { years: number };
  showComments: boolean;
  comments: Comment[];
  newComment: string;
  onCommentChange: (comment: string) => void;
  onAddComment: () => void;
  isCommentLoading: boolean;
  jobId: number;
  isAnimating: boolean;
  location: string;
  postedDate: number;
  salary?: string;
  isApplied?: boolean;
  applicationDate?: number;
  relevanceScore?: number;
}

export const JobCardContent = ({
  location,
  postedDate,
  salary,
  description,
  requiredSkills,
  experienceRequired,
  showComments,
  comments,
  newComment,
  onCommentChange,
  onAddComment,
  isCommentLoading,
  jobId,
  isAnimating,
  isApplied = false,
  applicationDate,
  relevanceScore
}: JobCardContentProps) => {
  return (
    <>
      <div className="flex flex-col gap-2 mb-4">
        {isApplied && (
          <>
            <Badge variant="secondary" className="bg-green-100 text-green-800 w-fit">
              Application Status: Under Review
            </Badge>
            {applicationDate && (
              <p className="text-sm text-muted-foreground">
                Applied {formatDistanceToNow(applicationDate)} ago
              </p>
            )}
          </>
        )}
      </div>

      <JobDetails
        location={location}
        postedDate={postedDate}
        salary={salary}
        description={description}
        requiredSkills={requiredSkills}
        experienceRequired={experienceRequired}
        relevanceScore={relevanceScore}
      />
      
      <JobComments
        showComments={showComments}
        comments={comments}
        newComment={newComment}
        onCommentChange={onCommentChange}
        onAddComment={onAddComment}
        isCommentLoading={isCommentLoading}
      />
      
      <div className="flex justify-center w-full mt-4">
        {isCommentLoading ? (
          <LoadingSpinner className="w-6 h-6" />
        ) : (
          <JobTrackingButton 
            jobId={jobId} 
            isAnimating={isAnimating}
            isApplied={isApplied}
          />
        )}
      </div>
    </>
  );
};

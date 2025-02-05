import { JobDetails } from "./JobDetails";
import { CommentList } from "./CommentList";
import { CommentForm } from "./CommentForm";
import { JobTrackingButton } from "./JobTrackingButton";
import { LoadingSpinner } from "../ui/loading-spinner";
import { Comment } from "@/types/job";

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
  isAnimating
}: JobCardContentProps) => {
  return (
    <>
      <JobDetails
        location={location}
        postedDate={postedDate}
        salary={salary}
        description={description}
        requiredSkills={requiredSkills}
        experienceRequired={experienceRequired}
      />
      
      {showComments && (
        <div className="space-y-4 animate-accordion-down">
          <CommentForm
            newComment={newComment}
            onCommentChange={onCommentChange}
            onAddComment={onAddComment}
          />
          <CommentList comments={comments} />
        </div>
      )}
      
      <div className="flex justify-center w-full mt-4">
        {isCommentLoading ? (
          <LoadingSpinner className="w-6 h-6" />
        ) : (
          <JobTrackingButton jobId={jobId} isAnimating={isAnimating} />
        )}
      </div>
    </>
  );
};
import { JobHeader } from "./JobHeader";
import { BookmarkButton } from "./BookmarkButton";
import { JobActions } from "./JobActions";
import { LikeButton } from "./LikeButton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface JobCardHeaderProps {
  id: number;
  title: string;
  company: string;
  type: string;
  category: 'fresher' | 'experienced' | 'remote' | 'internship';
  commentsCount: number;
  likesCount: number;
  onShare: () => void;
  onComment: () => void;
  onLike: () => void;
  isAnimating: boolean;
}

export const JobCardHeader = ({
  id,
  title,
  company,
  type,
  category,
  commentsCount,
  likesCount,
  onShare,
  onComment,
  onLike,
  isAnimating
}: JobCardHeaderProps) => {
  return (
    <div className="flex justify-between items-start">
      <JobHeader title={title} company={company} />
      <div className="flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <BookmarkButton jobId={id} />
              </div>
            </TooltipTrigger>
            <TooltipContent className="animate-tooltip-fade">
              <p>Save this job</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <JobActions
          type={type}
          category={category}
          commentsCount={commentsCount}
          onComment={onComment}
          onShare={onShare}
        >
          <LikeButton
            jobId={id}
            initialLikeCount={likesCount}
            onLike={onLike}
            isAnimating={isAnimating}
          />
        </JobActions>
      </div>
    </div>
  );
};
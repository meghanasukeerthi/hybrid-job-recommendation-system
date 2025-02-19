
import { Comment } from "@/types/job";
import { CommentList } from "./CommentList";
import { CommentForm } from "./CommentForm";

interface JobCommentsProps {
  showComments: boolean;
  comments: Comment[];
  newComment: string;
  onCommentChange: (comment: string) => void;
  onAddComment: () => void;
  isCommentLoading: boolean;
}

export const JobComments = ({
  showComments,
  comments,
  newComment,
  onCommentChange,
  onAddComment,
  isCommentLoading
}: JobCommentsProps) => {
  if (!showComments) return null;

  return (
    <div className="space-y-4 animate-accordion-down">
      <CommentForm
        newComment={newComment}
        onCommentChange={onCommentChange}
        onAddComment={onAddComment}
        isLoading={isCommentLoading}
      />
      <CommentList comments={comments} />
    </div>
  );
};

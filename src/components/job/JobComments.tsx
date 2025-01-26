import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";
import { Comment } from "@/types/job";

interface JobCommentsProps {
  comments: Comment[];
  newComment: string;
  onCommentChange: (value: string) => void;
  onAddComment: () => void;
}

export const JobComments = ({
  comments,
  newComment,
  onCommentChange,
  onAddComment
}: JobCommentsProps) => (
  <div className="mt-4 space-y-4 animate-slide-in">
    <CommentForm
      newComment={newComment}
      onCommentChange={onCommentChange}
      onAddComment={onAddComment}
    />
    <CommentList comments={comments} />
  </div>
);
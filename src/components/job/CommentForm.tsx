import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CommentFormProps {
  newComment: string;
  onCommentChange: (value: string) => void;
  onAddComment: () => void;
}

export const CommentForm = ({
  newComment,
  onCommentChange,
  onAddComment
}: CommentFormProps) => (
  <div className="flex gap-2">
    <Input
      value={newComment}
      onChange={(e) => onCommentChange(e.target.value)}
      placeholder="Add a comment..."
      className="flex-1 hover:border-primary transition-colors"
    />
    <Button onClick={onAddComment} className="hover-button">Post</Button>
  </div>
);
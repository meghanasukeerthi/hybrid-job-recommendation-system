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
}: CommentFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddComment();
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={newComment}
        onChange={(e) => onCommentChange(e.target.value)}
        placeholder="Add a comment..."
        className="flex-1 hover:border-primary transition-colors"
      />
      <Button type="submit" className="hover-button">Post</Button>
    </form>
  );
};
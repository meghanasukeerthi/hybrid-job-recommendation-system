
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface CommentFormProps {
  newComment: string;
  onCommentChange: (value: string) => void;
  onAddComment: () => void;
  isLoading?: boolean;
}

export const CommentForm = ({
  newComment,
  onCommentChange,
  onAddComment,
  isLoading = false
}: CommentFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment();
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={newComment}
        onChange={(e) => onCommentChange(e.target.value)}
        placeholder="Add a comment..."
        className="flex-1 hover:border-primary transition-colors"
        disabled={isLoading}
      />
      <Button 
        type="submit" 
        className="hover-button"
        disabled={isLoading || !newComment.trim()}
      >
        {isLoading ? <LoadingSpinner className="h-4 w-4" /> : 'Post'}
      </Button>
    </form>
  );
};

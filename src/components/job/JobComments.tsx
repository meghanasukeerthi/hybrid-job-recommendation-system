import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Comment {
  id: number;
  text: string;
  author: string;
  date: number;
}

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
    <div className="flex gap-2">
      <Input
        value={newComment}
        onChange={(e) => onCommentChange(e.target.value)}
        placeholder="Add a comment..."
        className="flex-1 hover:border-primary transition-colors"
      />
      <Button onClick={onAddComment} className="hover-button">Post</Button>
    </div>
    <div className="space-y-3">
      {comments.map((comment) => (
        <div key={comment.id} className="bg-muted p-3 rounded-lg hover:scale-[1.02] transition-transform">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{comment.author}</span>
            <span>{new Date(comment.date).toLocaleDateString()}</span>
          </div>
          <p className="mt-1 text-sm">{comment.text}</p>
        </div>
      ))}
    </div>
  </div>
);
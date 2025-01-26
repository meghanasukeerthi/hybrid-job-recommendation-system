import { Comment } from "@/types/job";
import { formatDistanceToNow } from "date-fns";

interface CommentListProps {
  comments: Comment[];
}

export const CommentList = ({ comments }: CommentListProps) => {
  if (!comments || comments.length === 0) {
    return <p className="text-muted-foreground text-sm">No comments yet.</p>;
  }

  return (
    <div className="space-y-3">
      {comments.map((comment, index) => (
        <div key={index} className="bg-muted p-3 rounded-lg hover:scale-[1.02] transition-transform">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{comment.author}</span>
            <span>{formatDistanceToNow(comment.date, { addSuffix: true })}</span>
          </div>
          <p className="mt-1 text-sm">{comment.text}</p>
        </div>
      ))}
    </div>
  );
};
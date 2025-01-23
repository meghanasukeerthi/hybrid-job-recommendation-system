import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobActionsProps {
  type: string;
  category?: 'fresher' | 'experienced' | 'remote' | 'internship';
  isLiked: boolean;
  likesCount: number;
  commentsCount: number;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  isAnimating: boolean;
}

export const JobActions = ({
  type,
  category,
  isLiked,
  likesCount,
  commentsCount,
  onLike,
  onComment,
  onShare,
  isAnimating
}: JobActionsProps) => (
  <div className="flex gap-2 items-center">
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center mini-hover">
        <Button
          variant="ghost"
          size="icon"
          className="relative hover-button"
          onClick={onLike}
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-all duration-300",
              isLiked ? "fill-red-500 text-red-500" : "text-gray-500",
              isAnimating && "animate-scale-in"
            )}
          />
        </Button>
        <span className="text-sm text-muted-foreground">{likesCount}</span>
      </div>
      <div className="flex flex-col items-center mini-hover">
        <Button
          variant="ghost"
          size="icon"
          className="hover-button"
          onClick={onComment}
        >
          <MessageSquare className="w-5 h-5 text-gray-500" />
        </Button>
        <span className="text-sm text-muted-foreground">{commentsCount}</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="hover-button mini-hover"
        onClick={onShare}
      >
        <Share2 className="w-5 h-5 text-gray-500" />
      </Button>
    </div>
    <Badge variant="secondary" className="mini-hover">
      {type}
    </Badge>
    {category === 'fresher' && (
      <Badge variant="outline" className="bg-green-500/10 text-green-500 mini-hover">
        Fresher Friendly
      </Badge>
    )}
  </div>
);
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookmarkJob } from "@/services/jobService";

interface BookmarkButtonProps {
  jobId: number;
}

export const BookmarkButton = ({ jobId }: BookmarkButtonProps) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedJobs') || '[]');
    setIsBookmarked(bookmarks.includes(jobId));
  }, [jobId]);

  const bookmarkMutation = useMutation({
    mutationFn: () => bookmarkJob(jobId),
    onSuccess: () => {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarkedJobs') || '[]');
      
      if (!isBookmarked) {
        bookmarks.push(jobId);
        toast({
          title: "Job bookmarked",
          description: "Job has been added to your bookmarks",
        });
      } else {
        const index = bookmarks.indexOf(jobId);
        if (index > -1) {
          bookmarks.splice(index, 1);
        }
        toast({
          title: "Bookmark removed",
          description: "Job has been removed from your bookmarks",
        });
      }
      
      localStorage.setItem('bookmarkedJobs', JSON.stringify(bookmarks));
      setIsBookmarked(!isBookmarked);
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update bookmark. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleBookmark = () => {
    bookmarkMutation.mutate();
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleBookmark}
      className={cn(
        "hover:bg-primary/10",
        isBookmarked && "text-yellow-500"
      )}
    >
      <Bookmark className={cn("h-5 w-5", isBookmarked && "fill-current")} />
    </Button>
  );
};
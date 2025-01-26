import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { JobHeader } from "./job/JobHeader";
import { JobActions } from "./job/JobActions";
import { JobDetails } from "./job/JobDetails";
import { CommentList } from "./job/CommentList";
import { CommentForm } from "./job/CommentForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeJob, addComment } from "@/services/jobService";
import { bookmarkJob, removeBookmark, isJobBookmarked, trackJobApplication, isJobApplied } from "@/services/userJobService";
import { Job, Comment } from "@/types/job";
import { validateComment, filterValidComments } from "@/services/commentService";

interface JobCardProps {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  postedDate: number;
  requiredSkills?: string[];
  likeCount: number;
  experienceRequired: { years: number };
  comments: Comment[];
  category: 'fresher' | 'experienced' | 'remote' | 'internship';
  salary?: string;
}

export const JobCard = ({ 
  id,
  title, 
  company, 
  location, 
  type, 
  description, 
  postedDate,
  requiredSkills = [],
  likeCount: initialLikeCount,
  experienceRequired,
  comments: initialComments = [],
  category = experienceRequired.years <= 1 ? 'fresher' : 'experienced',
  salary,
}: JobCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikeCount);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>(filterValidComments(initialComments));
  const [newComment, setNewComment] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (id) {
      setIsBookmarked(isJobBookmarked(id));
      setHasApplied(isJobApplied(id));
    }
  }, [id]);

  const likeMutation = useMutation({
    mutationFn: () => likeJob(id),
    onMutate: async () => {
      setLikesCount(prev => prev + 1);
      setIsLiked(true);
      setIsAnimating(true);
      
      const likedJobs = JSON.parse(localStorage.getItem('likedJobs') || '[]');
      if (!likedJobs.includes(id)) {
        localStorage.setItem('likedJobs', JSON.stringify([...likedJobs, id]));
      }
    },
    onSuccess: (updatedJob) => {
      queryClient.setQueryData(['jobs'], (oldJobs: Job[] | undefined) => {
        if (!oldJobs) return oldJobs;
        return oldJobs.map(job => 
          job.id === id ? { ...job, likeCount: updatedJob.likeCount } : job
        );
      });
      setTimeout(() => setIsAnimating(false), 300);
    },
    onError: () => {
      setLikesCount(prev => prev - 1);
      setIsLiked(false);
      setIsAnimating(false);
      
      const likedJobs = JSON.parse(localStorage.getItem('likedJobs') || '[]');
      localStorage.setItem('likedJobs', JSON.stringify(likedJobs.filter((jobId: number) => jobId !== id)));
      
      toast({
        title: "Error",
        description: "Failed to like the job. Please try again.",
        variant: "destructive"
      });
    }
  });

  const commentMutation = useMutation({
    mutationFn: (commentText: string) => {
      if (!commentText.trim()) {
        throw new Error("Comment cannot be empty");
      }
      if (!id) {
        throw new Error("Job ID is required");
      }
      
      const commentData = {
        text: commentText.trim(),
        author: "Current User",
        date: Date.now()
      };
      
      return addComment(id, commentData);
    },
    onSuccess: (updatedJob) => {
      if (updatedJob && updatedJob.comments) {
        const validComments = filterValidComments(updatedJob.comments);
        setComments(validComments);
        setNewComment("");
        
        queryClient.setQueryData(['jobs'], (oldJobs: Job[] | undefined) => {
          if (!oldJobs) return oldJobs;
          return oldJobs.map(job => 
            job.id === id ? { ...job, comments: validComments } : job
          );
        });
        
        toast({
          title: "Success",
          description: "Your comment has been posted successfully",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add comment. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleBookmark = async () => {
    if (!id) return;
    try {
      if (isBookmarked) {
        await removeBookmark(id);
        setIsBookmarked(false);
        toast({
          title: "Bookmark removed",
          description: "Job has been removed from your bookmarks",
        });
      } else {
        await bookmarkJob(id);
        setIsBookmarked(true);
        toast({
          title: "Job bookmarked",
          description: "Job has been added to your bookmarks",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive"
      });
    }
  };

  const handleApply = async () => {
    if (!id) return;
    try {
      await trackJobApplication(id);
      setHasApplied(true);
      setIsAnimating(true);
      toast({
        title: "Application Submitted! 🎉",
        description: "We've received your application. Good luck!",
      });
      setTimeout(() => setIsAnimating(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application",
        variant: "destructive"
      });
    }
  };

  const handleLike = () => {
    if (!id) return;
    likeMutation.mutate();
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${title} at ${company}`,
        text: `Check out this job opportunity: ${title} at ${company}`,
        url: window.location.href
      });
    } catch (err) {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Job post link has been copied to clipboard",
      });
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment before posting",
        variant: "destructive"
      });
      return;
    }
    commentMutation.mutate(newComment);
  };

  return (
    <Card className="animate-fade-in hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <JobHeader title={title} company={company} />
          <div className="flex gap-2">
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
            <JobActions
              type={type}
              category={category}
              isLiked={isLiked}
              likesCount={likesCount}
              commentsCount={comments.length}
              onLike={handleLike}
              onComment={() => setShowComments(!showComments)}
              onShare={handleShare}
              isAnimating={isAnimating}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <JobDetails
          location={location}
          postedDate={postedDate}
          salary={salary}
          description={description}
          requiredSkills={requiredSkills}
          experienceRequired={experienceRequired}
        />
        
        {showComments && (
          <div className="space-y-4">
            <CommentForm
              newComment={newComment}
              onCommentChange={setNewComment}
              onAddComment={handleAddComment}
            />
            <CommentList comments={comments} />
          </div>
        )}
        
        <div className="flex justify-center w-full mt-4">
          <Button 
            onClick={handleApply}
            disabled={hasApplied}
            className={cn(
              "w-1/2 transform transition-all duration-300 hover:bg-purple-600 hover:text-white active:scale-95 rounded-lg shadow-lg hover:shadow-purple-500/50",
              isAnimating && "animate-scale-in",
              hasApplied && "bg-gray-400 cursor-not-allowed"
            )}
          >
            {hasApplied ? "Applied" : "Apply Now"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

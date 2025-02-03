import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { JobHeader } from "./job/JobHeader";
import { JobActions } from "./job/JobActions";
import { JobDetails } from "./job/JobDetails";
import { CommentList } from "./job/CommentList";
import { CommentForm } from "./job/CommentForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeJob, addComment } from "@/services/jobService";
import { Job, Comment } from "@/types/job";
import { validateComment, filterValidComments } from "@/services/commentService";
import { LikeButton } from "./job/LikeButton";
import { BookmarkButton } from "./job/BookmarkButton";
import { JobTrackingButton } from "./job/JobTrackingButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LoadingSpinner } from "./ui/loading-spinner";

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
  const [likesCount, setLikesCount] = useState(initialLikeCount);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>(filterValidComments(initialComments));
  const [newComment, setNewComment] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: () => {
      const likedJobs = JSON.parse(localStorage.getItem('likedJobs') || '[]');
      const isCurrentlyLiked = likedJobs.includes(id);
      return likeJob(id, isCurrentlyLiked);
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
      setIsAnimating(false);
      toast({
        title: "Error",
        description: "Failed to update like status. Please try again.",
        variant: "destructive"
      });
    }
  });

  const commentMutation = useMutation({
    mutationFn: (commentText: string) => {
      if (!commentText.trim()) {
        throw new Error("Comment cannot be empty");
      }
      return addComment(id, {
        text: commentText.trim(),
        author: "Current User",
        date: Date.now()
      });
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
        description: error instanceof Error ? error.message : "Failed to add comment",
        variant: "destructive"
      });
    }
  });

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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <BookmarkButton jobId={id} />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="animate-tooltip-fade">
                  <p>Save this job</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <JobActions
              type={type}
              category={category}
              commentsCount={comments.length}
              onComment={() => setShowComments(!showComments)}
              onShare={handleShare}
            >
              <LikeButton
                jobId={id}
                initialLikeCount={likesCount}
                onLike={() => likeMutation.mutate()}
                isAnimating={isAnimating}
              />
            </JobActions>
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
          <div className="space-y-4 animate-accordion-down">
            <CommentForm
              newComment={newComment}
              onCommentChange={setNewComment}
              onAddComment={handleAddComment}
            />
            <CommentList comments={comments} />
          </div>
        )}
        
        <div className="flex justify-center w-full mt-4">
          {commentMutation.isPending ? (
            <LoadingSpinner className="w-6 h-6" />
          ) : (
            <JobTrackingButton jobId={id} isAnimating={isAnimating} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

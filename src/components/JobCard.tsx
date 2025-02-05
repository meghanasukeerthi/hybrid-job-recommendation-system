import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeJob, addComment } from "@/services/jobService";
import { Job, Comment } from "@/types/job";
import { filterValidComments } from "@/services/commentService";
import { JobCardHeader } from "./job/JobCardHeader";
import { JobCardContent } from "./job/JobCardContent";
import { JobMetadata } from "./job/JobMetadata";
import { JobSkills } from "./job/JobSkills";

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
  category,
  salary,
}: JobCardProps) => {
  const [likesCount, setLikesCount] = useState(initialLikeCount);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>(filterValidComments(initialComments));
  const [newComment, setNewComment] = useState("");

  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: () => likeJob(id, !isAnimating),
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
      }
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
    }
  };

  return (
    <Card className="animate-fade-in hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <JobCardHeader
          id={id}
          title={title}
          company={company}
          type={type}
          category={category}
          commentsCount={comments.length}
          likesCount={likesCount}
          onShare={handleShare}
          onComment={() => setShowComments(!showComments)}
          onLike={() => likeMutation.mutate()}
          isAnimating={isAnimating}
        />
        <JobMetadata
          location={location}
          type={type}
          postedDate={postedDate}
          salary={salary}
        />
      </CardHeader>
      <CardContent>
        <JobCardContent
          description={description}
          requiredSkills={requiredSkills}
          experienceRequired={experienceRequired}
          showComments={showComments}
          comments={comments}
          newComment={newComment}
          onCommentChange={setNewComment}
          onAddComment={() => commentMutation.mutate(newComment)}
          isCommentLoading={commentMutation.isPending}
          jobId={id}
          isAnimating={isAnimating}
        />
        <JobSkills skills={requiredSkills} />
      </CardContent>
    </Card>
  );
};
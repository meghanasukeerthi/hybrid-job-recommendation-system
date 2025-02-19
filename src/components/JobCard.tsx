
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeJob, addComment } from "@/services/jobService";
import { Job, Comment } from "@/types/job";
import { filterValidComments } from "@/services/commentService";
import { JobCardHeader } from "./job/JobCardHeader";
import { JobCardContent } from "./job/JobCardContent";
import { JobMetadata } from "./job/JobMetadata";

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

  const commentMutation = useMutation({
    mutationFn: async (commentText: string) => {
      if (!commentText.trim()) {
        throw new Error("Comment cannot be empty");
      }
      await addComment(id, commentText.trim());
      return commentText;
    },
    onSuccess: (commentText) => {
      const newComment: Comment = {
        id: Date.now(),
        text: commentText,
        author: "Current User",
        date: Date.now()
      };
      setComments([...comments, newComment]);
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
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
          onLike={() => setIsAnimating(true)}
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
          location={location}
          postedDate={postedDate}
          salary={salary}
        />
      </CardContent>
    </Card>
  );
};

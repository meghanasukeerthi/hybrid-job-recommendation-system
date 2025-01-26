import { Comment } from "@/types/job";

export const validateComment = (comment: Partial<Comment>): boolean => {
  return !!(comment && 
    comment.text && 
    comment.text.trim() !== '' && 
    comment.author);
};

export const filterValidComments = (comments: Comment[]): Comment[] => {
  return comments.filter(validateComment);
};
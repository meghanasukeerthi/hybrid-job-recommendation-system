export type JobCategory = "fresher" | "experienced" | "remote" | "internship";

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  category: JobCategory;
  description: string;
  postedDate: number;
  requiredSkills: string[];
  experienceRequired: {
    years: number;
  };
  comments: {
    text: string;
    author: string;
    date: number;
  }[];
  likeCount: number;
}
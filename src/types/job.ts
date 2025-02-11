
export type JobCategory = "fresher" | "experienced" | "remote" | "internship";

export interface Comment {
  id?: number;
  text: string;
  author: string;
  date: number;
}

export interface ExperienceRequired {
  id?: number;
  years: number;
}

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
  experienceRequired: ExperienceRequired;
  comments: Comment[];
  likeCount: number;
  salary?: string;
  applicationDate?: string | number;
  isApplied?: boolean;
}

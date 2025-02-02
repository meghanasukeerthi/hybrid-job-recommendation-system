import { Job } from "@/types/job";

export const sampleJobs: Job[] = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "Tech Corp",
    location: "San Francisco, CA",
    type: "Full-time",
    category: "experienced",
    description: "Looking for an experienced software engineer to join our team...",
    postedDate: Date.now() - 86400000, // 1 day ago
    requiredSkills: ["JavaScript", "React", "Node.js", "TypeScript"],
    experienceRequired: { years: 5 },
    comments: [],
    likeCount: 0,
    salary: "150000"
  },
  {
    id: 2,
    title: "Frontend Developer",
    company: "StartUp Inc",
    location: "Remote",
    type: "Full-time",
    category: "experienced",
    description: "Join our fast-growing startup as a frontend developer...",
    postedDate: Date.now() - 172800000, // 2 days ago
    requiredSkills: ["React", "TypeScript", "CSS", "HTML"],
    experienceRequired: { years: 3 },
    comments: [],
    likeCount: 0,
    salary: "120000"
  },
  {
    id: 3,
    title: "Junior Developer",
    company: "Growth Co",
    location: "New York, NY",
    type: "Full-time",
    category: "fresher",
    description: "Great opportunity for recent graduates...",
    postedDate: Date.now() - 259200000, // 3 days ago
    requiredSkills: ["JavaScript", "HTML", "CSS"],
    experienceRequired: { years: 1 },
    comments: [],
    likeCount: 0,
    salary: "80000"
  }
];
export const SAMPLE_JOBS = [
  {
    id: 1,
    title: "Junior Frontend Developer",
    company: "TechStart Inc.",
    location: "Remote",
    type: "Full-time",
    category: "fresher",
    description: "Perfect opportunity for fresh graduates to start their career in frontend development with React and TypeScript.",
    postedDate: Date.now() - 24 * 60 * 60 * 1000, // 1 day ago
    requiredSkills: ["React", "HTML", "CSS", "JavaScript"],
    experienceRequired: {
      id: 1,
      years: 0
    },
    comments: [
      { id: 1, text: "Great opportunity for freshers!", author: "John Doe", date: Date.now() - 24 * 60 * 60 * 1000 }
    ]
  },
  {
    id: 2,
    title: "UX Designer",
    company: "Design Studio",
    location: "Remote",
    type: "Contract",
    category: "experienced",
    description: "Join our creative team as a UX Designer and help shape the future of our digital products.",
    postedDate: Date.now() - 7 * 24 * 60 * 60 * 1000, // 1 week ago
    requiredSkills: ["Figma", "UI/UX", "Prototyping"],
    experienceRequired: {
      id: 2,
      years: 3
    },
    comments: [
      { id: 3, text: "Flexible remote work policy", author: "Mike Johnson", date: Date.now() - 3 * 24 * 60 * 60 * 1000 },
      { id: 4, text: "Great design team", author: "Sarah Lee", date: Date.now() - 5 * 24 * 60 * 60 * 1000 }
    ]
  }
];
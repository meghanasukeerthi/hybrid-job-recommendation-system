export const SAMPLE_JOBS = [
  {
    id: 1,
    title: "Junior Frontend Developer",
    company: "TechStart Inc.",
    location: "Remote",
    type: "Full-time",
    category: "fresher",
    description: "Perfect opportunity for fresh graduates to start their career in frontend development with React and TypeScript.",
    postedDate: Date.now() - 24 * 60 * 60 * 1000,
    requiredSkills: ["React", "HTML", "CSS", "JavaScript"],
    experienceRequired: {
      years: 0
    },
    comments: [
      { text: "Great opportunity for freshers!", author: "John Doe", date: Date.now() - 24 * 60 * 60 * 1000 },
      { text: "Perfect for those starting in web development.", author: "Jane Smith", date: Date.now() - 48 * 60 * 60 * 1000 }
    ],
    likeCount: 120
  },
  {
    id: 2,
    title: "UX Designer",
    company: "Design Studio",
    location: "Remote",
    type: "Contract",
    category: "experienced",
    description: "Join our creative team as a UX Designer and help shape the future of our digital products.",
    postedDate: Date.now() - 7 * 24 * 60 * 60 * 1000,
    requiredSkills: ["Figma", "UI/UX", "Prototyping"],
    experienceRequired: {
      years: 3
    },
    comments: [
      { text: "Flexible remote work policy", author: "Mike Johnson", date: Date.now() - 3 * 24 * 60 * 60 * 1000 },
      { text: "Great design team", author: "Sarah Lee", date: Date.now() - 5 * 24 * 60 * 60 * 1000 }
    ],
    likeCount: 85
  },
  {
    id: 3,
    title: "AI Engineer",
    company: "AI Solutions Ltd",
    location: "Boston, MA",
    type: "Full-time",
    category: "experienced",
    description: "Looking for an AI Engineer to develop and implement machine learning models.",
    postedDate: Date.now() - 3 * 24 * 60 * 60 * 1000,
    requiredSkills: ["Python", "Machine Learning", "TensorFlow"],
    experienceRequired: {
      years: 3
    },
    comments: [
      { text: "Exciting AI projects!", author: "Alex Chen", date: Date.now() - 2 * 24 * 60 * 60 * 1000 }
    ],
    likeCount: 95
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "Cloud Systems",
    location: "Seattle, WA",
    type: "Full-time",
    category: "experienced",
    description: "Join our DevOps team to help build and maintain our cloud infrastructure.",
    postedDate: Date.now() - 24 * 60 * 60 * 1000,
    requiredSkills: ["AWS", "Docker", "Kubernetes"],
    experienceRequired: {
      years: 5
    },
    comments: [
      { text: "Great cloud infrastructure team!", author: "David Wilson", date: Date.now() - 12 * 60 * 60 * 1000 },
      { text: "Excellent work culture", author: "Emma Davis", date: Date.now() - 18 * 60 * 60 * 1000 }
    ],
    likeCount: 150
  },
  {
    id: 5,
    title: "Mobile Developer Intern",
    company: "App Makers",
    location: "Remote",
    type: "Internship",
    category: "fresher",
    description: "Great opportunity for students to learn mobile development with React Native.",
    postedDate: Date.now() - 4 * 24 * 60 * 60 * 1000,
    requiredSkills: ["React Native", "JavaScript", "Mobile Development"],
    experienceRequired: {
      years: 0
    },
    comments: [
      { text: "Perfect internship opportunity!", author: "Tom Brown", date: Date.now() - 3 * 24 * 60 * 60 * 1000 }
    ],
    likeCount: 45
  }
];
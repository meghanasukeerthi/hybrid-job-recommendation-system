import { SearchBar } from "@/components/SearchBar";
import { JobCard } from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserCircle, ListFilter } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ResumeUploader } from "@/components/ResumeUploader";
import { ThemeToggle } from "@/components/ThemeToggle";

const SAMPLE_JOBS = [
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
  },
  {
    id: 3,
    title: "AI Engineer",
    company: "AI Solutions Ltd",
    location: "Boston, MA",
    type: "Full-time",
    description: "Looking for an AI Engineer to develop and implement machine learning models.",
    postedDate: Date.now() - 3 * 24 * 60 * 60 * 1000,
    requiredSkills: ["Python", "Machine Learning", "TensorFlow"],
    experienceRequired: {
      id: 3,
      years: 3
    },
    comments: []
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "Cloud Systems",
    location: "Seattle, WA",
    type: "Full-time",
    description: "Join our DevOps team to help build and maintain our cloud infrastructure.",
    postedDate: Date.now() - 24 * 60 * 60 * 1000,
    requiredSkills: ["AWS", "Docker", "Kubernetes"],
    experienceRequired: {
      id: 4,
      years: 5
    },
    comments: []
  },
  {
    id: 5,
    title: "Mobile Developer",
    company: "App Makers",
    location: "Austin, TX",
    type: "Full-time",
    description: "Seeking a Mobile Developer proficient in React Native and iOS development.",
    postedDate: Date.now() - 4 * 24 * 60 * 60 * 1000,
    requiredSkills: ["React Native", "iOS", "Android"],
    experienceRequired: {
      id: 5,
      years: 3
    },
    comments: []
  },
  {
    id: 6,
    title: "Data Scientist",
    company: "Data Analytics Co",
    location: "Chicago, IL",
    type: "Full-time",
    description: "Join our data science team to analyze and interpret complex data sets.",
    postedDate: Date.now() - 7 * 24 * 60 * 60 * 1000,
    requiredSkills: ["Python", "R", "Machine Learning"],
    experienceRequired: {
      id: 6,
      years: 3
    },
    comments: []
  },
  {
    id: 7,
    title: "Backend Developer",
    company: "Server Solutions",
    location: "Denver, CO",
    type: "Full-time",
    description: "Looking for a Backend Developer experienced with Node.js and databases.",
    postedDate: Date.now() - 2 * 24 * 60 * 60 * 1000,
    requiredSkills: ["Node.js", "MongoDB", "Express"],
    experienceRequired: {
      id: 7,
      years: 3
    },
    comments: []
  },
  {
    id: 8,
    title: "Product Manager",
    company: "Product Labs",
    location: "New York, NY",
    type: "Full-time",
    description: "Seeking an experienced Product Manager to lead our product development initiatives.",
    postedDate: Date.now() - 5 * 24 * 60 * 60 * 1000,
    requiredSkills: ["Product Management", "Agile", "JIRA"],
    experienceRequired: {
      id: 8,
      years: 5
    },
    comments: []
  },
  {
    id: 9,
    title: "Java Developer",
    company: "Enterprise Solutions",
    location: "Chicago, IL",
    type: "Full-time",
    description: "Join our team to develop enterprise-level Java applications.",
    postedDate: Date.now() - 3 * 24 * 60 * 60 * 1000,
    requiredSkills: ["Java", "Spring Boot", "SQL"],
    experienceRequired: {
      id: 9,
      years: 3
    },
    comments: []
  },
  {
    id: 10,
    title: "Cloud Architect",
    company: "Cloud Tech",
    location: "Seattle, WA",
    type: "Full-time",
    description: "Design and implement cloud-based solutions for our clients.",
    postedDate: Date.now() - 7 * 24 * 60 * 60 * 1000,
    requiredSkills: ["AWS", "Azure", "Cloud Architecture"],
    experienceRequired: {
      id: 10,
      years: 5
    },
    comments: []
  },
  {
    id: 11,
    title: "Graduate Trainee - Software Development",
    company: "Tech Academy",
    location: "Hybrid",
    type: "Full-time",
    category: "fresher",
    description: "Join our 6-month training program designed specifically for fresh graduates. Learn modern web development technologies and get hands-on experience.",
    postedDate: Date.now() - 3 * 24 * 60 * 60 * 1000,
    requiredSkills: ["Basic Programming", "Problem Solving", "Communication"],
    experienceRequired: {
      id: 11,
      years: 0
    },
    comments: []
  }
];

const calculateJobScore = (job, userProfile) => {
  let score = 0;
  
  // Match skills (higher weight)
  const userSkills = userProfile.skills || [];
  const matchedSkills = job.requiredSkills.filter(skill => 
    userSkills.some(userSkill => 
      userSkill.toLowerCase().includes(skill.toLowerCase())
    )
  );
  score += matchedSkills.length * 3;
  
  // Experience match (medium weight)
  const userExperience = parseInt(userProfile.experience) || 0;
  const jobExperience = job.experienceRequired.years || 0;
  if (userExperience >= jobExperience) {
    score += 2;
  }
  
  // Likes weight (lower weight)
  score += (job.initialLikes || 0) / 1000;
  
  return score;
};

const Index = () => {
  const [showAllJobs, setShowAllJobs] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  const getUserProfile = () => {
    const profileData = localStorage.getItem('userProfile');
    return profileData ? JSON.parse(profileData) : {
      skills: [],
      experience: "",
      education: "",
      careerGoals: []
    };
  };

  const getRecommendedJobs = () => {
    const userProfile = getUserProfile();
    const scoredJobs = SAMPLE_JOBS.map(job => ({
      ...job,
      score: calculateJobScore(job, userProfile)
    }));
    
    return scoredJobs
      .sort((a, b) => b.score - a.score)
      .map(({ score, ...job }) => job);
  };

  const filterJobsBySearch = (jobs) => {
    if (!searchQuery) return jobs;
    
    const query = searchQuery.toLowerCase();
    return jobs.filter(job => 
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.description.toLowerCase().includes(query) ||
      job.requiredSkills.some(skill => 
        skill.toLowerCase().includes(query)
      )
    );
  };

  const displayedJobs = filterJobsBySearch(
    showAllJobs ? SAMPLE_JOBS : getRecommendedJobs()
  );

  useEffect(() => {
    const userProfile = getUserProfile();
    if (userProfile.skills?.length) {
      toast({
        title: "Profile Updated",
        description: "Job recommendations have been updated based on your profile.",
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="bg-card shadow-md backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold hover:text-primary transition-colors">
            Job Portal
          </h1>
          <div className="flex gap-4 items-center">
            <ThemeToggle />
            <ResumeUploader />
            <Link to="/profile">
              <Button variant="outline" className="flex items-center gap-2 hover-button">
                <UserCircle className="w-5 h-5" />
                Profile
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      <div className="container py-8 animate-fade-in">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 hover:text-primary transition-colors">
            Find Your Dream Job
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Discover opportunities that match your skills and aspirations
          </p>
          <SearchBar onSearch={setSearchQuery} />
          <div className="mt-4 flex justify-center gap-4">
            <Button
              variant={!showAllJobs ? "default" : "outline"}
              onClick={() => setShowAllJobs(false)}
              className="flex items-center gap-2 hover-button"
            >
              <ListFilter className="w-4 h-4" />
              Recommended Jobs
            </Button>
            <Button
              variant={showAllJobs ? "default" : "outline"}
              onClick={() => setShowAllJobs(true)}
              className="flex items-center gap-2 hover-button"
            >
              All Jobs
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {displayedJobs.map((job, index) => (
            <JobCard key={index} {...job} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;

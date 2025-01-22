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
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    description: "We're looking for a Senior Frontend Developer to join our team and help build amazing user experiences using React and TypeScript.",
    postedDate: "2 days ago",
    requiredSkills: ["React", "TypeScript", "HTML", "CSS"]
  },
  {
    title: "UX Designer",
    company: "Design Studio",
    location: "Remote",
    type: "Contract",
    description: "Join our creative team as a UX Designer and help shape the future of our digital products.",
    postedDate: "1 week ago",
    requiredSkills: ["Figma", "UI/UX", "Prototyping"]
  },
  {
    title: "AI Engineer",
    company: "AI Solutions Ltd",
    location: "Boston, MA",
    type: "Full-time",
    description: "Looking for an AI Engineer to develop and implement machine learning models.",
    postedDate: "3 days ago",
    requiredSkills: ["Python", "Machine Learning", "TensorFlow"]
  },
  {
    title: "DevOps Engineer",
    company: "Cloud Systems",
    location: "Seattle, WA",
    type: "Full-time",
    description: "Join our DevOps team to help build and maintain our cloud infrastructure.",
    postedDate: "1 day ago",
    requiredSkills: ["AWS", "Docker", "Kubernetes"]
  },
  {
    title: "Mobile Developer",
    company: "App Makers",
    location: "Austin, TX",
    type: "Full-time",
    description: "Seeking a Mobile Developer proficient in React Native and iOS development.",
    postedDate: "4 days ago",
    requiredSkills: ["React Native", "iOS", "Android"]
  },
  {
    title: "Data Scientist",
    company: "Data Analytics Co",
    location: "Chicago, IL",
    type: "Full-time",
    description: "Join our data science team to analyze and interpret complex data sets.",
    postedDate: "1 week ago",
    requiredSkills: ["Python", "R", "Machine Learning"]
  },
  {
    title: "Backend Developer",
    company: "Server Solutions",
    location: "Denver, CO",
    type: "Full-time",
    description: "Looking for a Backend Developer experienced with Node.js and databases.",
    postedDate: "2 days ago",
    requiredSkills: ["Node.js", "MongoDB", "Express"]
  },
  {
    title: "Product Manager",
    company: "Product Labs",
    location: "New York, NY",
    type: "Full-time",
    description: "Seeking an experienced Product Manager to lead our product development initiatives.",
    postedDate: "5 days ago",
    requiredSkills: ["Product Management", "Agile", "JIRA"]
  },
  {
    title: "Java Developer",
    company: "Enterprise Solutions",
    location: "Chicago, IL",
    type: "Full-time",
    description: "Join our team to develop enterprise-level Java applications.",
    postedDate: "3 days ago",
    requiredSkills: ["Java", "Spring Boot", "SQL"]
  },
  {
    title: "Cloud Architect",
    company: "Cloud Tech",
    location: "Seattle, WA",
    type: "Full-time",
    description: "Design and implement cloud-based solutions for our clients.",
    postedDate: "1 week ago",
    requiredSkills: ["AWS", "Azure", "Cloud Architecture"]
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
  const jobExperience = parseInt(job.experienceRequired) || 0;
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
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-card shadow">
        <div className="container py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            Job Portal
          </h1>
          <div className="flex gap-4 items-center">
            <ThemeToggle />
            <ResumeUploader />
            <Link to="/profile">
              <Button variant="outline" className="flex items-center gap-2">
                <UserCircle className="w-5 h-5" />
                Profile
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      <div className="container py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
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
              className="flex items-center gap-2"
            >
              <ListFilter className="w-4 h-4" />
              Recommended Jobs
            </Button>
            <Button
              variant={showAllJobs ? "default" : "outline"}
              onClick={() => setShowAllJobs(true)}
              className="flex items-center gap-2"
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

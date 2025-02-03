import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { JobList } from "./JobList";
import { Job } from "@/types/job";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";

interface JobSectionsCarouselProps {
  allJobs: Job[];
  sortOrder: 'newest' | 'oldest' | 'salaryLowToHigh' | 'salaryHighToLow';
}

export const JobSectionsCarousel = ({ allJobs, sortOrder }: JobSectionsCarouselProps) => {
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [activeSection, setActiveSection] = useState<'all' | 'recommended'>('all');
  const [displayedJobs, setDisplayedJobs] = useState<Job[]>(allJobs);

  useEffect(() => {
    const userProfileStr = localStorage.getItem('userProfile');
    
    // Initial placeholder profile for recommendations if none exists
    const placeholderProfile = {
      skills: ["Java", "Spring Boot", "React", "TypeScript"],
      experience: "3 years",
      education: "Bachelor of Computer Science",
      careerGoals: "Full Stack Developer"
    };
    
    const userProfile = userProfileStr ? JSON.parse(userProfileStr) : placeholderProfile;
    
    // Enhanced job matching logic with scoring system
    const calculateJobScore = (job: Job) => {
      let score = 0;
      
      // Skills match (40% weight)
      if (userProfile.skills && userProfile.skills.length > 0) {
        const skillMatches = job.requiredSkills.filter(jobSkill =>
          userProfile.skills.some((userSkill: string) => 
            jobSkill.toLowerCase().includes(userSkill.toLowerCase()) ||
            userSkill.toLowerCase().includes(jobSkill.toLowerCase())
          )
        );
        score += (skillMatches.length / job.requiredSkills.length) * 40;
      }

      // Experience match (30% weight)
      if (userProfile.experience) {
        const userYearsMatch = userProfile.experience.match(/(\d+)/);
        const userYears = userYearsMatch ? parseInt(userYearsMatch[0]) : 0;
        const jobYears = job.experienceRequired.years;
        
        if (Math.abs(userYears - jobYears) <= 1) {
          score += 30;
        } else if (userYears >= jobYears) {
          score += 20;
        } else {
          score += Math.max(0, 15 - (jobYears - userYears) * 5);
        }
      }

      // Education and career goals match (30% weight)
      if (userProfile.education || userProfile.careerGoals) {
        const profileKeywords = [
          ...(userProfile.education?.toLowerCase().split(' ') || []),
          ...(userProfile.careerGoals?.toLowerCase().split(' ') || [])
        ];
        
        const keywordMatches = profileKeywords.filter(keyword =>
          job.description.toLowerCase().includes(keyword) ||
          job.title.toLowerCase().includes(keyword)
        );
        
        score += (keywordMatches.length / profileKeywords.length) * 30;
      }

      return score;
    };

    // Filter and sort jobs based on scores
    const scoredJobs = allJobs.map(job => ({
      job,
      score: calculateJobScore(job)
    }));

    // Filter out jobs with 0 score and sort by score
    const filteredAndSortedJobs = scoredJobs
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ job }) => job);

    setRecommendedJobs(filteredAndSortedJobs);

    // Show toast with recommendation count
    if (activeSection === 'recommended') {
      toast({
        title: "Job Recommendations Updated",
        description: `Found ${filteredAndSortedJobs.length} jobs matching your profile`,
      });
    }
  }, [allJobs, activeSection]);

  const sortJobs = (jobs: Job[]) => {
    return [...jobs].sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          return b.postedDate - a.postedDate;
        case 'oldest':
          return a.postedDate - b.postedDate;
        case 'salaryLowToHigh':
          return (parseInt(a.salary || "0") - parseInt(b.salary || "0"));
        case 'salaryHighToLow':
          return (parseInt(b.salary || "0") - parseInt(a.salary || "0"));
        default:
          return 0;
      }
    });
  };

  useEffect(() => {
    const jobsToDisplay = activeSection === 'all' ? allJobs : recommendedJobs;
    setDisplayedJobs(sortJobs(jobsToDisplay));
  }, [activeSection, sortOrder, allJobs, recommendedJobs]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-center gap-4 mb-6">
        <Button
          variant={activeSection === 'all' ? 'default' : 'outline'}
          onClick={() => setActiveSection('all')}
          className="min-w-[120px]"
        >
          All Jobs ({allJobs.length})
        </Button>
        <Button
          variant={activeSection === 'recommended' ? 'default' : 'outline'}
          onClick={() => setActiveSection('recommended')}
          className="min-w-[120px]"
        >
          Recommended ({recommendedJobs.length})
        </Button>
      </div>
      <Carousel className="w-full">
        <CarouselContent>
          <CarouselItem>
            <div className="p-4">
              <JobList jobs={displayedJobs} />
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
};
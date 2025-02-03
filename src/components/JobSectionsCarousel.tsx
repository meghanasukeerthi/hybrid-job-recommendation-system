import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { JobList } from "./JobList";
import { Job } from "@/types/job";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

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
      skills: ["Java", "Spring Boot", "React", "TypeScript", "Git", "AWS"],
      experience: "3 years",
      education: "Bachelor of Computer Science",
      careerGoals: "To become a Senior Full Stack Developer"
    };
    
    // Use placeholder profile for recommendations if no profile exists
    const userProfile = userProfileStr ? JSON.parse(userProfileStr) : placeholderProfile;
    
    // Enhanced job matching logic
    const matchesUserProfile = (job: Job) => {
      let matchScore = 0;
      const maxScore = 100;
      
      // Skills match (50% weight)
      if (userProfile.skills && userProfile.skills.length > 0) {
        const matchingSkills = job.requiredSkills.filter(jobSkill =>
          userProfile.skills.some((userSkill: string) => 
            jobSkill.toLowerCase().includes(userSkill.toLowerCase()) ||
            userSkill.toLowerCase().includes(jobSkill.toLowerCase())
          )
        );
        matchScore += (matchingSkills.length / job.requiredSkills.length) * 50;
      }

      // Experience match (30% weight)
      if (userProfile.experience) {
        const userYearsMatch = userProfile.experience.match(/(\d+)/);
        const userYears = userYearsMatch ? parseInt(userYearsMatch[0]) : 0;
        const jobYears = job.experienceRequired.years;
        const experienceMatch = Math.min(userYears / jobYears, 1.5);
        matchScore += experienceMatch * 30;
      }

      // Career goals match (20% weight)
      if (userProfile.careerGoals && job.description) {
        const goalKeywords = userProfile.careerGoals.toLowerCase().split(' ');
        const descriptionMatches = goalKeywords.some(keyword => 
          job.description.toLowerCase().includes(keyword)
        );
        if (descriptionMatches) matchScore += 20;
      }

      return matchScore >= 60; // 60% match threshold
    };

    const recommended = allJobs.filter(matchesUserProfile);
    setRecommendedJobs(recommended);
  }, [allJobs]);

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
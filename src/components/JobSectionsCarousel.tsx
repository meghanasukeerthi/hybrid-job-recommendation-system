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
  sortOrder: 'newest' | 'oldest';
}

export const JobSectionsCarousel = ({ allJobs, sortOrder }: JobSectionsCarouselProps) => {
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [activeSection, setActiveSection] = useState<'all' | 'recommended'>('all');
  const [displayedJobs, setDisplayedJobs] = useState<Job[]>(allJobs);

  useEffect(() => {
    const userProfileStr = localStorage.getItem('userProfile');
    
    // Initial placeholder profile if none exists
    const defaultProfile = {
      skills: ["JavaScript", "React", "TypeScript"],
      experience: "2 years",
      education: "Bachelor's in Computer Science",
      careerGoals: "Frontend Developer"
    };
    
    // If no profile exists, use default profile
    const userProfile = userProfileStr ? JSON.parse(userProfileStr) : defaultProfile;
    
    // Function to check if job matches user profile
    const matchesUserProfile = (job: Job) => {
      // Check skills match - one skill match is enough
      if (userProfile.skills && userProfile.skills.length > 0) {
        const hasMatchingSkill = job.requiredSkills.some(jobSkill =>
          userProfile.skills.some((userSkill: string) => 
            jobSkill.toLowerCase() === userSkill.toLowerCase()
          )
        );
        if (hasMatchingSkill) return true;
      }

      // Check experience match - 70% match required
      if (userProfile.experience) {
        const userYearsMatch = userProfile.experience.match(/(\d+)/);
        const userYears = userYearsMatch ? parseInt(userYearsMatch[0]) : 0;
        const jobYears = job.experienceRequired.years;
        const matchPercentage = (userYears / jobYears) * 100;
        if (matchPercentage >= 70) return true;
      }

      return false;
    };

    const recommended = allJobs.filter(matchesUserProfile);
    setRecommendedJobs(recommended);
  }, [allJobs]);

  // Sort jobs by comment count first, then by date if comment counts are equal
  const sortJobs = (jobs: Job[]) => {
    return [...jobs].sort((a, b) => {
      // First sort by comment count (descending)
      const commentDiff = b.comments.length - a.comments.length;
      if (commentDiff !== 0) return commentDiff;
      
      // If comment counts are equal, use the date sorting
      if (sortOrder === 'newest') {
        return b.postedDate - a.postedDate;
      } else {
        return a.postedDate - b.postedDate;
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
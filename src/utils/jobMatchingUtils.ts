import { Job } from "@/types/job";

interface UserProfile {
  skills: string[];
  experience: string;
  education: string;
  careerGoals: string;
}

export const calculateJobScore = (job: Job, userProfile: UserProfile): number => {
  let score = 0;
  
  // Skills match (40% weight)
  if (userProfile.skills && userProfile.skills.length > 0) {
    const skillMatches = job.requiredSkills.filter(jobSkill =>
      userProfile.skills.some(userSkill => 
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
  const profileKeywords = [
    ...(userProfile.education?.toLowerCase().split(' ') || []),
    ...(userProfile.careerGoals?.toLowerCase().split(' ') || [])
  ];
  
  const keywordMatches = profileKeywords.filter(keyword =>
    job.description.toLowerCase().includes(keyword) ||
    job.title.toLowerCase().includes(keyword)
  );
  
  score += (keywordMatches.length / profileKeywords.length) * 30;

  return score;
};

export const getRecommendedJobs = (jobs: Job[], userProfile: UserProfile): Job[] => {
  const scoredJobs = jobs.map(job => ({
    job,
    score: calculateJobScore(job, userProfile)
  }));

  return scoredJobs
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ job }) => job);
};
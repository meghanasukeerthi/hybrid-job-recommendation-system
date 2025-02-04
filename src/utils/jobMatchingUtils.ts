import { Job } from "@/types/job";

interface UserProfile {
  skills: string[];
  experience: string;
  education: string;
  careerGoals: string;
}

const calculateSkillScore = (jobSkills: string[], userSkills: string[]): number => {
  const matches = jobSkills.filter(jobSkill =>
    userSkills.some(userSkill => 
      jobSkill.toLowerCase().includes(userSkill.toLowerCase()) ||
      userSkill.toLowerCase().includes(jobSkill.toLowerCase())
    )
  );
  return matches.length > 0 ? (matches.length / jobSkills.length) * 40 : 0;
};

const calculateExperienceScore = (jobExperience: number, userExperience: string): number => {
  const userYearsMatch = userExperience.match(/(\d+)/);
  const userYears = userYearsMatch ? parseInt(userYearsMatch[0]) : 0;
  
  if (Math.abs(userYears - jobExperience) <= 1) return 30;
  if (userYears >= jobExperience) return 20;
  return Math.max(0, 15 - (jobExperience - userYears) * 5);
};

const calculateEducationScore = (jobDescription: string, education: string): number => {
  const educationKeywords = education.toLowerCase().split(/\s+/);
  const matches = educationKeywords.filter(keyword => 
    jobDescription.toLowerCase().includes(keyword)
  );
  return matches.length > 0 ? (matches.length / educationKeywords.length) * 30 : 0;
};

export const calculateJobScore = (job: Job, userProfile: UserProfile): number => {
  const skillScore = calculateSkillScore(job.requiredSkills, userProfile.skills);
  const experienceScore = calculateExperienceScore(job.experienceRequired.years, userProfile.experience);
  const educationScore = calculateEducationScore(job.description, userProfile.education);
  
  const totalScore = skillScore + experienceScore + educationScore;
  return Math.round(totalScore);
};

export const getRecommendedJobs = (jobs: Job[], userProfile: UserProfile): Job[] => {
  const scoredJobs = jobs.map(job => ({
    job,
    score: calculateJobScore(job, userProfile)
  }));

  // Filter out jobs with score 0 and sort by score
  return scoredJobs
    .filter(({ score }) => score > 30) // Minimum threshold for recommendations
    .sort((a, b) => b.score - a.score)
    .map(({ job }) => job);
};
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
  return matches.length > 0 ? (matches.length / jobSkills.length) * 1.0 : 0;
};

const calculateExperienceScore = (jobExperience: number, userExperience: string): number => {
  const userYearsMatch = userExperience.match(/(\d+)/);
  const userYears = userYearsMatch ? parseInt(userYearsMatch[0]) : 0;
  
  if (Math.abs(userYears - jobExperience) <= 1) return 0.8;
  if (userYears >= jobExperience) return 0.6;
  return Math.max(0, 0.4 - (jobExperience - userYears) * 0.1);
};

const calculateEducationScore = (jobDescription: string, education: string): number => {
  const educationKeywords = education.toLowerCase().split(/\s+/);
  const matches = educationKeywords.filter(keyword => 
    jobDescription.toLowerCase().includes(keyword)
  );
  return matches.length > 0 ? (matches.length / educationKeywords.length) * 0.3 : 0;
};

const calculateKeywordScore = (jobDescription: string, userProfile: UserProfile): number => {
  const userKeywords = [
    ...userProfile.skills,
    ...userProfile.careerGoals.toLowerCase().split(/\s+/)
  ];
  
  const matches = userKeywords.filter(keyword =>
    jobDescription.toLowerCase().includes(keyword.toLowerCase())
  );
  
  return matches.length > 0 ? (matches.length / userKeywords.length) * 0.7 : 0;
};

export const calculateJobScore = (job: Job, userProfile: UserProfile): number => {
  const skillScore = calculateSkillScore(job.requiredSkills, userProfile.skills);
  const experienceScore = calculateExperienceScore(job.experienceRequired.years, userProfile.experience);
  const educationScore = calculateEducationScore(job.description, userProfile.education);
  const keywordScore = calculateKeywordScore(job.description, userProfile);
  
  const totalScore = skillScore + experienceScore + educationScore + keywordScore;
  return Number(totalScore.toFixed(2));
};

export const getRecommendedJobs = (jobs: Job[], userProfile: UserProfile): Job[] => {
  const MINIMUM_SCORE = 2.4;
  
  const scoredJobs = jobs.map(job => ({
    job,
    score: calculateJobScore(job, userProfile)
  }));

  return scoredJobs
    .filter(({ score }) => score >= MINIMUM_SCORE)
    .sort((a, b) => b.score - a.score)
    .map(({ job }) => job);
};
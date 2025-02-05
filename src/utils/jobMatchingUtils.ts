import { Job } from "@/types/job";

interface UserProfile {
  skills: string[];
  experience: string;
  education: string;
  careerGoals: string;
}

const calculateSkillScore = (jobSkills: string[], userSkills: string[]): number => {
  if (!jobSkills.length || !userSkills.length) return 0;
  
  const matches = jobSkills.filter(jobSkill =>
    userSkills.some(userSkill => 
      jobSkill.toLowerCase().includes(userSkill.toLowerCase()) ||
      userSkill.toLowerCase().includes(jobSkill.toLowerCase())
    )
  );
  return matches.length > 0 ? (matches.length / jobSkills.length) * 1.0 : 0;
};

const calculateExperienceScore = (jobExperience: { years: number }, userExperience: string): number => {
  const userYearsMatch = userExperience.match(/(\d+)/);
  if (!userYearsMatch) return 0;
  
  const userYears = parseInt(userYearsMatch[0]);
  const jobYears = jobExperience.years;
  
  if (Math.abs(userYears - jobYears) <= 1) return 0.8;
  if (userYears >= jobYears) return 0.6;
  return Math.max(0, 0.4 - (jobYears - userYears) * 0.1);
};

const calculateEducationScore = (jobDescription: string, education: string): number => {
  if (!education) return 0;
  
  const educationKeywords = education.toLowerCase().split(/\s+/);
  const matches = educationKeywords.filter(keyword => 
    jobDescription.toLowerCase().includes(keyword)
  );
  return matches.length > 0 ? (matches.length / educationKeywords.length) * 0.3 : 0;
};

const calculateKeywordScore = (jobDescription: string, userProfile: UserProfile): number => {
  if (!jobDescription || !userProfile.careerGoals) return 0;
  
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
  const experienceScore = calculateExperienceScore(job.experienceRequired, userProfile.experience);
  const educationScore = calculateEducationScore(job.description, userProfile.education);
  const keywordScore = calculateKeywordScore(job.description, userProfile);
  
  const totalScore = skillScore + experienceScore + educationScore + keywordScore;
  return Number(totalScore.toFixed(2));
};

export const getRecommendedJobs = (jobs: Job[], userProfile: UserProfile): Job[] => {
  const MINIMUM_SCORE = 2.7;
  
  // Initially show all jobs if no profile exists
  if (!userProfile.skills?.length && !userProfile.experience && !userProfile.education) {
    console.log('No user profile found, showing all jobs');
    return jobs;
  }

  const scoredJobs = jobs.map(job => ({
    job,
    score: calculateJobScore(job, userProfile)
  }));

  console.log('Scored jobs:', scoredJobs.map(({ job, score }) => ({
    title: job.title,
    score,
    skills: job.requiredSkills,
    userSkills: userProfile.skills
  })));

  return scoredJobs
    .filter(({ score }) => score >= MINIMUM_SCORE)
    .sort((a, b) => b.score - a.score)
    .map(({ job }) => job);
};
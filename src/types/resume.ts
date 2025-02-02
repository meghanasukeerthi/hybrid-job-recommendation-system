export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface Experience {
  jobTitle: string;
  company: string;
  duration: string;
}

export interface ResumeData {
  fullName: string;
  email: string;
  skills: string[] | string;
  experience: string;
  education: string;
  careerGoals: string;
}
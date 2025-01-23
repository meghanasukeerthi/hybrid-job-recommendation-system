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
      { id: 1, text: "Great opportunity for freshers!", author: "John Doe", date: Date.now() - 24 * 60 * 60 * 1000 },
      { id: 2, text: "Perfect for those starting in web development.", author: "Jane Smith", date: Date.now() - 48 * 60 * 60 * 1000 },
      { id: 3, text: "Looks like an excellent learning opportunity.", author: "Alex Johnson", date: Date.now() - 72 * 60 * 60 * 1000 },
      { id: 4, text: "Amazing role for developers.", author: "Emily Brown", date: Date.now() - 96 * 60 * 60 * 1000 },
      { id: 5, text: "A great stepping stone for fresh graduates.", author: "Chris Wilson", date: Date.now() - 120 * 60 * 60 * 1000 },
      { id: 6, text: "Exciting role for tech enthusiasts!", author: "Sophia Davis", date: Date.now() - 144 * 60 * 60 * 1000 },
      { id: 7, text: "Ideal for someone new to the industry.", author: "Liam Martinez", date: Date.now() - 168 * 60 * 60 * 1000 },
      { id: 8, text: "An amazing opportunity to grow.", author: "Olivia Garcia", date: Date.now() - 192 * 60 * 60 * 1000 },
      { id: 9, text: "Good learning opportunity for beginners.", author: "Benjamin Clark", date: Date.now() - 216 * 60 * 60 * 1000 },
      { id: 10, text: "Great role to gain hands-on experience.", author: "Ava Lewis", date: Date.now() - 240 * 60 * 60 * 1000 },
      { id: 11, text: "Perfect for freshers starting out.", author: "Noah Walker", date: Date.now() - 264 * 60 * 60 * 1000 },
      { id: 12, text: "Amazing job for skill development.", author: "Isabella Hall", date: Date.now() - 288 * 60 * 60 * 1000 },
      { id: 13, text: "Great for those interested in coding.", author: "William Young", date: Date.now() - 312 * 60 * 60 * 1000 },
      { id: 14, text: "Nice opportunity to enhance skills.", author: "Mia Allen", date: Date.now() - 336 * 60 * 60 * 1000 },
      { id: 15, text: "Exciting chance to join the tech world.", author: "Lucas Scott", date: Date.now() - 360 * 60 * 60 * 1000 },
      { id: 16, text: "Perfect for recent graduates.", author: "Charlotte Adams", date: Date.now() - 384 * 60 * 60 * 1000 },
      { id: 17, text: "Good start for a career in IT.", author: "James Baker", date: Date.now() - 408 * 60 * 60 * 1000 },
      { id: 18, text: "A chance to work on exciting projects.", author: "Emma Carter", date: Date.now() - 432 * 60 * 60 * 1000 },
      { id: 19, text: "Interesting role for developers.", author: "Michael Turner", date: Date.now() - 456 * 60 * 60 * 1000 },
      { id: 20, text: "Great way to learn industry practices.", author: "Sophia Perez", date: Date.now() - 480 * 60 * 60 * 1000 },
      { id: 21, text: "Amazing opportunity for beginners.", author: "Liam Roberts", date: Date.now() - 504 * 60 * 60 * 1000 },
      { id: 22, text: "Fantastic for those starting their career.", author: "Olivia Phillips", date: Date.now() - 528 * 60 * 60 * 1000 },
      { id: 23, text: "Exciting job for tech enthusiasts.", author: "Benjamin Evans", date: Date.now() - 552 * 60 * 60 * 1000 },
      { id: 24, text: "Ideal for fresh graduates in tech.", author: "Ava Collins", date: Date.now() - 576 * 60 * 60 * 1000 },
      { id: 25, text: "Good learning opportunity for starters.", author: "Noah Stewart", date: Date.now() - 600 * 60 * 60 * 1000 },
      { id: 26, text: "Nice role to enhance technical skills.", author: "Isabella Sanchez", date: Date.now() - 624 * 60 * 60 * 1000 },
      { id: 27, text: "Exciting opportunity for growth.", author: "William Morris", date: Date.now() - 648 * 60 * 60 * 1000 },
      { id: 28, text: "Great job for freshers in software.", author: "Mia Reed", date: Date.now() - 672 * 60 * 60 * 1000 },
      { id: 29, text: "Perfect for those eager to learn.", author: "Lucas Cook", date: Date.now() - 696 * 60 * 60 * 1000 },
      { id: 30, text: "An excellent opportunity to start a career.", author: "Charlotte Morgan", date: Date.now() - 720 * 60 * 60 * 1000 }
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
  },
  {
    id: 12,
    title: "Junior Frontend Developer",
    company: "TechStart Inc.",
    location: "Remote",
    type: "Full-time",
    category: "fresher",
    description: "Perfect opportunity for fresh graduates to start their career in frontend development with React and TypeScript.",
    postedDate: Date.now() - 24 * 60 * 60 * 1000, // 1 day ago
    requiredSkills: ["React", "HTML", "CSS", "JavaScript"],
    experienceRequired: { id: 1, years: 0 },
    comments: [{ id: 1, text: "Great opportunity for freshers!", author: "John Doe", date: Date.now() - 24 * 60 * 60 * 1000 }]
  },
  {
    id: 13,
    title: "Backend Developer Intern",
    company: "CodeBase Solutions",
    location: "Hyderabad",
    type: "Internship",
    category: "fresher",
    description: "Join our backend team and gain hands-on experience with Node.js and MongoDB.",
    postedDate: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
    requiredSkills: ["Node.js", "MongoDB", "REST API"],
    experienceRequired: { id: 2, years: 0 },
    comments: [{ id: 2, text: "Amazing for backend enthusiasts!", author: "Alice Smith", date: Date.now() - 2 * 24 * 60 * 60 * 1000 }]
  },
  {
    id: 14,
    title: "UI/UX Designer Intern",
    company: "DesignPro Studios",
    location: "Bangalore",
    type: "Part-time",
    category: "fresher",
    description: "An excellent opportunity for design enthusiasts to kickstart their career in UI/UX design.",
    postedDate: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
    requiredSkills: ["Figma", "Adobe XD", "Prototyping"],
    experienceRequired: { id: 3, years: 0 },
    comments: [{ id: 3, text: "Perfect for designers!", author: "Bob Lee", date: Date.now() - 24 * 60 * 60 * 1000 }]
  },
  {
    id: 15,
    title: "Data Analyst Intern",
    company: "DataTech Insights",
    location: "Remote",
    type: "Internship",
    category: "fresher",
    description: "Work on data analysis projects using Python and SQL in a professional environment.",
    postedDate: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
    requiredSkills: ["Python", "SQL", "Data Visualization"],
    experienceRequired: { id: 4, years: 0 },
    comments: [{ id: 4, text: "Great for data enthusiasts!", author: "Eve Carson", date: Date.now() - 4 * 24 * 60 * 60 * 1000 }]
  },
  {
    id: 16,
    title: "Cloud Computing Trainee",
    company: "CloudSphere",
    location: "Pune",
    type: "Full-time",
    category: "fresher",
    description: "Learn cloud computing concepts and tools such as AWS and Docker.",
    postedDate: Date.now() - 6 * 24 * 60 * 60 * 1000, // 6 days ago
    requiredSkills: ["AWS", "Docker", "Kubernetes"],
    experienceRequired: { id: 5, years: 0 },
    comments: [{ id: 5, text: "Great training opportunity!", author: "Charlie Reed", date: Date.now() - 5 * 24 * 60 * 60 * 1000 }]
  },
  {
    id: 17,
    title: "AI/ML Research Intern",
    company: "AI Innovators",
    location: "Chennai",
    type: "Internship",
    category: "fresher",
    description: "Work on innovative AI/ML projects and contribute to research papers.",
    postedDate: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 days ago
    requiredSkills: ["Python", "TensorFlow", "Machine Learning"],
    experienceRequired: { id: 6, years: 0 },
    comments: [{ id: 6, text: "Exciting opportunity for AI enthusiasts!", author: "Diana Prince", date: Date.now() - 9 * 24 * 60 * 60 * 1000 }]
  },
  {
    id: 18,
    title: "Junior Mobile Developer",
    company: "MobileCraft",
    location: "Mumbai",
    type: "Full-time",
    category: "fresher",
    description: "Start your career in mobile app development with Flutter and Dart.",
    postedDate: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
    requiredSkills: ["Flutter", "Dart", "Firebase"],
    experienceRequired: { id: 7, years: 0 },
    comments: [{ id: 7, text: "Excellent opportunity for mobile devs!", author: "Frank Castle", date: Date.now() - 6 * 24 * 60 * 60 * 1000 }]
  },
  {
    id: 19,
    title: "Junior DevOps Engineer",
    company: "OpsTech",
    location: "Remote",
    type: "Full-time",
    category: "fresher",
    description: "Learn and implement CI/CD pipelines in a professional DevOps role.",
    postedDate: Date.now() - 12 * 24 * 60 * 60 * 1000, // 12 days ago
    requiredSkills: ["Docker", "Kubernetes", "Jenkins"],
    experienceRequired: { id: 8, years: 0 },
    comments: [{ id: 8, text: "Great start for DevOps careers!", author: "George Blake", date: Date.now() - 11 * 24 * 60 * 60 * 1000 }]
  },
  {
    id: 20,
    title: "Game Developer Intern",
    company: "GameOn Studios",
    location: "Delhi",
    type: "Part-time",
    category: "fresher",
    description: "Join our team to work on Unity-based game development projects.",
    postedDate: Date.now() - 4 * 24 * 60 * 60 * 1000, // 4 days ago
    requiredSkills: ["Unity", "C#", "Game Design"],
    experienceRequired: { id: 9, years: 0 },
    comments: [{ id: 9, text: "Dream job for game devs!", author: "Hannah Green", date: Date.now() - 3 * 24 * 60 * 60 * 1000 }]
  },
  {
    id: 21,
    title: "Junior QA Tester",
    company: "QualityFirst Ltd.",
    location: "Remote",
    type: "Full-time",
    category: "fresher",
    description: "Kickstart your career in quality assurance with hands-on testing of web and mobile applications.",
    postedDate: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
    requiredSkills: ["Manual Testing", "Automation Tools", "Bug Tracking"],
    experienceRequired: { id: 10, years: 0 },
    comments: [{ id: 10, text: "Great entry point for QA enthusiasts!", author: "Ivan Perez", date: Date.now() - 2 * 24 * 60 * 60 * 1000 }]
  },
  {
    id: 22,
    title: "Junior Cybersecurity Analyst",
    company: "CyberShield",
    location: "Noida",
    type: "Internship",
    category: "fresher",
    description: "Learn and assist in securing systems and applications against cyber threats.",
    postedDate: Date.now() - 6 * 24 * 60 * 60 * 1000, // 6 days ago
    requiredSkills: ["Network Security", "Penetration Testing", "Risk Analysis"],
    experienceRequired: { id: 11, years: 0 },
    comments: [{ id: 11, text: "Exciting role for cybersecurity learners!", author: "Jessica Ray", date: Date.now() - 5 * 24 * 60 * 60 * 1000 }]
  },
  {
    id: 23,
    title: "Junior Content Developer",
    company: "EduSphere",
    location: "Bangalore",
    type: "Full-time",
    category: "fresher",
    description: "Create educational content and resources for online learning platforms.",
    postedDate: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
    requiredSkills: ["Content Writing", "SEO", "Graphic Design"],
    experienceRequired: { id: 12, years: 0 },
    comments: [{ id: 12, text: "Perfect for creative individuals!", author: "Kevin Hart", date: Date.now() - 1 * 24 * 60 * 60 * 1000 }]
  },
  {
    id: 24,
    title: "Blockchain Developer Intern",
    company: "BlockBase",
    location: "Remote",
    type: "Internship",
    category: "fresher",
    description: "Work on blockchain projects using Ethereum and smart contracts.",
    postedDate: Date.now() - 8 * 24 * 60 * 60 * 1000, // 8 days ago
    requiredSkills: ["Ethereum", "Solidity", "Smart Contracts"],
    experienceRequired: { id: 13, years: 0 },
    comments: [{ id: 13, text: "Great opportunity for blockchain enthusiasts!", author: "Laura Adams", date: Date.now() - 7 * 24 * 60 * 60 * 1000 }]
  },
  {
    id: 25,
    title: "Junior IT Support Engineer",
    company: "SysTech Solutions",
    location: "Chennai",
    type: "Full-time",
    category: "fresher",
    description: "Provide IT support for clients and assist with troubleshooting hardware and software issues.",
    postedDate: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
    requiredSkills: ["Networking", "Troubleshooting", "Customer Support"],
    experienceRequired: { id: 14, years: 0 },
    comments: [{ id: 14, text: "Ideal for tech support beginners!", author: "Mike Ross", date: Date.now() - 4 * 24 * 60 * 60 * 1000 }]
  },
  {
    id: 26,
    title: "Junior Marketing Analyst",
    company: "MarketMinds",
    location: "Mumbai",
    type: "Internship",
    category: "fresher",
    description: "Analyze market trends and assist in developing marketing strategies.",
    postedDate: Date.now() - 4 * 24 * 60 * 60 * 1000, // 4 days ago
    requiredSkills: ["Excel", "Data Analysis", "Market Research"],
    experienceRequired: { id: 15, years: 0 },
    comments: [{ id: 15, text: "Perfect for aspiring marketing analysts!", author: "Nina Brown", date: Date.now() - 3 * 24 * 60 * 60 * 1000 }]
  },
  {
    id: 27,
    title: "Junior Software Tester",
    company: "SoftCheck Inc.",
    location: "Hyderabad",
    type: "Full-time",
    category: "fresher",
    description: "Assist in software testing for various applications and platforms.",
    postedDate: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
    requiredSkills: ["Testing", "Selenium", "Bug Reporting"],
    experienceRequired: { id: 16, years: 0 },
    comments: [{ id: 16, text: "A good start for software testers!", author: "Olivia White", date: Date.now() - 2 * 24 * 60 * 60 * 1000 }]
  },
  {
    id: 28,
    title: "Junior Graphic Designer",
    company: "CreativeCore",
    location: "Pune",
    type: "Part-time",
    category: "fresher",
    description: "Design creative assets for web and print media using Photoshop and Illustrator.",
    postedDate: Date.now() - 6 * 24 * 60 * 60 * 1000, // 6 days ago
    requiredSkills: ["Photoshop", "Illustrator", "Creativity"],
    experienceRequired: { id: 17, years: 0 },
    comments: [{ id: 17, text: "Amazing for design enthusiasts!", author: "Peter Clark", date: Date.now() - 5 * 24 * 60 * 60 * 1000 }]
  },
  {
    id: 29,
    title: "Junior Product Manager",
    company: "ProdManage Co.",
    location: "Delhi",
    type: "Full-time",
    category: "fresher",
    description: "Collaborate with teams to define product requirements and ensure delivery timelines.",
    postedDate: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
    requiredSkills: ["Project Management", "Communication", "Agile"],
    experienceRequired: { id: 18, years: 0 },
    comments: [{ id: 18, text: "Great for aspiring product managers!", author: "Sophia Turner", date: Date.now() - 6 * 24 * 60 * 60 * 1000 }]
  },
  {
    id: 30,
    title: "Junior DevOps Intern",
    company: "CloudOps Pvt. Ltd.",
    location: "Remote",
    type: "Internship",
    category: "fresher",
    description: "Gain hands-on experience with CI/CD pipelines and cloud deployments.",
    postedDate: Date.now() - 9 * 24 * 60 * 60 * 1000, // 9 days ago
    requiredSkills: ["CI/CD", "AWS", "Docker"],
    experienceRequired: { id: 19, years: 0 },
    comments: [{ id: 19, text: "Excellent learning opportunity for DevOps!", author: "Liam King", date: Date.now() - 8 * 24 * 60 * 60 * 1000 }]
  },
  {
    id: 31,
    title: "Junior AI Research Assistant",
    company: "AI Innovate",
    location: "Bangalore",
    type: "Internship",
    category: "fresher",
    description: "Assist in researching and developing AI models and algorithms.",
    postedDate: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
    requiredSkills: ["Python", "Machine Learning", "Data Analysis"],
    experienceRequired: { id: 20, years: 0 },
    comments: [{ id: 20, text: "Great opportunity to dive into AI!", author: "Sophia Green", date: Date.now() - 2 * 24 * 60 * 60 * 1000 }]
  },
  {
    id: 32,
    title: "Junior Game Developer",
    company: "GameWorks Studio",
    location: "Pune",
    type: "Full-time",
    category: "fresher",
    description: "Work on developing 2D and 3D games using Unity.",
    postedDate: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
    requiredSkills: ["Unity", "C#", "Game Design"],
    experienceRequired: { id: 21, years: 0 },
    comments: [{ id: 21, text: "Amazing role for gaming enthusiasts!", author: "James Clark", date: Date.now() - 4 * 24 * 60 * 60 * 1000 }]
  },
  {
    id: 33,
    title: "Junior UI/UX Designer",
    company: "DesignPro",
    location: "Hyderabad",
    type: "Full-time",
    category: "fresher",
    description: "Design intuitive user interfaces and enhance user experiences for web and mobile apps.",
    postedDate: Date.now() - 6 * 24 * 60 * 60 * 1000, // 6 days ago
    requiredSkills: ["Figma", "Adobe XD", "Prototyping"],
    experienceRequired: { id: 22, years: 0 },
    comments: [{ id: 22, text: "Great for design enthusiasts!", author: "Mia Brown", date: Date.now() - 5 * 24 * 60 * 60 * 1000 }]
  },
  {
    id: 34,
    title: "Junior Cloud Engineer",
    company: "CloudSphere",
    location: "Mumbai",
    type: "Internship",
    category: "fresher",
    description: "Learn cloud technologies and assist in cloud deployment projects.",
    postedDate: Date.now() - 8 * 24 * 60 * 60 * 1000, // 8 days ago
    requiredSkills: ["AWS", "Azure", "Docker"],
    experienceRequired: { id: 23, years: 0 },
    comments: [{ id: 23, text: "Perfect for cloud computing beginners!", author: "Noah Martinez", date: Date.now() - 7 * 24 * 60 * 60 * 1000 }]
  },
  {
    id: 35,
    title: "Junior Backend Developer",
    company: "TechNova",
    location: "Chennai",
    type: "Full-time",
    category: "fresher",
    description: "Develop RESTful APIs and backend services using Node.js.",
    postedDate: Date.now() - 4 * 24 * 60 * 60 * 1000, // 4 days ago
    requiredSkills: ["Node.js", "Express.js", "MongoDB"],
    experienceRequired: { id: 24, years: 0 },
    comments: [{ id: 24, text: "Great start for backend developers!", author: "Emma Watson", date: Date.now() - 3 * 24 * 60 * 60 * 1000 }]
  },
  {
    id: 36,
    title: "Junior Mobile App Developer",
    company: "Appify Labs",
    location: "Delhi",
    type: "Full-time",
    category: "fresher",
    description: "Build and maintain mobile apps using Flutter and Dart.",
    postedDate: Date.now() - 9 * 24 * 60 * 60 * 1000, // 9 days ago
    requiredSkills: ["Flutter", "Dart", "Mobile Development"],
    experienceRequired: { id: 25, years: 0 },
    comments: [{ id: 25, text: "Exciting role for mobile developers!", author: "Lucas Taylor", date: Date.now() - 8 * 24 * 60 * 60 * 1000 }]
  },
  {
    id: 37,
    title: "Junior Data Analyst",
    company: "DataInsight Corp.",
    location: "Remote",
    type: "Full-time",
    category: "fresher",
    description: "Analyze datasets and create visualizations to support business decisions.",
    postedDate: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
    requiredSkills: ["Excel", "Power BI", "SQL"],
    experienceRequired: { id: 26, years: 0 },
    comments: [{ id: 26, text: "Perfect role for data enthusiasts!", author: "Charlotte White", date: Date.now() - 6 * 24 * 60 * 60 * 1000 }]
  },
  {
    id: 38,
    title: "Junior SEO Specialist",
    company: "SearchGrow",
    location: "Bangalore",
    type: "Internship",
    category: "fresher",
    description: "Optimize websites for search engines and improve rankings.",
    postedDate: Date.now() - 6 * 24 * 60 * 60 * 1000, // 6 days ago
    requiredSkills: ["SEO", "Google Analytics", "Keyword Research"],
    experienceRequired: { id: 27, years: 0 },
    comments: [{ id: 27, text: "Great start for SEO specialists!", author: "Amelia Johnson", date: Date.now() - 5 * 24 * 60 * 60 * 1000 }]
  },
  {
    id: 39,
    title: "Junior Embedded Systems Engineer",
    company: "EmbedTech",
    location: "Hyderabad",
    type: "Full-time",
    category: "fresher",
    description: "Work on embedded systems and IoT projects.",
    postedDate: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
    requiredSkills: ["C", "Microcontrollers", "IoT"],
    experienceRequired: { id: 28, years: 0 },
    comments: [{ id: 28, text: "Amazing role for embedded system enthusiasts!", author: "Ethan Davis", date: Date.now() - 2 * 24 * 60 * 60 * 1000 }]
  },
  {
    id: 40,
    title: "Junior Digital Marketer",
    company: "DigitalGrowth",
    location: "Pune",
    type: "Part-time",
    category: "fresher",
    description: "Assist in digital marketing campaigns and social media management.",
    postedDate: Date.now() - 4 * 24 * 60 * 60 * 1000, // 4 days ago
    requiredSkills: ["Social Media", "Content Marketing", "Google Ads"],
    experienceRequired: { id: 29, years: 0 },
    comments: [{ id: 29, text: "Ideal for aspiring digital marketers!", author: "Grace Lee", date: Date.now() - 3 * 24 * 60 * 60 * 1000 }]
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
            AI-Powered Job Portal...
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

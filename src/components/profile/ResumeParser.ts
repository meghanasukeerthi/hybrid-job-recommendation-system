import * as pdfjs from 'pdfjs-dist';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const parseResume = async (file: File) => {
  if (file.type === 'application/pdf') {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + ' ';
    }
    
    // Extract skills (common programming languages and technologies)
    const skills = [
      "JavaScript", "React", "TypeScript", "Node.js", "Python", "Java",
      "HTML", "CSS", "SQL", "AWS", "Docker", "Git", "Angular", "Vue",
      "C++", "C#", "Ruby", "PHP", "Swift", "Kotlin", "Spring Boot",
      "Hibernate", "MySQL", "Maven", "JUnit", "REST API"
    ].filter(skill => fullText.toLowerCase().includes(skill.toLowerCase()));

    // Extract years of experience
    const experienceMatch = fullText.match(/(\d+)\s*(?:years?|yrs?)\s+(?:of\s+)?experience/i);
    const experience = experienceMatch ? `${experienceMatch[1]} years of experience in software development` : "";

    // Extract education
    const educationKeywords = ["Bachelor", "Master", "PhD", "BSc", "MSc", "B.E.", "B.Tech"];
    const educationMatch = educationKeywords.find(edu => fullText.includes(edu));
    const education = educationMatch ? `${educationMatch}` : "Bachelor of Technology";

    // Extract email
    const emailMatch = fullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const email = emailMatch ? emailMatch[0] : "";

    // Extract name (basic approach - first line or first capitalized words)
    const nameMatch = fullText.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/m);
    const fullName = nameMatch ? nameMatch[1] : "";

    return {
      fullName,
      email,
      skills,
      experience,
      education,
      careerGoals: "To become an Associate Java Developer",
    };
  }
  throw new Error("Unsupported file format");
};
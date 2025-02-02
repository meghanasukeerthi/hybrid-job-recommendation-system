import { ResumeData } from "@/types/resume";

export const parseResume = async (file: File): Promise<ResumeData> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    console.log('Starting resume upload...', {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size
    });

    const response = await fetch('/resume/upload', {
      method: 'POST',
      body: formData,
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      if (response.status === 500) {
        throw new Error(
          'Cannot connect to the resume parsing service. Please ensure:\n' +
          '1. Your Spring backend server is running on http://localhost:8080\n' +
          '2. You have configured a valid Gemini API key in your Spring application\n' +
          '3. The /resume/upload endpoint is properly mapped in your Spring controller'
        );
      }
      throw new Error(`Upload failed (${response.status}): ${await response.text() || 'Unknown error occurred'}`);
    }

    const data = await response.json();
    console.log('Parsed resume data:', data);

    // Format experience array into a readable string
    const formattedExperience = data.experience
      .map((exp: Experience) => `${exp.jobTitle} at ${exp.company}${exp.duration ? ` (${exp.duration})` : ''}`)
      .join('\n');

    // Format education array into a readable string
    const formattedEducation = data.education
      .map((edu: Education) => `${edu.degree} from ${edu.institution} (${edu.year})`)
      .join('\n');

    return {
      fullName: data.fullName || '',
      email: data.email || '',
      skills: Array.isArray(data.skills) ? data.skills : [],
      experience: formattedExperience,
      education: formattedEducation,
      careerGoals: data.careerGoals || ''
    };

  } catch (error) {
    console.error('Resume parsing error:', error);
    if (error instanceof Error) {
      throw new Error(`Resume upload failed: ${error.message}`);
    }
    throw new Error('Failed to parse resume: Unknown error occurred');
  }
};
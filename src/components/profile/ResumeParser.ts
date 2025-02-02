import axios from 'axios';
import { ResumeData } from "@/types/resume";

export const parseResume = async (file: File): Promise<ResumeData> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    console.log('Starting resume upload...', {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      formData: Array.from(formData.entries())
    });

    const response = await axios.post('/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Response received:', response.data);
    
    if (!response.data) {
      throw new Error('No data received from server');
    }

    // Transform the data to match our ResumeData interface
    return {
      fullName: response.data.fullName || '',
      email: response.data.email || '',
      skills: Array.isArray(response.data.skills) ? response.data.skills : [],
      experience: Array.isArray(response.data.experience) ? response.data.experience.map((exp: any) => ({
        jobTitle: exp.jobTitle || '',
        company: exp.company || '',
        duration: exp.duration || ''
      })) : [],
      education: Array.isArray(response.data.education) ? response.data.education.map((edu: any) => ({
        degree: edu.degree || '',
        institution: edu.institution || '',
        year: edu.year || ''
      })) : [],
      careerGoals: response.data.careerGoals || ''
    };

  } catch (error) {
    console.error('Resume parsing error:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      throw new Error(error.response?.data?.message || 'Failed to upload resume');
    }
    throw error instanceof Error ? error : new Error('Failed to parse resume');
  }
};
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
      headers: {
        'Accept': 'application/json',
      }
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      if (response.status === 500) {
        throw new Error('The server encountered an error while processing your request. Please ensure the upload service is running and try again later.');
      }
      const errorText = await response.text();
      throw new Error(`Upload failed (${response.status}): ${errorText || 'Unknown error occurred'}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid response format from server. Expected JSON but received: ' + contentType);
    }

    const data = await response.json();
    console.log('Parsed resume data:', data);

    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format from server: Expected object but received: ' + typeof data);
    }

    return {
      fullName: data.fullName || '',
      email: data.email || '',
      skills: Array.isArray(data.skills) ? data.skills : [],
      experience: data.experience || '',
      education: data.education || '',
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
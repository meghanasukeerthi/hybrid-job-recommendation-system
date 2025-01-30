const API_BASE_URL = 'http://localhost:8080';

interface ResumeData {
  fullName: string;
  email: string;
  skills: string[];
  experience: string;
  education: string;
  careerGoals: string;
}

export const parseResume = async (file: File): Promise<ResumeData> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    console.log('Sending request to:', `${API_BASE_URL}/resume/upload`);
    
    const response = await fetch('/resume/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      console.error('Resume upload failed with status:', response.status);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error('Failed to parse resume. Please try again.');
    }

    const data = await response.json();
    console.log('Parsed response data:', data);

    if (!data || typeof data !== 'object') {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from server');
    }

    return {
      fullName: data.fullName || '',
      email: data.email || '',
      skills: Array.isArray(data.skills) ? data.skills : (data.skills || '').split(',').map((s: string) => s.trim()),
      experience: data.experience || '',
      education: data.education || '',
      careerGoals: data.careerGoals || ''
    };
  } catch (error) {
    console.error('Resume parsing error:', error);
    throw error;
  }
};
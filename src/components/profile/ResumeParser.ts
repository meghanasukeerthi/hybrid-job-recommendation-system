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
    
    const response = await fetch(`/resume/upload`, {
      method: 'POST',
      body: formData,
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resume upload error response:', errorText);
      throw new Error('Failed to parse resume. Please try again.');
    }

    const data = await response.json();
    console.log('Parsed response data:', data);

    // Ensure we have a valid ResumeData object
    if (!data || typeof data !== 'object') {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from server');
    }

    // Convert the response to our expected format
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
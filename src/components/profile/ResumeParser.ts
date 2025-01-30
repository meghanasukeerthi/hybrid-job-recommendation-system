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
    console.log('Starting resume upload...');
    console.log('File details:', {
      name: file.name,
      type: file.type,
      size: file.size
    });
    
    const response = await fetch('/resume/upload', {
      method: 'POST',
      body: formData,
    });

    console.log('Response received:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resume upload failed:', {
        status: response.status,
        statusText: response.statusText,
        errorText: errorText
      });
      throw new Error(`Failed to parse resume: ${response.status} ${errorText || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Successfully parsed resume data:', data);

    if (!data || typeof data !== 'object') {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from server');
    }

    // Ensure all required fields are present with fallbacks
    const parsedData: ResumeData = {
      fullName: data.fullName || '',
      email: data.email || '',
      skills: Array.isArray(data.skills) ? data.skills : (data.skills || '').split(',').map((s: string) => s.trim()),
      experience: data.experience || '',
      education: data.education || '',
      careerGoals: data.careerGoals || ''
    };

    console.log('Normalized resume data:', parsedData);
    return parsedData;

  } catch (error) {
    console.error('Resume parsing error:', error);
    throw error instanceof Error ? error : new Error('Failed to parse resume');
  }
};
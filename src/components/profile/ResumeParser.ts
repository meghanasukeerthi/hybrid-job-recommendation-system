const API_BASE_URL = 'http://localhost:8080';

export const parseResume = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}/resume/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to parse resume');
    }

    const data = await response.json();
    
    // Parse the response data into the expected format
    const parsedData = {
      fullName: data.fullName || '',
      email: data.email || '',
      skills: (data.skills || '').split(',').map((s: string) => s.trim()),
      experience: data.experience || '',
      education: data.education || '',
      careerGoals: data.careerGoals || ''
    };

    return parsedData;
  } catch (error) {
    console.error('Resume parsing error:', error);
    throw new Error('Failed to parse resume. Please try again.');
  }
};
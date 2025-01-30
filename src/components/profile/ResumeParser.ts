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
      console.error('Resume upload error:', errorText);
      throw new Error('Failed to parse resume. Please try again.');
    }

    // Try to parse the response as JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const data = await response.json();
      
      // Parse the response data into the expected format
      const parsedData = {
        fullName: data.fullName || '',
        email: data.email || '',
        skills: Array.isArray(data.skills) ? data.skills : (data.skills || '').split(',').map((s: string) => s.trim()),
        experience: data.experience || '',
        education: data.education || '',
        careerGoals: data.careerGoals || ''
      };

      return parsedData;
    } else {
      // If response is not JSON, handle it as text
      const textResponse = await response.text();
      console.error('Invalid response format:', textResponse);
      throw new Error('Invalid response format from server');
    }
  } catch (error) {
    console.error('Resume parsing error:', error);
    throw error;
  }
};
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

    // Get the response text
    const responseText = await response.text();
    
    try {
      // First try to parse as JSON in case the backend response format changes
      const jsonData = JSON.parse(responseText);
      return {
        fullName: jsonData.fullName || '',
        email: jsonData.email || '',
        skills: Array.isArray(jsonData.skills) ? jsonData.skills : (jsonData.skills || '').split(',').map((s: string) => s.trim()),
        experience: jsonData.experience || '',
        education: jsonData.education || '',
        careerGoals: jsonData.careerGoals || ''
      };
    } catch (e) {
      // If JSON parsing fails, treat it as a string response
      console.log('Parsing response as string:', responseText);
      
      // Try to extract information from the string response
      // This is a basic example - adjust based on your actual response format
      const lines = responseText.split('\n').filter(line => line.trim());
      
      return {
        fullName: lines[0] || '',
        email: lines.find(l => l.includes('@')) || '',
        skills: lines.find(l => l.toLowerCase().includes('skills'))?.split(':')[1]?.split(',').map(s => s.trim()) || [],
        experience: lines.find(l => l.toLowerCase().includes('experience'))?.split(':')[1] || '',
        education: lines.find(l => l.toLowerCase().includes('education'))?.split(':')[1] || '',
        careerGoals: lines.find(l => l.toLowerCase().includes('career'))?.split(':')[1] || ''
      };
    }
  } catch (error) {
    console.error('Resume parsing error:', error);
    throw error;
  }
};
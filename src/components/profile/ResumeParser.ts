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
      },
      credentials: 'include'
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    // Get the response text first for logging
    const responseText = await response.text();
    console.log('Raw response:', responseText);

    if (!response.ok) {
      console.error('Upload failed:', {
        status: response.status,
        statusText: response.statusText,
        responseText
      });
      
      if (response.status === 500) {
        throw new Error('Server error: The file could not be processed. Please try a different PDF file or contact support.');
      }
      
      throw new Error(responseText || 'Failed to upload resume');
    }

    // Try to parse the response text as JSON
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Parsed resume data:', data);
    } catch (error) {
      console.error('Failed to parse JSON response:', error);
      throw new Error('Invalid response format from server');
    }

    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format from server');
    }

    const parsedData: ResumeData = {
      fullName: data.fullName || '',
      email: data.email || '',
      skills: Array.isArray(data.skills) ? data.skills : (data.skills || '').split(',').map((s: string) => s.trim()),
      experience: data.experience || '',
      education: data.education || '',
      careerGoals: data.careerGoals || ''
    };

    return parsedData;

  } catch (error) {
    console.error('Resume parsing error:', error);
    throw error instanceof Error ? error : new Error('Failed to parse resume');
  }
};
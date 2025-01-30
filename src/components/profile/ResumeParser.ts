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
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      if (response.status === 500) {
        throw new Error('Server error: Please try again later');
      }
      
      throw new Error(errorText || 'Failed to upload resume');
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Invalid content type:', contentType);
      throw new Error('Invalid response format from server');
    }

    const data = await response.json();
    console.log('Parsed resume data:', data);

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
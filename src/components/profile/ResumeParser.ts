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

    const response = await fetch('/resume/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log('Response headers:', {
      contentType: response.headers.get('content-type'),
      status: response.status,
      statusText: response.statusText
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload failed:', {
        status: response.status,
        statusText: response.statusText,
        errorText,
        headers: Object.fromEntries(response.headers.entries())
      });
      throw new Error(`Upload failed (${response.status}): ${errorText || 'Unknown error occurred'}`);
    }

    const responseText = await response.text();
    console.log('Raw response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Parsed resume data:', data);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Raw response that failed to parse:', responseText);
      throw new Error('Failed to parse server response as JSON');
    }

    // Transform the data to match our ResumeData interface
    return {
      fullName: data.fullName || '',
      email: data.email || '',
      skills: Array.isArray(data.skills) ? data.skills : [],
      experience: Array.isArray(data.experience) ? data.experience.map((exp: any) => ({
        jobTitle: exp.jobTitle || '',
        company: exp.company || '',
        duration: exp.duration || ''
      })) : [],
      education: Array.isArray(data.education) ? data.education.map((edu: any) => ({
        degree: edu.degree || '',
        institution: edu.institution || '',
        year: edu.year || ''
      })) : [],
      careerGoals: data.careerGoals || ''
    };

  } catch (error) {
    console.error('Resume parsing error:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    throw error instanceof Error ? error : new Error('Failed to parse resume');
  }
};
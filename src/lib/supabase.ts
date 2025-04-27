import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks and type checking
const getEnvVar = (name: string, required: boolean = true): string => {
  // For client-side code, we need to use window.ENV or NEXT_PUBLIC_ prefix
  const value = typeof window !== 'undefined' 
    ? (window as any).ENV?.[name] 
    : process.env[name];

  if (!value && required) {
    if (typeof window !== 'undefined') {
      console.error(`Missing environment variable: ${name}`);
      return ''; // Return empty string instead of throwing in client
    }
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value || '';
};

// Get environment variables, allowing empty values in client
const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL', false);
const supabaseKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', false);
const supabaseServiceKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY', false);

// Only create clients if we have the required values
const hasRequiredVars = supabaseUrl && supabaseKey;

// Client for public operations
export const supabase = hasRequiredVars 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Admin client for storage operations (only in server context)
export const supabaseAdmin = hasRequiredVars && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

export async function uploadResume(file: File, userId: string) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not initialized. Check environment variables.');
  }

  try {
    const fileExt = file.name.split('.').pop();
    // Include userId in the path to comply with RLS policy
    const fileName = `${userId}/${Date.now()}-${file.name}`;
    
    // First, try to find and remove any existing resume for this user
    const { data: existingFiles } = await supabaseAdmin.storage
      .from('resumes')
      .list(userId);

    // Remove existing resumes for this user
    if (existingFiles?.length) {
      const { error: deleteError } = await supabaseAdmin.storage
        .from('resumes')
        .remove(existingFiles.map(f => `${userId}/${f.name}`));
      
      if (deleteError) {
        console.error('Error deleting existing resume:', deleteError);
        // Continue with upload even if delete fails
      }
    }

    // Check file size before upload (10MB limit)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > MAX_SIZE) {
      throw new Error(`File size exceeds 10MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Invalid file type. Allowed types: PDF, DOC, DOCX. Received: ${file.type}`);
    }

    // Upload new resume using admin client
    const { data, error: uploadError } = await supabaseAdmin.storage
      .from('resumes')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error details:', {
        message: uploadError.message,
        name: uploadError.name,
        error: uploadError
      });
      throw new Error(`Failed to upload resume: ${uploadError.message}`);
    }

    if (!data?.path) {
      throw new Error('Upload successful but file path not returned');
    }
    
    // Get public URL using admin client
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('resumes')
      .getPublicUrl(fileName);

    if (!publicUrl) {
      throw new Error('Failed to generate public URL for uploaded file');
    }

    return publicUrl;
  } catch (error) {
    console.error('Detailed upload error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}

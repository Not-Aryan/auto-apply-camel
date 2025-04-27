import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Read .env file manually
const envPath = join(process.cwd(), '.env');
const envContent = readFileSync(envPath, 'utf-8');
const envVars = Object.fromEntries(
  envContent
    .split('\n')
    .filter(line => line && !line.startsWith('#'))
    .map(line => {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=').replace(/^["']|["']$/g, ''); // Remove quotes
      return [key.trim(), value.trim()];
    })
);

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  if (!supabaseUrl) console.error('- NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseServiceKey) console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

console.log('Using URL:', supabaseUrl);

// Create client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupStorage() {
  try {
    console.log('Checking for existing buckets...');
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      process.exit(1);
    }
    
    const resumesBucketExists = buckets?.some(bucket => bucket.name === 'resumes');

    if (!resumesBucketExists) {
      console.log('Creating resumes bucket...');
      const { error: createError } = await supabase.storage.createBucket('resumes', {
        public: true,
        allowedMimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        fileSizeLimit: 10485760, // 10MB
      });
      
      if (createError) {
        console.error('Error creating bucket:', createError);
        process.exit(1);
      }
      
      console.log('Resumes bucket created successfully!');

      console.log('\nIMPORTANT: Please set up the following storage policies in your Supabase dashboard:');
      console.log('\n1. Policy for authenticated uploads (INSERT):');
      console.log('Name: authenticated_upload');
      console.log('Definition:');
      console.log(`((role() = 'authenticated'::text) AND (bucket_id = 'resumes'::text) AND (auth.uid()::text = (storage.foldername(name))[1]))`);
      
      console.log('\n2. Policy for public reads (SELECT):');
      console.log('Name: public_read');
      console.log('Definition: true');
      
      console.log('\n3. Policy for authenticated updates (UPDATE):');
      console.log('Name: authenticated_update');
      console.log('Definition:');
      console.log(`((role() = 'authenticated'::text) AND (bucket_id = 'resumes'::text) AND (auth.uid()::text = (storage.foldername(name))[1]))`);
      
      console.log('\n4. Policy for authenticated deletes (DELETE):');
      console.log('Name: authenticated_delete');
      console.log('Definition:');
      console.log(`((role() = 'authenticated'::text) AND (bucket_id = 'resumes'::text) AND (auth.uid()::text = (storage.foldername(name))[1]))`);
    } else {
      console.log('Resumes bucket already exists.');
    }

    console.log('\nStorage setup completed!');
  } catch (error) {
    console.error('Error setting up storage:', error);
    process.exit(1);
  }
}

setupStorage();

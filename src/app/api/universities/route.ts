import { NextResponse } from 'next/server';
import axios from 'axios';

const COLLEGE_SCORECARD_API = 'https://api.data.gov/ed/collegescorecard/v1/schools';
const HIPO_LABS_API = 'http://universities.hipolabs.com/search';

// Hardcoded MIT logo
const MIT_LOGO = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/1200px-MIT_logo.svg.png';

interface University {
  name: string;
  country: string;
  state?: string;
  city?: string;
  website?: string;
  logo?: string;
}

function extractDomainFromWebsite(website: string): string {
  try {
    const url = new URL(website.startsWith('http') ? website : `https://${website}`);
    return url.hostname.replace('www.', '');
  } catch (e) {
    return website.replace('www.', '');
  }
}

function getLogo(domain: string, universityName: string): string {
  // Special case for MIT
  if (domain === 'mit.edu' || universityName.toLowerCase().includes('massachusetts institute of technology')) {
    return MIT_LOGO;
  }
  return `https://logo.clearbit.com/${domain}`;
}

async function searchUSUniversities(query: string): Promise<University[]> {
  try {
    const response = await axios.get(COLLEGE_SCORECARD_API, {
      params: {
        'school.name': query,
        fields: 'school.name,school.city,school.state,school.school_url',
        api_key: process.env.COLLEGE_SCORECARD_API_KEY || 'XBIYQmqEuWZnGI3B8z3o6cfe4JCx3eR7dwGBGsP1',
        per_page: 10
      }
    });

    return response.data.results.map((result: any) => {
      const website = result.school.school_url;
      const domain = website ? extractDomainFromWebsite(website) : null;
      
      return {
        name: result.school.name,
        country: 'United States',
        state: result.school.state,
        city: result.school.city,
        website: website,
        logo: domain ? getLogo(domain, result.school.name) : undefined
      };
    });
  } catch (error) {
    console.error('Error fetching US universities:', error);
    return [];
  }
}

async function searchInternationalUniversities(query: string): Promise<University[]> {
  try {
    const response = await axios.get(HIPO_LABS_API, {
      params: { name: query }
    });

    return response.data.map((result: any) => {
      const website = result.web_pages?.[0];
      const domain = website ? extractDomainFromWebsite(website) : null;

      return {
        name: result.name,
        country: result.country,
        state: result.state_province,
        website: website,
        logo: domain ? getLogo(domain, result.name) : undefined
      };
    });
  } catch (error) {
    console.error('Error fetching international universities:', error);
    return [];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const [usResults, internationalResults] = await Promise.all([
      searchUSUniversities(query),
      searchInternationalUniversities(query)
    ]);

    // Combine and deduplicate results based on university names
    const uniqueResults = new Map<string, University>();
    
    [...usResults, ...internationalResults].forEach(uni => {
      if (!uniqueResults.has(uni.name)) {
        uniqueResults.set(uni.name, uni);
      }
    });

    return NextResponse.json({ results: Array.from(uniqueResults.values()) });
  } catch (error) {
    console.error('Error searching universities:', error);
    return NextResponse.json({ results: [] });
  }
}

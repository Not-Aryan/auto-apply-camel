import axios from 'axios';

const COLLEGE_SCORECARD_API = 'https://api.data.gov/ed/collegescorecard/v1/schools';
const HIPO_LABS_API = 'http://universities.hipolabs.com/search';

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

function getLogo(domain: string): string {
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
        logo: domain ? getLogo(domain) : undefined
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
        logo: domain ? getLogo(domain) : undefined
      };
    });
  } catch (error) {
    console.error('Error fetching international universities:', error);
    return [];
  }
}

interface University {
  name: string;
  country: string;
  state?: string;
  city?: string;
  website?: string;
  logo?: string;
}

export async function searchUniversities(query: string): Promise<University[]> {
  if (!query || query.length < 2) return [];

  try {
    const response = await fetch(`/api/universities?query=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error searching universities:', error);
    return [];
  }
}

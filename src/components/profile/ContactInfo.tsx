import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { Card } from "@/components/ui/card";

interface ContactInfoProps {
  email?: string;
  phone?: string;
  github?: string;
  linkedin?: string;
  resume?: string;
  portfolio?: string;
}

export function ContactInfo({
  email,
  phone,
  github,
  linkedin,
  resume,
  portfolio,
}: ContactInfoProps) {
  return (
    <div className="space-y-3">
      {email && (
        <div className="flex items-center gap-2 text-gray-600">
          <EnvelopeIcon className="h-4 w-4" />
          <span className="text-base">{email}</span>
        </div>
      )}
      {phone && (
        <div className="flex items-center gap-2 text-gray-600">
          <PhoneIcon className="h-4 w-4" />
          <span className="text-base">{phone}</span>
        </div>
      )}
      {linkedin && (
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-base"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
          LinkedIn
        </a>
      )}
      {github && (
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-800 hover:text-gray-600 text-base"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub
        </a>
      )}
      {resume && (
        <a
          href={resume}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-800 hover:text-gray-600 text-base"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM6 4h7l5 5v11H6V4zm2 8h8v2H8v-2zm0 4h8v2H8v-2z"/>
          </svg>
          Resume
        </a>
      )}
      {portfolio && (
        <a
          href={portfolio}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-purple-600 hover:text-purple-800 text-base"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          Portfolio
        </a>
      )}
    </div>
  );
}

export type Status = "R" | "CF" | "S" | "RM" | "NA";

export type Company = {
  id: string;
  name: string;
  jobTitle: string;
  jobUrl: string;
  status: Status;
  interview?: string;
  accountOwner?: {
    name: string;
    avatarUrl: string;
  };
  lastUpdate: string;
  tasks: {
    id: string;
    name: string;
    color: string;
  }[];
  applicationStatus: "Applied" | "Applying" | "Queued";
};

export type MockUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profile: {
    phoneNumber: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    linkedinUrl: string;
    githubUrl: string;
    portfolioUrl: string;
    resumeUrl: string;
    education: {
      university: string;
      degree: string;
      field: string;
      gpa: number;
      startDate: string;
      endDate: string;
      isCurrently: boolean;
      location: string;
    }[];
    experiences: {
      company: string;
      position: string;
      type: string;
      startDate: string;
      endDate: string;
      location: string;
      isCurrently: boolean;
      description: string;
      achievements: string;
      technologies: string[];
    }[];
    projects: {
      name: string;
      description: string;
      url: string;
      githubUrl: string;
      technologies: string[];
      startDate: string;
      endDate: string;
      isOngoing: boolean;
    }[];
    skills: {
      name: string;
      proficiency: string;
      category: string;
    }[];
  };
};

export const mockUsers: MockUser[] = [
  {
    id: "user_2Qe1qXe1qXe1qXe1qXe1qXe1qXe1",
    email: "john.doe@example.com",
    firstName: "John",
    lastName: "Doe",
    profile: {
      phoneNumber: "555-123-4567",
      address: "123 Main St",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      zipCode: "94105",
      linkedinUrl: "https://linkedin.com/in/johndoe",
      githubUrl: "https://github.com/johndoe",
      portfolioUrl: "https://johndoe.com",
      resumeUrl: "https://storage.example.com/resumes/john-doe.pdf",
      education: [
        {
          university: "Stanford University",
          degree: "Bachelor of Science",
          field: "Computer Science",
          gpa: 3.8,
          startDate: "2018-09-01",
          endDate: "2022-06-01",
          isCurrently: false,
          location: "Stanford, CA"
        }
      ],
      experiences: [
        {
          company: "Tech Corp",
          position: "Software Engineer",
          type: "Full-time",
          startDate: "2022-07-01",
          endDate: "2023-12-31",
          location: "San Francisco, CA",
          isCurrently: false,
          description: "Worked on developing scalable web applications",
          achievements: "Led a team of 5 developers on a major feature release",
          technologies: ["React", "Node.js", "TypeScript", "AWS"]
        }
      ],
      projects: [
        {
          name: "E-commerce Platform",
          description: "A full-stack e-commerce platform with real-time inventory management",
          url: "https://ecommerce.johndoe.com",
          githubUrl: "https://github.com/johndoe/ecommerce",
          technologies: ["React", "Node.js", "MongoDB"],
          startDate: "2021-01-01",
          endDate: "2021-06-01",
          isOngoing: false
        }
      ],
      skills: [
        {
          name: "JavaScript",
          proficiency: "Expert",
          category: "Programming Language"
        },
        {
          name: "React",
          proficiency: "Advanced",
          category: "Framework"
        }
      ]
    }
  }
];

export const mockData: Company[] = [
  {
    id: "19",
    name: "Othello",
    jobTitle: "Full Stack Engineer",
    jobUrl: "",
    status: "R",
    interview: "Not Scheduled",
    accountOwner: {
      name: "",
      avatarUrl: "",
    },
    lastUpdate: "1 hour ago",
    tasks: [
      { id: "t1", name: "Schedule Final", color: "green" },
      { id: "t2", name: "System Design Prep", color: "red" },
    ],
    applicationStatus: "Queued",
  },
  {
    id: "2",
    name: "Hitcraft",
    jobTitle: "Full Stack Engineer",
    jobUrl: "https://boards.greenhouse.io/rippling/jobs/4489678005",
    status: "RM",
    lastUpdate: "3 hours ago",
    tasks: [{ id: "t3", name: "Cold Email Recruiter", color: "blue" }],
    applicationStatus: "Applied",
  },
  {
    id: "3",
    name: "Robotic Imaging",
    jobTitle: "SWE Intern Intern",
    jobUrl: "https://boards.greenhouse.io/scaleai/jobs/7575557002",
    status: "RM",
    interview: "Not scheduled",
    accountOwner: {
      name: "",
      avatarUrl: "",
    },
    lastUpdate: "1 day ago",
    tasks: [
      { id: "t4", name: "Take OA", color: "green" },
      { id: "t5", name: "Technical Screen", color: "red" },
    ],
    applicationStatus: "Applied",
  },
  {
    id: "4",
    name: "Synthetic Teams",
    jobTitle: "Vibe Coder",
    jobUrl: "",
    status: "RM",
    lastUpdate: "2 days ago",
    tasks: [],
    applicationStatus: "Applied",
  },
  {
    id: "5",
    name: "Ropes",
    jobTitle: "Founding Engineer",
    jobUrl: "https://boards.greenhouse.io/databricks/jobs/5232157004",
    status: "CF",
    interview: "Not scheduled",
    accountOwner: {
      name: "",
      avatarUrl: "",
    },
    lastUpdate: "4 days ago",
    tasks: [],
    applicationStatus: "Applying",
  },
  {
    id: "6",
    name: "Haize Labs",
    jobTitle: "Research Engineer",
    jobUrl: "https://boards.greenhouse.io/plaid/jobs/4489678005",
    status: "CF",
    lastUpdate: "5 days ago",
    tasks: [],
    applicationStatus: "Applying",
  },
  {
    id: "7",
    name: "Anvara",
    jobTitle: "Full Stack Engineer",
    jobUrl: "https://boards.greenhouse.io/figma/jobs/7575557002",
    status: "CF",
    accountOwner: {
      name: "",
      avatarUrl: "",
    },
    lastUpdate: "1 week ago",
    tasks: [],
    applicationStatus: "Applying",
  },
  {
    id: "8",
    name: "Vect",
    jobTitle: "Full Stack Engineer",
    jobUrl: "",
    status: "NA",
    lastUpdate: "1 week ago",
    tasks: [],
    applicationStatus: "Queued",
  },
  {
    id: "9",
    name: "Exodigo",
    jobTitle: "Algorithm Developer",
    jobUrl: "https://boards.greenhouse.io/retool/jobs/5232157004",
    status: "NA",
    interview: "Not scheduled",
    accountOwner: {
      name: "",
      avatarUrl: "",
    },
    lastUpdate: "2 weeks ago",
    tasks: [],
    applicationStatus: "Queued",
  },
  {
    id: "10",
    name: "Kisho",
    jobTitle: "Software Engineer",
    jobUrl: "https://boards.greenhouse.io/openai/jobs/4489678005",
    status: "NA",
    lastUpdate: "2 weeks ago",
    tasks: [],
    applicationStatus: "Queued",
  }
];

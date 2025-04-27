export type Status = "R" | "CF" | "S" | "RM";

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
  idealCandidate: string;
  tasks: {
    id: string;
    name: string;
    color: string;
  }[];
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
    id: "1",
    name: "Figma",
    jobTitle: "SWE Intern",
    jobUrl: "https://job-boards.greenhouse.io/figma/jobs/5232157004",
    status: "R",
    interview: "Mar 20, 2024",
    accountOwner: {
      name: "Sarah Chen",
      avatarUrl: "/avatars/sarah.jpg",
    },
    lastUpdate: "1 hour ago",
    idealCandidate: "Looking for creative problem-solvers with strong front-end development skills. Ideal candidates should have experience with modern web technologies, UI/UX design principles, and collaborative design tools. Knowledge of WebGL, Canvas API, or real-time collaboration systems is a plus.",
    tasks: [
      { id: "t1", name: "Schedule Final", color: "green" },
      { id: "t2", name: "System Design Prep", color: "red" },
    ],
  },
  {
    id: "2",
    name: "Rippling",
    jobTitle: "SWE Intern",
    jobUrl: "https://boards.greenhouse.io/rippling/jobs/4489678005",
    status: "S",
    lastUpdate: "3 hours ago",
    idealCandidate: "Seeking candidates with strong full-stack development experience and interest in enterprise software. Should have experience with modern JavaScript frameworks, API design, and database systems. Knowledge of HR tech, payroll systems, or enterprise software is valuable.",
    tasks: [{ id: "t3", name: "Cold Email Recruiter", color: "blue" }],
  },
  {
    id: "3",
    name: "Scale AI",
    jobTitle: "SWE Intern",
    jobUrl: "https://boards.greenhouse.io/scaleai/jobs/7575557002",
    status: "CF",
    interview: "Mar 25, 2024",
    accountOwner: {
      name: "Mike Ross",
      avatarUrl: "/avatars/mike.jpg",
    },
    lastUpdate: "1 day ago",
    idealCandidate: "Looking for candidates with strong ML/AI background and excellent programming skills. Should have experience with Python, distributed systems, and data processing. Knowledge of computer vision, NLP, or AI/ML frameworks is highly desired.",
    tasks: [
      { id: "t4", name: "Take OA", color: "yellow" },
      { id: "t5", name: "Technical Screen", color: "red" },
    ],
  },
  {
    id: "4",
    name: "Anthropic",
    jobTitle: "SWE Intern",
    jobUrl: "",
    status: "RM",
    lastUpdate: "2 days ago",
    idealCandidate: "Seeking candidates with strong interest in AI safety and ethics. Should have experience with large language models, distributed systems, and Python. Background in mathematics, computational linguistics, or philosophy is valuable.",
    tasks: [
      { id: "t6", name: "Follow Up Email", color: "blue" },
      { id: "t7", name: "Submit Application", color: "purple" },
    ],
  },
  {
    id: "5",
    name: "Databricks",
    jobTitle: "SWE Intern",
    jobUrl: "https://boards.greenhouse.io/databricks/jobs/5232157004",
    status: "R",
    interview: "Mar 18, 2024",
    accountOwner: {
      name: "Lisa Wang",
      avatarUrl: "/avatars/lisa.jpg",
    },
    lastUpdate: "4 days ago",
    idealCandidate: "Looking for candidates with strong distributed systems and big data experience. Should have knowledge of Spark, Hadoop ecosystem, and cloud platforms. Experience with data processing, analytics, or machine learning is highly valued.",
    tasks: [
      { id: "t8", name: "Behavioral Prep", color: "orange" },
      { id: "t9", name: "Final Round", color: "green" },
    ],
  },
  {
    id: "6",
    name: "Plaid",
    jobTitle: "SWE Intern",
    jobUrl: "https://boards.greenhouse.io/plaid/jobs/4489678005",
    status: "S",
    lastUpdate: "5 days ago",
    idealCandidate: "Seeking candidates with interest in fintech and API development. Strong understanding of security, authentication, and RESTful services required. Knowledge of financial systems and banking technology is a plus.",
    tasks: [
      { id: "t10", name: "Take OA", color: "yellow" },
      { id: "t11", name: "Submit Application", color: "blue" },
    ],
  },
  {
    id: "7",
    name: "Figma",
    jobTitle: "SWE Intern",
    jobUrl: "https://boards.greenhouse.io/figma/jobs/7575557002",
    status: "CF",
    accountOwner: {
      name: "Dylan Field",
      avatarUrl: "/avatars/dylan.jpg",
    },
    lastUpdate: "1 week ago",
    idealCandidate: "Looking for creative problem-solvers with strong front-end development skills. Ideal candidates should have experience with modern web technologies, UI/UX design principles, and collaborative design tools. Knowledge of WebGL, Canvas API, or real-time collaboration systems is a plus.",
    tasks: [
      { id: "t12", name: "Technical Screen", color: "red" },
      { id: "t13", name: "LC Prep", color: "orange" },
    ],
  },
  {
    id: "8",
    name: "Notion",
    jobTitle: "SWE Intern",
    jobUrl: "",
    status: "RM",
    lastUpdate: "1 week ago",
    idealCandidate: "Seeking candidates with full-stack development experience and passion for productivity tools. Should have experience with React, real-time collaboration, and database design. Interest in knowledge management and document editing systems is valuable.",
    tasks: [{ id: "t14", name: "Cold Email Recruiter", color: "blue" }],
  },
  {
    id: "9",
    name: "Retool",
    jobTitle: "SWE Intern",
    jobUrl: "https://boards.greenhouse.io/retool/jobs/5232157004",
    status: "R",
    interview: "Mar 22, 2024",
    accountOwner: {
      name: "David Hsu",
      avatarUrl: "/avatars/david.jpg",
    },
    lastUpdate: "2 weeks ago",
    idealCandidate: "Looking for candidates with experience in internal tools and enterprise software development. Strong understanding of APIs, databases, and front-end frameworks required. Experience with drag-and-drop interfaces or low-code platforms is a plus.",
    tasks: [
      { id: "t15", name: "Final Round", color: "red" },
      { id: "t16", name: "System Design Prep", color: "orange" },
    ],
  },
  {
    id: "10",
    name: "OpenAI",
    jobTitle: "SWE Intern",
    jobUrl: "https://boards.greenhouse.io/openai/jobs/4489678005",
    status: "S",
    lastUpdate: "2 weeks ago",
    idealCandidate: "Seeking candidates with strong ML/AI background and interest in AGI development. Should have experience with PyTorch, transformers, and large-scale distributed systems. Background in mathematics, computational linguistics, or cognitive science is valuable.",
    tasks: [
      { id: "t17", name: "Submit Application", color: "blue" },
      { id: "t18", name: "Follow Up Email", color: "gray" },
    ],
  },
  {
    id: "11",
    name: "Snowflake",
    jobTitle: "SWE Intern",
    jobUrl: "https://boards.greenhouse.io/snowflake/jobs/7575557002",
    status: "CF",
    interview: "Mar 28, 2024",
    accountOwner: {
      name: "Emily Zhang",
      avatarUrl: "/avatars/emily.jpg",
    },
    lastUpdate: "2 weeks ago",
    idealCandidate: "Looking for candidates with strong distributed systems and big data experience. Should have knowledge of Spark, Hadoop ecosystem, and cloud platforms. Experience with data processing, analytics, or machine learning is highly valued.",
    tasks: [
      { id: "t19", name: "Technical Screen", color: "red" },
      { id: "t20", name: "Behavioral Prep", color: "green" },
    ],
  },
  {
    id: "12",
    name: "Uber",
    jobTitle: "SWE Intern",
    jobUrl: "https://boards.greenhouse.io/uber/jobs/5232157004",
    status: "R",
    interview: "Mar 21, 2024",
    accountOwner: {
      name: "John Kim",
      avatarUrl: "/avatars/john.jpg",
    },
    lastUpdate: "2 weeks ago",
    idealCandidate: "Looking for candidates with experience in transportation and logistics. Should have knowledge of routing algorithms, vehicle tracking systems, and customer service. Experience with large-scale systems and urban planning is valuable.",
    tasks: [
      { id: "t21", name: "Final Round", color: "red" },
      { id: "t22", name: "Team Matching", color: "purple" },
    ],
  },
  {
    id: "13",
    name: "Roblox",
    jobTitle: "SWE Intern",
    jobUrl: "",
    status: "RM",
    lastUpdate: "3 weeks ago",
    idealCandidate: "Looking for candidates with experience in game development and user experience design. Should have knowledge of game engines, 3D modeling, and interactive design. Experience with multiplayer systems or social platforms is valuable.",
    tasks: [
      { id: "t23", name: "Submit Application", color: "blue" },
      { id: "t24", name: "Cold Email Recruiter", color: "gray" },
    ],
  },
  {
    id: "14",
    name: "Discord",
    jobTitle: "SWE Intern",
    jobUrl: "https://boards.greenhouse.io/discord/jobs/4489678005",
    status: "S",
    lastUpdate: "3 weeks ago",
    idealCandidate: "Looking for candidates with experience in communication and social networking. Should have knowledge of real-time communication systems, API design, and database systems. Experience with large-scale systems and user-generated content is valuable.",
    tasks: [
      { id: "t25", name: "Take OA", color: "yellow" },
      { id: "t26", name: "LC Prep", color: "orange" },
    ],
  },
  {
    id: "15",
    name: "Twitch",
    jobTitle: "SWE Intern",
    jobUrl: "https://boards.greenhouse.io/twitch/jobs/7575557002",
    status: "CF",
    accountOwner: {
      name: "Alex Chen",
      avatarUrl: "/avatars/alex.jpg",
    },
    lastUpdate: "3 weeks ago",
    idealCandidate: "Looking for candidates with experience in streaming and video content creation. Should have knowledge of streaming platforms, video editing, and social media marketing. Experience with live streaming or content moderation is valuable.",
    tasks: [
      { id: "t27", name: "Technical Screen", color: "red" },
      { id: "t28", name: "Schedule Call", color: "blue" },
    ],
  },
  {
    id: "16",
    name: "Robinhood",
    jobTitle: "SWE Intern",
    jobUrl: "",
    status: "RM",
    lastUpdate: "3 weeks ago",
    idealCandidate: "Looking for candidates with experience in financial technology and API development. Should have knowledge of financial markets, algorithmic trading, and security protocols. Experience with large-scale systems and financial analytics is valuable.",
    tasks: [
      { id: "t29", name: "Submit Application", color: "blue" },
      { id: "t30", name: "Follow Up Email", color: "gray" },
    ],
  },
  {
    id: "17",
    name: "Coinbase",
    jobTitle: "SWE Intern",
    jobUrl: "https://boards.greenhouse.io/coinbase/jobs/5232157004",
    status: "S",
    lastUpdate: "4 weeks ago",
    idealCandidate: "Looking for candidates with experience in cryptocurrency and blockchain technology. Should have knowledge of blockchain architecture, smart contracts, and decentralized systems. Experience with large-scale systems and financial security is valuable.",
    tasks: [
      { id: "t31", name: "Take OA", color: "yellow" },
      { id: "t32", name: "Complete Survey", color: "purple" },
    ],
  },
  {
    id: "18",
    name: "Palantir",
    jobTitle: "SWE Intern",
    jobUrl: "https://boards.greenhouse.io/palantir/jobs/4489678005",
    status: "R",
    interview: "Mar 27, 2024",
    accountOwner: {
      name: "Tom Wilson",
      avatarUrl: "/avatars/tom.jpg",
    },
    lastUpdate: "4 weeks ago",
    idealCandidate: "Looking for candidates with experience in data analysis and machine learning. Should have knowledge of large-scale data processing, statistical modeling, and data visualization. Experience with large-scale systems and data security is valuable.",
    tasks: [
      { id: "t33", name: "Final Round", color: "red" },
      { id: "t34", name: "System Design Prep", color: "orange" },
    ],
  },
  {
    id: "19",
    name: "DoorDash",
    jobTitle: "SWE Intern",
    jobUrl: "https://boards.greenhouse.io/doordash/jobs/7575557002",
    status: "CF",
    lastUpdate: "1 month ago",
    idealCandidate: "Looking for candidates with experience in food delivery and logistics. Should have knowledge of routing algorithms, vehicle tracking systems, and customer service. Experience with large-scale systems and urban planning is valuable.",
    tasks: [
      { id: "t35", name: "Take OA", color: "yellow" },
      { id: "t36", name: "LC Prep", color: "orange" },
    ],
  },
  {
    id: "20",
    name: "Airbnb",
    jobTitle: "SWE Intern",
    jobUrl: "https://boards.greenhouse.io/airbnb/jobs/5232157004",
    status: "R",
    interview: "Mar 19, 2024",
    accountOwner: {
      name: "Rachel Lee",
      avatarUrl: "/avatars/rachel.jpg",
    },
    lastUpdate: "1 month ago",
    idealCandidate: "Looking for candidates with experience in hospitality and customer service. Should have knowledge of reservation systems, booking platforms, and guest experience. Experience with large-scale systems and urban planning is valuable.",
    tasks: [
      { id: "t37", name: "Final Round", color: "red" },
      { id: "t38", name: "Background Check", color: "green" },
    ],
  },
  {
    id: "21",
    name: "Adobe",
    jobTitle: "SWE Intern",
    jobUrl: "",
    status: "RM",
    lastUpdate: "1 month ago",
    idealCandidate: "Looking for candidates with experience in creative design and user experience. Should have knowledge of design tools, UI/UX principles, and creative collaboration. Experience with large-scale systems and creative security is valuable.",
    tasks: [
      { id: "t39", name: "Submit Application", color: "blue" },
      { id: "t40", name: "Cold Email Recruiter", color: "gray" },
    ],
  },
  {
    id: "22",
    name: "Atlassian",
    jobTitle: "SWE Intern",
    jobUrl: "https://boards.greenhouse.io/atlassian/jobs/4489678005",
    status: "S",
    lastUpdate: "1 month ago",
    idealCandidate: "Looking for candidates with experience in software development and project management. Should have knowledge of agile methodologies, software architecture, and team collaboration. Experience with large-scale systems and project security is valuable.",
    tasks: [
      { id: "t41", name: "Take OA", color: "yellow" },
      { id: "t42", name: "Follow Up Email", color: "gray" },
    ],
  },
];

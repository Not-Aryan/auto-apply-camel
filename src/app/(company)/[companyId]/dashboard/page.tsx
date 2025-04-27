"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { 
  ChevronRightIcon, 
  ShareIcon, 
  SearchIcon, 
  ChevronDownIcon, 
  ArrowRightIcon,
  PlusIcon,
  InfoIcon,
  ArrowDownUpIcon,
  ListFilterIcon,
  CheckIcon,
  XIcon
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { EvaluationDialog } from "@/components/company/evaluation-dialog";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

// Define candidate type
interface Candidate {
  id: string;
  name: string;
  email: string;
  status: string;
  resumeUrl: string;
}

// Raw CSV data (replace with actual data loading if needed)
const csvData = `Timestamp,Email?,Name,Resume,What are you building?,Are you willing to be a dealer? (Free Admission and a High Quality Hoodie!),Anything else?,Column 8
4/2/2025 9:13:48,lerebo@mit.edu,Laura Lerebours ,https://drive.google.com/open?id=1OW9gX9M3Bsc4jSOi_y9mfxFklz0nTxBE,A dating app that connects people based on the activity they want to go to instead of who they are as people ,Yes ,Nope,
4/2/2025 9:23:44,chom38@mit.edu,Christopher Hom,https://drive.google.com/open?id=1J6OoJVtZw8sWBI-DQBW9cwQ93clBo29d,Research and Development in Fabric and Homecare at P&G for Summer 2025 to get insight into large scale consumer products before trying to build something,,,,
4/2/2025 9:25:30,wyyang@mit.edu,William Yang,https://drive.google.com/open?id=18IR619jxXAdbrCBWK_voEDOw8TAdBiL6,"NeuroSync AI is building an intelligent co-pilot for executive decision-making, combining real-time emotional signal processing with strategic simulation models to enhance high-stakes business negotiations. Our proprietary AI analyzes micro-expressions, speech patterns, and biometric cues to recommend optimal moves in both boardroom deals and investor conversations. Think of it as intuition, quantified.",No,,
4/2/2025 11:14:47,amyzy675@mit.edu,Ziyi Zhao,https://drive.google.com/open?id=1Wf9HNJmKmXIcSUkIiaV2xMNJX976WZGo,Energy Beverage Vending Machine for Athletes,Yes,,
4/2/2025 11:15:05,aaronkk@mit.edu,Aaron Kim,https://drive.google.com/open?id=1ORDB-1q3heYzikKFLGOhjI7X4kxRM-_0,"One of the projects that I am building is statistical modeling of Baseball statistics. After the money ball revolution, modern baseball utilizes a lot of science, especially data science. However, there are lots of statistics that are still extremely subjective based on each model. For example, win above replacement, also known as WAR, really differs on the weight of each play. By optimizing through a large dataset of baseball starting from the 1900s, I am trying to optimize these sabermetrics in a more favorable method for players and fans. ",Yes,,
4/2/2025 11:34:39,spelk28@mit.edu,Kristof Spellen,https://drive.google.com/open?id=1G1A1eAzRTx_1mpbBAlw4c5on01SZYYI6,"I am building a quant firm with some of my best friends called called ""Chelsea Quant Fund."" We are in the early developmental stages currently, focusing our trading strategies around statistical arbitrage. ",Yes,I would love to network and meet people deeply invested in quant to develop meaningful connections and possibly learn valuable knowledge. ,
4/2/2025 11:59:24,pyleang@mit.edu,Priscilla Leang,https://drive.google.com/open?id=1p5iLxNkF1FPkaWVKm2DFFA9vWYcpaihN,fencing shoe company! also building VLM for content creators on sice,,,,
4/2/2025 12:34:00,jorgevas@mit.edu,Jorge Vasquez,https://drive.google.com/open?id=1dCWUCjYrq6DteD1u_-kiiLjefw584lLg,N/A,Yes,"Although not currently a founder, I'm interested in the start-up process and would love the opportunity to network.",
4/2/2025 13:43:17,achej@mit.edu,Aashrith Chejerla,https://drive.google.com/open?id=1anbI9WR3_Enxesw9JV5gohUo6ekAesVC,"Securitization framework/protocol for Decentralized AI. Entering the age of a truly decentralized ml, with blockchain like training tendencies, robust networks/protocols are needed to protect entities from false data/whitenoise/malicious content/etc. That's what I'm building.",Yea,,
4/2/2025 13:47:09,adamg15@mit.edu,Adam,https://drive.google.com/open?id=1cjfMiqwR4MZhEFE7AH2E2T46gFYjQ4WX,A company that creates more flavorful and longer lasting gum using food science!,Sure!,,
4/2/2025 13:52:32,jzflint@mit.edu,Jeremy Flint,https://drive.google.com/open?id=13DbxIISpEyX-_FmWSj0xTtL5KJ9dgmNq,AI-Powered Skincare App,,,,
4/2/2025 15:34:49,lynnye27@mit.edu,Lynn Ye,https://drive.google.com/open?id=1u6hpvoh_DEbUSwXWwxTp4iPuMN6LELHt,I am interested in poker and quant!,No,,
4/2/2025 16:08:51,jmlaw@mit.edu,Jennifer Lawrence,https://drive.google.com/open?id=1pMTjBLx8VmPeWixZD1AWF8Pd80Qo6e7q,"I'm interested in working with large-scale distributed systems, as well as optimizing the way we think about software design. In the past, I've worked on everything ranging from full-stack SRE tools to automating distributed financial processes to working on git for geometries. Currently, I'm investing alternative approaches to software design and how to synergize programming processes with AI tools.",Yes if not playing,,
4/2/2025 16:55:50,laurayz@mit.edu,Laura Zhang,https://drive.google.com/open?id=1e6shiDs9JKMxK3QHAFx6O0vyuBMedWDv,Personal content creation brand + UGC,,,,
4/2/2025 17:14:23,spmh@mit.edu,Steven Henry,https://drive.google.com/open?id=11Un-W8g8V8al_sGmIvOtcFSWrcFqObcE,"Campus Cart - an all in one marketplace for students to securely and conveniently transact with other students. Furthermore, I'm very interested in the quant industry so, I'm working on a few projects in this space - trading and arbitrage.","No, I'm not the best at it shuffling","Poker is very interesting to me and the more I play, the more I learn. So, competing in this tournament will be super fun!",
4/2/2025 18:09:48,dyao@mit.edu,Darren Yao,https://drive.google.com/open?id=1mR0nxki5scGlEWCNzVNwtbFYr87i9k4j,,"yes, i sometimes deal for home games",,,
4/2/2025 18:31:55,nkim4724@mit.edu,Nathan Kim,https://drive.google.com/open?id=1fYz4bPCmgQsgWC-EtqPM33eLNDbcHLP4,"A technology-driven M&A investment bank startup out of MIT developing the automated process for generating Confidential Information Memorandums (CIMs), Buyers Lists, Management Presentations, and more. Already partnered with 7+ investment banks and private equity shops.",No,N/A,
4/2/2025 21:28:31,laurieee@mit.edu,Laurie Wang,https://drive.google.com/open?id=1nEmPdYA21FHPvNjy8dAG885bqEMQYRE7,A Hidden Markov Model analysis to detect market regimes,Yes,,
4/2/2025 22:26:27,dobie_5@mit.edu,Isaac Dobie,https://drive.google.com/open?id=1WYFnN_ZD-8J_cTf5Ty888RiZWP7RNkQD,NCAA basketball recruitment software that learns a player's tendencies based on previous film. College basketball coaches will be able to simulate recruits against college competition and in specific scenarios in order to recruit the best athletes for their respective schools. Recruiting efficiency requirement is growing exponentially with NIL. Schools are more financially reliant on sports team's performance.,No,Hopefully octo crab will win it for me!,
4/3/2025 20:14:43,danialht@mit.edu,Danial Hosseintabar,https://drive.google.com/open?id=1X1i3pLjj43DV00b4B13Peq72tVTKQhxl,A new AI powered development tool mainly for researchers,No,,
4/4/2025 11:24:43,Josephor@mit.edu,Joseph Ortega,https://drive.google.com/open?id=1bPSubWNPiNdOn2svEbLxXdVihtszjQUt,In the ideation phase for an AI agent,,,,
4/5/2025 15:09:31,jorgevas@mit.edu,Jorge Vasquez,https://drive.google.com/open?id=1ntU-z6DYXgq9OhctqWZZjTce6I8-Ann4,,Yes,Hi Aryan,
4/10/2025 15:03:10,austchen@mit.edu,Austin Chen,https://drive.google.com/open?id=15XcOhR0txeKfosPie4zz437YGW2jZ2PZ,,Yes,,
`;

// Function to parse CSV and assign statuses
const parseCsvData = (csvString: string): Candidate[] => {
  const lines = csvString.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const emailIndex = headers.indexOf('Email?');
  const nameIndex = headers.indexOf('Name');
  const resumeIndex = headers.indexOf('Resume');

  if (emailIndex === -1 || nameIndex === -1 || resumeIndex === -1) {
    console.error("CSV must contain 'Email?', 'Name', and 'Resume' columns");
    return [];
  }

  type ParsedCandidate = Omit<Candidate, 'status'>;

  const candidates: ParsedCandidate[] = lines.slice(1).map((line, index) => {
    const values = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)?.map(v => v.replace(/^"|"$/g, '').trim()) || line.split(',');

    const getValue = (index: number) => values[index]?.trim() || '';

    return {
      id: `candidate-${index + 1}`,
      name: getValue(nameIndex) || `Unknown Name ${index + 1}`,
      email: getValue(emailIndex) || `unknown${index + 1}@example.com`,
      resumeUrl: getValue(resumeIndex) || '',
    };
  });

  const totalParsed = candidates.length;
  const reviewCount = 5;
  const interviewCount = 2;

  return candidates.map((candidate, index) => {
    let status = "Lead";
    if (index < reviewCount) {
      status = "Review";
    } else if (index < reviewCount + interviewCount) {
      status = "Interview";
    }
    return { ...candidate, status };
  });
};

const mockCandidates: Candidate[] = parseCsvData(csvData);

const mockStats = {
  leads: mockCandidates.filter((c: Candidate) => c.status === 'Lead').length,
  reviewApplication: mockCandidates.filter((c: Candidate) => c.status === 'Review').length,
  interviews: mockCandidates.filter((c: Candidate) => c.status === 'Interview').length,
  hired: 0
};

const statusColors: Record<string, string> = {
  Lead: "bg-blue-50 text-blue-600 ring-blue-600/20",
  Review: "bg-yellow-50 text-yellow-600 ring-yellow-600/20",
  Interview: "bg-purple-50 text-purple-600 ring-purple-600/20",
  Hired: "bg-green-50 text-green-600 ring-green-600/20",
  Rejected: "bg-red-50 text-red-600 ring-red-600/20"
};

export default function CompanyDashboard() {
  const { companyId } = useParams();
  const { user } = useUser();
  const [selectedCandidates, setSelectedCandidates] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCandidateForDrawer, setSelectedCandidateForDrawer] = useState<Candidate | null>(null);
  const itemsPerPage = 10;

  const toggleSelectCandidate = (id: string) => {
    setSelectedCandidates(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredCandidates = mockCandidates.filter((candidate: Candidate) =>
    candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCandidates = filteredCandidates.length;
  const totalPages = Math.ceil(totalCandidates / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCandidates = filteredCandidates.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getStatusChipClass = (status: string) => {
    return statusColors[status] || "bg-gray-50 text-gray-600 ring-gray-600/20";
  };

  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-screen">
      <ResizablePanel defaultSize={selectedCandidateForDrawer ? 70 : 100}>
        <section className="mx-auto w-full px-5 pb-20 sm:px-10 mt-10 max-w-screen sm:max-w-5xl">
          <div className="relative flow-root w-full pb-10">
            <div className="inline-block w-full align-middle">
              <div className="mb-[40px] mt-5 flex w-full flex-wrap items-center gap-5">
                <div className="flex-1">
                  <div className="flex flex-1 items-center gap-2 text-base font-semibold leading-6 text-gray-900">
                    <Link href="/listings" className="hidden sm:flex">Listings</Link>
                    <ChevronRightIcon className="hidden h-4 w-4 text-gray-600 sm:flex" />
                    <div className="flex items-center gap-3">
                      <span className="whitespace-nowrap">Othello SWE 2025 Summer Internship</span>
                      <p className="text-xs px-2 py-1 w-fit whitespace-nowrap text-center rounded-xl font-medium bg-green-100/50 text-green-500" data-testid="job-status-badge">
                        Active
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 hidden text-sm text-gray-700 md:flex">
                    Manage candidates and applications for this listing
                  </p>
                </div>
                
                <div className="flex flex-row-reverse items-center gap-2 md:flex-row">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className="rounded-xl px-3 py-2 text-sm font-semibold">
                        <div className="flex items-center gap-1">
                          <p className="text-sm">Edit job</p>
                        </div>
                      </Button>
                    </DialogTrigger>
                    <EvaluationDialog /> 
                  </Dialog>
                  <Button className="rounded-xl px-3 py-2 text-sm font-semibold">
                    <section className="group relative">
                      <div className="flex items-center gap-2">
                        <ShareIcon className="h-4 w-4" />
                        <p className="text-sm">Share job</p>
                      </div>
                    </section>
                  </Button>
                </div>
              </div>
              
              <div className="max-md:mt-6">
                <div className="mx-auto flex max-w-7xl flex-col">
                  <div className="flex flex-1 flex-row items-center justify-evenly divide-x overflow-x-auto rounded-xl border border-gray-200">
                    <button className="relative w-full min-w-[200px] flex-1 cursor-pointer overflow-hidden duration-300 first:rounded-l-lg last:rounded-r-lg hover:bg-gray-50">
                      <div className="flex flex-1 flex-col items-start p-4 pb-3 pt-3">
                        <div className="flex w-full flex-row items-center">
                          <div className="truncate pr-1 text-sm/6 font-medium text-gray-500">
                            Leads
                          </div>
                          <InfoIcon className="h-3.5 w-3.5 flex-none rounded-full text-gray-600 duration-300 hover:bg-white hover:shadow-md" />
                        </div>
                        <div className="text-3xl/10 font-semibold tracking-tight text-gray-900">
                          {mockStats.leads}
                        </div>
                      </div>
                    </button>
                    
                    <button className="relative w-full min-w-[200px] flex-1 cursor-pointer overflow-hidden duration-300 first:rounded-l-lg last:rounded-r-lg hover:bg-gray-50">
                      <div className="flex flex-1 flex-col items-start p-4 pb-3 pt-3">
                        <div className="flex w-full flex-row items-center">
                          <div className="truncate pr-1 text-sm/6 font-medium text-gray-500">
                            Review Application
                          </div>
                          <InfoIcon className="h-3.5 w-3.5 flex-none rounded-full text-gray-600 duration-300 hover:bg-white hover:shadow-md" />
                        </div>
                        <div className="text-3xl/10 font-semibold tracking-tight text-gray-900">
                          {mockStats.reviewApplication}
                        </div>
                      </div>
                    </button>
                    
                    <button className="relative w-full min-w-[200px] flex-1 cursor-pointer overflow-hidden duration-300 first:rounded-l-lg last:rounded-r-lg hover:bg-gray-50">
                      <div className="flex flex-1 flex-col items-start p-4 pb-3 pt-3">
                        <div className="flex w-full flex-row items-center">
                          <div className="truncate pr-1 text-sm/6 font-medium text-gray-500">
                            Interviews
                          </div>
                          <InfoIcon className="h-3.5 w-3.5 flex-none rounded-full text-gray-600 duration-300 hover:bg-white hover:shadow-md" />
                        </div>
                        <div className="text-3xl/10 font-semibold tracking-tight text-gray-900">
                          {mockStats.interviews}
                        </div>
                      </div>
                    </button>
                    
                    <button className="relative w-full min-w-[200px] flex-1 cursor-pointer overflow-hidden duration-300 first:rounded-l-lg last:rounded-r-lg hover:bg-gray-50">
                      <div className="flex flex-1 flex-col items-start p-4 pb-3 pt-3">
                        <div className="flex w-full flex-row items-center">
                          <div className="truncate pr-1 text-sm/6 font-medium text-gray-500">
                            Hired
                          </div>
                          <InfoIcon className="h-3.5 w-3.5 flex-none rounded-full text-gray-600 duration-300 hover:bg-white hover:shadow-md" />
                        </div>
                        <div className="text-3xl/10 font-semibold tracking-tight text-gray-900">
                          {mockStats.hired}
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mb-2 mt-5">
                <header className="z-10 w-full bg-white transition-all duration-200">
                  <div className="relative">
                    <div className="mb-2 mt-6">
                      <div className="flex gap-2 flex-1 items-center cursor-text rounded-xl border w-full lg:max-w-5xl px-4 border-gray-200">
                        <label htmlFor="semantic-input" className="flex h-full cursor-text gap-1 rounded-s-full flex-1">
                          <div className="flex flex-1 flex-row items-center gap-3 justify-center whitespace-nowrap outline-none">
                            <button className="flex flex-none items-center gap-2 overflow-hidden text-sm rounded-lg transition-all duration-200 text-gray-500">
                              <SearchIcon className="h-4 w-4 flex-none" />
                            </button>
                            <input 
                              id="semantic-input" 
                              autoComplete="off" 
                              placeholder="Search by name or email" 
                              className="w-full border-0 bg-transparent py-4 px-0 text-gray-900 outline-none ring-0 placeholder:text-gray-400 focus:outline-none text-sm"
                              value={searchQuery}
                              onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                              }}
                            />
                          </div>
                        </label>
                        
                        <div className="relative inline-block text-left h-fit z-20 group">
                          <div className="flex items-center rounded-md text-sm py-1 px-2 font-medium transition-colors focus:outline-none text-gray-900 hover:bg-gray-50 hover:text-gray-900">
                            Keyword
                            <ChevronDownIcon className="h-4 w-4 ml-2" />
                          </div>
                          <div className="absolute right-0 top-[75%] mt-2 w-96 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition-all duration-200 ease-out transform opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible">
                            <div className="p-1">
                              <button className="flex text-left w-full gap-3 rounded-sm px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none">
                                <CheckIcon className="h-4 w-4 text-gray-900 flex-shrink-0 stroke-2 mt-0.5" />
                                <div className="flex-1">
                                  <p className="text-sm font-semibold">Keyword</p>
                                  <p className="text-gray-500">Search by name or email</p>
                                </div>
                              </button>
                              <button className="flex text-left w-full gap-3 rounded-sm px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none">
                                <div className="h-4 w-4 flex-shrink-0"></div>
                                <div className="flex-1">
                                  <p className="text-sm font-semibold">Intelligent</p>
                                  <p className="text-gray-500">Search and sort by anything!</p>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </header>
              </div>
              
              <section className="w-full border-separate border-spacing-y-5">
                <div className="sticky top-0 z-10 bg-white">
                  <section className="mb-2 h-10 pt-2"></section>
                  <section className="relative flex items-end border-b">
                    <div className="absolute left-0 top-4 flex h-[32px] flex-col items-center gap-3.5">
                      <div className="relative px-7 sm:w-12 sm:px-6 group">
                        <input type="checkbox" className="absolute left-4 top-0 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                        <div className="absolute left-4 top-4 bg-white w-fit group-hover:block hidden pt-2">
                          <ul role="menu" aria-orientation="vertical" aria-labelledby="options-menu" className="p-1 border border-gray-200 rounded-md shadow-sm min-w-40">
                          </ul>
                        </div>
                      </div>
                    </div>
                    <section className="w-full">
                      <div className="flex h-12 max-w-6xl flex-1">
                        <div className="ml-10 mr-2 flex max-w-6xl flex-1 items-center gap-2 overflow-visible">
                          <div className="relative inline-block">
                            <Button variant="ghost" className="rounded-md px-1.5 py-1">
                              <ArrowDownUpIcon className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="relative -ml-1 inline-block">
                            <Button variant="ghost" className="rounded-md px-1.5 py-1">
                              <ListFilterIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="relative ml-auto mt-1 pr-4 before:absolute before:-left-10 before:top-0 before:h-full before:w-10 before:bg-gradient-to-l before:from-white before:to-transparent before:content-['']">
                          <nav aria-label="Pagination" className="relative flex items-center justify-between border-gray-200 bg-white py-3 false">
                            <div className="hidden sm:block whitespace-nowrap">
                              <p className="text-sm text-gray-700 mr-5 -mt-1">
                                <span className="font-medium">{startIndex + 1}-{Math.min(endIndex, totalCandidates)}</span> of <span className="font-medium">{totalCandidates}</span>
                              </p>
                            </div>
                            <div className="flex flex-1 justify-between sm:justify-end -mt-1">
                              <button 
                                onClick={() => handlePageChange(currentPage - 1)} 
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center rounded-md bg-white text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 disabled:ring-gray-200 disabled:text-gray-500 disabled:hover:bg-white px-2 py-0.5"
                              >
                                Previous
                              </button>
                              <button 
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages || totalCandidates === 0}
                                className="relative ml-3 inline-flex items-center rounded-md bg-white text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 disabled:ring-gray-200 disabled:text-gray-500 disabled:hover:bg-white px-2 py-0.5"
                              >
                                Next
                              </button>
                            </div>
                          </nav>
                        </div>
                      </div>
                    </section>
                  </section>
                </div>
                
                <div className="flex max-w-6xl flex-col overflow-x-auto">
                  <table className="min-w-full table-fixed divide-y divide-gray-300">
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {currentCandidates.length > 0 ? (
                        currentCandidates.map((candidate) => (
                          <tr 
                            key={candidate.id} 
                            className="border-b-none group w-full cursor-pointer transition-all duration-300 hover:bg-gray-50"
                            onClick={() => setSelectedCandidateForDrawer(candidate)}
                          >
                            <td className="relative w-12 px-7 sm:px-6">
                              <div onClick={(e) => e.stopPropagation()}> 
                                <Checkbox 
                                  className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                  checked={!!selectedCandidates[candidate.id]}
                                  onCheckedChange={() => {
                                    toggleSelectCandidate(candidate.id);
                                  }}
                                />
                              </div>
                            </td>
                            <td className="min-w-[110px] py-2 pr-3 text-sm font-medium text-gray-900 max-w-[110px] sm:max-w-[180px]">
                              <div className="overflow-hidden truncate text-ellipsis">{candidate.name}</div>
                            </td>
                            <td className="hidden h-full px-3 py-3 text-sm text-gray-500 md:flex max-w-[350px] max-[800px]:max-w-[350px] lg:max-w-[300px]">
                              <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{candidate.email}</div>
                            </td>
                            <td className="relative max-w-[75px] whitespace-nowrap px-3 py-2 text-sm text-gray-500 md:max-w-[140px]">
                              <div className={`text-xs px-2 py-1 w-fit whitespace-nowrap text-center rounded-xl font-medium ${getStatusChipClass(candidate.status)}`}>
                                {candidate.status}
                              </div>
                            </td>
                            <td className="hidden whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 lg:flex w-full">
                              <div className="flex justify-end rounded-e-md ml-auto w-fit"> 
                                <div className="relative flex items-center overflow-hidden text-indigo-600 whitespace-nowrap px-3 py-1 text-left text-sm font-semibold outline-none ring-0 transition-all duration-300 group-hover:text-indigo-700">
                                  View application&nbsp;&nbsp;<span className="ml-1 transition-all"> →</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center py-10 text-gray-500">
                            No candidates found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </div>
        </section>
      </ResizablePanel>
      
      {selectedCandidateForDrawer && (
        <>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
            <div className="flex flex-col h-full p-4">
              <div className="flex justify-between items-center pb-4 border-b mb-4">
                <div>
                  <h2 className="text-lg font-semibold">{selectedCandidateForDrawer.name}</h2>
                  <p className="text-sm text-muted-foreground">{selectedCandidateForDrawer.email} - {selectedCandidateForDrawer.status}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full"
                  onClick={() => setSelectedCandidateForDrawer(null)}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1 overflow-auto mb-4">
                 {selectedCandidateForDrawer.resumeUrl ? (
                    <iframe 
                      src={selectedCandidateForDrawer.resumeUrl} 
                      className="w-full h-full border-0"
                      title={`${selectedCandidateForDrawer.name}'s Resume`}
                    />
                 ) : (
                   <p className="text-gray-500 text-center mt-10">No resume URL provided.</p>
                 )}
              </div>

              <div className="mt-auto border-t pt-4">
                <Button variant="outline" onClick={() => setSelectedCandidateForDrawer(null)}>Close</Button>
              </div>
            </div>
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
}

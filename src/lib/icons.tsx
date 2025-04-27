import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Copy,
  CreditCard,
  File,
  FileText,
  HelpCircle,
  Image,
  Laptop,
  Loader2,
  LogIn,
  Moon,
  MoreVertical,
  Pizza,
  Plus,
  Settings,
  SunMedium,
  Trash,
  Twitter,
  User,
  X,
  Search, // Generic search
  Terminal, // Command execution
  FilePlus, // Create file
  FileX, // Delete file
  Replace, // String replace
  MousePointerClick, // Browser click
  XCircle, // Browser close tab
  Move, // Browser drag drop
  ChevronDown, // Browser get dropdown
  ArrowLeft, // Browser go back
  Type, // Browser input text
  Globe, // Browser navigate
  ArrowDown, // Browser scroll down
  ChevronsDown, // Browser scroll to text 
  ArrowUp, // Browser scroll up
  ListChecks, // Browser select dropdown
  Keyboard, // Browser send keys
  CopySlash, // Browser switch tab (using copy as placeholder)
  Clock, // Browser wait
  Rocket, // Deploy
  MessageSquare, // Ask
  CheckSquare, // Complete
  Network, // Crawl webpage
  Code // For general code/file display if needed
} from 'lucide-react' // Assuming lucide-react is installed

export type Icon = typeof Activity // Use a known icon type

export const Icons = {
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  logo: Pizza, // Placeholder logo
  close: X,
  spinner: Loader2,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  trash: Trash,
  post: FileText,
  page: File,
  media: Image,
  settings: Settings,
  billing: CreditCard,
  ellipsis: MoreVertical,
  add: Plus,
  warning: AlertTriangle,
  user: User,
  arrowRight: ArrowRight,
  help: HelpCircle,
  pizza: Pizza,
  twitter: Twitter,
  check: Check,
  copy: Copy,
  copyDone: ClipboardCheck,
  logIn: LogIn,
  terminal: Terminal,
  search: Search, // web-search
  filePlus: FilePlus, // create-file
  fileX: FileX, // delete-file
  replace: Replace, // str-replace
  mousePointerClick: MousePointerClick, // browser-click-element
  xCircle: XCircle, // browser-close-tab
  move: Move, // browser-drag-drop
  chevronDown: ChevronDown, // browser-get-dropdown-options
  arrowLeft: ArrowLeft, // browser-go-back
  type: Type, // browser-input-text
  globe: Globe, // browser-navigate-to
  arrowDown: ArrowDown, // browser-scroll-down
  chevronsDown: ChevronsDown, // browser-scroll-to-text
  arrowUp: ArrowUp, // browser-scroll-up
  listChecks: ListChecks, // browser-select-dropdown-option
  keyboard: Keyboard, // browser-send-keys
  copySlash: CopySlash, // browser-switch-tab
  clock: Clock, // browser-wait
  rocket: Rocket, // deploy
  messageSquare: MessageSquare, // ask
  checkSquare: CheckSquare, // complete
  network: Network, // crawl-webpage
  code: Code,
  activity: Activity,
  file: File, // Default file icon
  fileText: FileText
}

// Function to get an icon component based on a tool name string
export const getToolIcon = (toolName?: string): Icon => {
  if (!toolName) return Icons.activity; // Default icon

  const lowerToolName = toolName.toLowerCase();

  // Direct matches first
  if (lowerToolName === 'web-search') return Icons.search;
  if (lowerToolName === 'execute-command') return Icons.terminal;
  if (lowerToolName === 'create-file') return Icons.filePlus;
  if (lowerToolName === 'delete-file') return Icons.fileX;
  if (lowerToolName === 'str-replace') return Icons.replace;
  if (lowerToolName === 'full-file-rewrite') return Icons.fileText; // Reuse file text
  if (lowerToolName === 'browser-click-element') return Icons.mousePointerClick;
  if (lowerToolName === 'browser-close-tab') return Icons.xCircle;
  if (lowerToolName === 'browser-drag-drop') return Icons.move;
  if (lowerToolName === 'browser-get-dropdown-options') return Icons.chevronDown;
  if (lowerToolName === 'browser-go-back') return Icons.arrowLeft;
  if (lowerToolName === 'browser-input-text') return Icons.type;
  if (lowerToolName === 'browser-navigate-to') return Icons.globe;
  if (lowerToolName === 'browser-scroll-down') return Icons.arrowDown;
  if (lowerToolName === 'browser-scroll-to-text') return Icons.chevronsDown;
  if (lowerToolName === 'browser-scroll-up') return Icons.arrowUp;
  if (lowerToolName === 'browser-select-dropdown-option') return Icons.listChecks;
  if (lowerToolName === 'browser-send-keys') return Icons.keyboard;
  if (lowerToolName === 'browser-switch-tab') return Icons.copySlash;
  if (lowerToolName === 'browser-wait') return Icons.clock;
  if (lowerToolName === 'deploy') return Icons.rocket;
  if (lowerToolName === 'ask') return Icons.messageSquare;
  if (lowerToolName === 'complete') return Icons.checkSquare;
  if (lowerToolName === 'crawl-webpage') return Icons.network;

  // Fallback checks
  if (lowerToolName.includes('search')) return Icons.search;
  if (lowerToolName.includes('command') || lowerToolName.includes('terminal') || lowerToolName.includes('execute')) return Icons.terminal;
  if (lowerToolName.includes('file')) return Icons.file; // Generic file for other file ops
  if (lowerToolName.includes('browser') || lowerToolName.includes('navigate') || lowerToolName.includes('web')) return Icons.globe;
  if (lowerToolName.includes('code') || lowerToolName.includes('script')) return Icons.code;

  return Icons.activity; // Default if no match
}; 
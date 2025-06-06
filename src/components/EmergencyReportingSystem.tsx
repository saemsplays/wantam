
import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, Phone, AlertTriangle, X, ExternalLink, 
  Eye, EyeOff, Copy, Check, ArrowLeft, 
  Search, MapPin, Globe, Zap, Scale, FileText,
  ChevronRight, ChevronDown, Menu, Home, Heart, Plus
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Organization {
  name: string;
  description?: string;
  contact?: {
    website?: string;
    email?: string;
    phone?: string;
    mobile?: string;
    address?: string;
  };
  services?: string[];
  process?: string;
  security?: string;
  setup?: string;
  usage?: string;
  risks?: string;
  note?: string;
  examples?: string[];
  access?: string;
  locations?: string;
  phone?: string;
}

interface Contact {
  name: string;
  description?: string;
  phone?: string;
  note?: string;
  process?: string;
  contact?: string;
  services?: string[];
  access?: string;
}

interface ResourceSubcategory {
  title: string;
  organizations?: Organization[];
  contacts?: Contact[];
  warning?: string;
  immediateSteps?: string[];
  steps?: string[];
  process?: string;
}

interface ResourceCategory {
  [key: string]: ResourceSubcategory;
}

interface ResourcesData {
  [key: string]: ResourceCategory;
}

interface Bill {
  name: string;
  year: string;
  status: string;
  path: string;
}

interface Category {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
  color: string;
  urgency: string;
}

interface QuestionOption {
  text: string;
  leads: string;
}

interface QuestionnaireAnswer {
  text: string;
  leads: string;
}

const EmergencyReportingSystem = ({ dockPosition = 'bottom' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('main');
  const [currentCategory, setCurrentCategory] = useState('');
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);
  const [copiedItems, setCopiedItems] = useState<{[key: string]: boolean}>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // BillsSidebar state
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [questionnaire, setQuestionnaire] = useState<Record<number, QuestionnaireAnswer>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentView, setCurrentView] = useState('sidebar');
  const [copiedText, setCopiedText] = useState('');
  
  // BillsSidebar mobile state
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mobileContent, setMobileContent] = useState<'report' | 'bills' | 'suggest' | 'support'>('report');
  const [suggestion, setSuggestion] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const [showSupportForm, setShowSupportForm] = useState(false);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const relatedBills: Bill[] = [
    { name: "Tax Laws (Amendment) Bill", year: "2024", status: "Active", path: "/bills/tax-laws-amendment-2024" },
    { name: "Public Finance Management Bill", year: "2024", status: "Pending", path: "/bills/public-finance-management-2024" },
    { name: "Revenue Administration Bill", year: "2024", status: "Draft", path: "/bills/revenue-administration-2024" },
    { name: "Banking (Amendment) Bill", year: "2024", status: "Active", path: "/bills/banking-amendment-2024" },
    { name: "Capital Markets Bill", year: "2024", status: "Review", path: "/bills/capital-markets-2024" }
  ];

  const categories: Category[] = [
    {
      id: 'local-ngos',
      title: 'Local NGOs & Human Rights',
      icon: Shield,
      description: 'Kenyan human rights organizations',
      color: 'bg-blue-500',
      urgency: 'safe'
    },
    {
      id: 'international-orgs',
      title: 'International Organizations',
      icon: Globe,
      description: 'UN bodies and international NGOs',
      color: 'bg-green-500',
      urgency: 'safe'
    },
    {
      id: 'secure-channels',
      title: 'Secure Digital Channels',
      icon: Eye,
      description: 'Encrypted and anonymous reporting',
      color: 'bg-purple-500',
      urgency: 'moderate'
    },
    {
      id: 'darkweb-options',
      title: 'Dark Web & Anonymous',
      icon: Zap,
      description: 'Maximum anonymity options',
      color: 'bg-red-500',
      urgency: 'high-risk'
    },
    {
      id: 'legal-support',
      title: 'Legal Aid & Documentation',
      icon: FileText,
      description: 'Legal assistance and evidence collection',
      color: 'bg-orange-500',
      urgency: 'safe'
    },
    {
      id: 'emergency-support',
      title: 'Emergency & Crisis Support',
      icon: AlertTriangle,
      description: 'Immediate safety and medical help',
      color: 'bg-red-600',
      urgency: 'urgent'
    }
  ];

  const questions: {[key: string]: Array<{question: string, options: QuestionOption[]}>} = {
    'local-ngos': [
      {
        question: "What type of violation are you reporting?",
        options: [
          { text: "Physical torture or abuse", leads: "torture" },
          { text: "Enforced disappearance", leads: "disappearance" },
          { text: "Freedom of expression violations", leads: "expression" },
          { text: "Other human rights violations", leads: "general" }
        ]
      }
    ],
    'international-orgs': [
      {
        question: "Do you need immediate protection or can you wait for investigation?",
        options: [
          { text: "Need immediate protection", leads: "urgent" },
          { text: "Can wait for proper investigation", leads: "investigation" },
          { text: "Want to document for future accountability", leads: "documentation" }
        ]
      }
    ],
    'secure-channels': [
      {
        question: "What is your technical comfort level?",
        options: [
          { text: "Basic - I can use websites and email", leads: "basic" },
          { text: "Intermediate - I can use VPNs and encrypted apps", leads: "intermediate" },
          { text: "Advanced - I'm comfortable with Tor and encryption", leads: "advanced" }
        ]
      }
    ],
    'darkweb-options': [
      {
        question: "What level of risk are you willing to accept?",
        options: [
          { text: "Low risk - Just anonymous submission", leads: "low-risk" },
          { text: "Medium risk - Willing to use Tor networks", leads: "medium-risk" },
          { text: "High risk - Need maximum exposure/impact", leads: "high-risk" }
        ]
      }
    ],
    'legal-support': [
      {
        question: "Do you need immediate medical documentation?",
        options: [
          { text: "Yes - I have physical injuries", leads: "medical" },
          { text: "No - I need legal advice", leads: "legal" },
          { text: "Both medical and legal support", leads: "both" }
        ]
      }
    ],
    'emergency-support': [
      {
        question: "What is your immediate safety status?",
        options: [
          { text: "I am in immediate danger", leads: "immediate" },
          { text: "I am safe but need medical help", leads: "medical" },
          { text: "I need psychological support", leads: "psychological" }
        ]
      }
    ]
  };

  // Define the resources data with proper typing
  const resources: ResourcesData = {
    'local-ngos': {
      'torture': {
        title: 'Torture Documentation & Support',
        organizations: [
          {
            name: 'Kenya Human Rights Commission (KHRC)',
            description: 'Primary organization for documenting torture and human rights abuses',
            contact: {
              website: 'https://www.khrc.or.ke',
              email: 'info@khrc.or.ke',
              phone: '+254 20 273 2097',
              mobile: '+254 722 203 867'
            },
            services: ['Case documentation', 'Legal support', 'Referrals to UN bodies', 'Public advocacy'],
            process: 'Fill out online Victim Referral Form or call helpline. Assigned caseworker will gather statement and evidence.'
          },
          {
            name: 'Independent Medico-Legal Unit (IMLU)',
            description: 'Specializes in forensic documentation of torture injuries',
            contact: {
              website: 'https://www.imlu.org',
              email: 'info@imlu.org',
              phone: '+254 20 263 4945'
            },
            services: ['Free medical examinations', 'Medico-legal certificates', 'Forensic documentation', 'Court-admissible reports'],
            process: 'Visit any county office for forensic medical examination. Receive legally recognized certificate.'
          }
        ]
      },
      'disappearance': {
        title: 'Enforced Disappearance Reporting',
        organizations: [
          {
            name: 'Kenya Human Rights Commission (KHRC)',
            description: 'Documents disappearances and coordinates with families',
            contact: {
              website: 'https://www.khrc.or.ke',
              email: 'info@khrc.or.ke',
              phone: '+254 20 273 2097'
            },
            services: ['Missing person documentation', 'Family support', 'Legal action', 'International referrals'],
            process: 'Report immediately with all available details. KHRC will coordinate search and legal action.'
          },
          {
            name: 'International Committee of the Red Cross (ICRC)',
            description: 'Family tracing and protection services',
            contact: {
              website: 'https://www.icrc.org/en/where-we-work/africa/kenya',
              phone: '+254 20 271 5577',
              email: 'nairobi.icrc@icrc.org'
            },
            services: ['Family tracing', 'Restoring family links', 'Protection visits', 'Confidential inquiries'],
            process: 'Submit tracing request. ICRC will coordinate confidentially with authorities.'
          }
        ]
      },
      'expression': {
        title: 'Freedom of Expression Violations',
        organizations: [
          {
            name: 'Article 19 Eastern Africa',
            description: 'Focuses on media rights and freedom of expression',
            contact: {
              website: 'https://www.article19.org/location/africa/eastern-africa/',
              email: 'kenya@article19.org',
              phone: '+254 728 694 486'
            },
            services: ['Media freedom advocacy', 'Legal support for journalists', 'UN referrals', 'Public alerts'],
            process: 'Submit details through "Write to Us" form. They assess and may issue public alerts or take legal action.'
          }
        ]
      },
      'general': {
        title: 'General Human Rights Violations',
        organizations: [
          {
            name: 'Kenya Human Rights Commission (KHRC)',
            description: 'Comprehensive human rights organization',
            contact: {
              website: 'https://www.khrc.or.ke',
              email: 'info@khrc.or.ke',
              phone: '+254 20 273 2097'
            },
            services: ['All human rights violations', 'Legal support', 'Documentation', 'Advocacy'],
            process: 'Contact via phone, email, or online form. Comprehensive case handling available.'
          }
        ]
      }
    },
    'international-orgs': {
      'urgent': {
        title: 'Urgent International Protection',
        organizations: [
          {
            name: 'UN Office of High Commissioner for Human Rights (OHCHR) - Kenya',
            description: 'UN human rights monitoring and urgent appeals',
            contact: {
              website: 'https://kenya.ohchr.org',
              email: 'registry@ohchr.org',
              phone: '+254 20 288 5000'
            },
            services: ['Urgent appeals', 'Government communications', 'Protection measures', 'International pressure'],
            process: 'Send urgent 2-3 page summary immediately. OHCHR can issue public statements and contact government.'
          },
          {
            name: 'UN Special Rapporteur on Torture',
            description: 'UN expert on torture allegations worldwide',
            contact: {
              email: 'sr.torture@ohchr.org',
              website: 'https://www.ohchr.org/en/special-procedures/sr-torture'
            },
            services: ['Urgent appeals', 'Government communications', 'International investigations'],
            process: 'Download complaint form. Submit with medical evidence. Receives priority for urgent cases.'
          }
        ]
      },
      'investigation': {
        title: 'International Investigation Bodies',
        organizations: [
          {
            name: 'African Commission on Human and Peoples\' Rights (ACHPR)',
            description: 'Regional human rights body under African Union',
            contact: {
              website: 'https://www.achpr.org',
              email: 'achpr@achpr.org'
            },
            services: ['Regional investigations', 'Government pressure', 'Continental advocacy'],
            process: 'Fill Model Form for Communications. Commission can shame Kenya at AU level.'
          },
          {
            name: 'UN Working Group on Enforced Disappearances',
            description: 'UN body specializing in disappearances',
            contact: {
              email: 'wg-disappearances@ohchr.org',
              website: 'https://www.ohchr.org/en/special-procedures/wg-disappearances'
            },
            services: ['Urgent appeals', 'Case documentation', 'International pressure'],
            process: 'Submit complaint form with evidence. Working Group issues urgent appeals for ongoing cases.'
          }
        ]
      },
      'documentation': {
        title: 'International Documentation for Future Accountability',
        organizations: [
          {
            name: 'International Criminal Court (ICC)',
            description: 'Court for crimes against humanity and war crimes',
            contact: {
              email: 'victimsandwitnesses@icc-cpi.int',
              address: 'P.O. Box 19519, 2500 CM The Hague, Netherlands'
            },
            services: ['Crime documentation', 'Future prosecutions', 'Preliminary examinations'],
            process: 'Submit detailed Communication showing systematic abuse patterns. Evidence preserved for future cases.'
          },
          {
            name: 'Human Rights Watch',
            description: 'International documentation and advocacy',
            contact: {
              email: 'hrwafrica@hrw.org',
              website: 'https://www.hrw.org'
            },
            services: ['Investigation reports', 'International advocacy', 'Government pressure'],
            process: 'Submit via online form. HRW may conduct full investigations and publish reports.'
          }
        ]
      }
    },
    'secure-channels': {
      'basic': {
        title: 'Basic Secure Reporting (User-Friendly)',
        organizations: [
          {
            name: 'Amnesty International - Secure Submission',
            description: 'Global human rights organization with secure reporting',
            contact: {
              website: 'https://www.amnesty.org/en/get-involved/submit-your-report',
              email: 'eastasiahumanrights@amnesty.org'
            },
            security: 'HTTPS encryption, no registration required',
            services: ['Urgent actions', 'International campaigns', 'Victim support'],
            process: 'Use secure online form. Amnesty will verify and may launch international campaigns.'
          },
          {
            name: 'ProtonMail Secure Communication',
            description: 'Encrypted email for contacting organizations',
            setup: 'Create free ProtonMail account at protonmail.com',
            usage: 'Use to contact any organization via encrypted email',
            security: 'End-to-end encryption, Swiss privacy laws'
          }
        ]
      },
      'intermediate': {
        title: 'Intermediate Security Tools',
        organizations: [
          {
            name: 'Signal Messenger',
            description: 'Encrypted messaging for sensitive communications',
            setup: 'Download Signal app, verify with phone number',
            usage: 'Contact trusted journalists or NGO contacts via Signal',
            security: 'End-to-end encryption, disappearing messages'
          },
          {
            name: 'Tor Browser + NGO Websites',
            description: 'Anonymous web browsing for submissions',
            setup: 'Download Tor Browser from torproject.org',
            usage: 'Access NGO websites anonymously, submit reports without revealing IP',
            security: 'IP address hidden, browsing encrypted'
          }
        ]
      },
      'advanced': {
        title: 'Advanced Security & Encryption',
        organizations: [
          {
            name: 'Tails Operating System',
            description: 'Ultra-secure OS for maximum anonymity',
            setup: 'Download Tails, create bootable USB drive',
            usage: 'Boot from USB for completely anonymous computing',
            security: 'Leaves no traces, all traffic through Tor'
          },
          {
            name: 'PGP Encryption',
            description: 'Military-grade encryption for communications',
            setup: 'Learn PGP key generation and usage',
            usage: 'Encrypt all sensitive documents before transmission',
            security: 'Unbreakable encryption when properly implemented'
          }
        ]
      }
    },
    'darkweb-options': {
      'low-risk': {
        title: 'Anonymous Submission Platforms',
        warning: '⚠️ These methods require technical knowledge and carry legal risks',
        organizations: [
          {
            name: 'SecureDrop (Major News Outlets)',
            description: 'Anonymous whistleblowing platform used by journalists',
            examples: [
              'The Guardian: guardianmdpst7xfc.onion',
              'The Intercept: y6xjgkgwj47us5ca.onion',
              'ProPublica: propub3r6espa33w.onion'
            ],
            setup: 'Requires Tor Browser, access via .onion addresses',
            security: 'High anonymity, journalist verification',
            process: 'Generate PGP key, encrypt files, upload anonymously'
          }
        ]
      },
      'medium-risk': {
        title: 'Decentralized Networks',
        warning: '⚠️ Higher complexity, moderate legal risks',
        organizations: [
          {
            name: 'IPFS (InterPlanetary File System)',
            description: 'Decentralized file storage network',
            setup: 'Install IPFS via Tor, upload encrypted files',
            security: 'Censorship-resistant, permanent storage',
            usage: 'Upload evidence, share hash with trusted contacts'
          },
          {
            name: 'Freenet Anonymous Network',
            description: 'Peer-to-peer anonymous publishing',
            setup: 'Install Freenet, create anonymous sites',
            security: 'Distributed storage, difficult to censor',
            usage: 'Publish documentation permanently on network'
          }
        ]
      },
      'high-risk': {
        title: 'Hacktivist Networks',
        warning: '🚫 EXTREME LEGAL RISKS - Potential criminal charges',
        organizations: [
          {
            name: 'Anonymous IRC Channels',
            description: 'Decentralized hacktivist networks',
            access: 'IRC via Tor: irc.esper.net (#anonops, #OpHumanRights)',
            risks: 'Criminal liability, no control over actions taken',
            note: 'May assist with website defacements or data leaks'
          },
          {
            name: 'Dark Web Leak Boards',
            description: 'Anonymous leak publication platforms',
            examples: ['Tor pastebins', 'Anonymous imageboards'],
            risks: 'Extreme legal exposure, potential victim endangerment',
            note: 'Maximum publicity but no editorial control'
          }
        ]
      }
    },
    'legal-support': {
      'medical': {
        title: 'Medical Documentation & Legal Support',
        organizations: [
          {
            name: 'Independent Medico-Legal Unit (IMLU)',
            description: 'Free forensic medical examinations',
            contact: {
              website: 'https://www.imlu.org',
              email: 'info@imlu.org',
              phone: '+254 20 263 4945'
            },
            services: ['Forensic exams', 'Medical certificates', 'Court testimony', 'Trauma counseling'],
            locations: 'Offices in Nairobi, Kisumu, Kakamega, and other counties',
            process: 'Visit nearest office immediately for examination. Certificate admissible in court.'
          }
        ]
      },
      'legal': {
        title: 'Legal Aid & Representation',
        organizations: [
          {
            name: 'Law Society of Kenya (LSK) - Human Rights Centre',
            description: 'Legal clinics and pro-bono representation',
            contact: {
              website: 'https://www.lsk.or.ke',
              phone: '+254 20 271 4999'
            },
            services: ['Free legal advice', 'Court representation', 'Constitutional cases'],
            process: 'Visit legal clinics in Nairobi and major towns'
          },
          {
            name: 'Kenya Legal & Ethical Issues Network (KELIN)',
            description: 'Constitutional and human rights litigation',
            contact: {
              website: 'https://www.kelin.org'
            },
            services: ['Pro-bono legal aid', 'Strategic litigation', 'Human rights cases'],
            process: 'Contact for constitutional and human rights matters'
          }
        ]
      },
      'both': {
        title: 'Combined Medical & Legal Support',
        steps: [
          '1. Immediate medical documentation at IMLU',
          '2. Secure medical certificate and copies',
          '3. Contact LSK or KELIN for legal representation',
          '4. Simultaneously report to KHRC for advocacy',
          '5. Consider international submissions with medical evidence'
        ],
        process: 'Follow this sequence for maximum protection:'
      }
    },
    'emergency-support': {
      'immediate': {
        title: 'IMMEDIATE DANGER - Emergency Contacts',
        warning: '🚨 If in immediate danger, prioritize personal safety',
        contacts: [
          {
            name: 'Kenya Red Cross Emergency',
            phone: '1199',
            description: 'Emergency response and evacuation'
          },
          {
            name: 'Trusted Embassy (if applicable)',
            note: 'Contact embassy of your citizenship for protection',
            process: 'Request emergency consular assistance'
          },
          {
            name: 'Safe House Networks',
            contact: 'Via KHRC: +254 722 203 867',
            description: 'Human rights defenders safe house network'
          }
        ],
        immediateSteps: [
          '1. Move to public, safe location immediately',
          '2. Contact trusted family/friends about situation',
          '3. Document evidence if safely possible',
          '4. Contact emergency services or trusted embassy',
          '5. Report to human rights organizations once safe'
        ]
      },
      'medical': {
        title: 'Medical Emergency Support',
        organizations: [
          {
            name: 'IMLU Emergency Medical',
            description: 'Urgent forensic medical documentation',
            contact: {
              phone: '+254 20 263 4945',
              email: 'info@imlu.org'
            },
            process: 'Call immediately, they provide emergency examinations'
          },
          {
            name: 'Public Hospitals',
            note: 'For immediate medical care, go to nearest public hospital',
            process: 'Seek treatment first, then contact IMLU for forensic documentation'
          }
        ]
      },
      'psychological': {
        title: 'Psychological & Trauma Support',
        organizations: [
          {
            name: 'Torture Survivors Support',
            contact: 'Via KHRC: +254 20 273 2097',
            services: ['Trauma counseling', 'Survivor support groups', 'Long-term therapy']
          },
          {
            name: 'Community Mental Health',
            description: 'Local mental health support networks',
            access: 'Through county health departments or NGO referrals'
          }
        ]
      }
    }
  };

  const copyToClipboard = (text: string, key: string = '') => {
    try {
      navigator.clipboard.writeText(text);
      if (key) {
        setCopiedItems(prev => ({ ...prev, [key]: true }));
        setTimeout(() => setCopiedItems(prev => ({ ...prev, [key]: false })), 2000);
      } else {
        setCopiedText(text);
        setTimeout(() => setCopiedText(''), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getEmailTemplate = (org: Organization, category: Category, subcategory: ResourceSubcategory) => {
    if (!org.contact?.email) return '';
    
    const subject = encodeURIComponent(`Human Rights Violation Report - ${org.name}`);
    const body = encodeURIComponent(
      `Dear ${org.name},

I am writing to report a human rights violation under the category of:
${category.title} > ${subcategory.title}

Violation Details:
[Please describe the violation in detail, including date, location, and individuals involved]

Evidence Available:
[Describe any evidence you have]

Requested Action:
[Specify what assistance you need]

Contact Information:
[Your name/contact details - optional]

Sincerely,
[Your Name]`
    );
    return `mailto:${org.contact.email}?subject=${subject}&body=${body}`;
  };

  const getSectionIcon = (section: string) => {
    const icons = {
      'local-ngos': <MapPin className="w-4 h-4" />,
      'international-orgs': <Globe className="w-4 h-4" />,
      'emergency-support': <Zap className="w-4 h-4" />,
      'legal-support': <Scale className="w-4 h-4" />,
      'secure-channels': <Shield className="w-4 h-4" />,
      'darkweb-options': <Globe className="w-4 h-4" />
    };
    return icons[section as keyof typeof icons] || <Shield className="w-4 h-4" />;
  };

  const getSectionColor = (section: string) => {
    const colors = {
      'local-ngos': 'bg-blue-50 border-blue-200 text-blue-800',
      'international-orgs': 'bg-purple-50 border-purple-200 text-purple-800',
      'emergency-support': 'bg-red-50 border-red-200 text-red-800',
      'legal-support': 'bg-green-50 border-green-200 text-green-800',
      'secure-channels': 'bg-yellow-50 border-yellow-200 text-yellow-800',
      'darkweb-options': 'bg-gray-100 border-gray-300 text-gray-800'
    };
    return colors[section as keyof typeof colors] || 'bg-gray-50 border-gray-200 text-gray-800';
  };

  // Handle category selection from BillsSidebar logic
  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setCurrentView('questionnaire');
    setCurrentQuestion(0);
    setQuestionnaire({});
  };

  // Handle question answer from BillsSidebar logic
  const handleQuestionAnswer = (answer: QuestionOption) => {
    const newQuestionnaire = { ...questionnaire, [currentQuestion]: answer };
    setQuestionnaire(newQuestionnaire);
    setCurrentView('results');
  };

  // Reset flow from BillsSidebar logic
  const resetFlow = () => {
    setCurrentView('sidebar');
    setSelectedCategory(null);
    setQuestionnaire({});
    setCurrentQuestion(0);
  };

  // Handle suggestion submit from BillsSidebar logic
  const handleSuggestionSubmit = () => {
    if (suggestion.trim()) {
      const subject = encodeURIComponent('Bill Suggestion from CEKA Website');
      const body = encodeURIComponent(`Bill Suggestion:\n\n${suggestion}`);
      window.open(`mailto:civiceducationkenya@gmail.com?subject=${subject}&body=${body}`, '_blank');
      setSuggestion('');
      setShowSuggestionForm(false);
    }
  };

  // Handle support submit from BillsSidebar logic
  const handleSupportSubmit = () => {
    if (supportMessage.trim()) {
      console.log('Support message submitted:', supportMessage);
      setSupportMessage('');
      setShowSupportForm(false);
    }
  };

  // Handle mobile drawer open from BillsSidebar logic
  const openMobileDrawer = (content: 'report' | 'bills' | 'suggest' | 'support') => {
    setMobileContent(content);
    setMobileDrawerOpen(true);
  };

  // Handle contact methods rendering with prefilled content
  const renderContactMethods = (org: Organization, category: Category | null, subcategory: ResourceSubcategory | null) => {
    if (!org.contact || !category || !subcategory) return null;
    
    return (
      <div className="mt-2 space-y-1">
        {org.contact.website && (
          <div className="flex items-center text-xs">
            <ExternalLink size={12} className="mr-2 text-blue-600" />
            <a 
              href={org.contact.website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:underline"
            >
              {org.contact.website.replace('https://', '')}
            </a>
            <button 
              onClick={() => copyToClipboard(org.contact.website)} 
              className="ml-2 text-xs text-gray-500 hover:text-gray-700"
            >
              Copy
            </button>
          </div>
        )}
        
        {org.contact.email && (
          <div className="flex items-center text-xs">
            <Phone size={12} className="mr-2 text-blue-600" />
            <a 
              href={getEmailTemplate(org, category, subcategory)} 
              className="text-blue-600 hover:underline"
            >
              {org.contact.email}
            </a>
            <button 
              onClick={() => copyToClipboard(org.contact.email)} 
              className="ml-2 text-xs text-gray-500 hover:text-gray-700"
            >
              Copy
            </button>
          </div>
        )}
        
        {org.contact.phone && (
          <div className="flex items-center text-xs">
            <Phone size={12} className="mr-2 text-green-600" />
            <a 
              href={`tel:${org.contact.phone.replace(/[^0-9+]/g, '')}`} 
              className="text-green-600 hover:underline"
            >
              {org.contact.phone}
            </a>
            <button 
              onClick={() => copyToClipboard(org.contact.phone)} 
              className="ml-2 text-xs text-gray-500 hover:text-gray-700"
            >
              Copy
            </button>
          </div>
        )}
      </div>
    );
  };

  const ContactCard = ({ org, compact = false }: { org: Organization | Contact, compact?: boolean }) => (
    <div className={`bg-white border border-gray-200 rounded-lg ${compact ? 'p-3' : 'p-4'} space-y-3 shadow-sm transition-all hover:shadow-md`}>
      <div className="space-y-2">
        <h4 className={`font-semibold text-gray-900 ${compact ? 'text-sm' : 'text-base'}`}>{org.name}</h4>
        {org.description && (
          <p className={`text-gray-600 ${compact ? 'text-xs' : 'text-sm'}`}>{org.description}</p>
        )}
      </div>
      
      {/* Contact info if available */}
      {'contact' in org && org.contact && (
        <div className="space-y-2">
          {org.contact.phone && (
            <div className="flex items-center justify-between">
              <a href={`tel:${org.contact.phone}`} className="flex items-center space-x-2 text-green-600 hover:text-green-700">
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">{org.contact.phone}</span>
              </a>
              <button
                onClick={() => copyToClipboard(org.contact.phone, `${org.name}-phone`)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                {copiedItems[`${org.name}-phone`] ? 
                  <Check className="w-3 h-3 text-green-600" /> : 
                  <Copy className="w-3 h-3 text-gray-500" />
                }
              </button>
            </div>
          )}
          
          {org.contact.mobile && (
            <div className="flex items-center justify-between">
              <a href={`tel:${org.contact.mobile}`} className="flex items-center space-x-2 text-green-600 hover:text-green-700">
                <Phone className="w-4 h-4" />
                <span className="text-sm">{org.contact.mobile}</span>
              </a>
              <button
                onClick={() => copyToClipboard(org.contact.mobile, `${org.name}-mobile`)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                {copiedItems[`${org.name}-mobile`] ? 
                  <Check className="w-3 h-3 text-green-600" /> : 
                  <Copy className="w-3 h-3 text-gray-500" />
                }
              </button>
            </div>
          )}
          
          {org.contact.email && (
            <div className="flex items-center justify-between">
              <a href={`mailto:${org.contact.email}`} className="text-blue-600 hover:text-blue-700 text-sm truncate">
                {org.contact.email}
              </a>
              <button
                onClick={() => copyToClipboard(org.contact.email, `${org.name}-email`)}
                className="p-1 hover:bg-gray-100 rounded ml-2"
              >
                {copiedItems[`${org.name}-email`] ? 
                  <Check className="w-3 h-3 text-green-600" /> : 
                  <Copy className="w-3 h-3 text-gray-500" />
                }
              </button>
            </div>
          )}
          
          {org.contact.website && (
            <a 
              href={org.contact.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
            >
              <span>Website</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {/* For Contact objects with phone property */}
      {'phone' in org && org.phone && (
        <div className="flex items-center justify-between">
          <a href={`tel:${org.phone}`} className="flex items-center space-x-2 text-green-600 hover:text-green-700">
            <Phone className="w-4 h-4" />
            <span className="text-sm font-medium">{org.phone}</span>
          </a>
          <button
            onClick={() => copyToClipboard(org.phone, `${org.name}-emergency`)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {copiedItems[`${org.name}-emergency`] ? 
              <Check className="w-3 h-3 text-green-600" /> : 
              <Copy className="w-3 h-3 text-gray-500" />
            }
          </button>
        </div>
      )}
      
      {/* Services if available */}
      {'services' in org && org.services && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-700">Services:</p>
          <div className="flex flex-wrap gap-1">
            {org.services.slice(0, 3).map((service, idx) => (
              <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                {service}
              </span>
            ))}
            {org.services.length > 3 && (
              <span className="text-xs text-gray-500">+{org.services.length - 3} more</span>
            )}
          </div>
        </div>
      )}
      
      {/* Process if available */}
      {'process' in org && org.process && (
        <div className="bg-gray-50 p-2 rounded text-xs text-gray-700">
          <span className="font-medium">Process: </span>{org.process}
        </div>
      )}
    </div>
  );

  const MainDashboard = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="bg-red-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto">
          <Shield className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Emergency Reporting Hub</h3>
        <p className="text-sm text-gray-600">
          Comprehensive resources for human rights violations and emergency situations
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search resources..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setCurrentSection('emergency-support')}
          className="p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-left flex flex-col"
        >
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mb-2">
            <Zap className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-sm font-bold text-red-800">Emergency</div>
          <div className="text-xs text-red-600 mt-1">Immediate danger & crisis support</div>
        </button>

        <button
          onClick={() => setCurrentSection('local-ngos')}
          className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left flex flex-col"
        >
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-2">
            <MapPin className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm font-bold text-blue-800">Local NGOs</div>
          <div className="text-xs text-blue-600 mt-1">Kenyan human rights organizations</div>
        </button>

        <button
          onClick={() => setCurrentSection('international-orgs')}
          className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-left flex flex-col"
        >
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mb-2">
            <Globe className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-sm font-bold text-purple-800">International</div>
          <div className="text-xs text-purple-600 mt-1">UN bodies & global organizations</div>
        </button>

        <button
          onClick={() => setCurrentSection('legal-support')}
          className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-left flex flex-col"
        >
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-2">
            <Scale className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-sm font-bold text-green-800">Legal Aid</div>
          <div className="text-xs text-green-600 mt-1">Medical & legal documentation</div>
        </button>

        <button
          onClick={() => setCurrentSection('secure-channels')}
          className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors text-left flex flex-col"
        >
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
            <Shield className="w-4 h-4 text-yellow-600" />
          </div>
          <div className="text-sm font-bold text-yellow-800">Secure Channels</div>
          <div className="text-xs text-yellow-600 mt-1">Safe reporting methods</div>
        </button>

        <button
          onClick={() => setCurrentSection('darkweb-options')}
          className="p-4 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors text-left flex flex-col"
        >
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mb-2">
            <Globe className="w-4 h-4 text-gray-700" />
          </div>
          <div className="text-sm font-bold text-gray-800">Dark Web Options</div>
          <div className="text-xs text-gray-600 mt-1">High-risk anonymous reporting</div>
        </button>
      </div>

      <div className="bg-red-50 border border-red-100 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-red-700">
            <span className="font-medium">Important:</span> If you're in immediate danger, call <span className="font-bold">112</span> or <span className="font-bold">999</span> first. Only use this system when safe to do so.
          </div>
        </div>
      </div>
    </div>
  );

  const SectionView = () => {
    const sectionData = resources[currentSection as keyof ResourcesData];
    if (!sectionData) return null;
    
    const categories = Object.keys(sectionData);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentSection('main')}
              className="p-1.5 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              {getSectionIcon(currentSection)}
            </div>
            <h3 className="text-lg font-bold text-gray-900 capitalize">
              {currentSection.replace(/-/g, ' ')}
            </h3>
          </div>
        </div>

        <div className="grid gap-3">
          {categories.map(category => {
            const categoryData = sectionData[category];
            const resourceCount = (categoryData.organizations?.length || 0) + (categoryData.contacts?.length || 0);
            
            return (
              <button
                key={category}
                onClick={() => {
                  setCurrentCategory(category);
                  setCurrentSection('category-detail');
                }}
                className={`p-4 border rounded-lg hover:shadow-md transition-all text-left flex justify-between items-center ${getSectionColor(currentSection)}`}
              >
                <div>
                  <h4 className="font-semibold mb-1">{categoryData.title}</h4>
                  <p className="text-xs opacity-80">
                    {resourceCount} resources
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const CategoryDetailView = () => {
    // Find which section contains the current category
    const sectionKey = Object.keys(resources).find(key => 
      resources[key as keyof ResourcesData] && 
      currentCategory in resources[key as keyof ResourcesData]
    ) as keyof ResourcesData | undefined;
    
    if (!sectionKey) return null;
    
    const sectionData = resources[sectionKey];
    const categoryData = sectionData[currentCategory];

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentSection(sectionKey)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
          <button
            onClick={() => setCurrentSection('main')}
            className="p-1.5 hover:bg-gray-100 rounded-full"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">{categoryData.title}</h3>
          
          {categoryData.warning && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm font-medium">{categoryData.warning}</p>
            </div>
          )}

          {categoryData.immediateSteps && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 font-medium text-sm mb-2">Immediate Steps:</p>
              <ol className="text-red-700 text-xs space-y-1">
                {categoryData.immediateSteps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          <div className="space-y-3">
            {categoryData.organizations?.map((org, idx) => (
              <ContactCard key={idx} org={org} />
            ))}
            
            {categoryData.contacts?.map((contact, idx) => (
              <ContactCard key={idx} org={contact} compact />
            ))}
          </div>
        </div>
      </div>
    );
  };

  // BillsSidebar rendering components
  const renderSidebar = () => (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-1 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
          Report Human Rights Violations
        </h2>
        <p className="text-xs text-gray-500 mb-3">
          Secure reporting channels for government abuse, abduction, or atrocity
        </p>
      </div>
      
      <div className="space-y-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category)}
              className={`w-full p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 text-left group ${category.color} bg-opacity-5 hover:bg-opacity-10`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded ${category.color} bg-opacity-20`}>
                    <Icon size={16} className="text-current" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs">{category.title}</h3>
                    <p className="text-xs text-gray-500">{category.description}</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-gray-400 group-hover:text-gray-700 transition-colors" />
              </div>
              
              <div className="mt-1 flex items-center">
                <div className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  category.urgency === 'urgent' ? 'bg-red-600 text-white' :
                  category.urgency === 'high-risk' ? 'bg-orange-600 text-white' :
                  category.urgency === 'moderate' ? 'bg-yellow-600 text-black' :
                  'bg-green-600 text-white'
                }`}>
                  {category.urgency === 'urgent' ? '🚨 URGENT' :
                   category.urgency === 'high-risk' ? '⚠️ HIGH RISK' :
                   category.urgency === 'moderate' ? '⚡ MODERATE' :
                   '✅ SAFE'}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-xs mb-1">🔒 Security Notice</h3>
        <p className="text-xs text-gray-600">
          Choose your security level carefully. Higher security options may carry legal risks but offer better protection.
        </p>
      </div>
    </div>
  );

  const renderQuestionnaire = () => {
    if (!selectedCategory) return null;
    
    const categoryQuestions = questions[selectedCategory.id];
    if (!categoryQuestions || categoryQuestions.length === 0) return null;
    
    const currentQ = categoryQuestions[currentQuestion];

    return (
      <div className="w-full">
        <button
          onClick={resetFlow}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-3 text-xs"
        >
          <ChevronDown className="mr-1 rotate-90" size={14} />
          Back to Categories
        </button>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center mb-3">
            {React.createElement(selectedCategory.icon, { 
              size: 18, 
              className: `mr-2 text-white p-1 rounded ${selectedCategory.color}` 
            })}
            <h1 className="text-sm font-bold text-gray-800">{selectedCategory.title}</h1>
          </div>
          
          <div>
            <h2 className="text-sm font-semibold text-gray-800 mb-3">{currentQ.question}</h2>
            <div className="space-y-2">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleQuestionAnswer(option)}
                  className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800">{option.text}</span>
                    <ChevronRight size={14} className="text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (!selectedCategory) return null;
    
    const selectedAnswer = questionnaire[0] as QuestionnaireAnswer | undefined;
    if (!selectedAnswer) return null;
    
    const resourceCategory = resources[selectedCategory.id as keyof ResourcesData];
    if (!resourceCategory) return null;
    
    const specificResources = resourceCategory[selectedAnswer.leads];
    if (!specificResources) return null;

    return (
      <div className="w-full">
        <button
          onClick={() => setCurrentView('questionnaire')}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-3 text-xs"
        >
          <ChevronDown className="mr-1 rotate-90" size={14} />
          Back to Questionnaire
        </button>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center mb-3">
            {React.createElement(selectedCategory.icon, {
              size: 18, 
              className: `mr-2 text-white p-1 rounded ${selectedCategory.color}`
            })}
            <div>
              <h1 className="text-sm font-bold text-gray-800">{specificResources.title}</h1>
              <p className="text-xs text-gray-500">Based on: {selectedAnswer.text}</p>
            </div>
          </div>

          {specificResources.warning && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-red-800 font-semibold">{specificResources.warning}</p>
            </div>
          )}

          {specificResources.immediateSteps && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-xs text-red-800 mb-2">🚨 IMMEDIATE STEPS:</h3>
              <ol className="space-y-1">
                {specificResources.immediateSteps.map((step, index) => (
                  <li key={index} className="text-xs text-red-700">{step}</li>
                ))}
              </ol>
            </div>
          )}

          {specificResources.steps && (
            <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-xs text-green-800 mb-2">Step-by-Step Process:</h3>
              <ul className="space-y-1">
                {specificResources.steps.map((step, index) => (
                  <li key={index} className="text-xs text-green-700">{step}</li>
                ))}
              </ul>
            </div>
          )}

          {specificResources.organizations && (
            <div className="space-y-3">
              <h3 className="font-semibold text-xs text-gray-800 mb-1">Organizations:</h3>
              {specificResources.organizations.map((org, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold text-xs text-gray-800">{org.name}</h4>
                  {org.description && <p className="text-xs text-gray-600 mt-1">{org.description}</p>}
                  
                  {/* Contact Info */}
                  {(org.contact?.website || org.contact?.email || org.contact?.phone) && (
                    <div className="mt-2">
                      <h5 className="font-semibold text-xs text-gray-700 mb-1">Contact:</h5>
                      {renderContactMethods(org, selectedCategory, specificResources)}
                    </div>
                  )}
                  
                  {/* Services */}
                  {org.services && (
                    <div className="mt-2">
                      <h5 className="font-semibold text-xs text-gray-700 mb-1">Services:</h5>
                      <ul className="list-disc pl-4 space-y-1">
                        {org.services.map((service, idx) => (
                          <li key={idx} className="text-xs text-gray-600">{service}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Process */}
                  {org.process && (
                    <div className="mt-2">
                      <h5 className="font-semibold text-xs text-gray-700 mb-1">Process:</h5>
                      <p className="text-xs text-gray-600">{org.process}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {specificResources.contacts && (
            <div className="mt-3">
              <h3 className="font-semibold text-xs text-gray-800 mb-2">Emergency Contacts:</h3>
              <div className="grid gap-2">
                {specificResources.contacts.map((contact, index) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-lg text-xs">
                    <h4 className="font-semibold text-gray-800">{contact.name}</h4>
                    {contact.description && <p className="text-gray-600 mt-1">{contact.description}</p>}
                    {contact.phone && (
                      <div className="flex items-center mt-1">
                        <Phone size={12} className="mr-2 text-green-600" />
                        <span className="font-mono">{contact.phone}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Determine the position of the modal based on dock position
  const getModalPosition = () => {
    switch(dockPosition) {
      case 'top': return 'top-16 mt-2';
      case 'left': return 'left-16 ml-2 top-1/2 transform -translate-y-1/2';
      case 'right': return 'right-16 mr-2 top-1/2 transform -translate-y-1/2';
      default: return 'bottom-16 mb-2';
    }
  };

  const renderBillsContent = () => (
    <div className="space-y-3">
      <h3 className="font-bold text-lg mb-2">Related Bills</h3>
      {relatedBills.map((bill, index) => (
        <a
          key={index}
          href={bill.path}
          className="block p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 leading-tight mb-1">
                {bill.name}
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{bill.year}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  bill.status === 'Active' ? 'bg-green-100 text-green-700' :
                  bill.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {bill.status}
                </span>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-400 mt-1" />
          </div>
        </a>
      ))}
    </div>
  );

  const renderSuggestContent = () => (
    <div className="space-y-4">
      <h3 className="font-bold text-lg">Suggest a Bill</h3>
      <Textarea
        placeholder="Suggest a bill for us to cover..."
        value={suggestion}
        onChange={(e) => setSuggestion(e.target.value)}
        className="min-h-[120px]"
      />
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => setMobileDrawerOpen(false)}
        >
          Cancel
        </Button>
        <Button
          className="flex-1"
          onClick={() => {
            handleSuggestionSubmit();
            setMobileDrawerOpen(false);
          }}
          disabled={!suggestion.trim()}
        >
          Submit
        </Button>
      </div>
    </div>
  );

  const renderSupportContent = () => (
    <div className="space-y-4">
      <h3 className="font-bold text-lg">Support CEKA</h3>
      <Textarea
        placeholder="How would you like to support CEKA?"
        value={supportMessage}
        onChange={(e) => setSupportMessage(e.target.value)}
        className="min-h-[120px]"
      />
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => setMobileDrawerOpen(false)}
        >
          Cancel
        </Button>
        <Button
          className="flex-1 bg-green-600 hover:bg-green-700"
          onClick={() => {
            handleSupportSubmit();
            setMobileDrawerOpen(false);
          }}
          disabled={!supportMessage.trim()}
        >
          Submit
        </Button>
      </div>
    </div>
  );

  // Mobile drawer content based on selected content
  const renderMobileDrawerContent = () => {
    switch (mobileContent) {
      case 'bills': return renderBillsContent();
      case 'suggest': return renderSuggestContent();
      case 'support': return renderSupportContent();
      case 'report': 
        return (
          <div className="w-full">
            {currentView === 'sidebar' && renderSidebar()}
            {currentView === 'questionnaire' && renderQuestionnaire()}
            {currentView === 'results' && renderResults()}
            
            <div className="mt-4 text-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setMobileDrawerOpen(false)}
                className="text-xs w-full"
              >
                Close Reporting Hub
              </Button>
            </div>
          </div>
        );
      default: return null;
    }
  };

  if (!isOpen) {
    return (
      <div className={`fixed z-50 ${
        dockPosition === 'top' ? 'top-4 right-4' : 
        dockPosition === 'left' ? 'left-4 top-1/2 transform -translate-y-1/2' : 
        dockPosition === 'right' ? 'right-4 top-1/2 transform -translate-y-1/2' : 
        'bottom-4 right-4'
      }`}>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition-all hover:scale-105 animate-pulse"
          title="Emergency Reporting Hub"
          style={{ boxShadow: '0 4px 14px rgba(220, 38, 38, 0.5)' }}
        >
          <Shield className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Modal backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-40 z-40"
        onClick={() => {
          setIsOpen(false);
          setIsMobileMenuOpen(false);
        }}
      />

      {/* Modal content */}
      <div 
        ref={modalRef}
        className={`fixed z-50 ${getModalPosition()} w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                if (currentSection !== 'main') setCurrentSection('main');
                else setIsOpen(false);
              }}
              className="p-1.5 hover:bg-gray-200 rounded-full"
            >
              {currentSection === 'main' ? 
                <X className="w-5 h-5" /> : 
                <ArrowLeft className="w-5 h-5" />
              }
            </button>
            <Shield className="w-5 h-5 text-red-600" />
            <span className="font-bold text-gray-900">Report Emergency</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPrivacyMode(!isPrivacyMode)}
              className={`p-2 rounded-lg transition-colors ${
                isPrivacyMode ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-600'
              }`}
              title={isPrivacyMode ? 'Privacy mode ON' : 'Privacy mode OFF'}
            >
              {isPrivacyMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 hover:bg-gray-200 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b">
            <div className="grid grid-cols-3 gap-1 p-2">
              <button 
                onClick={() => setCurrentSection('emergency-support')}
                className="p-3 text-center text-xs font-medium text-red-600 hover:bg-red-50 rounded"
              >
                <Zap className="w-5 h-5 mx-auto mb-1" />
                Emergency
              </button>
              <button 
                onClick={() => setCurrentSection('local-ngos')}
                className="p-3 text-center text-xs font-medium text-blue-600 hover:bg-blue-50 rounded"
              >
                <MapPin className="w-5 h-5 mx-auto mb-1" />
                Local
              </button>
              <button 
                onClick={() => setCurrentSection('international-orgs')}
                className="p-3 text-center text-xs font-medium text-purple-600 hover:bg-purple-50 rounded"
              >
                <Globe className="w-5 h-5 mx-auto mb-1" />
                International
              </button>
              <button 
                onClick={() => setCurrentSection('legal-support')}
                className="p-3 text-center text-xs font-medium text-green-600 hover:bg-green-50 rounded"
              >
                <Scale className="w-5 h-5 mx-auto mb-1" />
                Legal
              </button>
              <button 
                onClick={() => setCurrentSection('secure-channels')}
                className="p-3 text-center text-xs font-medium text-yellow-600 hover:bg-yellow-50 rounded"
              >
                <Shield className="w-5 h-5 mx-auto mb-1" />
                Secure
              </button>
              <button 
                onClick={() => setCurrentSection('darkweb-options')}
                className="p-3 text-center text-xs font-medium text-gray-600 hover:bg-gray-100 rounded"
              >
                <Globe className="w-5 h-5 mx-auto mb-1" />
                Dark Web
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className={`flex-1 overflow-y-auto p-5 ${
          isPrivacyMode ? 'filter blur-sm hover:filter-none transition-all' : ''
        }`}>
          {currentSection === 'main' && <MainDashboard />}
          {currentSection !== 'main' && currentSection !== 'category-detail' && <SectionView />}
          {currentSection === 'category-detail' && <CategoryDetailView />}
        </div>

        {isPrivacyMode && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 pointer-events-none">
            <div className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm">
              Hover to view content
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-gray-50 p-3 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Use responsibly. Report safely. Prioritize your security.
          </p>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50" 
            onClick={() => setMobileDrawerOpen(false)} 
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[85vh] overflow-hidden">
            <div className="flex justify-end p-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setMobileDrawerOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="overflow-y-auto max-h-[75vh] p-4">
              {renderMobileDrawerContent()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmergencyReportingSystem;

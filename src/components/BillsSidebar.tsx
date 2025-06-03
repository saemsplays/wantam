import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, ChevronDown, ChevronUp, ChevronRight, Plus, ExternalLink, 
  Heart, AlertTriangle, Globe, Mail, Phone, Shield, Users, Eye, Zap, Menu, X
} from "lucide-react";

interface Category {
  id: string;
  title: string;
  icon: React.ComponentType;
  description: string;
  color: string;
  urgency: string;
}

interface Bill {
  name: string;
  year: string;
  status: string;
  path: string;
}

const relatedBills: Bill[] = [
  { name: "Tax Laws (Amendment) Bill", year: "2024", status: "Active", path: "/bills/tax-laws-amendment-2024" },
  { name: "Public Finance Management Bill", year: "2024", status: "Pending", path: "/bills/public-finance-management-2024" },
  { name: "Revenue Administration Bill", year: "2024", status: "Draft", path: "/bills/revenue-administration-2024" },
  { name: "Banking (Amendment) Bill", year: "2024", status: "Active", path: "/bills/banking-amendment-2024" },
  { name: "Capital Markets Bill", year: "2024", status: "Review", path: "/bills/capital-markets-2024" }
];

// Enhanced Reporting Hub Component with prefilled content and hyperlinks
const ReportingHub = ({ onClose }: { onClose?: () => void }) => {
  const [currentView, setCurrentView] = useState('sidebar');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [questionnaire, setQuestionnaire] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [copiedText, setCopiedText] = useState('');

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const categories = [
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

  const questions = {
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

  const resources = {
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
        process: 'Follow this sequence for maximum protection:',
        steps: [
          '1. Immediate medical documentation at IMLU',
          '2. Secure medical certificate and copies',
          '3. Contact LSK or KELIN for legal representation',
          '4. Simultaneously report to KHRC for advocacy',
          '5. Consider international submissions with medical evidence'
        ]
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

  const getEmailTemplate = (org: any, category: any, subcategory: any) => {
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

  const handleCategorySelect = (category: any) => {
    setSelectedCategory(category);
    setCurrentView('questionnaire');
    setCurrentQuestion(0);
    setQuestionnaire({});
  };

  const handleQuestionAnswer = (answer: any) => {
    const newQuestionnaire = { ...questionnaire, [currentQuestion]: answer };
    setQuestionnaire(newQuestionnaire);
    setCurrentView('results');
  };

  const resetFlow = () => {
    setCurrentView('sidebar');
    setSelectedCategory(null);
    setQuestionnaire({});
    setCurrentQuestion(0);
  };

  // Handle contact methods with prefilled content
  const renderContactMethods = (org: any, category: any, subcategory: any) => {
    if (!org.contact) return null;
    
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
            <Mail size={12} className="mr-2 text-blue-600" />
            <a 
              href={getEmailTemplate(org, selectedCategory, subcategory)} 
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
    const categoryQuestions = questions[selectedCategory.id as keyof typeof questions];
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
            <selectedCategory.icon size={18} className={`mr-2 text-white p-1 rounded ${selectedCategory.color}`} />
            <h1 className="text-sm font-bold text-gray-800">{selectedCategory.title}</h1>
          </div>
          
          <div>
            <h2 className="text-sm font-semibold text-gray-800 mb-3">{currentQ.question}</h2>
            <div className="space-y-2">
              {currentQ.options.map((option: any, index: number) => (
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
    const selectedAnswer = questionnaire[0 as keyof typeof questionnaire];
    const resourceCategory = resources[selectedCategory.id as keyof typeof resources];
    const specificResources = resourceCategory[selectedAnswer.leads as keyof typeof resourceCategory];

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
            <selectedCategory.icon size={18} className={`mr-2 text-white p-1 rounded ${selectedCategory.color}`} />
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
                {specificResources.immediateSteps.map((step: string, index: number) => (
                  <li key={index} className="text-xs text-red-700">{step}</li>
                ))}
              </ol>
            </div>
          )}

          {specificResources.steps && (
            <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-xs text-green-800 mb-2">Step-by-Step Process:</h3>
              <ul className="space-y-1">
                {specificResources.steps.map((step: string, index: number) => (
                  <li key={index} className="text-xs text-green-700">{step}</li>
                ))}
              </ul>
            </div>
          )}

          {specificResources.organizations && (
            <div className="space-y-3">
              <h3 className="font-semibold text-xs text-gray-800 mb-1">Organizations:</h3>
              {specificResources.organizations.map((org: any, index: number) => (
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
                      {org.contact.email && (
                        <div className="flex items-center text-xs">
                          <Mail size={12} className="mr-2 text-blue-600" />
                          <span>{org.contact.email}</span>
                        </div>
                      )}
                      {org.contact.phone && (
                        <div className="flex items-center text-xs">
                          <Phone size={12} className="mr-2 text-green-600" />
                          <span>{org.contact.phone}</span>
                        </div>
                      )}
                      {org.contact.mobile && (
                        <div className="flex items-center text-xs">
                          <Phone size={12} className="mr-2 text-green-600" />
                          <span>{org.contact.mobile}</span>
                        </div>
                      )}
                      {org.contact.address && (
                        <div className="flex items-start text-xs">
                          <div className="mt-1 mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                              <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                          </div>
                          <span>{org.contact.address}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Services */}
    {org.services && (
      <div className="mt-2">
        <h5 className="font-semibold text-xs text-gray-700 mb-1">Services:</h5>
        <ul className="list-disc pl-4 space-y-1">
          {org.services.map((service: string, idx: number) => (
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

          {specificResources.contacts && (
            <div className="mt-3">
              <h3 className="font-semibold text-xs text-gray-800 mb-2">Emergency Contacts:</h3>
              <div className="grid gap-2">
                {specificResources.contacts.map((contact: any, index: number) => (
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

  return (
    <div className="w-full">
      {currentView === 'sidebar' && renderSidebar()}
      {currentView === 'questionnaire' && renderQuestionnaire()}
      {currentView === 'results' && renderResults()}
      
      <div className="mt-4 text-center">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onClose}
          className="text-xs w-full"
        >
          Close Reporting Hub
        </Button>
      </div>
    </div>
  );
};

// Floating Action Button for Mobile
const MobileFAB: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div className="fixed bottom-4 right-4 z-50 lg:hidden">
    <Button
      className="rounded-full w-14 h-14 shadow-lg"
      onClick={onClick}
    >
      <Menu className="h-6 w-6" />
    </Button>
  </div>
);

// Mobile Navigation Drawer
const MobileDrawer: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  children: React.ReactNode 
}> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[85vh] overflow-hidden">
        <div className="flex justify-end p-2">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="overflow-y-auto max-h-[75vh] p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

// Enhanced BillsSidebar with scrollable content and mobile support
export const BillsSidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const [showSupportForm, setShowSupportForm] = useState(false);
  const [showReportHub, setShowReportHub] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mobileContent, setMobileContent] = useState<'bills' | 'suggest' | 'support' | 'report'>('bills');

  const handleSuggestionSubmit = () => {
    if (suggestion.trim()) {
      console.log('Bill suggestion submitted:', suggestion);
      setSuggestion('');
      setShowSuggestionForm(false);
    }
  };

  const handleSupportSubmit = () => {
    if (supportMessage.trim()) {
      console.log('Support message submitted:', supportMessage);
      setSupportMessage('');
      setShowSupportForm(false);
    }
  };

  const openMobileDrawer = (content: typeof mobileContent) => {
    setMobileContent(content);
    setMobileDrawerOpen(true);
  };

  const renderMobileContent = () => {
    switch (mobileContent) {
      case 'bills':
        return (
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
      
      case 'suggest':
        return (
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
      
      case 'support':
        return (
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
      
      case 'report':
        return <ReportingHub onClose={() => setMobileDrawerOpen(false)} />;
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block">
        <Card className="w-64 shadow-lg border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                {showReportHub ? 'Report Hub' : 'Related Bills'}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-6 w-6 p-0"
              >
                {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </Button>
            </CardTitle>
          </CardHeader>

          {isExpanded && (
            <CardContent className="pt-0 max-h-[70vh] overflow-y-auto">
              {showReportHub ? (
                <ReportingHub onClose={() => setShowReportHub(false)} />
              ) : (
                <>
                  <div className="space-y-2 mb-4">
                    {relatedBills.map((bill, index) => (
                      <a
                        key={index}
                        href={bill.path}
                        className="block p-2 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-medium text-gray-900 leading-tight mb-1">
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
                          <ExternalLink className="h-3 w-3 text-gray-400 mt-1 group-hover:text-blue-600 transition-colors" />
                        </div>
                      </a>
                    ))}
                  </div>

                  <div className="border-t pt-3 space-y-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => setShowSuggestionForm(true)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Suggest a Bill
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => setShowSupportForm(true)}
                    >
                      <Heart className="h-3 w-3 mr-1" />
                      Support CEKA
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => setShowReportHub(true)}
                    >
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Report Hub
                    </Button>
                    <a href="https://ceka.lovable.app/" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        <Globe className="h-3 w-3 mr-1" />
                        Visit CEKA
                      </Button>
                    </a>
                  </div>

                  {showSuggestionForm && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                      <h3 className="font-semibold text-xs mb-2">Suggest a Bill</h3>
                      <Textarea
                        placeholder="Suggest a bill for us to cover..."
                        value={suggestion}
                        onChange={(e) => setSuggestion(e.target.value)}
                        className="mb-2 text-xs min-h-[60px]"
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => setShowSuggestionForm(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={handleSuggestionSubmit}
                          disabled={!suggestion.trim()}
                        >
                          Submit
                        </Button>
                      </div>
                    </div>
                  )}

                  {showSupportForm && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <h3 className="font-semibold text-xs mb-2">Support CEKA</h3>
                      <Textarea
                        placeholder="How would you like to support CEKA?"
                        value={supportMessage}
                        onChange={(e) => setSupportMessage(e.target.value)}
                        className="mb-2 text-xs min-h-[60px]"
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => setShowSupportForm(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 text-xs bg-green-600 hover:bg-green-700"
                          onClick={handleSupportSubmit}
                          disabled={!supportMessage.trim()}
                        >
                          Submit
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          )}
        </Card>
      </div>

      {/* Mobile Floating Action Button */}
      <MobileFAB onClick={() => openMobileDrawer('bills')} />

      {/* Mobile Drawer */}
      <MobileDrawer 
        isOpen={mobileDrawerOpen} 
        onClose={() => setMobileDrawerOpen(false)}
      >
        {renderMobileContent()}
      </MobileDrawer>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center p-3 lg:hidden z-40">
        <Button 
          variant="ghost" 
          className="flex flex-col items-center text-xs px-2"
          onClick={() => openMobileDrawer('bills')}
        >
          <FileText className="h-4 w-4 mb-1" />
          Bills
        </Button>
        
        <Button 
          variant="ghost" 
          className="flex flex-col items-center text-xs px-2"
          onClick={() => openMobileDrawer('suggest')}
        >
          <Plus className="h-4 w-4 mb-1" />
          Suggest
        </Button>
        
        <Button 
          variant="ghost" 
          className="flex flex-col items-center text-xs px-2"
          onClick={() => openMobileDrawer('support')}
        >
          <Heart className="h-4 w-4 mb-1" />
          Support
        </Button>
        
        <Button 
          variant="ghost" 
          className="flex flex-col items-center text-xs px-2"
          onClick={() => openMobileDrawer('report')}
        >
          <AlertTriangle className="h-4 w-4 mb-1" />
          Report
        </Button>
        
        <a
          href="https://ceka.lovable.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center text-xs px-2 text-gray-600 hover:text-gray-900"
        >
          <Button variant="ghost" className="flex flex-col text-xs px-2">
            <Globe className="h-4 w-4 mb-1" />
            CEKA
          </Button>
        </a>
      </div>
    </>
  );
};

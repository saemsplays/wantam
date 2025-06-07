import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Phone, Shield, AlertTriangle, Users, MapPin, Heart, Zap, FileText, ExternalLink, Eye, EyeOff, Copy, Check, ArrowLeft, Globe, Scale, ChevronRight, ChevronDown, Menu, Home } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import debounce from 'lodash.debounce';

interface EmergencyReportingSystemProps {
  isOpen: boolean;
  onClose: () => void;
  dockPosition?: 'bottom' | 'top' | 'left' | 'right';
}

const EmergencyReportingSystem: React.FC<EmergencyReportingSystemProps> = ({ 
  isOpen, 
  onClose, 
  dockPosition = 'bottom' 
}) => {
  const [currentSection, setCurrentSection] = useState('main');
  const [currentCategory, setCurrentCategory] = useState('');
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);
  const [copiedItems, setCopiedItems] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [filteredResources, setFilteredResources] = useState<Record<string, Record<string, any>>>({});
  const [noSearchResults, setNoSearchResults] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const modalRef = useRef(null);

  // Debounce input
  useEffect(() => {
    const handler = debounce(() => setDebouncedTerm(searchTerm), 300);
    handler();
    return () => handler.cancel();
  }, [searchTerm]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const resources: any = {
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

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => ({ ...prev, [key]: true }));
      setTimeout(() => setCopiedItems(prev => ({ ...prev, [key]: false })), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
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
    return icons[section] || <Shield className="w-4 h-4" />;
  };

  const getSectionColor = (section: string) => {
    const colors = {
      'local-ngos': 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100',
      'international-orgs': 'bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100',
      'emergency-support': 'bg-red-50 border-red-200 text-red-800 hover:bg-red-100',
      'legal-support': 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100',
      'secure-channels': 'bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100',
      'darkweb-options': 'bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200'
    };
    return colors[section] || 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100';
  };

  const ContactCard = ({ org, compact = false }: { org: any, compact?: boolean }) => (
    <div className={`bg-white border border-gray-200 rounded-lg ${compact ? 'p-3' : 'p-4'} space-y-3 shadow-sm transition-all hover:shadow-md`}>
      <div className="space-y-2">
        <h4 className={`font-semibold text-gray-900 ${compact ? 'text-sm' : 'text-base'}`}>{org.name}</h4>
        {org.description && (
          <p className={`text-gray-600 ${compact ? 'text-xs' : 'text-sm'}`}>{org.description}</p>
        )}
      </div>
      
      {org.contact && (
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

      {org.phone && (
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
      
      {org.services && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-700">Services:</p>
          <div className="flex flex-wrap gap-1">
            {org.services.slice(0, 3).map((service: string, idx: number) => (
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
      
      {org.process && (
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
    const sectionData = resources[currentSection];
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
                    {categoryData.organizations?.length || categoryData.contacts?.length || 0} resources
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
    const sectionKey = Object.keys(resources).find(key => 
      Object.keys(resources[key]).includes(currentCategory)
    );
    const sectionData = resources[sectionKey!];
    const categoryData = sectionData[currentCategory];

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentSection(sectionKey!)}
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
                {categoryData.immediateSteps.map((step: string, idx: number) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          <div className="space-y-3">
            {categoryData.organizations?.map((org: any, idx: number) => (
              <ContactCard key={idx} org={org} />
            ))}
            
            {categoryData.contacts?.map((contact: any, idx: number) => (
              <ContactCard key={idx} org={contact} compact />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const getModalPosition = () => {
    switch(dockPosition) {
      case 'top': return 'top-16 mt-2';
      case 'left': return 'left-16 ml-2 top-1/2 transform -translate-y-1/2';
      case 'right': return 'right-16 mr-2 top-1/2 transform -translate-y-1/2';
      default: return 'bottom-16 mb-2';
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
          onClick={() => setCurrentSection('main') || onClose() || setIsPrivacyMode(false) || setIsMobileMenuOpen(false) || setCurrentCategory('') || setCopiedItems({}) || setSearchTerm('') || setDebouncedTerm('') || setFilteredResources({}) || setNoSearchResults(false) || setIsOpen(true)}
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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]"
            onClick={onClose}
          />
          
          {/* Sliding Sidebar */}
          <motion.div
            ref={modalRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
            className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-900 shadow-2xl z-[9999] overflow-hidden border-l border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-red-600 to-orange-600">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Emergency Resources</h2>
                    <p className="text-white/80 text-sm">Your safety matters</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsPrivacyMode(!isPrivacyMode)}
                    className={`p-2 rounded-lg transition-colors ${
                      isPrivacyMode ? 'bg-gray-900 text-white' : 'bg-white/20 text-white'
                    }`}
                    title={isPrivacyMode ? 'Privacy mode ON' : 'Privacy mode OFF'}
                  >
                    {isPrivacyMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="h-6 w-6 text-white" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className={`flex-1 overflow-y-auto p-6 ${
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
              <div className="bg-gray-50 dark:bg-gray-800 p-3 border-t border-gray-200 dark:border-gray-700 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Use responsibly. Report safely. Prioritize your security.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EmergencyReportingSystem;

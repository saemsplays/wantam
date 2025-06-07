
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Phone, Shield, AlertTriangle, Users, MapPin, Heart, Zap, FileText, ExternalLink, Globe, Lock, Eye, EyeOff, Briefcase, MessageSquare, Wifi, WifiOff, Gavel } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import debounce from 'lodash.debounce';

interface EmergencyReportingSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Organization {
  name: string;
  description: string;
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
  examples?: string[];
  risks?: string;
  note?: string;
  access?: string;
  locations?: string;
  steps?: string[];
}

interface ResourceSection {
  title: string;
  organizations?: Organization[];
  warning?: string;
  process?: string;
  steps?: string[];
  contacts?: Array<{
    name: string;
    phone?: string;
    description?: string;
    note?: string;
    process?: string;
  }>;
  immediateSteps?: string[];
}

type ResourcesType = Record<string, Record<string, ResourceSection>>;

const EmergencyReportingSystem: React.FC<EmergencyReportingSystemProps> = ({ isOpen, onClose }) => {
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [currentSubsection, setCurrentSubsection] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [filteredResources, setFilteredResources] = useState<ResourcesType>({});
  const [noSearchResults, setNoSearchResults] = useState(false);

  // Debounce input
  useEffect(() => {
    const handler = debounce(() => setDebouncedTerm(searchTerm), 300);
    handler();
    return () => handler.cancel();
  }, [searchTerm]);

  const resources: ResourcesType = {
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
            phone: '+254 722 203 867',
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
          }
        ]
      }
    }
  };

  // Filter logic
  useEffect(() => {
    if (!debouncedTerm.trim()) {
      setFilteredResources({});
      setNoSearchResults(false);
      return;
    }

    const term = debouncedTerm.toLowerCase();
    const filtered: ResourcesType = {};

    for (const sectionKey in resources) {
      for (const subsectionKey in resources[sectionKey]) {
        const subsection = resources[sectionKey][subsectionKey];
        
        // Search in title, organizations, and other content
        const titleMatch = subsection.title.toLowerCase().includes(term);
        const orgMatches = subsection.organizations?.some(org => 
          org.name.toLowerCase().includes(term) ||
          org.description.toLowerCase().includes(term) ||
          org.services?.some(service => service.toLowerCase().includes(term)) ||
          Object.values(org.contact || {}).some(contact => 
            typeof contact === 'string' && contact.toLowerCase().includes(term)
          )
        );

        if (titleMatch || orgMatches) {
          if (!filtered[sectionKey]) {
            filtered[sectionKey] = {};
          }
          filtered[sectionKey][subsectionKey] = subsection;
        }
      }
    }

    setFilteredResources(filtered);
    setNoSearchResults(Object.keys(filtered).length === 0);
  }, [debouncedTerm, resources]);

  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'local-ngos': return <Users className="h-4 w-4" />;
      case 'international-orgs': return <Globe className="h-4 w-4" />;
      case 'secure-channels': return <Lock className="h-4 w-4" />;
      case 'darkweb-options': return <WifiOff className="h-4 w-4" />;
      case 'legal-support': return <Gavel className="h-4 w-4" />;
      case 'emergency-support': return <Phone className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getSubsectionIcon = (subsection: string) => {
    switch (subsection) {
      case 'torture': return <Shield className="h-3 w-3" />;
      case 'disappearance': return <Eye className="h-3 w-3" />;
      case 'expression': return <MessageSquare className="h-3 w-3" />;
      case 'general': return <FileText className="h-3 w-3" />;
      case 'urgent': return <AlertTriangle className="h-3 w-3" />;
      case 'investigation': return <Search className="h-3 w-3" />;
      case 'documentation': return <FileText className="h-3 w-3" />;
      case 'basic': return <Wifi className="h-3 w-3" />;
      case 'intermediate': return <Lock className="h-3 w-3" />;
      case 'advanced': return <Shield className="h-3 w-3" />;
      case 'immediate': return <Phone className="h-3 w-3" />;
      case 'medical': return <Heart className="h-3 w-3" />;
      case 'psychological': return <Users className="h-3 w-3" />;
      case 'legal': return <Gavel className="h-3 w-3" />;
      default: return <FileText className="h-3 w-3" />;
    }
  };

  const getSectionColor = (section: string) => {
    switch (section) {
      case 'local-ngos': return 'text-green-600 border-green-200 hover:bg-green-50 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-950';
      case 'international-orgs': return 'text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-950';
      case 'secure-channels': return 'text-purple-600 border-purple-200 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-800 dark:hover:bg-purple-950';
      case 'darkweb-options': return 'text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950';
      case 'legal-support': return 'text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-800 dark:hover:bg-indigo-950';
      case 'emergency-support': return 'text-orange-600 border-orange-200 hover:bg-orange-50 dark:text-orange-400 dark:border-orange-800 dark:hover:bg-orange-950';
      default: return 'text-gray-600 border-gray-200 hover:bg-gray-50 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-800';
    }
  };

  const handleContactClick = (contactInfo: string) => {
    if (contactInfo.startsWith('+') || contactInfo.match(/^\d/)) {
      window.location.href = `tel:${contactInfo}`;
    } else if (contactInfo.includes('Text ')) {
      const match = contactInfo.match(/Text\s+(\w+)\s+to\s+(\d+)/);
      if (match) {
        window.location.href = `sms:${match[2]}?body=${match[1]}`;
      }
    } else if (contactInfo.includes('@')) {
      window.location.href = `mailto:${contactInfo}`;
    } else if (contactInfo.startsWith('http')) {
      window.open(contactInfo, '_blank');
    }
  };

  const hasSearchResults = Object.keys(filteredResources).length > 0;
  const displayResources = hasSearchResults ? filteredResources : resources;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[10000]"
            onClick={onClose}
          />
          
          {/* Sliding Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
            className="fixed right-0 top-0 h-full w-96 bg-background border-l border-border shadow-2xl z-[10001] overflow-hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-red-600 to-orange-600">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Emergency Resources</h2>
                    <p className="text-white/80 text-sm">Your safety matters</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {!currentSection ? (
                  <div className="space-y-6">
                    {/* Search */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input
                        type="text"
                        placeholder="Search resources..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    {/* Search Results */}
                    {noSearchResults && (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          No resources found matching "{searchTerm}"
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => setSearchTerm("")}
                          className="mt-2"
                        >
                          Clear search
                        </Button>
                      </div>
                    )}

                    {/* Main Categories */}
                    <div className="grid grid-cols-1 gap-4">
                      {Object.entries(displayResources).map(([section, subsections]) => (
                        <motion.button
                          key={section}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setCurrentSection(section)}
                          className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-lg ${getSectionColor(section)}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-current bg-opacity-20 flex items-center justify-center">
                              {getSectionIcon(section)}
                            </div>
                            <div>
                              <h3 className="font-semibold capitalize text-sm">
                                {section.replace(/-/g, " ")}
                              </h3>
                              <p className="text-xs opacity-80">
                                {Object.keys(subsections).length} categories
                              </p>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ) : !currentSubsection ? (
                  <div className="space-y-4">
                    <button
                      onClick={() => setCurrentSection(null)}
                      className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                    >
                      ← Back to categories
                    </button>

                    <h3 className="text-lg font-bold capitalize text-foreground">
                      {currentSection.replace(/-/g, " ")}
                    </h3>

                    <div className="space-y-3">
                      {Object.entries(displayResources[currentSection] || {}).map(([subsection, data]) => (
                        <motion.button
                          key={subsection}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setCurrentSubsection(subsection)}
                          className={`w-full p-4 rounded-lg border text-left transition-all hover:shadow-md ${getSectionColor(currentSection)}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-current bg-opacity-20 flex items-center justify-center">
                              {getSubsectionIcon(subsection)}
                            </div>
                            <div>
                              <h4 className="font-medium capitalize">{data.title}</h4>
                              <p className="text-xs opacity-80">
                                {data.organizations?.length || 0} resources
                              </p>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button
                      onClick={() => setCurrentSubsection(null)}
                      className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                    >
                      ← Back to {currentSection.replace(/-/g, " ")}
                    </button>

                    {(() => {
                      const subsectionData = displayResources[currentSection]?.[currentSubsection];
                      if (!subsectionData) return null;

                      return (
                        <>
                          <h3 className="text-lg font-bold text-foreground">
                            {subsectionData.title}
                          </h3>

                          {subsectionData.warning && (
                            <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                              <p className="text-red-700 dark:text-red-300 text-sm font-medium">
                                {subsectionData.warning}
                              </p>
                            </div>
                          )}

                          <div className="space-y-4">
                            {subsectionData.organizations?.map((org, index) => (
                              <div key={index} className="p-4 bg-muted rounded-lg border">
                                <h4 className="font-medium text-foreground mb-2">{org.name}</h4>
                                <p className="text-sm text-muted-foreground mb-3">{org.description}</p>
                                
                                {org.contact && (
                                  <div className="space-y-2 mb-3">
                                    {Object.entries(org.contact).map(([key, value]) => (
                                      <button
                                        key={key}
                                        onClick={() => handleContactClick(value)}
                                        className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                                      >
                                        <ExternalLink className="h-3 w-3" />
                                        <span className="capitalize">{key}:</span>
                                        <span>{value}</span>
                                      </button>
                                    ))}
                                  </div>
                                )}

                                {org.services && (
                                  <div className="mb-3">
                                    <p className="text-xs font-medium text-foreground mb-1">Services:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {org.services.map((service, serviceIndex) => (
                                        <span
                                          key={serviceIndex}
                                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                                        >
                                          {service}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {org.process && (
                                  <div className="text-xs text-muted-foreground">
                                    <span className="font-medium">Process: </span>
                                    {org.process}
                                  </div>
                                )}
                              </div>
                            ))}

                            {subsectionData.contacts?.map((contact, index) => (
                              <div key={index} className="p-4 bg-muted rounded-lg border">
                                <h4 className="font-medium text-foreground mb-2">{contact.name}</h4>
                                {contact.phone && (
                                  <button
                                    onClick={() => handleContactClick(contact.phone)}
                                    className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors mb-2"
                                  >
                                    <Phone className="h-3 w-3" />
                                    {contact.phone}
                                  </button>
                                )}
                                <p className="text-sm text-muted-foreground">{contact.description}</p>
                              </div>
                            ))}

                            {subsectionData.immediateSteps && (
                              <div className="p-4 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg">
                                <h4 className="font-medium text-orange-700 dark:text-orange-300 mb-2">Immediate Steps:</h4>
                                <ol className="space-y-1">
                                  {subsectionData.immediateSteps.map((step, index) => (
                                    <li key={index} className="text-sm text-orange-600 dark:text-orange-400">
                                      {step}
                                    </li>
                                  ))}
                                </ol>
                              </div>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EmergencyReportingSystem;


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

  // Complete resources object with all categories and subcategories
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
      }
    }
  };

  // Prefilled email templates
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

  return (
    <div className="w-full">
      {currentView === 'sidebar' && renderSidebar()}
      
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

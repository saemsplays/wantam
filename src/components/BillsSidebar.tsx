import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, ChevronDown, ChevronUp, Plus, ExternalLink, 
  Heart, AlertTriangle, Globe, Mail, Phone, Shield, Users, Eye, Zap
} from "lucide-react";

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

// Reporting Hub Component
const ReportingHub = ({ onClose }: { onClose?: () => void }) => {
  const [currentView, setCurrentView] = useState('sidebar');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [questionnaire, setQuestionnaire] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [copiedText, setCopiedText] = useState('');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
    // ... (other question categories same as before)
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
          // ... (other resources same as before)
        ]
      },
      // ... (other resource types same as before)
    },
    // ... (other resource categories same as before)
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
          onClick={resetFlow}
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

          {specificResources.organizations && (
            <div className="space-y-3">
              {specificResources.organizations.map((org: any, index: number) => (
                <div key={index} className="p-3 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold text-xs text-gray-800">{org.name}</h4>
                  {org.description && <p className="text-xs text-gray-600 mt-1">{org.description}</p>}
                  
                  {org.contact && (
                    <div className="mt-2 space-y-1">
                      {org.contact.website && (
                        <div className="flex items-center text-xs">
                          <ExternalLink size={12} className="mr-2 text-blue-600" />
                          <a href={org.contact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Website
                          </a>
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
                {specificResources.contacts.map((contact: any, index: number) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-lg text-xs">
                    <h4 className="font-semibold text-gray-800">{contact.name}</h4>
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

// Main Sidebar Component
export const BillsSidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const [showSupportForm, setShowSupportForm] = useState(false);
  const [showReportHub, setShowReportHub] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [supportMessage, setSupportMessage] = useState('');

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

  return (
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
          <CardContent className="pt-0">
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
                        <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </a>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t pt-3 space-y-2">
                  
                  {/* Suggest a Bill */}
                  {!showSuggestionForm ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSuggestionForm(true)}
                      className="w-full text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Suggest a Bill
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Suggest a bill for us to cover..."
                        value={suggestion}
                        onChange={(e) => setSuggestion(e.target.value)}
                        className="text-xs resize-none"
                        rows={3}
                      />
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowSuggestionForm(false)}
                          className="flex-1 text-xs"
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSuggestionSubmit}
                          className="flex-1 text-xs"
                          disabled={!suggestion.trim()}
                        >
                          Submit
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Support Button */}
                  {!showSupportForm ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSupportForm(true)}
                      className="w-full text-xs bg-green-50 hover:bg-green-100 border-green-200"
                    >
                      <Heart className="h-3 w-3 mr-1" />
                      Support Us
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="How would you like to support CEKA?"
                        value={supportMessage}
                        onChange={(e) => setSupportMessage(e.target.value)}
                        className="text-xs resize-none"
                        rows={3}
                      />
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowSupportForm(false)}
                          className="flex-1 text-xs"
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSupportSubmit}
                          className="flex-1 text-xs bg-green-600 hover:bg-green-700"
                          disabled={!supportMessage.trim()}
                        >
                          Submit
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* CEKA Link */}
                  <a
                    href="https://ceka.lovable.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs bg-blue-50 hover:bg-blue-100 border-blue-200"
                    >
                      <Globe className="h-3 w-3 mr-1" />
                      Visit CEKA
                    </Button>
                  </a>

                  {/* Report Hub Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowReportHub(true)}
                    className="w-full text-xs bg-red-50 hover:bg-red-100 border-red-200"
                  >
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Report Violations
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
};

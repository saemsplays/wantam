import React, { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { DonationWidget } from './DonationWidget';
import {
  Menu,
  X,
  Scale,
  Shield,
  Users,
  FileText,
  AlertTriangle,
  Heart,
  MessageSquare,
  ExternalLink,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Gavel,
  Eye,
  UserCheck,
  Building,
  Briefcase,
  Globe,
  Zap,
  Coins,
  Home,
  Car,
  Laptop,
  GraduationCap,
  Stethoscope,
  Wifi,
  TreePine,
  Factory,
  Vote,
  Calendar,
  Clock,
  TrendingUp
} from 'lucide-react';

interface Category {
  id: string;
  title: string;
  icon: React.ComponentType<{ size?: string | number; className?: string; }>;
  description: string;
  color: string;
  urgency: string;
}

interface Bill {
  id: string;
  title: string;
  category: string;
  status: 'pending' | 'passed' | 'rejected' | 'under-review';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  lastUpdated: string;
  tags: string[];
  summary?: string;
  keyProvisions?: string[];
  implications?: string[];
  nextSteps?: string;
  publicComment?: boolean;
  deadline?: string;
}

const CATEGORIES: Category[] = [
  {
    id: 'governance',
    title: 'Governance & Democracy',
    icon: Vote,
    description: 'Bills affecting democratic processes, elections, and government structure',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    urgency: 'high'
  },
  {
    id: 'finance',
    title: 'Finance & Economy',
    icon: Coins,
    description: 'Financial bills, taxation, and economic policies',
    color: 'bg-green-100 text-green-800 border-green-200',
    urgency: 'critical'
  },
  {
    id: 'human-rights',
    title: 'Human Rights & Justice',
    icon: Scale,
    description: 'Civil rights, justice system, and constitutional rights',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    urgency: 'critical'
  },
  {
    id: 'health',
    title: 'Health & Social Services',
    icon: Stethoscope,
    description: 'Healthcare, social welfare, and public health policies',
    color: 'bg-red-100 text-red-800 border-red-200',
    urgency: 'high'
  },
  {
    id: 'education',
    title: 'Education & Skills',
    icon: GraduationCap,
    description: 'Education policies, skills development, and research',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    urgency: 'medium'
  },
  {
    id: 'technology',
    title: 'Technology & Innovation',
    icon: Laptop,
    description: 'Digital policies, innovation, and technology regulation',
    color: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    urgency: 'medium'
  },
  {
    id: 'environment',
    title: 'Environment & Climate',
    icon: TreePine,
    description: 'Environmental protection, climate action, and sustainability',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    urgency: 'critical'
  },
  {
    id: 'infrastructure',
    title: 'Infrastructure & Transport',
    icon: Car,
    description: 'Transport, housing, and infrastructure development',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    urgency: 'medium'
  },
  {
    id: 'business',
    title: 'Business & Trade',
    icon: Briefcase,
    description: 'Business regulation, trade policies, and commerce',
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    urgency: 'medium'
  },
  {
    id: 'security',
    title: 'Security & Defense',
    icon: Shield,
    description: 'National security, defense, and public safety',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    urgency: 'high'
  }
];

const BILLS_DATA: Bill[] = [
  {
    id: 'finance-bill-2025',
    title: 'Finance Bill 2025',
    category: 'finance',
    status: 'under-review',
    urgency: 'critical',
    description: 'Comprehensive tax reforms affecting VAT, excise duty, and digital services',
    lastUpdated: '2025-01-15',
    tags: ['taxation', 'vat', 'digital-tax', 'essential-goods'],
    summary: 'The Finance Bill 2025 proposes significant changes to Kenya\'s tax structure, including removal of VAT exemptions on essential goods, expansion of digital lending taxes, and new privacy access provisions for KRA.',
    keyProvisions: [
      'Removal of zero-rated VAT status on essential goods',
      'Expansion of digital lending tax to non-resident services',
      'Enhanced KRA access to personal financial data',
      'New excise duties on various consumer goods'
    ],
    implications: [
      'Increased cost of living for ordinary citizens',
      'Potential privacy violations through unrestricted data access',
      'Negative impact on digital financial inclusion',
      'Disproportionate burden on low-income households'
    ],
    nextSteps: 'Public participation period ongoing until January 31, 2025',
    publicComment: true,
    deadline: '2025-01-31'
  }
];

// Mobile Drawer Component with smooth animations
const MobileDrawer: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  children: React.ReactNode 
}> = ({ isOpen, onClose, children }) => {
  return (
    <div 
      className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
        isOpen 
          ? 'opacity-100 pointer-events-auto' 
          : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? 'bg-opacity-50' : 'bg-opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Drawer Content */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-xl transform transition-all duration-300 ease-out ${
          isOpen 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-full opacity-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

const BillCard: React.FC<{ bill: Bill }> = ({ bill }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'passed': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'under-review': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-sm">{bill.title}</h3>
        <div className="flex gap-1">
          <Badge className={`text-xs ${getStatusColor(bill.status)}`}>
            {bill.status.replace('-', ' ')}
          </Badge>
          <Badge className={`text-xs ${getUrgencyColor(bill.urgency)}`}>
            {bill.urgency}
          </Badge>
        </div>
      </div>
      
      <p className="text-xs text-gray-600 mb-3">{bill.description}</p>
      
      <div className="flex flex-wrap gap-1 mb-3">
        {bill.tags.slice(0, 3).map((tag) => (
          <Badge key={tag} variant="outline" className="text-xs">
            {tag.replace('-', ' ')}
          </Badge>
        ))}
        {bill.tags.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{bill.tags.length - 3} more
          </Badge>
        )}
      </div>
      
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>Updated: {new Date(bill.lastUpdated).toLocaleDateString()}</span>
        {bill.deadline && (
          <span className="text-red-600 font-medium">
            Deadline: {new Date(bill.deadline).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};

export const BillsSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedUrgency, setSelectedUrgency] = useState<string | null>(null);
  
  // Support form states
  const [showSupportForm, setShowSupportForm] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  
  // Suggest a bill states
  const [showSuggestForm, setShowSuggestForm] = useState(false);
  const [billSuggestion, setBillSuggestion] = useState('');

  const handleSupportSubmit = () => {
    if (!supportMessage.trim()) return;
    
    const mailtoLink = `mailto:civiceducationkenya@gmail.com?subject=Support Message from CEKA User&body=${encodeURIComponent(supportMessage)}`;
    window.location.href = mailtoLink;
    
    toast({
      title: "Opening email app",
      description: "Your support message is ready to send!",
    });
    
    setSupportMessage('');
    setShowSupportForm(false);
  };

  const handleSuggestBill = () => {
    const subject = "Bill Suggestion from CEKA User";
    const body = `Dear CEKA Team,

I would like to suggest the following bill for consideration and tracking:

${billSuggestion.trim() || '[Please describe your bill suggestion here]'}

Best regards,
[Your name]`;

    const mailtoLink = `mailto:civiceducationkenya@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
    
    toast({
      title: "Opening email app",
      description: "Your bill suggestion is ready to send!",
    });
    
    setBillSuggestion('');
    setShowSuggestForm(false);
  };

  const filteredBills = BILLS_DATA.filter(bill => {
    const matchesCategory = !selectedCategory || bill.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      bill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = !selectedStatus || bill.status === selectedStatus;
    const matchesUrgency = !selectedUrgency || bill.urgency === selectedUrgency;
    
    return matchesCategory && matchesSearch && matchesStatus && matchesUrgency;
  });

  const selectedCategoryData = selectedCategory 
    ? CATEGORIES.find(cat => cat.id === selectedCategory)
    : null;

  return (
    <>
      {/* Desktop Sidebar */}
      <Drawer>
        <DrawerTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="hidden lg:flex items-center gap-2 fixed left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/95 backdrop-blur-sm border-gray-300 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Menu className="h-4 w-4" />
            <span className="text-sm font-medium">Bills Tracker</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-w-md mx-auto">
          {/* Desktop content */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Gavel className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-bold">Bills Tracker</h2>
              </div>
            </div>
            
            {/* Rest of desktop content */}
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Track important bills affecting Kenya's democracy, economy, and civil rights.
              </p>
              
              {/* Categories for desktop */}
              <div className="grid grid-cols-1 gap-2">
                {CATEGORIES.slice(0, 5).map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant="outline"
                      className="w-full justify-start text-left p-3 h-auto"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <IconComponent size={16} className="mr-2 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm">{category.title}</div>
                        <div className="text-xs text-gray-500">{category.description}</div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Mobile Trigger Button */}
      <Button 
        variant="outline" 
        size="sm"
        className="lg:hidden fixed left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/95 backdrop-blur-sm border-gray-300 shadow-lg p-2"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Mobile Drawer with smooth animations */}
      <MobileDrawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-4 max-h-[85vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Gavel className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-bold">Bills Tracker</h2>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsOpen(false)}
              className="p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1">
            <div className="space-y-4">
              {!selectedCategory ? (
                <>
                  {/* Main Categories */}
                  <div>
                    <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Scale className="h-4 w-4" />
                      Bill Categories
                    </h3>
                    <div className="space-y-2">
                      {CATEGORIES.map((category) => {
                        const IconComponent = category.icon;
                        return (
                          <Button
                            key={category.id}
                            variant="outline"
                            className="w-full justify-start text-left p-3 h-auto"
                            onClick={() => setSelectedCategory(category.id)}
                          >
                            <div className="flex items-start gap-2 w-full">
                              <IconComponent size={16} className="mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm">{category.title}</div>
                                <div className="text-xs text-gray-500 line-clamp-2">{category.description}</div>
                              </div>
                              <ChevronRight className="h-4 w-4 flex-shrink-0" />
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  <Separator />

                  {/* Quick Actions */}
                  <div>
                    <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Civic Actions
                    </h3>
                    <div className="space-y-2">
                      {/* Support CEKA */}
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left p-3 h-auto"
                        onClick={() => setShowSupportForm(!showSupportForm)}
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        <div>
                          <div className="font-medium text-sm">Support CEKA</div>
                          <div className="text-xs text-gray-500">Help us continue our civic education mission</div>
                        </div>
                      </Button>

                      {/* Support Form with DonationWidget */}
                      {showSupportForm && (
                        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold text-xs">Support CEKA</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs p-1 h-auto"
                              onClick={() => setShowSupportForm(false)}
                            >
                              ✕
                            </Button>
                          </div>
                          
                          <DonationWidget isVisible={true} />
                        </div>
                      )}

                      {/* Suggest a Bill */}
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left p-3 h-auto"
                        onClick={() => setShowSuggestForm(!showSuggestForm)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        <div>
                          <div className="font-medium text-sm">Suggest a Bill</div>
                          <div className="text-xs text-gray-500">Propose legislation for tracking</div>
                        </div>
                      </Button>

                      {showSuggestForm && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <h3 className="font-semibold text-xs mb-3">Suggest a Bill</h3>
                          <Textarea
                            placeholder="Describe the bill you'd like us to track (title, purpose, key provisions)..."
                            value={billSuggestion}
                            onChange={(e) => setBillSuggestion(e.target.value)}
                            className="mb-3 text-xs min-h-[80px]"
                          />
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-xs"
                              onClick={() => setShowSuggestForm(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1 text-xs bg-blue-600 hover:bg-blue-700"
                              onClick={handleSuggestBill}
                            >
                              Submit Suggestion
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Report Human Rights Violations */}
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left p-3 h-auto"
                        asChild
                      >
                        <a href="https://ceka.lovable.app/human-rights" target="_blank" rel="noopener noreferrer">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          <div>
                            <div className="font-medium text-sm">Report Human Rights Violations</div>
                            <div className="text-xs text-gray-500">
                              In uncertain times of abductions and abuse, secure reporting channels help maintain accountability. Multiple verified avenues available - stay safe.
                            </div>
                          </div>
                          <ExternalLink className="h-3 w-3 ml-2" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                /* Category View */
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mb-4 text-xs"
                    onClick={() => setSelectedCategory(null)}
                  >
                    ← Back to Categories
                  </Button>

                  {selectedCategoryData && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <selectedCategoryData.icon size={20} />
                        <h3 className="font-bold text-base">{selectedCategoryData.title}</h3>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">{selectedCategoryData.description}</p>
                      
                      <Badge className={`text-xs ${selectedCategoryData.color}`}>
                        {selectedCategoryData.urgency} priority
                      </Badge>
                    </div>
                  )}

                  {/* Search and Filters */}
                  <div className="space-y-3 mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search bills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 text-xs"
                      />
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <Filter className="h-3 w-3 mr-2" />
                      Filters
                      <ChevronDown className={`h-3 w-3 ml-2 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </Button>

                    {showFilters && (
                      <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                        <div>
                          <label className="text-xs font-medium">Status:</label>
                          <select
                            value={selectedStatus || ''}
                            onChange={(e) => setSelectedStatus(e.target.value || null)}
                            className="w-full mt-1 p-1 border rounded text-xs"
                          >
                            <option value="">All</option>
                            <option value="pending">Pending</option>
                            <option value="under-review">Under Review</option>
                            <option value="passed">Passed</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="text-xs font-medium">Urgency:</label>
                          <select
                            value={selectedUrgency || ''}
                            onChange={(e) => setSelectedUrgency(e.target.value || null)}
                            className="w-full mt-1 p-1 border rounded text-xs"
                          >
                            <option value="">All</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bills List */}
                  <div className="space-y-3">
                    {filteredBills.length > 0 ? (
                      filteredBills.map((bill) => (
                        <BillCard key={bill.id} bill={bill} />
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">No bills found in this category</p>
                        <p className="text-xs text-gray-400 mt-1">Try adjusting your filters or search terms</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </MobileDrawer>
    </>
  );
};

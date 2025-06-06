
import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, Phone, AlertTriangle, X, ExternalLink, 
  Eye, EyeOff, Copy, Check, ArrowLeft, 
  Search, MapPin, Globe, Zap, Scale, 
  ChevronRight, Menu, Home
} from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const EmergencyReportingSystem = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [currentSection, setCurrentSection] = useState('main');
  const [currentCategory, setCurrentCategory] = useState('');
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);
  const [copiedItems, setCopiedItems] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset to main section when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentSection('main');
      setCurrentCategory('');
      setSearchTerm('');
    }
  }, [isOpen]);

  const resources = {
    'emergency-support': {
      'immediate-danger': {
        title: 'Immediate Danger',
        warning: 'If you are in immediate physical danger, call 112 or 999 first.',
        immediateSteps: [
          'Call emergency services: 112 or 999',
          'Move to a safe location if possible',
          'Document injuries with photos if safe to do so',
          'Contact trusted friends/family'
        ],
        organizations: [
          {
            name: 'National Police Service',
            phone: '112',
            description: 'Emergency police response'
          },
          {
            name: 'Kenya Red Cross',
            phone: '1199',
            description: 'Emergency medical and humanitarian assistance'
          }
        ]
      },
      'crisis-support': {
        title: 'Crisis Support',
        organizations: [
          {
            name: 'Befrienders Kenya',
            phone: '+254 722 178 177',
            description: 'Mental health crisis support and suicide prevention',
            contact: {
              email: 'info@befrienderskenya.org',
              website: 'https://befrienderskenya.org'
            }
          }
        ]
      }
    },
    'local-ngos': {
      'human-rights': {
        title: 'Human Rights Organizations',
        organizations: [
          {
            name: 'Kenya Human Rights Commission (KHRC)',
            description: 'Leading human rights organization in Kenya',
            contact: {
              phone: '+254 20 374 9397',
              email: 'admin@khrc.or.ke',
              website: 'https://www.khrc.or.ke'
            },
            services: ['Legal aid', 'Documentation', 'Advocacy']
          },
          {
            name: 'Independent Medico-Legal Unit (IMLU)',
            description: 'Medical and legal documentation of torture and violence',
            contact: {
              phone: '+254 20 374 2926',
              email: 'info@imlu.org',
              website: 'https://www.imlu.org'
            },
            services: ['Medical documentation', 'Legal support', 'Rehabilitation']
          }
        ]
      }
    },
    'international-orgs': {
      'un-bodies': {
        title: 'UN Bodies',
        organizations: [
          {
            name: 'UN Human Rights Office Kenya',
            description: 'UN Human Rights monitoring and support',
            contact: {
              phone: '+254 20 762 4770',
              email: 'kenya@ohchr.org',
              website: 'https://www.ohchr.org'
            }
          }
        ]
      }
    },
    'legal-support': {
      'documentation': {
        title: 'Legal Documentation',
        organizations: [
          {
            name: 'Law Society of Kenya',
            description: 'Legal aid and attorney referrals',
            contact: {
              phone: '+254 20 221 9090',
              email: 'info@lsk.or.ke',
              website: 'https://www.lsk.or.ke'
            }
          }
        ]
      }
    },
    'secure-channels': {
      'anonymous-reporting': {
        title: 'Anonymous Reporting',
        organizations: [
          {
            name: 'Signal Messenger',
            description: 'Encrypted messaging for secure communication',
            contact: {
              website: 'https://signal.org'
            },
            process: 'Download Signal app, use phone verification, enable disappearing messages'
          }
        ]
      }
    },
    'darkweb-options': {
      'high-risk': {
        title: 'High-Risk Anonymous Options',
        warning: 'Only use if absolutely necessary. Requires technical expertise.',
        organizations: [
          {
            name: 'SecureDrop',
            description: 'Anonymous document submission system',
            contact: {
              website: 'https://securedrop.org'
            },
            process: 'Requires Tor browser and technical setup'
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
    const icons: Record<string, React.ReactNode> = {
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
    const colors: Record<string, string> = {
      'local-ngos': 'bg-blue-50 border-blue-200 text-blue-800',
      'international-orgs': 'bg-purple-50 border-purple-200 text-purple-800',
      'emergency-support': 'bg-red-50 border-red-200 text-red-800',
      'legal-support': 'bg-green-50 border-green-200 text-green-800',
      'secure-channels': 'bg-yellow-50 border-yellow-200 text-yellow-800',
      'darkweb-options': 'bg-gray-100 border-gray-300 text-gray-800'
    };
    return colors[section] || 'bg-gray-50 border-gray-200 text-gray-800';
  };

  const ContactCard = ({ org, compact = false }: { org: any; compact?: boolean }) => (
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(org.contact.phone, `${org.name}-phone`)}
                className="h-6 w-6 p-0"
              >
                {copiedItems[`${org.name}-phone`] ? 
                  <Check className="w-3 h-3 text-green-600" /> : 
                  <Copy className="w-3 h-3 text-gray-500" />
                }
              </Button>
            </div>
          )}
          
          {org.contact.email && (
            <div className="flex items-center justify-between">
              <a href={`mailto:${org.contact.email}`} className="text-blue-600 hover:text-blue-700 text-sm truncate">
                {org.contact.email}
              </a>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(org.contact.email, `${org.name}-email`)}
                className="h-6 w-6 p-0 ml-2"
              >
                {copiedItems[`${org.name}-email`] ? 
                  <Check className="w-3 h-3 text-green-600" /> : 
                  <Copy className="w-3 h-3 text-gray-500" />
                }
              </Button>
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(org.phone, `${org.name}-emergency`)}
            className="h-6 w-6 p-0"
          >
            {copiedItems[`${org.name}-emergency`] ? 
              <Check className="w-3 h-3 text-green-600" /> : 
              <Copy className="w-3 h-3 text-gray-500" />
            }
          </Button>
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
        <Input
          type="text"
          placeholder="Search resources..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={() => setCurrentSection('emergency-support')}
          className="p-4 h-auto bg-red-50 border-red-200 hover:bg-red-100 text-left flex flex-col items-start"
        >
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mb-2">
            <Zap className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-sm font-bold text-red-800">Emergency</div>
          <div className="text-xs text-red-600 mt-1">Immediate danger & crisis support</div>
        </Button>

        <Button
          variant="outline"
          onClick={() => setCurrentSection('local-ngos')}
          className="p-4 h-auto bg-blue-50 border-blue-200 hover:bg-blue-100 text-left flex flex-col items-start"
        >
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-2">
            <MapPin className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm font-bold text-blue-800">Local NGOs</div>
          <div className="text-xs text-blue-600 mt-1">Kenyan human rights organizations</div>
        </Button>

        <Button
          variant="outline"
          onClick={() => setCurrentSection('international-orgs')}
          className="p-4 h-auto bg-purple-50 border-purple-200 hover:bg-purple-100 text-left flex flex-col items-start"
        >
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mb-2">
            <Globe className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-sm font-bold text-purple-800">International</div>
          <div className="text-xs text-purple-600 mt-1">UN bodies & global organizations</div>
        </Button>

        <Button
          variant="outline"
          onClick={() => setCurrentSection('legal-support')}
          className="p-4 h-auto bg-green-50 border-green-200 hover:bg-green-100 text-left flex flex-col items-start"
        >
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-2">
            <Scale className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-sm font-bold text-green-800">Legal Aid</div>
          <div className="text-xs text-green-600 mt-1">Medical & legal documentation</div>
        </Button>

        <Button
          variant="outline"
          onClick={() => setCurrentSection('secure-channels')}
          className="p-4 h-auto bg-yellow-50 border-yellow-200 hover:bg-yellow-100 text-left flex flex-col items-start"
        >
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
            <Shield className="w-4 h-4 text-yellow-600" />
          </div>
          <div className="text-sm font-bold text-yellow-800">Secure Channels</div>
          <div className="text-xs text-yellow-600 mt-1">Safe reporting methods</div>
        </Button>

        <Button
          variant="outline"
          onClick={() => setCurrentSection('darkweb-options')}
          className="p-4 h-auto bg-gray-100 border-gray-300 hover:bg-gray-200 text-left flex flex-col items-start"
        >
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mb-2">
            <Globe className="w-4 h-4 text-gray-700" />
          </div>
          <div className="text-sm font-bold text-gray-800">Dark Web Options</div>
          <div className="text-xs text-gray-600 mt-1">High-risk anonymous reporting</div>
        </Button>
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
    const sectionData = resources[currentSection as keyof typeof resources];
    const categories = Object.keys(sectionData);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentSection('main')}
              className="p-1.5 h-auto"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
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
            const categoryData = sectionData[category as keyof typeof sectionData];
            return (
              <Button
                key={category}
                variant="outline"
                onClick={() => {
                  setCurrentCategory(category);
                  setCurrentSection('category-detail');
                }}
                className={`p-4 h-auto border rounded-lg hover:shadow-md transition-all text-left flex justify-between items-center ${getSectionColor(currentSection)}`}
              >
                <div>
                  <h4 className="font-semibold mb-1">{categoryData.title}</h4>
                  <p className="text-xs opacity-80">
                    {categoryData.organizations?.length || categoryData.contacts?.length || 0} resources
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Button>
            );
          })}
        </div>
      </div>
    );
  };

  const CategoryDetailView = () => {
    const sectionKey = Object.keys(resources).find(key => 
      Object.keys(resources[key as keyof typeof resources]).includes(currentCategory)
    ) as keyof typeof resources;
    const sectionData = resources[sectionKey];
    const categoryData = sectionData[currentCategory as keyof typeof sectionData];

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setCurrentSection(sectionKey)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentSection('main')}
            className="p-1.5 h-auto"
          >
            <Home className="w-4 h-4" />
          </Button>
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

  const content = (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (currentSection !== 'main') setCurrentSection('main');
              else onClose();
            }}
            className="p-1.5 h-auto"
          >
            {currentSection === 'main' ? 
              <X className="w-5 h-5" /> : 
              <ArrowLeft className="w-5 h-5" />
            }
          </Button>
          <Shield className="w-5 h-5 text-red-600" />
          <span className="font-bold text-gray-900">Report Emergency</span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsPrivacyMode(!isPrivacyMode)}
          className={`p-2 h-auto transition-colors ${
            isPrivacyMode ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
          title={isPrivacyMode ? 'Privacy mode ON' : 'Privacy mode OFF'}
        >
          {isPrivacyMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
      </div>

      {/* Content */}
      <div className={`transition-all ${
        isPrivacyMode ? 'filter blur-sm hover:filter-none' : ''
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
      <div className="bg-gray-50 dark:bg-gray-800 p-3 border-t border-gray-200 dark:border-gray-700 text-center -mx-6 -mb-6">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Use responsibly. Report safely. Prioritize your security.
        </p>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="bottom" className="h-[85vh] overflow-hidden">
          <div className="h-full overflow-y-auto">
            {content}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop sidebar
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-40 z-40"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-hidden">
        <div className="h-full overflow-y-auto p-6">
          {content}
        </div>
      </div>
    </>
  );
};

export default EmergencyReportingSystem;


import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, Phone, AlertTriangle, X, ExternalLink, 
  Eye, EyeOff, Copy, Check, ArrowLeft, 
  Search, MapPin, Globe, Zap, Scale, 
  ChevronRight, ChevronDown, Menu, Home
} from 'lucide-react';

interface EmergencyReportingSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Organization {
  name: string;
  description?: string;
  contact?: {
    website?: string;
    email?: string;
    phone?: string;
    mobile?: string;
  };
  phone?: string;
  services?: string[];
  process?: string;
}

interface CategoryResource {
  title: string;
  warning?: string;
  immediateSteps?: string[];
  organizations?: Organization[];
  contacts?: Array<{
    name: string;
    phone?: string;
    description?: string;
    note?: string;
    process?: string;
  }>;
}

interface ResourceSection {
  [key: string]: CategoryResource;
}

interface Resources {
  [key: string]: ResourceSection;
}

const EmergencyReportingSystem: React.FC<EmergencyReportingSystemProps> = ({ isOpen, onClose }) => {
  const [currentSection, setCurrentSection] = useState('main');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);
  const [copiedItems, setCopiedItems] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const resources: Resources = {
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
          }
        ],
        immediateSteps: [
          '1. Move to public, safe location immediately',
          '2. Contact trusted family/friends about situation',
          '3. Document evidence if safely possible',
          '4. Contact emergency services or trusted embassy',
          '5. Report to human rights organizations once safe'
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

  const ContactCard: React.FC<{ org: Organization; compact?: boolean }> = ({ org, compact = false }) => (
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
                onClick={() => copyToClipboard(org.contact.phone!, `${org.name}-phone`)}
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
                onClick={() => copyToClipboard(org.contact.mobile!, `${org.name}-mobile`)}
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
                onClick={() => copyToClipboard(org.contact.email!, `${org.name}-email`)}
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
            onClick={() => copyToClipboard(org.phone!, `${org.name}-emergency`)}
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

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-40 z-40"
        onClick={onClose}
      />

      <div 
        ref={modalRef}
        className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                if (currentSection !== 'main') setCurrentSection('main');
                else onClose();
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
            </div>
          </div>
        )}

        {/* Content */}
        <div className={`flex-1 overflow-y-auto p-5 ${
          isPrivacyMode ? 'filter blur-sm hover:filter-none transition-all' : ''
        }`}>
          {currentSection === 'main' && <MainDashboard />}
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
    </>
  );
};

export default EmergencyReportingSystem;

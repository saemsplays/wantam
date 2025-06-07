
import React, { useState, useRef, useEffect } from 'react';
import { Shield, Search, Phone, Globe, MapPin, Clock, AlertTriangle, X, ChevronRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmergencyReportingSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EmergencyType {
  id: string;
  title: string;
  organizations: Array<{
    name: string;
    contacts: {
      website?: string;
      email?: string;
      phone?: string;
      mobile?: string;
      address?: string;
    };
  }>;
  warning: string;
  immediateSteps: string[];
}

const emergencyTypes: EmergencyType[] = [
  {
    id: 'abduction',
    title: 'Abduction/Enforced Disappearance',
    organizations: [
      {
        name: 'Kenya National Commission on Human Rights (KNCHR)',
        contacts: {
          website: 'https://www.knchr.org',
          email: 'complaints@knchr.org',
          phone: '+254-20-2270000',
          mobile: '+254-729-417000',
          address: 'CVS Plaza, Lenana Road, Nairobi'
        }
      },
      {
        name: 'Independent Policing Oversight Authority (IPOA)',
        contacts: {
          website: 'https://www.ipoa.go.ke',
          email: 'info@ipoa.go.ke',
          phone: '+254-20-2245777',
          mobile: '+254-701-265000',
          address: 'ACK Garden House, 7th Floor, Nairobi'
        }
      }
    ],
    warning: 'IMMEDIATE ACTION REQUIRED: Contact multiple organizations immediately. Time is critical.',
    immediateSteps: [
      'Contact KNCHR immediately',
      'File report with IPOA',
      'Notify family/trusted contacts',
      'Document everything with timestamps',
      'Contact media if safe to do so'
    ]
  },
  {
    id: 'police-brutality',
    title: 'Police Brutality/Misconduct',
    organizations: [
      {
        name: 'Independent Policing Oversight Authority (IPOA)',
        contacts: {
          website: 'https://www.ipoa.go.ke',
          email: 'complaints@ipoa.go.ke',
          phone: '+254-20-2245777',
          mobile: '+254-701-265000',
          address: 'ACK Garden House, 7th Floor, Nairobi'
        }
      },
      {
        name: 'Kenya National Commission on Human Rights (KNCHR)',
        contacts: {
          website: 'https://www.knchr.org',
          email: 'complaints@knchr.org',
          phone: '+254-20-2270000',
          mobile: '+254-729-417000',
          address: 'CVS Plaza, Lenana Road, Nairobi'
        }
      }
    ],
    warning: 'Document injuries immediately. Seek medical attention and preserve evidence.',
    immediateSteps: [
      'Seek immediate medical attention',
      'Document injuries with photos',
      'File complaint with IPOA within 14 days',
      'Report to KNCHR',
      'Gather witness statements'
    ]
  }
];

export const EmergencyReportingSystem: React.FC<EmergencyReportingSystemProps> = ({ isOpen, onClose }) => {
  const [currentView, setCurrentView] = useState<'main' | 'detail'>('main');
  const [selectedEmergency, setSelectedEmergency] = useState<EmergencyType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const handleEmergencySelect = (emergency: EmergencyType) => {
    setSelectedEmergency(emergency);
    setCurrentView('detail');
  };

  const handleBack = () => {
    setCurrentView('main');
    setSelectedEmergency(null);
  };

  const filteredEmergencies = emergencyTypes.filter(emergency =>
    emergency.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
          />

          <motion.div
            ref={modalRef}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col rounded-r-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-red-50 dark:bg-red-900/20">
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Emergency Reporting Hub</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {currentView === 'main' ? (
                <motion.div
                  key="main"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search emergency type..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-2 text-red-700 dark:text-red-300 mb-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm font-medium">Emergency Notice</span>
                      </div>
                      <p className="text-xs text-red-600 dark:text-red-400 max-w-full truncate">
                        For life-threatening emergencies, call 999 immediately
                      </p>
                    </div>

                    {filteredEmergencies.map((emergency) => (
                      <motion.div
                        key={emergency.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-red-300 dark:hover:border-red-600 transition-colors cursor-pointer"
                        onClick={() => handleEmergencySelect(emergency)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-white text-sm max-w-full truncate">
                              {emergency.title}
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 max-w-full truncate">
                              {emergency.organizations.length} organizations available
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                selectedEmergency && (
                  <motion.div
                    key="detail"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex-1 flex flex-col overflow-hidden"
                  >
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors mb-3"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Back</span>
                      </button>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-base max-w-full truncate">
                        {selectedEmergency.title}
                      </h3>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {selectedEmergency.warning && (
                        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-red-700 dark:text-red-300 mb-2">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-sm font-medium">Warning</span>
                          </div>
                          <p className="text-xs text-red-600 dark:text-red-400 max-w-full truncate">
                            {selectedEmergency.warning}
                          </p>
                        </div>
                      )}

                      {selectedEmergency.immediateSteps && (
                        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
                          <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2 text-sm">
                            Immediate Steps
                          </h4>
                          <ul className="space-y-1">
                            {selectedEmergency.immediateSteps.map((step, index) => (
                              <li key={index} className="text-xs text-blue-600 dark:text-blue-400 flex items-start gap-2">
                                <span className="text-blue-500 mt-1">•</span>
                                <span className="max-w-full truncate">{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                          Contact Organizations
                        </h4>
                        {selectedEmergency.organizations.map((org, index) => (
                          <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                            <h5 className="font-medium text-gray-900 dark:text-white text-sm mb-2 max-w-full truncate">
                              {org.name}
                            </h5>
                            <div className="space-y-2">
                              {Object.entries(org.contacts).map(([key, value]) => {
                                if (!value) return null;
                                const icon = key === 'website' ? Globe : key === 'email' ? '@' : key === 'phone' || key === 'mobile' ? Phone : MapPin;
                                const IconComponent = typeof icon === 'string' ? () => <span>{icon}</span> : icon;
                                
                                return (
                                  <div key={key} className="flex items-center gap-2">
                                    <IconComponent className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                    <span className="text-xs text-gray-600 dark:text-gray-400 max-w-full truncate">
                                      {String(value)}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EmergencyReportingSystem;

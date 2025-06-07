
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Phone, Shield, AlertTriangle, Users, MapPin, Heart, Zap, FileText, ExternalLink } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import debounce from 'lodash.debounce';

interface EmergencyReportingSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmergencyReportingSystem: React.FC<EmergencyReportingSystemProps> = ({ isOpen, onClose }) => {
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [filteredResources, setFilteredResources] = useState<Record<string, Record<string, string>>>({});
  const [noSearchResults, setNoSearchResults] = useState(false);

  // Debounce input
  useEffect(() => {
    const handler = debounce(() => setDebouncedTerm(searchTerm), 300);
    handler();
    return () => handler.cancel();
  }, [searchTerm]);

  const resources = {
    'emergency-services': {
      'Police Emergency': '999',
      'Ambulance Emergency': '999',
      'Fire Emergency': '999',
      'Nairobi Emergency Services': '+254-20-2222181',
      'Kenya Red Cross': '+254-20-6003593',
      'St. John Ambulance': '+254-20-2210000'
    },
    'mental-health': {
      'Befrienders Kenya': '+254-722-178177',
      'Mental Health Kenya': '+254-722-516777',
      'Crisis Text Line': 'Text HOME to 741741',
      'Suicide Prevention': '+254-722-178177'
    },
    'legal-aid': {
      'Kenya National Human Rights Commission': '+254-20-2270000',
      'Legal Resources Foundation': '+254-20-387450',
      'Federation of Women Lawyers (FIDA)': '+254-20-387361',
      'Kituo Cha Sheria': '+254-20-387450'
    },
    'safety-tips': {
      'Document Evidence': 'Take photos, screenshots, and keep records',
      'Share Location': 'Send your location to trusted contacts',
      'Emergency Contacts': 'Keep emergency numbers readily available',
      'Safe Spaces': 'Identify safe places in your area'
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
    const filtered: Record<string, Record<string, string>> = {};

    for (const section in resources) {
      const matches = Object.entries(resources[section]).filter(([key, val]) =>
        key.toLowerCase().includes(term) || val.toLowerCase().includes(term)
      );

      if (matches.length) {
        filtered[section] = Object.fromEntries(matches);
      }
    }

    setFilteredResources(filtered);
    setNoSearchResults(Object.keys(filtered).length === 0);
  }, [debouncedTerm]);

  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'emergency-services': return <Phone className="h-4 w-4" />;
      case 'mental-health': return <Heart className="h-4 w-4" />;
      case 'legal-aid': return <Shield className="h-4 w-4" />;
      case 'safety-tips': return <Zap className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getSectionColor = (section: string) => {
    switch (section) {
      case 'emergency-services': return 'text-red-600 border-red-200 hover:bg-red-50';
      case 'mental-health': return 'text-blue-600 border-blue-200 hover:bg-blue-50';
      case 'legal-aid': return 'text-green-600 border-green-200 hover:bg-green-50';
      case 'safety-tips': return 'text-orange-600 border-orange-200 hover:bg-orange-50';
      default: return 'text-gray-600 border-gray-200 hover:bg-gray-50';
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
    }
  };

  const hasSearchResults = Object.keys(filteredResources).length > 0;

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

                    {/* Search Results */}
                    {noSearchResults && (
                      <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">
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

                    {!noSearchResults && hasSearchResults && (
                      <div className="grid grid-cols-1 gap-3">
                        {Object.keys(filteredResources).map((sectionKey) => (
                          <Button
                            key={sectionKey}
                            variant="outline"
                            onClick={() => setCurrentSection(sectionKey)}
                            className={`p-4 h-auto border rounded-lg hover:shadow-md transition-all text-left flex flex-col items-start ${getSectionColor(sectionKey)}`}
                          >
                            <div className="w-8 h-8 rounded-full bg-current bg-opacity-20 flex items-center justify-center mb-2">
                              {getSectionIcon(sectionKey)}
                            </div>
                            <div className="text-sm font-bold capitalize">
                              {sectionKey.replace(/-/g, " ")}
                            </div>
                            <div className="text-xs opacity-80 mt-1">
                              {Object.keys(filteredResources[sectionKey]).length} matches
                            </div>
                          </Button>
                        ))}
                      </div>
                    )}

                    {/* Main Categories */}
                    {!searchTerm && (
                      <div className="grid grid-cols-1 gap-4">
                        {Object.keys(resources).map((section) => (
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
                                  {Object.keys(resources[section]).length} resources
                                </p>
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button
                      onClick={() => setCurrentSection(null)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      ← Back to categories
                    </button>

                    <h3 className="text-lg font-bold capitalize text-gray-900 dark:text-white">
                      {currentSection.replace(/-/g, " ")}
                    </h3>

                    <div className="space-y-3">
                      {Object.entries(hasSearchResults ? filteredResources[currentSection] || {} : resources[currentSection]).map(([service, contact]) => (
                        <motion.div
                          key={service}
                          whileHover={{ scale: 1.02 }}
                          className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border hover:shadow-md transition-all cursor-pointer"
                          onClick={() => handleContactClick(contact)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">{service}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{contact}</p>
                            </div>
                            <ExternalLink className="h-4 w-4 text-gray-400" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
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

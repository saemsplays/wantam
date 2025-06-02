
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Phone, Mail, ExternalLink, Copy, Check, ChevronRight } from "lucide-react";

const ReportCategory: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState('');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000);
  };

  // Sample data - in a real app, this would come from a data source
  const categoryData = {
    'local-ngos': {
      title: 'Local NGOs & Human Rights Organizations',
      question: 'What type of violation are you reporting?',
      options: [
        { text: 'Physical torture or abuse', value: 'torture' },
        { text: 'Enforced disappearance', value: 'disappearance' },
        { text: 'Freedom of expression violations', value: 'expression' },
        { text: 'Other human rights violations', value: 'general' }
      ],
      resources: {
        torture: {
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
        // Add other resource types here
      }
    }
    // Add other categories here
  };

  const currentCategory = categoryData[categoryId as keyof typeof categoryData];

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Category Not Found</h2>
            <p className="text-gray-600 mb-4">The reporting category you're looking for doesn't exist.</p>
            <a href="/report-violations">
              <Button>Back to Report Violations</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleOptionSelect = (value: string) => {
    setSelectedAnswer(value);
  };

  const renderQuestions = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{currentCategory.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="text-xl font-semibold mb-6">{currentCategory.question}</h3>
        <div className="space-y-3">
          {currentCategory.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(option.value)}
              className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-800">{option.text}</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderResults = () => {
    const resourceData = currentCategory.resources[selectedAnswer as keyof typeof currentCategory.resources];
    if (!resourceData) return null;

    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{resourceData.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {resourceData.organizations.map((org, index) => (
                <div key={index} className="p-6 border border-gray-200 rounded-lg">
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">{org.name}</h4>
                  <p className="text-gray-600 mb-4">{org.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold text-gray-700 mb-2">Contact Information:</h5>
                      <div className="space-y-2">
                        {org.contact.website && (
                          <div className="flex items-center">
                            <ExternalLink className="h-4 w-4 mr-2 text-blue-600" />
                            <a href={org.contact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                              {org.contact.website}
                            </a>
                          </div>
                        )}
                        {org.contact.email && (
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-blue-600" />
                            <span className="text-sm">{org.contact.email}</span>
                            <button
                              onClick={() => copyToClipboard(org.contact.email)}
                              className="ml-2 p-1 hover:bg-gray-100 rounded"
                            >
                              {copiedText === org.contact.email ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-500" />}
                            </button>
                          </div>
                        )}
                        {org.contact.phone && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-green-600" />
                            <span className="text-sm">{org.contact.phone}</span>
                            <button
                              onClick={() => copyToClipboard(org.contact.phone)}
                              className="ml-2 p-1 hover:bg-gray-100 rounded"
                            >
                              {copiedText === org.contact.phone ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-500" />}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-gray-700 mb-2">Services:</h5>
                      <ul className="list-disc pl-5 space-y-1">
                        {org.services.map((service, idx) => (
                          <li key={idx} className="text-sm text-gray-600">{service}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                    <h5 className="font-semibold text-blue-800 mb-2">Process:</h5>
                    <p className="text-blue-700 text-sm">{org.process}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-center">
              <Button onClick={() => setSelectedAnswer(null)} variant="outline">
                Choose Different Option
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <a href="/report-violations" className="flex items-center text-gray-600 hover:text-gray-800 mb-4">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Categories
          </a>
        </div>

        {selectedAnswer ? renderResults() : renderQuestions()}
      </div>
    </div>
  );
};

export default ReportCategory;

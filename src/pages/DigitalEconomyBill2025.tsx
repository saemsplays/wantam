
import React from 'react';
import { SharedLayout } from '../components/SharedLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Scale, FileText } from "lucide-react";

const DigitalEconomyBill2025 = () => {
  return (
    <SharedLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium mb-6 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              <AlertTriangle className="h-5 w-5" />
              Digital Economy Bill 2025 Analysis
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Digital Economy Bill{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                2025
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Navigating the digital transformation of Kenya's economy and its regulatory framework.
            </p>
          </div>

          <div className="space-y-8">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-blue-200 dark:border-blue-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="bg-blue-600 dark:bg-blue-500 p-2 rounded-lg">
                    <Scale className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-900 dark:text-white">Bill Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    The Digital Economy Bill 2025 aims to establish a comprehensive framework for 
                    Kenya's digital transformation, addressing cybersecurity, data protection, 
                    e-commerce, and digital financial services.
                  </p>
                  
                  <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 mb-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">Digital Rights & Concerns</span>
                    </div>
                    <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                      <li>• Data privacy and protection standards</li>
                      <li>• Digital identity and authentication</li>
                      <li>• Cybersecurity and digital crime prevention</li>
                      <li>• Digital divide and accessibility</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="bg-purple-600 dark:bg-purple-500 p-2 rounded-lg">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-900 dark:text-white">Constitutional Digital Rights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    Digital economy legislation must protect fundamental rights including privacy (Article 31), 
                    freedom of expression (Article 33), and access to information (Article 35).
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Digital Privacy</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Protection of personal data and digital communications from unauthorized access.
                      </p>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2">Digital Inclusion</h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Ensuring equitable access to digital services and opportunities.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Digital economy analysis coming soon. Help shape Kenya's digital future through participation.
              </p>
              <a
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                Return to Finance Bill 2025
              </a>
            </div>
          </div>
        </div>
      </div>
    </SharedLayout>
  );
};

export default DigitalEconomyBill2025;

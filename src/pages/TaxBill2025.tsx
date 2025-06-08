
import React from 'react';
import { SharedLayout } from '../components/SharedLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Scale, FileText } from "lucide-react";

const TaxBill2025 = () => {
  return (
    <SharedLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium mb-6 bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
              <AlertTriangle className="h-5 w-5" />
              Tax Bill 2025 Analysis
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Tax Bill{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
                2025
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Analyzing proposed tax reforms and their implications for Kenyan taxpayers and businesses.
            </p>
          </div>

          <div className="space-y-8">
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 border-purple-200 dark:border-purple-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="bg-purple-600 dark:bg-purple-500 p-2 rounded-lg">
                    <Scale className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-900 dark:text-white">Bill Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    The Tax Bill 2025 proposes significant reforms to Kenya's taxation system, affecting 
                    income tax, corporate tax, and various other levies. Understanding these changes is 
                    crucial for informed public participation.
                  </p>
                  
                  <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 mb-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">Key Tax Reforms</span>
                    </div>
                    <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                      <li>• Personal income tax rate adjustments</li>
                      <li>• Corporate tax compliance requirements</li>
                      <li>• Digital service tax implementation</li>
                      <li>• Tax incentive restructuring</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="bg-blue-600 dark:bg-blue-500 p-2 rounded-lg">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-900 dark:text-white">Constitutional Principles</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    Tax legislation must comply with constitutional principles of equity, transparency, 
                    and public participation as outlined in Article 201 and 118(1) of the Constitution.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Equity Principle</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Tax burden should be fairly distributed based on ability to pay.
                      </p>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2">Transparency</h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Tax policies must be clear, predictable, and openly communicated.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Detailed tax analysis coming soon. Stay informed about how these changes affect you.
              </p>
              <a
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-colors"
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

export default TaxBill2025;

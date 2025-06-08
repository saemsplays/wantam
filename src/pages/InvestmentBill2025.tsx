
import React from 'react';
import { SharedLayout } from '../components/SharedLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Scale, FileText } from "lucide-react";

const InvestmentBill2025 = () => {
  return (
    <SharedLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium mb-6 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              <AlertTriangle className="h-5 w-5" />
              Investment Bill 2025 Analysis
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Investment Bill{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400">
                2025
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Examining investment policies and incentives that shape Kenya's economic future.
            </p>
          </div>

          <div className="space-y-8">
            <Card className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 border-emerald-200 dark:border-emerald-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="bg-emerald-600 dark:bg-emerald-500 p-2 rounded-lg">
                    <Scale className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-900 dark:text-white">Bill Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    The Investment Bill 2025 seeks to create a conducive environment for both domestic 
                    and foreign investment in Kenya. This legislation directly impacts job creation, 
                    economic growth, and sustainable development.
                  </p>
                  
                  <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 mb-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">Investment Focus Areas</span>
                    </div>
                    <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                      <li>• Foreign direct investment incentives</li>
                      <li>• Small and medium enterprise support</li>
                      <li>• Technology and innovation hubs</li>
                      <li>• Sustainable and green investments</li>
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
                  <span className="text-gray-900 dark:text-white">Economic Rights and Investment</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    Investment policies must align with Article 40 (right to property) and Article 43 
                    (economic and social rights) of the Constitution, ensuring benefits reach all Kenyans.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Job Creation</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Investments should prioritize employment opportunities for Kenyan citizens.
                      </p>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2">Local Content</h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Policies should promote local procurement and value addition.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Comprehensive investment analysis in development. Your voice matters in shaping Kenya's investment future.
              </p>
              <a
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-lg font-medium transition-colors"
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

export default InvestmentBill2025;

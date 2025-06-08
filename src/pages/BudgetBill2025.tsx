
import React from 'react';
import { SharedLayout } from '../components/SharedLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Scale, FileText } from "lucide-react";

const BudgetBill2025 = () => {
  return (
    <SharedLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium mb-6 bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
              <AlertTriangle className="h-5 w-5" />
              Budget Bill 2025 Analysis
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Budget Bill{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400">
                2025
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Understanding the proposed budget allocations and their impact on Kenya's development agenda.
            </p>
          </div>

          <div className="space-y-8">
            <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 border-orange-200 dark:border-orange-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="bg-orange-600 dark:bg-orange-500 p-2 rounded-lg">
                    <Scale className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-900 dark:text-white">Bill Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    The Budget Bill 2025 outlines the government's proposed expenditure and revenue collection 
                    strategies for the financial year 2025-2026. This bill affects every Kenyan through its 
                    impact on public services, infrastructure development, and economic policies.
                  </p>
                  
                  <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 mb-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">Key Areas of Concern</span>
                    </div>
                    <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                      <li>• Budget deficit and debt sustainability</li>
                      <li>• Public service delivery efficiency</li>
                      <li>• Infrastructure investment priorities</li>
                      <li>• Social protection and welfare programs</li>
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
                  <span className="text-gray-900 dark:text-white">Constitutional Basis for Public Participation</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    Article 118(1) of the Constitution mandates public participation in all legislative processes. 
                    Your input on the Budget Bill is not just welcome—it's your constitutional right and civic duty.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Article 118(1)</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Parliament shall facilitate public participation and involvement in the legislative process.
                      </p>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2">Article 201</h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Public finance shall promote transparent and accountable use of public resources.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                This analysis tool is under development. Check back soon for detailed Budget Bill 2025 analysis.
              </p>
              <a
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg font-medium transition-colors"
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

export default BudgetBill2025;


import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, AlertTriangle, Scale, Users } from "lucide-react";
import { Link } from 'react-router-dom';
import BillsFAB from '../components/BillsFAB';

const TaxBill2025 = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Finance Bill
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium mb-6 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300">
            <AlertTriangle className="h-5 w-5" />
            Coming Soon: Tax Bill 2025 Objection Platform
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Object to the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400">
              Tax Bill 2025
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            The Tax Bill 2025 objection platform is under development. 
            Participate in shaping Kenya's tax policies and regulations.
          </p>
        </div>

        <Card className="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700">
          <CardHeader>
            <CardTitle className="text-center text-green-900 dark:text-green-100">
              Tax Bill 2025 - Key Areas of Concern
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Digital Services Tax</h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Proposed changes to taxation of digital services and platforms
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Small Business Relief</h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Tax relief measures for small and medium enterprises
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Income Tax Bands</h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Adjustments to personal income tax brackets and rates
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Corporate Tax</h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Changes to corporate tax rates and incentives
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BillsFAB />
    </div>
  );
};

export default TaxBill2025;

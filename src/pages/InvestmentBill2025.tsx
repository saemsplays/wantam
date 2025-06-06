
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, AlertTriangle, Scale, Users } from "lucide-react";
import { Link } from 'react-router-dom';
import BillsFAB from '../components/BillsFAB';

const InvestmentBill2025 = () => {
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
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium mb-6 bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
            <AlertTriangle className="h-5 w-5" />
            Coming Soon: Investment Bill 2025 Objection Platform
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Object to the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
              Investment Bill 2025
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            The Investment Bill 2025 objection platform is coming soon. 
            Help shape policies that affect foreign and domestic investment in Kenya.
          </p>
        </div>

        <Card className="bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700">
          <CardHeader>
            <CardTitle className="text-center text-purple-900 dark:text-purple-100">
              Platform Under Development
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-purple-800 dark:text-purple-200 mb-6">
              We're working on creating a comprehensive platform for Investment Bill 2025 objections. 
              This will include provisions for foreign investment, domestic capital formation, and regulatory frameworks.
            </p>
            <Link to="/">
              <Button className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white">
                Return to Finance Bill Platform
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <BillsFAB />
    </div>
  );
};

export default InvestmentBill2025;

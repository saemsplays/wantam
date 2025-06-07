
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, AlertTriangle, Scale, Users } from "lucide-react";
import { Link } from 'react-router-dom';
import BillsFAB from '../components/BillsFAB';

const BudgetBill2025 = () => {
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
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium mb-6 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            <AlertTriangle className="h-5 w-5" />
            Coming Soon: Budget Bill 2025 Objection Platform
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Object to the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Budget Bill 2025
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            The Budget Bill 2025 objection platform is currently under development. 
            Exercise your constitutional right to participate in the budgetary process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 dark:bg-blue-500 p-2 rounded-lg flex-shrink-0">
                  <Scale className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Constitutional Basis</h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Article 221 of the Constitution requires public participation in budget processes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="bg-purple-600 dark:bg-purple-500 p-2 rounded-lg flex-shrink-0">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Public Participation</h3>
                  <p className="text-sm text-purple-800 dark:text-purple-200">
                    Citizens have the right to participate in budget planning and oversight
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="bg-green-600 dark:bg-green-500 p-2 rounded-lg flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Transparency</h3>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    Budget processes must be open, transparent, and accountable
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-center text-gray-900 dark:text-white">
              Stay Updated
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The Budget Bill 2025 objection platform will be available soon. 
              In the meantime, you can use the Finance Bill objection platform.
            </p>
            <Link to="/">
              <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white">
                Go to Finance Bill Platform
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <BillsFAB />
    </div>
  );
};

export default BudgetBill2025;

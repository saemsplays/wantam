
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, AlertTriangle, Scale, Users } from "lucide-react";
import { Link } from 'react-router-dom';
import BillsFAB from '../components/BillsFAB';

const DigitalEconomyBill2025 = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to #RejectFinanceBill2025
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium mb-6 bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
            <AlertTriangle className="h-5 w-5" />
            Coming Soon: Kenya Information and Communications (Amendment) Bill, 2025 Objection Platform
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Object to the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400">
              Digital Economy Bill 2025
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Kenya Information and Communications (Amendment) Bill, 2025 objection platform is in development. 
            Participate in shaping Kenya's digital transformation and technology policies.
          </p>
        </div>

        <Card className="bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-700">
          <CardHeader>
            <CardTitle className="text-center text-orange-900 dark:text-orange-100">
              Kenya Information and Communications (Amendment) Bill, 2025 - Key Focus Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Definition Expansion (Section 2)</h4>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  "Telecommunication operator" now explicitly includes ISPs.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Metered Billing System (New Section 27A(3C)-(3D))</h4>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  ISPs must implement a system that:

Assigns unique meter numbers to customers.

Monitors usage and converts it to readable details.

Generates invoices based on consumption.

Allows user verification of invoices.

Submits annual reports on the billing system to the Communications Authority.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Transitional Provisions (Fifth Schedule, New 2A)</h4>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Existing ISP licenses remain valid until expiry.

Subsequent licenses must be issued under this amended Act.
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

export default DigitalEconomyBill2025;
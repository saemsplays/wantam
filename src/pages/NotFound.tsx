
import React from 'react';
import { SharedLayout } from '../components/SharedLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Home } from "lucide-react";

const NotFound = () => {
  return (
    <SharedLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-3 text-2xl">
                <div className="bg-red-600 dark:bg-red-500 p-2 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <span className="text-gray-900 dark:text-white">Page Not Found</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h2 className="text-6xl font-bold text-gray-300 dark:text-gray-600 mb-4">404</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  The page you're looking for doesn't exist or has been moved.
                </p>
              </div>
              
              <a
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 text-white rounded-lg font-medium transition-colors"
              >
                <Home className="h-4 w-4" />
                Return Home
              </a>
              
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Continue exercising your constitutional rights at our main platform.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SharedLayout>
  );
};

export default NotFound;


import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Globe, Eye, Zap, FileText, AlertTriangle, ChevronRight } from "lucide-react";

const categories = [
  {
    id: 'local-ngos',
    title: 'Local NGOs & Human Rights',
    icon: Shield,
    description: 'Kenyan human rights organizations',
    color: 'bg-blue-500',
    urgency: 'safe'
  },
  {
    id: 'international-orgs',
    title: 'International Organizations',
    icon: Globe,
    description: 'UN bodies and international NGOs',
    color: 'bg-green-500',
    urgency: 'safe'
  },
  {
    id: 'secure-channels',
    title: 'Secure Digital Channels',
    icon: Eye,
    description: 'Encrypted and anonymous reporting',
    color: 'bg-purple-500',
    urgency: 'moderate'
  },
  {
    id: 'darkweb-options',
    title: 'Dark Web & Anonymous',
    icon: Zap,
    description: 'Maximum anonymity options',
    color: 'bg-red-500',
    urgency: 'high-risk'
  },
  {
    id: 'legal-support',
    title: 'Legal Aid & Documentation',
    icon: FileText,
    description: 'Legal assistance and evidence collection',
    color: 'bg-orange-500',
    urgency: 'safe'
  },
  {
    id: 'emergency-support',
    title: 'Emergency & Crisis Support',
    icon: AlertTriangle,
    description: 'Immediate safety and medical help',
    color: 'bg-red-600',
    urgency: 'urgent'
  }
];

const ReportViolations: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <a href="/" className="flex items-center text-gray-600 hover:text-gray-800 mb-4">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Finance Bill
          </a>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🛡️ Kenya Rights Hub
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Secure reporting channels for human rights violations
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-blue-800 mb-2">🔒 Security Notice</h3>
            <p className="text-blue-700 text-sm">
              Choose your security level carefully. Higher security options may carry legal risks but offer better protection.
              Your safety is paramount - always prioritize personal security when reporting violations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <a
                key={category.id}
                href={`/report-violations/${category.id}`}
                className="block"
              >
                <Card className={`h-full border-2 hover:border-gray-300 transition-all duration-200 hover:shadow-lg cursor-pointer group ${category.color} bg-opacity-5 hover:bg-opacity-10`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-lg ${category.color} bg-opacity-20`}>
                          <Icon className="h-6 w-6 text-gray-700" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{category.title}</CardTitle>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    
                    <div className="flex items-center">
                      <div className={`text-xs px-3 py-1 rounded-full font-medium ${
                        category.urgency === 'urgent' ? 'bg-red-100 text-red-700' :
                        category.urgency === 'high-risk' ? 'bg-orange-100 text-orange-700' :
                        category.urgency === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {category.urgency === 'urgent' ? '🚨 URGENT' :
                         category.urgency === 'high-risk' ? '⚠️ HIGH RISK' :
                         category.urgency === 'moderate' ? '⚡ MODERATE RISK' :
                         '✅ SAFE'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>
            );
          })}
        </div>

        <div className="mt-12 bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="font-semibold text-amber-800 mb-3">⚠️ Important Safety Guidelines</h3>
          <ul className="text-amber-700 space-y-2 text-sm">
            <li>• If you are in immediate danger, prioritize your safety and contact emergency services</li>
            <li>• Document evidence when it's safe to do so</li>
            <li>• Consider using secure communication methods for sensitive information</li>
            <li>• Know your rights under the Constitution of Kenya 2010</li>
            <li>• Seek support from trusted friends, family, or organizations</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReportViolations;

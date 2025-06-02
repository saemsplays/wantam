
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, FileText, Users, Scale, Shield } from 'lucide-react';

interface TourStarterProps {
  onStartTour: () => void;
}

const tourHighlights = [
  {
    title: 'Your Details',
    description: 'Enter your name to personalize the objection letter',
    icon: <Users className="w-5 h-5 text-blue-500" />,
  },
  {
    title: 'Choose Recipients',
    description: 'Select who should receive your constitutional objection',
    icon: <FileText className="w-5 h-5 text-emerald-500" />,
  },
  {
    title: 'Review Letter',
    description: 'Examine the pre-drafted constitutional objections',
    icon: <Scale className="w-5 h-5 text-purple-500" />,
  },
  {
    title: 'Send Objection',
    description: 'Submit your formal objection via email',
    icon: <Shield className="w-5 h-5 text-green-500" />,
  },
];

export const TourStarter: React.FC<TourStarterProps> = ({ onStartTour }) => {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-emerald-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Play className="h-5 w-5 text-white" />
          </div>
          Take a Guided Tour
        </CardTitle>
        <p className="text-gray-600">Learn how to submit your constitutional objection in 4 simple steps</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-6">
          {tourHighlights.map((highlight, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-lg">
                {highlight.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 text-sm">{highlight.title}</h4>
                <p className="text-xs text-gray-600">{highlight.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <Button 
          onClick={onStartTour}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Play className="mr-2 h-4 w-4" />
          Start Interactive Tour
        </Button>
      </CardContent>
    </Card>
  );
};

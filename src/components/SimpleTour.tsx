
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, X, Play } from "lucide-react";

interface TourStep {
  id: string;
  title: string;
  description: string;
  targetId: string;
}

interface SimpleTourProps {
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export const SimpleTour: React.FC<SimpleTourProps> = ({ isActive, onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tourSteps: TourStep[] = [
    {
      id: 'gpt-assistant',
      title: 'AI Assistant Available',
      description: 'Get help understanding the Finance Bill with our AI assistant',
      targetId: 'gpt-card'
    },
    {
      id: 'details',
      title: 'Enter Your Details',
      description: 'Add your name to personalize your objection letter',
      targetId: 'details'
    },
    {
      id: 'recipients',
      title: 'Choose Recipients',
      description: 'Select who should receive your constitutional objection',
      targetId: 'recipients'
    },
    {
      id: 'subject',
      title: 'Email Subject',
      description: 'Review and customize the email subject line',
      targetId: 'subject'
    },
    {
      id: 'letter',
      title: 'Review Your Letter',
      description: 'Examine the pre-drafted constitutional objections and edit if needed',
      targetId: 'letter'
    },
    {
      id: 'send',
      title: 'Send Your Objection',
      description: 'Submit your formal objection via your email app',
      targetId: 'send'
    }
  ];

  const currentStepData = tourSteps[currentStep];

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      // Scroll to the target element
      const element = document.getElementById(currentStepData.targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  if (!isActive) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-40 z-[60]" onClick={onSkip} />
      
      {/* Tour Card */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[61] w-full max-w-md mx-4">
        <Card className="shadow-2xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Tour Guide</CardTitle>
              <Button variant="ghost" size="sm" onClick={onSkip} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-1 mt-2">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">{currentStepData.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{currentStepData.description}</p>
            </div>
            
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <span className="text-sm text-gray-500">
                {currentStep + 1} of {tourSteps.length}
              </span>
              
              <Button onClick={handleNext} className="flex items-center gap-2">
                {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

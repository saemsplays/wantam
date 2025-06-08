import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const tourSteps: TourStep[] = [
    {
      id: 'start',
      title: 'Begin Your Guide',
      description: 'Welcome! I am here to guide you through your submission. Shall we?',
      targetId: 'hero'
    },
    {
      id: 'introduction',
      title: 'Introduction + Finance Bill GPT',
      description: 'Understand how the Constitution protects you + ask questions on the Finance Bill GPT',
      targetId: 'chad'
    },
    {
      id: 'details',
      title: 'Enter Your Details',
      description: 'Add a name to personalize your objection letter. You\'re free to use a pseudonym or initials.',
      targetId: 'details'
    },
    {
      id: 'recipients',
      title: 'Confirm Recipients',
      description: 'In this case, they\'ve been ticked for you',
      targetId: 'recipients'
    },
    {
      id: 'subject',
      title: 'Email Subject',
      description: 'Review and customize your email subject line',
      targetId: 'subject'
    },
    {
      id: 'letter',
      title: 'Review Your Letter',
      description: 'Examine and edit if needed',
      targetId: 'letter'
    },
    {
      id: 'send',
      title: 'Send Your Objection',
      description: 'You\'ll be redirected to your email app. Hit send and you\'re done!',
      targetId: 'send'
    }
  ];

  const currentStepData = tourSteps[currentStep];

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      const nextStep = tourSteps[currentStep + 1];
      const element = document.getElementById(nextStep.targetId);
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
      const prevStep = tourSteps[currentStep - 1];
      const element = document.getElementById(prevStep.targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  useEffect(() => {
    if (isActive && currentStepData) {
      const element = document.getElementById(currentStepData.targetId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, [isActive, currentStepData]);

  if (!isActive) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-40 z-[60]" onClick={onSkip} />

      {/* Tour Card */}
      <div
        className={`
          fixed z-[61] w-full max-w-sm mx-4 md:max-w-md
          ${isMobile ? 'left-1/2 bottom-4 -translate-x-1/2' : 'top-4 right-4'}
        `}
        style={isMobile ? { transform: 'translateX(-50%) scale(0.95)' } : {}}
      >
        <Card className="shadow-2xl border-2 border-blue-500">
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
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {currentStepData.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-100 leading-relaxed">
                {currentStepData.description}
              </p>
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

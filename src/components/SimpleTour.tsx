import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface TourStep {
  id: string;
  title: string;
  description: string;
  targetId: string;
  position?: number; // Added position property
}

interface SimpleTourProps {
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
  sections: { id: string; position: number }[]; // Added sections prop
}

export const SimpleTour: React.FC<SimpleTourProps> = ({ 
  isActive, 
  onComplete, 
  onSkip,
  sections 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Create tour steps with positions from sections
  const tourSteps: TourStep[] = useMemo(() => {
    const baseSteps = [
      {
        id: 'hero',
        title: 'Begin Your Guide',
        description: 'Welcome, fellow citizen! I am here to guide you through your submission. Shall we?',
        targetId: 'hero'
      },
      {
        id: 'chad',
        title: 'Change.Org + Download',
        description: 'View other petitions + download our app & WANTAM on the go!',
        targetId: 'chad'
      },
      {
        id: 'templates',
        title: 'View Email Templates',
        description: 'We\'ve made it simple for you to choose a template on the go. Peek around or simply create one.',
        targetId: 'templates'
      },
      {
        id: 'details',
        title: 'Enter Your Details',
        description: 'Add a name to personalize your template letter. You\'re free to use a pseudonym or initials.',
        targetId: 'details'
      },
      {
        id: 'recipients',
        title: 'Confirm Recipients',
        description: 'Confirm to whom this is being sent. In this case, they\'ve been ticked for you',
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

    // Merge positions from sections prop
    return baseSteps.map(step => ({
      ...step,
      position: sections.find(s => s.id === step.id)?.position
    }));
  }, [sections]);

  const currentStepData = tourSteps[currentStep];

  // Scroll handler using position percentage
  const scrollToPosition = (position?: number) => {
    if (position !== undefined) {
      const y = (position / 100) * document.documentElement.scrollHeight;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      scrollToPosition(tourSteps[currentStep + 1].position);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      scrollToPosition(tourSteps[currentStep - 1].position);
    }
  };

  useEffect(() => {
    if (isActive && currentStepData) {
      scrollToPosition(currentStepData.position);
    }
  }, [isActive, currentStepData]);

  if (!isActive) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-40 z-[60]" onClick={onSkip} />
      <div
        className={`fixed z-[61] w-full max-w-sm mx-4 md:max-w-md ${
          isMobile ? 'left-1/2 bottom-4 -translate-x-1/2' : 'top-4 right-4'
        }`}
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

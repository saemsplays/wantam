
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Play } from 'lucide-react';
import { ToastNotification } from './ToastNotification';

interface TourStep {
  target: string;
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  toast: string;
}

interface JoyrideTourProps {
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export const JoyrideTour: React.FC<JoyrideTourProps> = ({ isActive, onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [highlightElement, setHighlightElement] = useState<Element | null>(null);

  const tourSteps: TourStep[] = [
    {
      target: '#hero',
      title: 'Welcome to the Finance Bill Objection Platform',
      content: 'This platform helps you exercise your constitutional right to participate in Kenya\'s legislative process. Let\'s take a quick tour!',
      placement: 'center',
      toast: 'Welcome! Starting your constitutional rights tour 🇰🇪'
    },
    {
      target: '#details',
      title: 'Enter Your Details',
      content: 'Start by entering your full name. This will be used to personalize your objection letter. Your privacy is protected - no data is stored.',
      placement: 'top',
      toast: 'Step 1: Add your name to personalize the letter ✍️'
    },
    {
      target: '#recipients',
      title: 'Choose Recipients',
      content: 'Select who should receive your objection. Both the Clerk and Finance Committee are recommended for maximum impact.',
      placement: 'top',
      toast: 'Step 2: Choose who receives your objection 📧'
    },
    {
      target: '#letter',
      title: 'Review Your Letter',
      content: 'This pre-drafted letter cites specific constitutional violations. You can edit it or use it as-is. It covers VAT, digital lending tax, and privacy concerns.',
      placement: 'top',
      toast: 'Step 3: Review the legal objections 📄'
    },
    {
      target: '#send',
      title: 'Send Your Objection',
      content: 'Once everything looks good, click the send button to open your email app with everything pre-filled. Just review and send!',
      placement: 'top',
      toast: 'Final step: Send your constitutional objection! 🚀'
    }
  ];

  const currentStepData = tourSteps[currentStep];

  useEffect(() => {
    if (!isActive) return;

    // Show toast for current step
    if (currentStepData) {
      setToastMessage(currentStepData.toast);
      setShowToast(true);

      // Highlight current element
      const element = document.querySelector(currentStepData.target);
      setHighlightElement(element);

      // Scroll to element
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentStep, isActive, currentStepData]);

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTour = () => {
    setHighlightElement(null);
    setShowToast(false);
    onComplete();
  };

  const skipTour = () => {
    setHighlightElement(null);
    setShowToast(false);
    onSkip();
  };

  if (!isActive) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[55]" />

      {/* Highlight overlay for current element */}
      {highlightElement && (
        <div
          className="fixed z-[56] pointer-events-none border-4 border-blue-500 rounded-lg shadow-2xl shadow-blue-500/50"
          style={{
            top: highlightElement.getBoundingClientRect().top - 8,
            left: highlightElement.getBoundingClientRect().left - 8,
            width: highlightElement.getBoundingClientRect().width + 16,
            height: highlightElement.getBoundingClientRect().height + 16,
            transition: 'all 0.3s ease'
          }}
        />
      )}

      {/* Tour tooltip */}
      <div 
        className="fixed z-[57] bg-white rounded-xl shadow-2xl border border-gray-200 max-w-sm p-6"
        style={{
          top: highlightElement ? 
            (highlightElement.getBoundingClientRect().bottom + 20) + 'px' : 
            '50%',
          left: highlightElement ?
            Math.max(20, Math.min(window.innerWidth - 400, highlightElement.getBoundingClientRect().left)) + 'px' : 
            '50%',
          transform: !highlightElement ? 'translate(-50%, -50%)' : 'none'
        }}
      >
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-4">
          {tourSteps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <h3 className="font-semibold text-gray-900 mb-2">{currentStepData.title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed mb-6">{currentStepData.content}</p>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <button
            onClick={skipTour}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Skip Tour
          </button>

          <button
            onClick={nextStep}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
            {currentStep === tourSteps.length - 1 ? 
              <CheckCircle className="h-4 w-4" /> : 
              <ChevronRight className="h-4 w-4" />
            }
          </button>
        </div>
      </div>

      {/* Toast notification */}
      {showToast && (
        <ToastNotification
          message={toastMessage}
          type="info"
          onClose={() => setShowToast(false)}
          duration={4000}
        />
      )}
    </>
  );
};

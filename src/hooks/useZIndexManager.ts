import { useState, useCallback, useEffect, useRef } from 'react';

interface ZIndexManager {
  activeButton: string | null;
  bringToFront: (buttonId: string) => void;
  sendToBack: (buttonId: string) => void;
  reset: () => void;
  registerButton: (buttonId: string, ref: HTMLElement | null) => void;
  unregisterButton: (buttonId: string) => void;
}

export const useZIndexManager = (): ZIndexManager => {
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const buttonRefs = useRef<Map<string, HTMLElement>>(new Map());

  const bringToFront = useCallback((buttonId: string) => {
    setActiveButton(buttonId);
    document.body.classList.add('backdrop-blur-active');
  }, []);

  const sendToBack = useCallback((buttonId: string) => {
    if (activeButton === buttonId) {
      setActiveButton(null);
      document.body.classList.remove('backdrop-blur-active');
    }
  }, [activeButton]);

  const reset = useCallback(() => {
    setActiveButton(null);
    document.body.classList.remove('backdrop-blur-active');
  }, []);

  const registerButton = useCallback((buttonId: string, ref: HTMLElement | null) => {
    if (ref) {
      buttonRefs.current.set(buttonId, ref);
    } else {
      buttonRefs.current.delete(buttonId);
    }
  }, []);

  const unregisterButton = useCallback((buttonId: string) => {
    buttonRefs.current.delete(buttonId);
  }, []);

  // Handle click outside effect
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!activeButton) return;

      const target = event.target as Node;
      let clickedInsideButton = false;

      // Check if click is inside any registered button
      for (const [buttonId, buttonElement] of buttonRefs.current) {
        if (buttonElement && buttonElement.contains(target)) {
          clickedInsideButton = true;
          break;
        }
      }

      // If clicked outside all buttons, reset
      if (!clickedInsideButton) {
        reset();
      }
    };

    // Only add listener when there's an active button
    if (activeButton) {
      document.addEventListener('mousedown', handleClickOutside);
      
      // Also handle escape key
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          reset();
        }
      };
      document.addEventListener('keydown', handleEscape);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [activeButton, reset]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove('backdrop-blur-active');
    };
  }, []);

  return {
    activeButton,
    bringToFront,
    sendToBack,
    reset,
    registerButton,
    unregisterButton
  };
};

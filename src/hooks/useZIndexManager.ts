import { useState, useCallback, useEffect, useRef } from 'react';

interface ZIndexManager {
  activeButton: string | null;
  bringToFront: (buttonId: string) => void;
  sendToBack: (buttonId: string) => void;
  reset: () => void;
  registerButton: (buttonId: string, ref: HTMLElement | null) => void;
  unregisterButton: (buttonId: string) => void;
  registerChild: (buttonId: string, childRef: HTMLElement | null) => void;
}

export const useZIndexManager = (): ZIndexManager => {
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const buttonRefs = useRef<Map<string, HTMLElement>>(new Map());
  const childRefs = useRef<Map<string, HTMLElement[]>>(new Map());
  const isBlurActive = useRef<boolean>(false);

  const applyBlur = useCallback(() => {
    if (!isBlurActive.current) {
      document.body.classList.add('backdrop-blur-active');
      isBlurActive.current = true;
    }
  }, []);

  const removeBlur = useCallback(() => {
    if (isBlurActive.current) {
      document.body.classList.remove('backdrop-blur-active');
      isBlurActive.current = false;
    }
  }, []);

  const bringToFront = useCallback((buttonId: string) => {
    setActiveButton(buttonId);
    applyBlur();
    
    // Set high z-index for the button itself
    const activeElement = buttonRefs.current.get(buttonId);
    if (activeElement) {
      activeElement.style.zIndex = '9998';
      activeElement.style.position = activeElement.style.position || 'relative';
    }
    
    // Set high z-index for registered child elements of this button
    const childElements = childRefs.current.get(buttonId);
    if (childElements) {
      childElements.forEach(child => {
        child.style.zIndex = '9999';
        child.style.position = child.style.position || 'relative';
      });
    }
  }, [applyBlur]);

  const sendToBack = useCallback((buttonId: string) => {
    if (activeButton === buttonId) {
      setActiveButton(null);
      removeBlur();
    }
  }, [activeButton, removeBlur]);

  const reset = useCallback(() => {
    // Reset z-index for previously active elements
    if (activeButton) {
      const activeElement = buttonRefs.current.get(activeButton);
      if (activeElement) {
        activeElement.style.zIndex = '';
      }
      
      // Reset only the registered child elements for this button
      const childElements = childRefs.current.get(activeButton);
      if (childElements) {
        childElements.forEach(child => {
          child.style.zIndex = '';
        });
      }
    }
    
    setActiveButton(null);
    removeBlur();
  }, [activeButton, removeBlur]);

  const registerButton = useCallback((buttonId: string, ref: HTMLElement | null) => {
    if (ref) {
      buttonRefs.current.set(buttonId, ref);
    } else {
      buttonRefs.current.delete(buttonId);
    }
  }, []);

  const registerChild = useCallback((buttonId: string, childRef: HTMLElement | null) => {
    if (childRef) {
      const existing = childRefs.current.get(buttonId) || [];
      if (!existing.includes(childRef)) {
        childRefs.current.set(buttonId, [...existing, childRef]);
      }
    }
  }, []);

  const unregisterButton = useCallback((buttonId: string) => {
    buttonRefs.current.delete(buttonId);
    childRefs.current.delete(buttonId);
    // If the unregistered button was active, reset
    if (activeButton === buttonId) {
      reset();
    }
  }, [activeButton, reset]);

  // Handle click outside and escape key - always active to catch outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If no active button, nothing to reset
      if (!activeButton) return;

      const target = event.target as Node;
      
      // Check if click is inside any registered button
      for (const [, buttonElement] of buttonRefs.current) {
        if (buttonElement && buttonElement.contains(target)) {
          return; // Click is inside a button, don't reset
        }
      }
      
      // Clicked outside all buttons, reset blur and active state
      reset();
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && activeButton) {
        reset();
      }
    };

    // Always add event listeners to catch clicks outside
    document.addEventListener('mousedown', handleClickOutside, true); // Use capture phase
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [activeButton, reset]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      removeBlur();
      buttonRefs.current.clear();
      childRefs.current.clear();
    };
  }, [removeBlur]);

  return {
    activeButton,
    bringToFront,
    sendToBack,
    reset,
    registerButton,
    unregisterButton,
    registerChild
  };
};


import { useState, useCallback } from 'react';

interface ZIndexManager {
  activeButton: string | null;
  bringToFront: (buttonId: string) => void;
  sendToBack: (buttonId: string) => void;
  reset: () => void;
}

export const useZIndexManager = (): ZIndexManager => {
  const [activeButton, setActiveButton] = useState<string | null>(null);

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

  return {
    activeButton,
    bringToFront,
    sendToBack,
    reset
  };
};

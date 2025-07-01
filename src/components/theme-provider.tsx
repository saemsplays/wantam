
import React, { createContext, useContext } from 'react';

interface ThemeProviderContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

const ThemeProviderContext = createContext<ThemeProviderContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

import React, { createContext, useContext, ReactNode } from 'react';
import { useDecisionStore } from '../store/decisionStore';
import { lightTheme, darkTheme, Theme } from '../constants/theme';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const storeTheme = useDecisionStore((state) => state.theme);
  const toggleTheme = useDecisionStore((state) => state.toggleTheme);
  
  const theme = storeTheme === 'dark' ? darkTheme : lightTheme;
  const isDark = storeTheme === 'dark';
  
  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}


import React, { createContext, useContext, useState, useEffect } from 'react';

export type ShoppingMode = 'offline' | 'online';

export interface AppContextType {
  mode: ShoppingMode;
  setMode: (mode: ShoppingMode) => void;
  location: string;
  setLocation: (location: string) => void;
  pincode: string;
  setPincode: (pincode: string) => void;
  theme: 'light' | 'dark' | 'colorful';
  setTheme: (theme: 'light' | 'dark' | 'colorful') => void;
  accessibilityEnabled: boolean;
  setAccessibilityEnabled: (enabled: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ShoppingMode>('online');
  const [location, setLocation] = useState('');
  const [pincode, setPincode] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark' | 'colorful'>('light');
  const [accessibilityEnabled, setAccessibilityEnabled] = useState(false);

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('shopping-mode') as ShoppingMode;
    const savedLocation = localStorage.getItem('user-location');
    const savedPincode = localStorage.getItem('user-pincode');
    const savedTheme = localStorage.getItem('app-theme') as 'light' | 'dark' | 'colorful';
    const savedAccessibility = localStorage.getItem('accessibility-enabled');

    if (savedMode) setMode(savedMode);
    if (savedLocation) setLocation(savedLocation);
    if (savedPincode) setPincode(savedPincode);
    if (savedTheme) setTheme(savedTheme);
    if (savedAccessibility) setAccessibilityEnabled(savedAccessibility === 'true');
  }, []);

  // Save to localStorage when values change
  useEffect(() => {
    localStorage.setItem('shopping-mode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('user-location', location);
  }, [location]);

  useEffect(() => {
    localStorage.setItem('user-pincode', pincode);
  }, [pincode]);

  useEffect(() => {
    localStorage.setItem('app-theme', theme);
    // Apply theme to document
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('accessibility-enabled', accessibilityEnabled.toString());
  }, [accessibilityEnabled]);

  return (
    <AppContext.Provider
      value={{
        mode,
        setMode,
        location,
        setLocation,
        pincode,
        setPincode,
        theme,
        setTheme,
        accessibilityEnabled,
        setAccessibilityEnabled,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

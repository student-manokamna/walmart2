
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilitySettings {
  visuallyImpaired: boolean;
  hearingImpaired: boolean;
  colorblind: boolean;
  cognitiveDisabilities: boolean;
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  visualAlerts: boolean;
  textOnlyMode: boolean;
  colorblindPalette: 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  simpleLayout: boolean;
  iconNavigation: boolean;
  dyslexiaFriendlyFont: boolean;
  voiceControl: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  resetSettings: () => void;
  applySettings: () => void;
}

const defaultSettings: AccessibilitySettings = {
  visuallyImpaired: false,
  hearingImpaired: false,
  colorblind: false,
  cognitiveDisabilities: false,
  highContrast: false,
  largeText: false,
  screenReader: false,
  visualAlerts: false,
  textOnlyMode: false,
  colorblindPalette: 'normal',
  simpleLayout: false,
  iconNavigation: false,
  dyslexiaFriendlyFont: false,
  voiceControl: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    applySettings();
  }, [settings]);

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const applySettings = () => {
    const root = document.documentElement;
    
    // High contrast mode
    if (settings.highContrast) {
      root.classList.add('accessibility-high-contrast');
    } else {
      root.classList.remove('accessibility-high-contrast');
    }
    
    // Large text
    if (settings.largeText) {
      root.style.fontSize = '120%';
    } else {
      root.style.fontSize = '';
    }
    
    // Dyslexia-friendly font
    if (settings.dyslexiaFriendlyFont) {
      root.style.fontFamily = 'Arial, sans-serif';
      root.style.letterSpacing = '0.05em';
      root.style.lineHeight = '1.6';
    } else {
      root.style.fontFamily = '';
      root.style.letterSpacing = '';
      root.style.lineHeight = '';
    }
    
    // Colorblind palette
    root.setAttribute('data-colorblind', settings.colorblindPalette);
    
    // Simple layout
    if (settings.simpleLayout) {
      root.classList.add('accessibility-simple');
    } else {
      root.classList.remove('accessibility-simple');
    }
    
    // Screen reader support
    if (settings.screenReader) {
      root.setAttribute('aria-live', 'polite');
    } else {
      root.removeAttribute('aria-live');
    }
    
    // Voice control
    if (settings.voiceControl) {
      root.setAttribute('data-voice-control', 'enabled');
    } else {
      root.removeAttribute('data-voice-control');
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        applySettings,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

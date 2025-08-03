
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface NavigationStep {
  id: string;
  instruction: string;
  distance?: string;
  aisle?: string;
  direction?: string;
}

interface NavigationContextType {
  isNavigating: boolean;
  currentStep: NavigationStep | null;
  steps: NavigationStep[];
  startNavigation: (productName: string, mode: 'online' | 'offline') => void;
  stopNavigation: () => void;
  nextStep: () => void;
  speakInstruction: (text: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentStep, setCurrentStep] = useState<NavigationStep | null>(null);
  const [steps, setSteps] = useState<NavigationStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const { toast } = useToast();

  const speakInstruction = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const generateOfflineSteps = (productName: string): NavigationStep[] => {
    const distances = ['15m', '25m', '30m', '10m'];
    const aisles = ['Aisle 1', 'Aisle 2', 'Aisle 3', 'Aisle 4'];
    const directions = ['straight ahead', 'turn left', 'turn right', 'walk forward'];
    
    const randomDistance = distances[Math.floor(Math.random() * distances.length)];
    const randomAisle = aisles[Math.floor(Math.random() * aisles.length)];
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];

    return [
      {
        id: '1',
        instruction: `🧭 Walk ${randomDistance} ${randomDirection} to ${randomAisle} to find ${productName}.`,
        distance: randomDistance,
        aisle: randomAisle,
        direction: randomDirection
      },
      {
        id: '2',
        instruction: `📍 You're getting closer! Look for the ${productName} on your left side.`,
      },
      {
        id: '3',
        instruction: `✅ Found it! ${productName} should be right in front of you.`,
      }
    ];
  };

  const generateOnlineSteps = (productName: string): NavigationStep[] => {
    const categories = ['Snacks', 'Groceries', 'Beverages', 'Dairy', 'Bakery'];
    const filters = ['Low Sugar', 'High Protein', 'Organic', 'Low Fat', 'Gluten Free'];
    
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomFilter = filters[Math.floor(Math.random() * filters.length)];

    return [
      {
        id: '1',
        instruction: `🏠 Go to Homepage → Click on ${randomCategory} category to find ${productName}.`,
      },
      {
        id: '2',
        instruction: `🔍 Apply '${randomFilter}' filter to narrow down your search.`,
      },
      {
        id: '3',
        instruction: `✅ Perfect! You should now see ${productName} in the filtered results.`,
      }
    ];
  };

  const startNavigation = (productName: string, mode: 'online' | 'offline') => {
    const navigationSteps = mode === 'offline' 
      ? generateOfflineSteps(productName)
      : generateOnlineSteps(productName);

    setSteps(navigationSteps);
    setCurrentStepIndex(0);
    setCurrentStep(navigationSteps[0]);
    setIsNavigating(true);

    // Speak the first instruction
    speakInstruction(navigationSteps[0].instruction);
    
    // Show toast with navigation started
    toast({
      title: "🧭 Navigation Started",
      description: `Finding ${productName} in ${mode} mode`,
    });
  };

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      setCurrentStep(steps[nextIndex]);
      speakInstruction(steps[nextIndex].instruction);
    } else {
      stopNavigation();
      toast({
        title: "🎉 Navigation Complete!",
        description: "You've reached your destination.",
      });
    }
  };

  const stopNavigation = () => {
    setIsNavigating(false);
    setCurrentStep(null);
    setSteps([]);
    setCurrentStepIndex(0);
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  };

  return (
    <NavigationContext.Provider
      value={{
        isNavigating,
        currentStep,
        steps,
        startNavigation,
        stopNavigation,
        nextStep,
        speakInstruction,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

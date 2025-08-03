
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navigation, MapPin, Volume2, X, ArrowRight } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { useApp } from '../context/AppContext';

const SmartNavigation: React.FC = () => {
  const { isNavigating, currentStep, steps, stopNavigation, nextStep, speakInstruction } = useNavigation();
  const { mode } = useApp();

  if (!isNavigating || !currentStep) return null;

  const currentStepIndex = steps.findIndex(step => step.id === currentStep.id);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md mx-auto p-4">
      <Card className="bg-primary text-primary-foreground shadow-2xl border-2 border-primary-foreground/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Navigation className="h-5 w-5" />
              <span>Smart Navigation</span>
              <Badge variant="secondary" className="ml-2">
                {mode === 'offline' ? '🛍️ In-Store' : '🛒 Online'}
              </Badge>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={stopNavigation}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-primary-foreground/20 rounded-full h-2 mt-2">
            <div 
              className="bg-primary-foreground h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-sm opacity-90 mt-1">
            Step {currentStepIndex + 1} of {steps.length}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Current Instruction */}
          <div className="bg-primary-foreground/10 rounded-lg p-4">
            <p className="text-lg font-medium leading-relaxed">
              {currentStep.instruction}
            </p>
            
            {/* Offline-specific details */}
            {mode === 'offline' && currentStep.distance && (
              <div className="flex items-center space-x-4 mt-3 text-sm opacity-90">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{currentStep.distance}</span>
                </div>
                {currentStep.aisle && (
                  <div className="flex items-center space-x-1">
                    <span>🏪</span>
                    <span>{currentStep.aisle}</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button
              onClick={() => speakInstruction(currentStep.instruction)}
              variant="secondary"
              size="sm"
              className="flex-1"
            >
              <Volume2 className="h-4 w-4 mr-2" />
              Repeat
            </Button>
            
            {currentStepIndex < steps.length - 1 ? (
              <Button
                onClick={nextStep}
                variant="secondary"
                size="sm"
                className="flex-1"
              >
                Next Step
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={stopNavigation}
                variant="secondary"
                size="sm"
                className="flex-1"
              >
                Complete
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartNavigation;

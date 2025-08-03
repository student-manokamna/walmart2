
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Eye, Ear, Palette, Brain, RotateCcw, Type, Mic } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import HealthAnalysisPanel from './HealthAnalysisPanel';

const AccessibilitySettings: React.FC = () => {
  const { settings, updateSettings, resetSettings } = useAccessibility();

  const handleVisuallyImpairedChange = (enabled: boolean) => {
    updateSettings({
      visuallyImpaired: enabled,
      highContrast: enabled,
      largeText: enabled,
      screenReader: enabled,
    });
  };

  const handleHearingImpairedChange = (enabled: boolean) => {
    updateSettings({
      hearingImpaired: enabled,
      visualAlerts: enabled,
      textOnlyMode: enabled,
    });
  };

  const handleColorblindChange = (enabled: boolean) => {
    updateSettings({
      colorblind: enabled,
      colorblindPalette: enabled ? 'protanopia' : 'normal',
    });
  };

  const handleCognitiveChange = (enabled: boolean) => {
    updateSettings({
      cognitiveDisabilities: enabled,
      simpleLayout: enabled,
      iconNavigation: enabled,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Accessibility & Health Settings</h2>
        <p className="text-muted-foreground">
          Customize your experience based on your needs and health requirements
        </p>
      </div>

      {/* Visual Impairment Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>Visual Impairment Support</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="visually-impaired" className="text-base">
              Enable Visual Impairment Support
            </Label>
            <Switch
              id="visually-impaired"
              checked={settings.visuallyImpaired}
              onCheckedChange={handleVisuallyImpairedChange}
            />
          </div>
          
          {settings.visuallyImpaired && (
            <div className="space-y-3 pl-4 border-l-2 border-primary">
              <div className="flex items-center justify-between">
                <Label htmlFor="high-contrast">High Contrast Mode</Label>
                <Switch
                  id="high-contrast"
                  checked={settings.highContrast}
                  onCheckedChange={(checked) => updateSettings({ highContrast: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="large-text">Large Text (120% size)</Label>
                <Switch
                  id="large-text"
                  checked={settings.largeText}
                  onCheckedChange={(checked) => updateSettings({ largeText: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="screen-reader">Screen Reader Support</Label>
                <Switch
                  id="screen-reader"
                  checked={settings.screenReader}
                  onCheckedChange={(checked) => updateSettings({ screenReader: checked })}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hearing Impairment Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Ear className="h-5 w-5" />
            <span>Hearing Impairment Support</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="hearing-impaired" className="text-base">
              Enable Hearing Impairment Support
            </Label>
            <Switch
              id="hearing-impaired"
              checked={settings.hearingImpaired}
              onCheckedChange={handleHearingImpairedChange}
            />
          </div>
          
          {settings.hearingImpaired && (
            <div className="space-y-3 pl-4 border-l-2 border-primary">
              <div className="flex items-center justify-between">
                <Label htmlFor="visual-alerts">Visual Alerts & Notifications</Label>
                <Switch
                  id="visual-alerts"
                  checked={settings.visualAlerts}
                  onCheckedChange={(checked) => updateSettings({ visualAlerts: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="text-only">Text-Only Mode</Label>
                <Switch
                  id="text-only"
                  checked={settings.textOnlyMode}
                  onCheckedChange={(checked) => updateSettings({ textOnlyMode: checked })}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Colorblind Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>Colorblind Support</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="colorblind" className="text-base">
              Enable Colorblind Support
            </Label>
            <Switch
              id="colorblind"
              checked={settings.colorblind}
              onCheckedChange={handleColorblindChange}
            />
          </div>
          
          {settings.colorblind && (
            <div className="space-y-3 pl-4 border-l-2 border-primary">
              <div className="space-y-2">
                <Label htmlFor="colorblind-palette">Colorblind Type</Label>
                <Select
                  value={settings.colorblindPalette}
                  onValueChange={(value) => updateSettings({ colorblindPalette: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal Vision</SelectItem>
                    <SelectItem value="protanopia">Protanopia (Red-blind)</SelectItem>
                    <SelectItem value="deuteranopia">Deuteranopia (Green-blind)</SelectItem>
                    <SelectItem value="tritanopia">Tritanopia (Blue-blind)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dyslexia & Reading Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Type className="h-5 w-5" />
            <span>Reading & Dyslexia Support</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="dyslexia-font" className="text-base">
              Dyslexia-Friendly Font
            </Label>
            <Switch
              id="dyslexia-font"
              checked={settings.dyslexiaFriendlyFont}
              onCheckedChange={(checked) => updateSettings({ dyslexiaFriendlyFont: checked })}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Uses Arial font with increased letter spacing and line height for better readability.
          </p>
        </CardContent>
      </Card>

      {/* Voice Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mic className="h-5 w-5" />
            <span>Voice Control</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="voice-control" className="text-base">
              Enable Voice Control
            </Label>
            <Switch
              id="voice-control"
              checked={settings.voiceControl}
              onCheckedChange={(checked) => updateSettings({ voiceControl: checked })}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Allows navigation and interaction using voice commands.
          </p>
        </CardContent>
      </Card>

      {/* Cognitive Disabilities Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>Cognitive Disabilities Support</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="cognitive" className="text-base">
              Enable Cognitive Support
            </Label>
            <Switch
              id="cognitive"
              checked={settings.cognitiveDisabilities}
              onCheckedChange={handleCognitiveChange}
            />
          </div>
          
          {settings.cognitiveDisabilities && (
            <div className="space-y-3 pl-4 border-l-2 border-primary">
              <div className="flex items-center justify-between">
                <Label htmlFor="simple-layout">Simple Layout</Label>
                <Switch
                  id="simple-layout"
                  checked={settings.simpleLayout}
                  onCheckedChange={(checked) => updateSettings({ simpleLayout: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="icon-navigation">Icon-Based Navigation</Label>
                <Switch
                  id="icon-navigation"
                  checked={settings.iconNavigation}
                  onCheckedChange={(checked) => updateSettings({ iconNavigation: checked })}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Health Analysis Panel */}
      <HealthAnalysisPanel />

      <Separator />

      {/* Reset Settings */}
      <div className="flex justify-center">
        <Button
          onClick={resetSettings}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset All Settings</span>
        </Button>
      </div>

      {/* Current Settings Summary */}
      <Card className="bg-muted">
        <CardHeader>
          <CardTitle>Current Settings Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Visual Support:</p>
              <p className={settings.visuallyImpaired ? 'text-green-600' : 'text-muted-foreground'}>
                {settings.visuallyImpaired ? 'Enabled' : 'Disabled'}
              </p>
            </div>
            <div>
              <p className="font-medium">Hearing Support:</p>
              <p className={settings.hearingImpaired ? 'text-green-600' : 'text-muted-foreground'}>
                {settings.hearingImpaired ? 'Enabled' : 'Disabled'}
              </p>
            </div>
            <div>
              <p className="font-medium">Colorblind Support:</p>
              <p className={settings.colorblind ? 'text-green-600' : 'text-muted-foreground'}>
                {settings.colorblind ? `Enabled (${settings.colorblindPalette})` : 'Disabled'}
              </p>
            </div>
            <div>
              <p className="font-medium">Cognitive Support:</p>
              <p className={settings.cognitiveDisabilities ? 'text-green-600' : 'text-muted-foreground'}>
                {settings.cognitiveDisabilities ? 'Enabled' : 'Disabled'}
              </p>
            </div>
            <div>
              <p className="font-medium">Dyslexia Font:</p>
              <p className={settings.dyslexiaFriendlyFont ? 'text-green-600' : 'text-muted-foreground'}>
                {settings.dyslexiaFriendlyFont ? 'Enabled' : 'Disabled'}
              </p>
            </div>
            <div>
              <p className="font-medium">Voice Control:</p>
              <p className={settings.voiceControl ? 'text-green-600' : 'text-muted-foreground'}>
                {settings.voiceControl ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessibilitySettings;

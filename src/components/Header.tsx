import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MapPin, Settings, Palette, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import AccessibilitySettings from './AccessibilitySettings';

const Header: React.FC = () => {
  const { mode, setMode, location, setLocation, pincode, setPincode, theme, setTheme, accessibilityEnabled, setAccessibilityEnabled } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAccessibilitySettings, setShowAccessibilitySettings] = useState(false);
  const currentLocation = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSettings = () => setShowSettings(!showSettings);

  const handleModeToggle = (checked: boolean) => {
    setMode(checked ? 'online' : 'offline');
  };

  const isActiveRoute = (path: string) => currentLocation.pathname === path;

  return (
    <>
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleMenu}
                className="p-2 hover:bg-accent rounded-md transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">W</span>
                </div>
                <h1 className="text-xl font-bold text-foreground">Walmart AI Assistant</h1>
              </Link>
            </div>

            {/* Mode Toggle and Location */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Offline 🛍️</span>
                <Switch
                  checked={mode === 'online'}
                  onCheckedChange={handleModeToggle}
                  aria-label="Toggle shopping mode"
                />
                <span className="text-sm font-medium">Online 🛒</span>
              </div>

              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-32 h-8"
                />
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSettings}
                className="p-2"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleMenu}>
          <nav className="fixed left-0 top-0 h-full w-80 bg-background border-r border-border transform transition-transform duration-300 ease-in-out z-50">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-semibold">Navigation</h2>
                <Button variant="ghost" size="sm" onClick={toggleMenu}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <ul className="space-y-4">
                <li>
                  <Link
                    to="/"
                    className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
                      isActiveRoute('/') ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                    }`}
                    onClick={toggleMenu}
                  >
                    <span>🏠</span>
                    <span>Home</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop"
                    className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
                      isActiveRoute('/shop') ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                    }`}
                    onClick={toggleMenu}
                  >
                    <span>🛒</span>
                    <span>Shop</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/customise"
                    className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
                      isActiveRoute('/customise') ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                    }`}
                    onClick={toggleMenu}
                  >
                    <span>✂️</span>
                    <span>Customise</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/checkout"
                    className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
                      isActiveRoute('/checkout') ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                    }`}
                    onClick={toggleMenu}
                  >
                    <span>💳</span>
                    <span>Checkout</span>
                  </Link>
                </li>
                
                {/* Accessibility Settings in Menu */}
                <li>
                  <button
                    onClick={() => {
                      setShowAccessibilitySettings(true);
                      toggleMenu();
                    }}
                    className="flex items-center space-x-3 p-3 rounded-md transition-colors hover:bg-accent w-full text-left"
                  >
                    <span>♿</span>
                    <span>Accessibility Settings</span>
                  </button>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleSettings}>
          <div className="fixed right-0 top-0 h-full w-80 bg-background border-l border-border transform transition-transform duration-300 ease-in-out z-50">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-semibold">Settings</h2>
                <Button variant="ghost" size="sm" onClick={toggleSettings}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Theme Selection */}
                <div>
                  <Label className="text-sm font-medium mb-3 flex items-center">
                    <Palette className="h-4 w-4 mr-2" />
                    Theme
                  </Label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="theme"
                        value="light"
                        checked={theme === 'light'}
                        onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'colorful')}
                        className="w-4 h-4"
                      />
                      <span>Light</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="theme"
                        value="dark"
                        checked={theme === 'dark'}
                        onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'colorful')}
                        className="w-4 h-4"
                      />
                      <span>Dark</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="theme"
                        value="colorful"
                        checked={theme === 'colorful'}
                        onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'colorful')}
                        className="w-4 h-4"
                      />
                      <span>Colorful</span>
                    </label>
                  </div>
                </div>

                {/* Accessibility */}
                <div>
                  <Label className="text-sm font-medium mb-3 flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    Accessibility
                  </Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={accessibilityEnabled}
                        onCheckedChange={setAccessibilityEnabled}
                      />
                      <span className="text-sm">High contrast mode</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowAccessibilitySettings(true);
                        setShowSettings(false);
                      }}
                      className="w-full"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Advanced Accessibility
                    </Button>
                  </div>
                </div>

                {/* Location Settings */}
                <div>
                  <Label className="text-sm font-medium mb-3 flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Location
                  </Label>
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="Enter your location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                    <Input
                      type="text"
                      placeholder="Enter pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accessibility Settings Modal */}
      {showAccessibilitySettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Accessibility Settings</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAccessibilitySettings(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <AccessibilitySettings />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

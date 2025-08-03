
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useProducts } from '../context/ProductsContext';
import { useNavigation } from '../context/NavigationContext';
import { useHealth } from '../context/HealthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { MapPin, Wifi, WifiOff, Search, Mic, ShoppingCart, Scissors, Sparkles, Heart, AlertTriangle, QrCode, Leaf, Navigation, ArrowRight } from 'lucide-react';

const Index: React.FC = () => {
  const { mode, location, pincode } = useApp();
  const { cart, products } = useProducts();
  const { startNavigation } = useNavigation();
  const { userAllergies, analyzeProduct } = useHealth();
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const nearbyItems = products.filter(p => p.distance && p.aisle).slice(0, 4);
  const trendingItems = products.filter(p => !p.distance).slice(0, 4);

  const handleSmartNavigation = () => {
    setActiveDemo('navigation');
    startNavigation("Milk", "offline");
  };

  const handleHealthAnalysis = () => {
    setActiveDemo('health');
  };

  const handleAllergenAlerts = () => {
    setActiveDemo('allergen');
  };

  const handleEcoFriendly = () => {
    setActiveDemo('eco');
  };

  const handleQRScan = () => {
    setActiveDemo('qr');
  };

  // Demo content for different features
  const renderDemoContent = () => {
    if (!activeDemo) return null;

    switch (activeDemo) {
      case 'health':
        return (
          <Card className="mt-6 border-2 border-green-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-700">
                <Heart className="h-5 w-5" />
                <span>Health Analysis Demo</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-semibold">Health Categories:</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h5 className="font-medium text-blue-800">💙 Diabetic Friendly</h5>
                    <p className="text-sm text-blue-600">Low sugar, high fiber foods</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <h5 className="font-medium text-red-800">❤️ Heart Healthy</h5>
                    <p className="text-sm text-red-600">Low sodium, lean proteins</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <h5 className="font-medium text-purple-800">💪 Fitness</h5>
                    <p className="text-sm text-purple-600">High protein, energy foods</p>
                  </div>
                  <div className="p-3 bg-pink-50 rounded-lg">
                    <h5 className="font-medium text-pink-800">🤰 Pregnancy</h5>
                    <p className="text-sm text-pink-600">Safe nutrition, vitamins</p>
                  </div>
                </div>
                <Button onClick={() => setActiveDemo(null)} variant="outline" className="w-full">
                  Close Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'allergen':
        return (
          <Card className="mt-6 border-2 border-orange-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-orange-700">
                <AlertTriangle className="h-5 w-5" />
                <span>Allergen Alerts Demo</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-semibold">Common Allergens:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['Nuts', 'Dairy', 'Gluten', 'Shellfish', 'Eggs', 'Soy'].map((allergen) => (
                    <div key={allergen} className="flex items-center space-x-2 p-2 bg-orange-50 rounded">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">{allergen}</span>
                      {userAllergies.includes(allergen.toLowerCase()) && (
                        <Badge variant="destructive" className="text-xs">Avoid</Badge>
                      )}
                    </div>
                  ))}
                </div>
                <Button onClick={() => setActiveDemo(null)} variant="outline" className="w-full">
                  Close Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'eco':
        return (
          <Card className="mt-6 border-2 border-green-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-700">
                <Leaf className="h-5 w-5" />
                <span>Eco-Friendly Products Demo</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-semibold">Environmental Impact:</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Organic Apples</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Leaf className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-green-600">Eco-Friendly</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">Processed Snacks</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-xs text-red-600">High Impact</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Local Vegetables</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Leaf className="h-4 w-4 text-yellow-500" />
                      <span className="text-xs text-yellow-600">Sustainable</span>
                    </div>
                  </div>
                </div>
                <Button onClick={() => setActiveDemo(null)} variant="outline" className="w-full">
                  Close Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'qr':
        return (
          <Card className="mt-6 border-2 border-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-700">
                <QrCode className="h-5 w-5" />
                <span>QR Scanner Demo</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-center">
                <div className="w-32 h-32 mx-auto bg-blue-100 rounded-lg flex items-center justify-center">
                  <QrCode className="h-16 w-16 text-blue-500" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Point your camera at a product barcode to get instant nutrition info, allergen alerts, and health analysis
                </p>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600">Demo: Scanned Cereal Box</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs">✅ Gluten-Free</p>
                    <p className="text-xs">⚠️ High Sugar Content</p>
                    <p className="text-xs">🌱 Eco-Friendly Packaging</p>
                  </div>
                </div>
                <Button onClick={() => setActiveDemo(null)} variant="outline" className="w-full">
                  Close Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome to Walmart AI Assistant
        </h1>
        <div className="flex items-center justify-center space-x-2 text-muted-foreground">
          {mode === 'online' ? (
            <>
              <Wifi className="h-5 w-5 text-green-500" />
              <span>Online Shopping Mode</span>
            </>
          ) : (
            <>
              <WifiOff className="h-5 w-5 text-blue-500" />
              <span>Offline In-Store Mode</span>
            </>
          )}
        </div>
        {pincode && (
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>Location: {pincode}</span>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button asChild className="h-16 text-left justify-start">
          <Link to="/shop" className="flex items-center space-x-3">
            <Search className="h-6 w-6" />
            <div>
              <div className="font-semibold">Search Products</div>
              <div className="text-sm opacity-75">Find what you need</div>
            </div>
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="h-16 text-left justify-start">
          <Link to="/shop" className="flex items-center space-x-3">
            <Mic className="h-6 w-6" />
            <div>
              <div className="font-semibold">Voice Search</div>
              <div className="text-sm opacity-75">Speak to search</div>
            </div>
          </Link>
        </Button>

        <Button asChild variant="outline" className="h-16 text-left justify-start">
          <Link to="/checkout" className="flex items-center space-x-3">
            <ShoppingCart className="h-6 w-6" />
            <div>
              <div className="font-semibold">View Cart</div>
              <div className="text-sm opacity-75">
                {cartItemCount} items • ${cartTotal.toFixed(2)}
              </div>
            </div>
            {cartItemCount > 0 && (
              <Badge className="ml-auto">
                {cartItemCount}
              </Badge>
            )}
          </Link>
        </Button>
      </div>

      {/* AI Features Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card hover:bg-accent transition-colors cursor-pointer" onClick={handleQRScan}>
          <CardContent className="flex flex-col items-center justify-center p-6 h-32">
            <QrCode className="h-8 w-8 text-blue-500 mb-2" />
            <h3 className="font-semibold text-lg">Scan QR Code</h3>
            <p className="text-sm text-muted-foreground text-center">Point camera at product barcode</p>
          </CardContent>
        </Card>

        <Card className="bg-card hover:bg-accent transition-colors cursor-pointer" onClick={handleHealthAnalysis}>
          <CardContent className="flex flex-col items-center justify-center p-6 h-32">
            <Heart className="h-8 w-8 text-red-500 mb-2" />
            <h3 className="font-semibold text-lg">Health Analysis</h3>
            <p className="text-sm text-muted-foreground text-center">Get personalized health insights</p>
          </CardContent>
        </Card>

        <Card className="bg-card hover:bg-accent transition-colors cursor-pointer" onClick={handleAllergenAlerts}>
          <CardContent className="flex flex-col items-center justify-center p-6 h-32">
            <AlertTriangle className="h-8 w-8 text-orange-500 mb-2" />
            <h3 className="font-semibold text-lg">Allergen Alerts</h3>
            <p className="text-sm text-muted-foreground text-center">Identify potential allergens</p>
          </CardContent>
        </Card>

        <Card className="bg-card hover:bg-accent transition-colors cursor-pointer" onClick={handleEcoFriendly}>
          <CardContent className="flex flex-col items-center justify-center p-6 h-32">
            <Leaf className="h-8 w-8 text-green-500 mb-2" />
            <h3 className="font-semibold text-lg">Eco-Friendly</h3>
            <p className="text-sm text-muted-foreground text-center">Sustainable product choices</p>
          </CardContent>
        </Card>
      </div>

      {/* Demo Content */}
      {renderDemoContent()}

      {/* Mode-specific content */}
      {mode === 'offline' ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Nearby Items in Store</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nearbyItems.map((item, index) => {
                  const healthAnalysis = analyzeProduct(item);
                  return (
                    <div
                      key={index}
                      className="p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{item.name}</h3>
                          {/* Eco-friendly indicator */}
                          {healthAnalysis.ecoFriendly ? (
                            <div className="w-3 h-3 bg-green-500 rounded-full" title="Eco-Friendly" />
                          ) : (
                            <div className="w-3 h-3 bg-red-500 rounded-full" title="Not Eco-Friendly" />
                          )}
                        </div>
                        <span className="text-primary font-bold">${item.price}</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground mb-2">
                        <span>📍 {item.distance} away</span>
                        <span>🏪 {item.aisle}</span>
                      </div>
                      <Button size="sm" className="w-full">
                        <MapPin className="h-4 w-4 mr-2" />
                        Get Directions
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5" />
                <span>Trending Products</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trendingItems.map((item, index) => {
                  const healthAnalysis = analyzeProduct(item);
                  return (
                    <div
                      key={index}
                      className="p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold">{item.name}</h3>
                                {/* Eco-friendly indicator */}
                                {healthAnalysis.ecoFriendly ? (
                                  <div className="w-3 h-3 bg-green-500 rounded-full" title="Eco-Friendly" />
                                ) : (
                                  <div className="w-3 h-3 bg-red-500 rounded-full" title="Not Eco-Friendly" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{item.category}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-primary font-bold">${item.price}</span>
                              <div className="text-sm text-muted-foreground">
                                ⭐ {item.rating}
                              </div>
                            </div>
                          </div>
                          <Button size="sm" className="w-full">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Assistant Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Scissors className="h-5 w-5" />
              <span>Custom Orders</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Design custom clothing and place orders with AI assistance.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/customise">Start Customizing</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mic className="h-5 w-5" />
              <span>Voice Shopping</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Use voice commands to search and shop hands-free.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/shop">Try Voice Search</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Smart Navigation - Only show for offline mode */}
        {mode === 'offline' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Navigation className="h-5 w-5" />
                <span>Smart Navigation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Get directions to items in-store with AR assistance.
              </p>
              <Button onClick={handleSmartNavigation} variant="outline" className="w-full">
                <ArrowRight className="h-4 w-4 mr-2" />
                Try Navigation Demo
              </Button>
              {activeDemo === 'navigation' && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Navigation className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-blue-700">Navigation Active</span>
                  </div>
                  <div className="space-y-1 text-xs text-blue-600">
                    <p>📍 Turn right towards Dairy section</p>
                    <p>🚶‍♂️ Walk 50 feet straight</p>
                    <p>🥛 Milk is on Aisle 3, Shelf B</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Current Cart Preview */}
      {cartItemCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Your Cart</span>
              </div>
              <Badge>{cartItemCount} items</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <span className="text-muted-foreground">
                {cart.slice(0, 3).map(item => item.name).join(', ')}
                {cart.length > 3 && ` and ${cart.length - 3} more items`}
              </span>
              <span className="text-2xl font-bold text-primary">
                ${cartTotal.toFixed(2)}
              </span>
            </div>
            <div className="flex space-x-2">
              <Button asChild className="flex-1">
                <Link to="/checkout">
                  Checkout Now
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link to="/shop">
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Index;

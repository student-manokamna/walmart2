
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { QrCode, Scan, Heart, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { useToast } from '@/hooks/use-toast';

interface ScannedProductData {
  id: string;
  name: string;
  barcode: string;
  ingredients: string[];
  nutrition: {
    calories: number;
    fat: number;
    saturatedFat: number;
    sodium: number;
    sugar: number;
    protein: number;
    fiber: number;
  };
  allergens: string[];
}

const QRScanner: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<ScannedProductData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { analyzeProduct, addScannedProduct, userProfile } = useHealth();
  const { toast } = useToast();

  // Mock product database
  const mockProducts: ScannedProductData[] = [
    {
      id: '1',
      name: 'Coca Cola Original',
      barcode: '1234567890',
      ingredients: ['Carbonated Water', 'High Fructose Corn Syrup', 'Caramel Color', 'Phosphoric Acid', 'Natural Flavors', 'Caffeine'],
      nutrition: {
        calories: 140,
        fat: 0,
        saturatedFat: 0,
        sodium: 45,
        sugar: 39,
        protein: 0,
        fiber: 0,
      },
      allergens: [],
    },
    {
      id: '2',
      name: 'Peanut Butter Cookies',
      barcode: '0987654321',
      ingredients: ['Wheat Flour', 'Peanut Butter', 'Sugar', 'Eggs', 'Butter', 'Baking Soda', 'Salt'],
      nutrition: {
        calories: 180,
        fat: 9,
        saturatedFat: 3,
        sodium: 190,
        sugar: 12,
        protein: 4,
        fiber: 1,
      },
      allergens: ['Peanuts', 'Gluten', 'Eggs'],
    },
    {
      id: '3',
      name: 'Organic Apple Juice',
      barcode: '1122334455',
      ingredients: ['Organic Apple Juice', 'Vitamin C'],
      nutrition: {
        calories: 110,
        fat: 0,
        saturatedFat: 0,
        sodium: 10,
        sugar: 24,
        protein: 0,
        fiber: 0,
      },
      allergens: [],
    },
  ];

  const simulateQRScan = () => {
    setIsScanning(true);
    toast({
      title: "📱 QR Scanner Active",
      description: "Hold your camera steady over the QR code or barcode",
    });

    // Simulate scanning delay
    setTimeout(() => {
      const randomProduct = mockProducts[Math.floor(Math.random() * mockProducts.length)];
      setScannedProduct(randomProduct);
      setIsScanning(false);
      setIsModalOpen(true);
      
      // Add to scanned products
      const productWithAnalysis = {
        ...randomProduct,
        healthAnalysis: analyzeProduct(randomProduct as any),
      };
      addScannedProduct(productWithAnalysis);
      
      toast({
        title: "✅ Product Scanned Successfully",
        description: `Found ${randomProduct.name}`,
      });
    }, 2000);
  };

  if (!scannedProduct && !isScanning) {
    return (
      <div className="space-y-4">
        <Button
          onClick={simulateQRScan}
          className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          <QrCode className="h-6 w-6 mr-3" />
          Scan Product QR Code
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 border rounded-lg">
            <Scan className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <h3 className="font-semibold">Scan QR Code</h3>
            <p className="text-sm text-muted-foreground">Point camera at product barcode</p>
          </div>
          <div className="p-4 border rounded-lg">
            <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
            <h3 className="font-semibold">Health Analysis</h3>
            <p className="text-sm text-muted-foreground">Get personalized health insights</p>
          </div>
          <div className="p-4 border rounded-lg">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-orange-500" />
            <h3 className="font-semibold">Allergen Alerts</h3>
            <p className="text-sm text-muted-foreground">Identify potential allergens</p>
          </div>
        </div>
      </div>
    );
  }

  if (isScanning) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">
            <QrCode className="h-20 w-20 mx-auto mb-4 text-blue-500" />
            <h3 className="text-xl font-semibold mb-2">Scanning...</h3>
            <p className="text-muted-foreground">Position the QR code in your camera view</p>
            <div className="mt-4 flex justify-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" />
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
            </div>
          </div>
          <Button
            onClick={() => setIsScanning(false)}
            variant="outline"
            className="mt-4"
          >
            Cancel
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!scannedProduct) return null;

  const healthAnalysis = analyzeProduct(scannedProduct as any);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <QrCode className="h-6 w-6" />
              <span>Product Analysis</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsModalOpen(false);
                setScannedProduct(null);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            {/* Product Info */}
            <div className="text-center">
              <h2 className="text-2xl font-bold">{scannedProduct.name}</h2>
              <p className="text-muted-foreground">Barcode: {scannedProduct.barcode}</p>
              
              {/* Health Score */}
              <div className="mt-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                    healthAnalysis.healthScore >= 80 ? 'bg-green-100 text-green-800' :
                    healthAnalysis.healthScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {healthAnalysis.healthScore}
                  </div>
                  <div>
                    <p className="font-semibold">Health Score</p>
                    <p className="text-sm text-muted-foreground">
                      {healthAnalysis.isHealthy ? 'Healthy Choice' : 'Consume Moderately'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Tabs defaultValue="health" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="health">Health</TabsTrigger>
                <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                <TabsTrigger value="allergens">Allergens</TabsTrigger>
              </TabsList>

              <TabsContent value="health" className="space-y-4">
                {/* Health Warnings */}
                {healthAnalysis.warnings.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Health Warnings
                    </h4>
                    <ul className="space-y-1">
                      {healthAnalysis.warnings.map((warning, index) => (
                        <li key={index} className="text-red-700 text-sm">• {warning}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {healthAnalysis.recommendations.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Recommendations
                    </h4>
                    <ul className="space-y-1">
                      {healthAnalysis.recommendations.map((rec, index) => (
                        <li key={index} className="text-green-700 text-sm">• {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Health Tags */}
                <div className="flex flex-wrap gap-2">
                  {healthAnalysis.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant={tag.includes('High') ? 'destructive' : 'secondary'}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="ingredients">
                <ScrollArea className="h-40">
                  <div className="space-y-2">
                    {scannedProduct.ingredients.map((ingredient, index) => (
                      <div key={index} className="p-2 bg-muted rounded-md">
                        <span className="text-sm">{ingredient}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="nutrition">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Calories</span>
                      <span className="font-semibold">{scannedProduct.nutrition.calories}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Fat</span>
                      <span className="font-semibold">{scannedProduct.nutrition.fat}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturated Fat</span>
                      <span className="font-semibold">{scannedProduct.nutrition.saturatedFat}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sodium</span>
                      <span className="font-semibold">{scannedProduct.nutrition.sodium}mg</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Sugar</span>
                      <span className="font-semibold">{scannedProduct.nutrition.sugar}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Protein</span>
                      <span className="font-semibold">{scannedProduct.nutrition.protein}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fiber</span>
                      <span className="font-semibold">{scannedProduct.nutrition.fiber}g</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="allergens">
                <div className="space-y-3">
                  {scannedProduct.allergens.length > 0 ? (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <h4 className="font-semibold text-orange-800 mb-2">⚠️ Contains Allergens:</h4>
                      <div className="flex flex-wrap gap-2">
                        {scannedProduct.allergens.map((allergen, index) => (
                          <Badge key={index} variant="destructive">
                            {allergen}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800">✅ No Common Allergens Detected</h4>
                      <p className="text-green-700 text-sm mt-1">
                        This product appears to be free from common allergens like nuts, dairy, gluten, and soy.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRScanner;

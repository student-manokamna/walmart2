
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Shirt, Palette, Scissors, ShoppingCart } from 'lucide-react';

interface CustomOrder {
  type: string;
  fabric: string;
  color: string;
  size: string;
  description: string;
  image?: string;
  price: number;
}

const Customise: React.FC = () => {
  const [selectedType, setSelectedType] = useState('shirt');
  const [selectedFabric, setSelectedFabric] = useState('cotton');
  const [selectedColor, setSelectedColor] = useState('blue');
  const [selectedSize, setSelectedSize] = useState('M');
  const [description, setDescription] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const clothingTypes = [
    { id: 'shirt', name: 'Shirt', price: 29.99, icon: '👔' },
    { id: 'dress', name: 'Dress', price: 49.99, icon: '👗' },
    { id: 'pants', name: 'Pants', price: 39.99, icon: '👖' },
    { id: 'jacket', name: 'Jacket', price: 79.99, icon: '🧥' }
  ];

  const fabrics = [
    { id: 'cotton', name: 'Cotton', price: 0, description: 'Comfortable and breathable' },
    { id: 'silk', name: 'Silk', price: 20, description: 'Luxurious and smooth' },
    { id: 'wool', name: 'Wool', price: 15, description: 'Warm and durable' },
    { id: 'linen', name: 'Linen', price: 10, description: 'Light and airy' }
  ];

  const colors = [
    { id: 'blue', name: 'Blue', hex: '#3B82F6' },
    { id: 'red', name: 'Red', hex: '#EF4444' },
    { id: 'green', name: 'Green', hex: '#10B981' },
    { id: 'black', name: 'Black', hex: '#1F2937' },
    { id: 'white', name: 'White', hex: '#F9FAFB' },
    { id: 'purple', name: 'Purple', hex: '#8B5CF6' }
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const calculatePrice = () => {
    const basePrice = clothingTypes.find(t => t.id === selectedType)?.price || 0;
    const fabricPrice = fabrics.find(f => f.id === selectedFabric)?.price || 0;
    const customizationFee = description ? 10 : 0;
    return basePrice + fabricPrice + customizationFee;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    // Here you would typically send the order to your backend
    console.log('Custom order placed:', {
      type: selectedType,
      fabric: selectedFabric,
      color: selectedColor,
      size: selectedSize,
      description,
      image: uploadedImage,
      price: calculatePrice()
    });
  };

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">✂️</div>
            <h2 className="text-2xl font-bold mb-2">Custom Order Placed!</h2>
            <p className="text-muted-foreground mb-4">
              Your custom clothing order has been received. We'll start working on it right away!
            </p>
            <div className="bg-muted p-4 rounded-lg mb-4">
              <p className="text-sm">
                <strong>Estimated delivery:</strong> 7-10 business days
              </p>
              <p className="text-sm">
                <strong>Order total:</strong> ${calculatePrice().toFixed(2)}
              </p>
            </div>
            <Button onClick={() => setOrderPlaced(false)} className="w-full">
              Create Another Custom Item
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">✂️ Custom Clothing Designer</h1>
        <p className="text-muted-foreground">
          Design your perfect outfit with AI assistance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customization Options */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="type" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="type">Type</TabsTrigger>
              <TabsTrigger value="fabric">Fabric</TabsTrigger>
              <TabsTrigger value="style">Style</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="type" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shirt className="h-5 w-5" />
                    <span>Choose Clothing Type</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {clothingTypes.map(type => (
                      <div
                        key={type.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors text-center ${
                          selectedType === type.id ? 'border-primary bg-primary/10' : 'hover:bg-accent'
                        }`}
                        onClick={() => setSelectedType(type.id)}
                      >
                        <div className="text-4xl mb-2">{type.icon}</div>
                        <h3 className="font-semibold">{type.name}</h3>
                        <p className="text-sm text-muted-foreground">${type.price}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fabric" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Palette className="h-5 w-5" />
                    <span>Select Fabric</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fabrics.map(fabric => (
                      <div
                        key={fabric.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedFabric === fabric.id ? 'border-primary bg-primary/10' : 'hover:bg-accent'
                        }`}
                        onClick={() => setSelectedFabric(fabric.id)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{fabric.name}</h3>
                          {fabric.price > 0 && (
                            <Badge variant="secondary">+${fabric.price}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{fabric.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="style" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Color & Size</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Color</Label>
                    <div className="grid grid-cols-6 gap-3">
                      {colors.map(color => (
                        <div
                          key={color.id}
                          className={`w-12 h-12 rounded-full cursor-pointer border-4 transition-all ${
                            selectedColor === color.id ? 'border-primary scale-110' : 'border-gray-200 hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.hex }}
                          onClick={() => setSelectedColor(color.id)}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-3 block">Size</Label>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map(size => (
                        <Button
                          key={size}
                          variant={selectedSize === size ? 'default' : 'outline'}
                          onClick={() => setSelectedSize(size)}
                          className="w-12 h-12"
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Custom Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="description">Special Instructions</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe any special requirements, measurements, or design preferences..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                    />
                    {description && (
                      <p className="text-sm text-primary mt-2">
                        +$10 customization fee
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Upload Reference Image</Label>
                    <div className="mt-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        {uploadedImage ? (
                          <img
                            src={uploadedImage}
                            alt="Uploaded reference"
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <div className="text-center">
                            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-500">
                              Click to upload reference image
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview & Order */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">
                    {clothingTypes.find(t => t.id === selectedType)?.icon}
                  </div>
                  <div
                    className="w-16 h-4 mx-auto rounded"
                    style={{ backgroundColor: colors.find(c => c.id === selectedColor)?.hex }}
                  />
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="font-semibold">
                    {clothingTypes.find(t => t.id === selectedType)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Fabric:</span>
                  <span className="font-semibold">
                    {fabrics.find(f => f.id === selectedFabric)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Color:</span>
                  <span className="font-semibold">
                    {colors.find(c => c.id === selectedColor)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span className="font-semibold">{selectedSize}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Base Price:</span>
                  <span>${clothingTypes.find(t => t.id === selectedType)?.price}</span>
                </div>
                {fabrics.find(f => f.id === selectedFabric)?.price! > 0 && (
                  <div className="flex justify-between">
                    <span>Fabric Upgrade:</span>
                    <span>+${fabrics.find(f => f.id === selectedFabric)?.price}</span>
                  </div>
                )}
                {description && (
                  <div className="flex justify-between">
                    <span>Customization:</span>
                    <span>+$10</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${calculatePrice().toFixed(2)}</span>
                </div>
              </div>

              <Button onClick={handlePlaceOrder} className="w-full" size="lg">
                <Scissors className="h-4 w-4 mr-2" />
                Place Custom Order
              </Button>

              <div className="text-xs text-muted-foreground text-center">
                Estimated delivery: 7-10 business days
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Customise;

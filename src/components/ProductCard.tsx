
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, ShoppingCart, Navigation, AlertTriangle, CheckCircle } from 'lucide-react';
import { Product } from '../context/ProductsContext';
import { useProducts } from '../context/ProductsContext';
import { useApp } from '../context/AppContext';
import { useNavigation } from '../context/NavigationContext';
import { useHealth } from '../context/HealthContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useProducts();
  const { mode } = useApp();
  const { startNavigation } = useNavigation();
  const { analyzeProduct, getProductCompatibility } = useHealth();

  const healthAnalysis = analyzeProduct(product);
  const compatibility = getProductCompatibility(product);

  const handleNavigate = () => {
    startNavigation(product.name, mode);
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="p-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{product.category}</Badge>
              {/* Health Score Badge */}
              <div className={`px-2 py-1 rounded-full text-xs font-bold ${getHealthScoreColor(healthAnalysis.healthScore)}`}>
                {healthAnalysis.healthScore}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-muted-foreground">{product.rating}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
        
        {/* Health Information */}
        <div className="space-y-2 mb-4">
          {/* Health Tags */}
          <div className="flex flex-wrap gap-1">
            {healthAnalysis.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant={tag.includes('High') ? 'destructive' : 'secondary'}
                className="text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
          
          {/* Health Warnings */}
          {healthAnalysis.warnings.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-2">
              <div className="flex items-center space-x-1 text-red-700">
                <AlertTriangle className="h-3 w-3" />
                <span className="text-xs font-medium">Health Alert</span>
              </div>
              <p className="text-xs text-red-600 mt-1">
                {healthAnalysis.warnings[0]}
              </p>
            </div>
          )}
          
          {/* Health Recommendations */}
          {healthAnalysis.recommendations.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-md p-2">
              <div className="flex items-center space-x-1 text-green-700">
                <CheckCircle className="h-3 w-3" />
                <span className="text-xs font-medium">Recommended</span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                {healthAnalysis.recommendations[0]}
              </p>
            </div>
          )}
        </div>
        
        {mode === 'offline' && product.distance && product.aisle && (
          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{product.distance} away</span>
            </div>
            <span>🏪 {product.aisle}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
          <Badge variant={product.inStock ? "default" : "destructive"}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 space-y-2">
        <Button 
          onClick={() => addToCart(product)}
          disabled={!product.inStock}
          className="w-full"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
        
        {/* Navigation Button for Offline Mode */}
        {mode === 'offline' && product.distance && (
          <Button
            onClick={handleNavigate}
            variant="outline"
            className="w-full"
          >
            <Navigation className="h-4 w-4 mr-2" />
            Get Directions
          </Button>
        )}
        
        {/* Online Navigation Button */}
        {mode === 'online' && (
          <Button
            onClick={handleNavigate}
            variant="outline"
            className="w-full"
          >
            <Navigation className="h-4 w-4 mr-2" />
            Find Online
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductCard;

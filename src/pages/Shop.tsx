
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Mic, Filter, MicOff } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { useVoiceSearch } from '../hooks/useVoiceSearch';
import ProductCard from '../components/ProductCard';
import { useApp } from '../context/AppContext';

const Shop: React.FC = () => {
  const { products, searchProducts, filterByCategory } = useProducts();
  const { mode } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const { isListening, startListening, stopListening, isSupported } = useVoiceSearch((transcript) => {
    setSearchQuery(transcript);
  });

  const categories = useMemo(() => {
    const cats = products.map(p => p.category);
    return [...new Set(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products;
    
    if (searchQuery) {
      result = searchProducts(searchQuery);
    }
    
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }
    
    // Show items with distance first for offline mode
    if (mode === 'offline') {
      result = result.sort((a, b) => {
        if (a.distance && !b.distance) return -1;
        if (!a.distance && b.distance) return 1;
        return 0;
      });
    }
    
    return result;
  }, [products, searchQuery, selectedCategory, mode, searchProducts]);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">
          {mode === 'offline' ? '🛍️ In-Store Shopping' : '🛒 Online Shopping'}
        </h1>
        <p className="text-muted-foreground">
          {mode === 'offline' 
            ? 'Find items near you in the store' 
            : 'Browse our complete product catalog'
          }
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Search & Filter</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-12"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                {isSupported && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={isListening ? stopListening : startListening}
                    className={isListening ? 'text-red-500' : ''}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Voice Status */}
          {isListening && (
            <div className="text-center p-2 bg-red-50 rounded-md">
              <span className="text-red-600 text-sm">🎤 Listening... Speak now!</span>
            </div>
          )}

          {/* Category Filter */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Categories:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedCategory === '' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedCategory('')}
              >
                All
              </Badge>
              {categories.map(category => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory && ` in ${selectedCategory}`}
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* No Results */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filters
          </p>
          <Button onClick={() => { setSearchQuery(''); setSelectedCategory(''); }}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Shop;

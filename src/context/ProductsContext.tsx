
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  distance?: string;
  aisle?: string;
  inStock: boolean;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ProductsContextType {
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  searchProducts: (query: string) => Product[];
  filterByCategory: (category: string) => Product[];
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

// Mock products data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Fresh Apples',
    price: 3.99,
    category: 'Produce',
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300',
    rating: 4.5,
    distance: '50m',
    aisle: 'Aisle 1',
    inStock: true,
    description: 'Fresh red apples, perfect for snacking'
  },
  {
    id: '2',
    name: 'Milk (Gallon)',
    price: 2.89,
    category: 'Dairy',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300',
    rating: 4.3,
    distance: '120m',
    aisle: 'Aisle 3',
    inStock: true,
    description: 'Fresh whole milk, 1 gallon'
  },
  {
    id: '3',
    name: 'iPhone 15 Pro',
    price: 999.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300',
    rating: 4.8,
    inStock: true,
    description: 'Latest iPhone with advanced camera system'
  },
  {
    id: '4',
    name: 'Nike Air Max',
    price: 129.99,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300',
    rating: 4.6,
    inStock: true,
    description: 'Comfortable running shoes with air cushioning'
  },
  {
    id: '5',
    name: 'Instant Pot',
    price: 79.99,
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300',
    rating: 4.7,
    inStock: true,
    description: 'Multi-use pressure cooker, slow cooker, and more'
  },
  {
    id: '6',
    name: 'Bread (Whole Wheat)',
    price: 2.49,
    category: 'Bakery',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300',
    rating: 4.2,
    distance: '80m',
    aisle: 'Aisle 2',
    inStock: true,
    description: 'Fresh baked whole wheat bread'
  }
];

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products] = useState<Product[]>(mockProducts);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('walmart-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('walmart-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const searchProducts = (query: string): Product[] => {
    return products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
  };

  const filterByCategory = (category: string): Product[] => {
    return products.filter(product => product.category === category);
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        searchProducts,
        filterByCategory,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

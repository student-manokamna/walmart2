
import React, { createContext, useContext, useState } from 'react';
import { Product } from './ProductsContext';

interface HealthProfile {
  diabetes: boolean;
  heartDisease: boolean;
  highBloodPressure: boolean;
  pregnancy: boolean;
  allergies: string[];
  dietaryPreferences: string[];
  ageGroup: 'child' | 'adult' | 'senior';
  fitnessGoals: string[];
}

interface HealthAnalysis {
  isHealthy: boolean;
  suitableFor: string[];
  warnings: string[];
  recommendations: string[];
  healthScore: number;
  tags: string[];
  ecoFriendly: boolean;
  allergenWarnings: string[];
}

interface ScannedProduct {
  id: string;
  name: string;
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
  healthAnalysis: HealthAnalysis;
}

interface HealthContextType {
  userProfile: HealthProfile;
  updateProfile: (profile: Partial<HealthProfile>) => void;
  analyzeProduct: (product: Product | ScannedProduct) => HealthAnalysis;
  scannedProducts: ScannedProduct[];
  addScannedProduct: (product: ScannedProduct) => void;
  getProductCompatibility: (product: Product) => {
    compatible: boolean;
    warnings: string[];
    recommendations: string[];
    allergenWarnings: string[];
  };
  userAllergies: string[];
  updateAllergies: (allergies: string[]) => void;
}

const defaultProfile: HealthProfile = {
  diabetes: false,
  heartDisease: false,
  highBloodPressure: false,
  pregnancy: false,
  allergies: [],
  dietaryPreferences: [],
  ageGroup: 'adult',
  fitnessGoals: [],
};

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<HealthProfile>(defaultProfile);
  const [scannedProducts, setScannedProducts] = useState<ScannedProduct[]>([]);
  const [userAllergies, setUserAllergies] = useState<string[]>([]);

  const updateProfile = (profile: Partial<HealthProfile>) => {
    setUserProfile(prev => ({ ...prev, ...profile }));
  };

  const updateAllergies = (allergies: string[]) => {
    setUserAllergies(allergies);
    setUserProfile(prev => ({ ...prev, allergies }));
  };

  const analyzeProduct = (product: Product | ScannedProduct): HealthAnalysis => {
    const analysis: HealthAnalysis = {
      isHealthy: true,
      suitableFor: [],
      warnings: [],
      recommendations: [],
      healthScore: 85,
      tags: [],
      ecoFriendly: false,
      allergenWarnings: [],
    };

    // Simulate health analysis based on product name and category
    const productName = product.name.toLowerCase();
    const category = 'category' in product ? product.category.toLowerCase() : '';
    
    // Check for allergens
    const commonAllergens = ['nuts', 'dairy', 'gluten', 'shellfish', 'eggs', 'soy'];
    commonAllergens.forEach(allergen => {
      if (productName.includes(allergen) && userAllergies.some(allergy => allergy.toLowerCase().includes(allergen))) {
        analysis.allergenWarnings.push(`Contains ${allergen} - You are allergic to this!`);
        analysis.warnings.push(`⚠️ ALLERGEN WARNING: ${allergen}`);
        analysis.healthScore -= 30;
      }
    });

    // Eco-friendliness check
    const ecoFriendlyKeywords = ['organic', 'natural', 'plant-based', 'sustainable', 'eco'];
    analysis.ecoFriendly = ecoFriendlyKeywords.some(keyword => productName.includes(keyword));
    
    // Analyze based on product type
    if (productName.includes('sugar') || productName.includes('candy') || productName.includes('soda')) {
      analysis.healthScore = 25;
      analysis.isHealthy = false;
      analysis.warnings.push('High sugar content');
      analysis.tags.push('High Sugar');
      
      if (userProfile.diabetes) {
        analysis.warnings.push('❌ Not suitable for diabetics');
      }
    }
    
    if (productName.includes('oil') || productName.includes('fried') || category.includes('snacks')) {
      analysis.healthScore -= 20;
      analysis.warnings.push('High oil content');
      analysis.tags.push('High Fat');
      
      if (userProfile.heartDisease) {
        analysis.warnings.push('❌ Not recommended for heart patients');
      }
    }
    
    if (productName.includes('salt') || productName.includes('chips') || productName.includes('pickle')) {
      analysis.healthScore -= 15;
      analysis.warnings.push('High sodium content');
      analysis.tags.push('High Sodium');
      
      if (userProfile.highBloodPressure) {
        analysis.warnings.push('❌ High sodium - not suitable for hypertension');
      }
    }
    
    // Positive analysis
    if (productName.includes('apple') || productName.includes('vegetable') || category.includes('produce')) {
      analysis.healthScore = 95;
      analysis.isHealthy = true;
      analysis.suitableFor.push('Everyone');
      analysis.tags.push('Natural', 'Healthy');
      analysis.recommendations.push('✅ Great source of vitamins and fiber');
      analysis.ecoFriendly = true;
    }
    
    if (productName.includes('protein') || productName.includes('chicken') || productName.includes('fish')) {
      analysis.healthScore += 10;
      analysis.tags.push('High Protein');
      analysis.suitableFor.push('✅ Fitness enthusiasts');
      analysis.recommendations.push('✅ Good for muscle building');
    }
    
    // Age-specific recommendations
    if (userProfile.ageGroup === 'child') {
      if (productName.includes('milk') || productName.includes('cheese')) {
        analysis.recommendations.push('✅ Good for growing children');
      }
    }
    
    if (userProfile.ageGroup === 'senior') {
      if (productName.includes('calcium') || productName.includes('vitamin')) {
        analysis.recommendations.push('✅ Beneficial for seniors');
      }
    }

    return analysis;
  };

  const getProductCompatibility = (product: Product) => {
    const analysis = analyzeProduct(product);
    
    return {
      compatible: analysis.warnings.length === 0 && analysis.allergenWarnings.length === 0,
      warnings: analysis.warnings,
      recommendations: analysis.recommendations,
      allergenWarnings: analysis.allergenWarnings,
    };
  };

  const addScannedProduct = (product: ScannedProduct) => {
    setScannedProducts(prev => [product, ...prev]);
  };

  return (
    <HealthContext.Provider
      value={{
        userProfile,
        updateProfile,
        analyzeProduct,
        scannedProducts,
        addScannedProduct,
        getProductCompatibility,
        userAllergies,
        updateAllergies,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (context === undefined) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};

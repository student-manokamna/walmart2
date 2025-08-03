
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Heart, Dumbbell, Baby, Activity, Leaf, AlertTriangle } from 'lucide-react';

const HealthAnalysisPanel: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);

  const healthCategories = [
    {
      id: 'diabetic',
      title: 'Diabetic Person',
      icon: Activity,
      color: 'bg-blue-500',
      recommendations: [
        'Low glycemic index foods (quinoa, oats)',
        'High fiber vegetables (broccoli, spinach)',
        'Lean proteins (chicken, fish)',
        'Nuts and seeds in moderation'
      ],
      avoid: [
        'Sugary drinks and desserts',
        'White bread and refined grains',
        'Processed foods high in sodium',
        'Fried and fatty foods'
      ]
    },
    {
      id: 'heart-patient',
      title: 'Heart Patient',
      icon: Heart,
      color: 'bg-red-500',
      recommendations: [
        'Omega-3 rich fish (salmon, mackerel)',
        'Whole grains and fiber',
        'Fresh fruits and vegetables',
        'Low-fat dairy products'
      ],
      avoid: [
        'High sodium processed foods',
        'Trans fats and saturated fats',
        'Excessive alcohol',
        'Red meat in large quantities'
      ]
    },
    {
      id: 'gym-goer',
      title: 'Gym-Goer',
      icon: Dumbbell,
      color: 'bg-green-500',
      recommendations: [
        'High protein foods (eggs, chicken)',
        'Complex carbohydrates (sweet potato)',
        'Pre-workout bananas and dates',
        'Post-workout protein shakes'
      ],
      avoid: [
        'Heavy meals before workout',
        'High-fat foods pre-exercise',
        'Excessive sugar',
        'Alcohol before training'
      ]
    },
    {
      id: 'pregnant',
      title: 'Pregnant Woman',
      icon: Baby,
      color: 'bg-pink-500',
      recommendations: [
        'Folate-rich foods (leafy greens)',
        'Calcium sources (dairy, almonds)',
        'Iron-rich foods (lean meat, beans)',
        'Prenatal vitamins'
      ],
      avoid: [
        'Raw or undercooked meat/eggs',
        'High mercury fish',
        'Alcohol and caffeine excess',
        'Unpasteurized dairy products'
      ]
    }
  ];

  const commonAllergies = [
    'Nuts (peanuts, tree nuts)',
    'Dairy products',
    'Gluten/Wheat',
    'Shellfish',
    'Eggs',
    'Soy products',
    'Fish',
    'Sesame seeds'
  ];

  const handleAllergyToggle = (allergy: string) => {
    setSelectedAllergies(prev => 
      prev.includes(allergy) 
        ? prev.filter(a => a !== allergy)
        : [...prev, allergy]
    );
  };

  const selectedCategoryData = healthCategories.find(cat => cat.id === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Health Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Health Analysis Panel</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {healthCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <IconComponent className="h-6 w-6" />
                  <span className="text-sm font-medium">{category.title}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Category Details */}
      {selectedCategoryData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <selectedCategoryData.icon className="h-5 w-5" />
              <span>{selectedCategoryData.title} - Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recommended Foods */}
              <div>
                <h4 className="font-semibold text-green-600 mb-3 flex items-center">
                  ✅ Recommended Foods
                </h4>
                <ul className="space-y-2">
                  {selectedCategoryData.recommendations.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm">{item}</span>
                      <Badge variant="outline" className="ml-auto text-xs">
                        <Leaf className="h-3 w-3 mr-1" />
                        Eco-friendly
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Foods to Avoid */}
              <div>
                <h4 className="font-semibold text-red-600 mb-3 flex items-center">
                  ❌ Foods to Avoid
                </h4>
                <ul className="space-y-2">
                  {selectedCategoryData.avoid.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Allergy Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Allergy Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Select your allergies to get personalized food recommendations and warnings:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {commonAllergies.map((allergy, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`allergy-${index}`}
                    checked={selectedAllergies.includes(allergy)}
                    onCheckedChange={() => handleAllergyToggle(allergy)}
                  />
                  <Label 
                    htmlFor={`allergy-${index}`} 
                    className="text-sm cursor-pointer"
                  >
                    {allergy}
                  </Label>
                </div>
              ))}
            </div>

            {selectedAllergies.length > 0 && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h5 className="font-semibold text-yellow-800 mb-2">
                  ⚠️ Your Selected Allergies:
                </h5>
                <div className="flex flex-wrap gap-2">
                  {selectedAllergies.map((allergy, index) => (
                    <Badge key={index} variant="destructive" className="text-xs">
                      {allergy}
                    </Badge>
                  ))}
                </div>
                <p className="text-yellow-700 text-sm mt-2">
                  Products containing these allergens will be highlighted with warning labels.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthAnalysisPanel;

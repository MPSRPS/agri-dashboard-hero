
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useTranslation } from '@/hooks/useTranslation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Loader2, Sprout, Leaf, Droplets } from 'lucide-react';

const FertilizerRecommendation = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cropType: '',
    soilType: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    ph: '',
    moisture: '',
  });
  const [recommendation, setRecommendation] = useState<null | {
    fertilizer: string;
    application: string;
    timing: string;
    dosage: string;
    alternatives: string[];
    notes: string;
  }>(null);

  const cropOptions = [
    { value: 'rice', label: 'Rice' },
    { value: 'wheat', label: 'Wheat' },
    { value: 'maize', label: 'Maize' },
    { value: 'cotton', label: 'Cotton' },
    { value: 'sugarcane', label: 'Sugarcane' },
    { value: 'potato', label: 'Potato' },
    { value: 'tomato', label: 'Tomato' },
    { value: 'onion', label: 'Onion' },
  ];

  const soilOptions = [
    { value: 'sandy', label: 'Sandy' },
    { value: 'loamy', label: 'Loamy' },
    { value: 'clay', label: 'Clay' },
    { value: 'silty', label: 'Silty' },
    { value: 'peaty', label: 'Peaty' },
    { value: 'chalky', label: 'Chalky' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock API call - would connect to a real API in production
    setTimeout(() => {
      // This would typically be the result from an API
      const mockRecommendations = {
        rice: {
          fertilizer: 'Urea',
          application: 'Split application',
          timing: 'Apply 30-40% at transplanting, 30-40% at tillering, and 20-30% at panicle initiation',
          dosage: '250-300 kg/ha',
          alternatives: ['Ammonium Sulfate', 'NPK 15-15-15'],
          notes: 'For optimal results, ensure proper water management. Apply in dry soil conditions followed by irrigation.'
        },
        wheat: {
          fertilizer: 'NPK 12-32-16',
          application: 'Broadcast application',
          timing: 'Apply 50% at sowing and 50% at crown root initiation stage',
          dosage: '200-250 kg/ha',
          alternatives: ['Diammonium Phosphate (DAP)', 'NPK 10-26-26'],
          notes: 'Supplement with foliar spray of 2% urea at heading stage for better grain filling.'
        },
        maize: {
          fertilizer: 'NPK 20-10-10',
          application: 'Band placement',
          timing: 'Apply 50% at sowing, 25% at knee-high stage, and 25% at tasseling',
          dosage: '300-350 kg/ha',
          alternatives: ['Urea + Single Super Phosphate', 'NPK 15-15-15'],
          notes: 'For high-yielding varieties, consider adding micronutrients like zinc sulfate (25 kg/ha).'
        },
        cotton: {
          fertilizer: 'NPK 15-15-15',
          application: 'Split application',
          timing: 'Apply 33% at sowing, 33% at square formation, and 33% at flowering',
          dosage: '200-250 kg/ha',
          alternatives: ['DAP + Muriate of Potash (MOP)', 'NPK 12-32-16'],
          notes: 'Foliar application of 2% DAP at boll development stage enhances yield.'
        },
        sugarcane: {
          fertilizer: 'NPK 10-26-26',
          application: 'Band placement',
          timing: 'Apply 25% at planting, 50% at tillering, and 25% at grand growth phase',
          dosage: '500-600 kg/ha',
          alternatives: ['Urea + Single Super Phosphate + MOP', 'NPK 14-35-14'],
          notes: 'Apply organic manure (10-15 tons/ha) before planting for better results.'
        },
        potato: {
          fertilizer: 'NPK 19-19-19',
          application: 'Broadcast and incorporation',
          timing: 'Apply 50% at planting and 50% at tuber initiation',
          dosage: '400-450 kg/ha',
          alternatives: ['DAP + MOP', 'NPK 12-32-16'],
          notes: 'Calcium and magnesium supplementation improves tuber quality.'
        },
        tomato: {
          fertilizer: 'NPK 13-40-13',
          application: 'Drip fertigation',
          timing: 'Apply 30% at transplanting, 40% at flowering, and 30% at fruiting',
          dosage: '300-350 kg/ha',
          alternatives: ['NPK 19-19-19', 'DAP + MOP'],
          notes: 'Regular foliar application of micronutrients prevents blossom end rot.'
        },
        onion: {
          fertilizer: 'NPK 15-15-15',
          application: 'Broadcast application',
          timing: 'Apply 40% at transplanting and 60% in 2-3 splits during bulb development',
          dosage: '250-300 kg/ha',
          alternatives: ['Ammonium Sulfate + Single Super Phosphate + MOP', 'NPK 19-19-19'],
          notes: 'Sulfur application enhances pungency and storage quality.'
        }
      };
      
      const cropType = formData.cropType as keyof typeof mockRecommendations;
      if (mockRecommendations[cropType]) {
        setRecommendation(mockRecommendations[cropType]);
      } else {
        // Default recommendation if crop is not in the list
        setRecommendation({
          fertilizer: 'NPK 15-15-15',
          application: 'Broadcast application',
          timing: 'Apply 50% at planting and 50% after 30-45 days',
          dosage: '250-300 kg/ha',
          alternatives: ['Organic compost', 'Vermicompost'],
          notes: 'Conduct a soil test for more precise recommendations.'
        });
      }
      
      setLoading(false);
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {t('fertilizerRecommendation')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Get personalized fertilizer recommendations based on your crop and soil conditions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="p-6 border-gray-200">
              <h2 className="text-lg font-semibold mb-4">Input Parameters</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Crop Type</label>
                  <Select 
                    value={formData.cropType} 
                    onValueChange={(value) => handleSelectChange('cropType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select crop" />
                    </SelectTrigger>
                    <SelectContent>
                      {cropOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Soil Type</label>
                  <Select 
                    value={formData.soilType} 
                    onValueChange={(value) => handleSelectChange('soilType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select soil type" />
                    </SelectTrigger>
                    <SelectContent>
                      {soilOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nitrogen (N) Level (mg/kg)</label>
                  <Input
                    type="number"
                    name="nitrogen"
                    value={formData.nitrogen}
                    onChange={handleInputChange}
                    placeholder="e.g., 120"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phosphorus (P) Level (mg/kg)</label>
                  <Input
                    type="number"
                    name="phosphorus"
                    value={formData.phosphorus}
                    onChange={handleInputChange}
                    placeholder="e.g., 40"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Potassium (K) Level (mg/kg)</label>
                  <Input
                    type="number"
                    name="potassium"
                    value={formData.potassium}
                    onChange={handleInputChange}
                    placeholder="e.g., 80"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Soil pH</label>
                  <Input
                    type="number"
                    name="ph"
                    value={formData.ph}
                    onChange={handleInputChange}
                    placeholder="e.g., 6.5"
                    step="0.1"
                    min="0"
                    max="14"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Soil Moisture (%)</label>
                  <Input
                    type="number"
                    name="moisture"
                    value={formData.moisture}
                    onChange={handleInputChange}
                    placeholder="e.g., 35"
                    min="0"
                    max="100"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full mt-6"
                  disabled={loading || !formData.cropType || !formData.soilType}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing
                    </>
                  ) : (
                    'Get Recommendations'
                  )}
                </Button>
              </form>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            {loading ? (
              <Card className="p-6 border-gray-200 h-full flex flex-col items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-krishi-600 mb-4" />
                <h3 className="text-lg font-medium">Analyzing Your Input...</h3>
                <p className="text-gray-500 mt-2">We're calculating the optimal fertilizer recommendations.</p>
                <Progress value={45} className="w-2/3 mt-6" />
              </Card>
            ) : recommendation ? (
              <Card className="p-6 border-gray-200">
                <h2 className="text-xl font-semibold mb-6 text-krishi-700 flex items-center">
                  <Sprout className="mr-2 h-5 w-5" />
                  Fertilizer Recommendation
                </h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-krishi-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-krishi-700">Recommended Fertilizer</h3>
                      <p className="mt-2">{recommendation.fertilizer}</p>
                    </div>
                    
                    <div className="bg-soil-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-soil-700">Application Method</h3>
                      <p className="mt-2">{recommendation.application}</p>
                    </div>
                  </div>
                  
                  <div className="bg-water-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-water-700">Application Timing</h3>
                    <p className="mt-2">{recommendation.timing}</p>
                  </div>
                  
                  <div className="bg-growth-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-growth-700">Recommended Dosage</h3>
                    <p className="mt-2">{recommendation.dosage}</p>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-semibold">Alternative Fertilizers</h3>
                    <ul className="mt-2 space-y-2">
                      {recommendation.alternatives.map((alt, index) => (
                        <li key={index} className="flex items-center">
                          <Leaf className="mr-2 h-4 w-4 text-krishi-600" />
                          {alt}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-amber-700">Additional Notes</h3>
                    <p className="mt-2">{recommendation.notes}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700">Disclaimer</h3>
                    <p className="mt-2 text-sm">
                      These recommendations are based on general guidelines. For optimal results, 
                      please consult with a local agricultural expert and consider conducting a 
                      detailed soil analysis.
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-6 border-gray-200 h-full flex flex-col items-center justify-center text-center">
                <Droplets className="h-16 w-16 text-krishi-200 mb-4" />
                <h3 className="text-lg font-medium">No Recommendation Yet</h3>
                <p className="text-gray-500 mt-2 max-w-md">
                  Fill out the form with your crop and soil details to receive personalized fertilizer recommendations.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FertilizerRecommendation;

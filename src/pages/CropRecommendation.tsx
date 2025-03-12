
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useTranslation } from '@/hooks/useTranslation';
import { Card } from '@/components/ui/card';
import { Leaf, ArrowRight, FileText, Droplets, ThermometerSnowflake, Ruler, CloudRain } from 'lucide-react';

const CropRecommendation = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: ''
  });
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // This would normally be the result from your backend ML model
      const crops = ['rice', 'wheat', 'maize', 'chickpea', 'kidney beans', 'mung bean', 'black gram', 'pomegranate', 'banana', 'mango', 'grapes', 'watermelon', 'muskmelon', 'papaya', 'orange', 'coconut'];
      const randomCrop = crops[Math.floor(Math.random() * crops.length)];
      setRecommendation(randomCrop);
      setLoading(false);
    }, 2000);
  };

  const resetForm = () => {
    setFormData({
      nitrogen: '',
      phosphorus: '',
      potassium: '',
      temperature: '',
      humidity: '',
      ph: '',
      rainfall: ''
    });
    setRecommendation(null);
  };

  // Presets for demo purposes
  const presets = [
    {
      name: 'Sandy Soil',
      icon: <Leaf className="h-5 w-5" />,
      values: {
        nitrogen: '40',
        phosphorus: '35',
        potassium: '30',
        temperature: '25',
        humidity: '60',
        ph: '6.5',
        rainfall: '150'
      }
    },
    {
      name: 'Clay Soil',
      icon: <Droplets className="h-5 w-5" />,
      values: {
        nitrogen: '80',
        phosphorus: '60',
        potassium: '50',
        temperature: '28',
        humidity: '70',
        ph: '7.2',
        rainfall: '200'
      }
    },
    {
      name: 'Loamy Soil',
      icon: <FileText className="h-5 w-5" />,
      values: {
        nitrogen: '60',
        phosphorus: '50',
        potassium: '45',
        temperature: '27',
        humidity: '65',
        ph: '6.8',
        rainfall: '175'
      }
    }
  ];

  const cropInformation: Record<string, any> = {
    rice: {
      description: 'Rice is a staple food crop in many parts of the world. It thrives in warm and humid conditions with plenty of water.',
      season: 'Kharif season (Monsoon)',
      waterNeeds: 'High',
      growthPeriod: '3-6 months',
      yield: '3-5 tons per hectare'
    },
    wheat: {
      description: 'Wheat is a cereal grain that is a worldwide staple food. It grows best in moderate temperatures.',
      season: 'Rabi season (Winter)',
      waterNeeds: 'Medium',
      growthPeriod: '4-5 months',
      yield: '2.5-3.5 tons per hectare'
    },
    maize: {
      description: 'Maize (corn) is a versatile crop used for food, feed, and biofuel. It requires warm conditions and moderate rainfall.',
      season: 'Kharif and Rabi seasons',
      waterNeeds: 'Medium',
      growthPeriod: '3-4 months',
      yield: '4-6 tons per hectare'
    },
    mango: {
      description: 'Mango is a tropical fruit known as the "King of Fruits". It grows best in tropical and subtropical regions.',
      season: 'Perennial, fruiting in summer',
      waterNeeds: 'Medium',
      growthPeriod: 'Trees take 5-8 years to fruit',
      yield: '10-15 tons per hectare (mature trees)'
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('cropRecommendation')}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Get personalized crop recommendations based on soil composition and environmental factors.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <Card className="p-6 border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Enter Soil and Environmental Data</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {presets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => setFormData(preset.values)}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center justify-center gap-2"
                  >
                    <div className="w-10 h-10 rounded-full bg-krishi-100 flex items-center justify-center text-krishi-600">
                      {preset.icon}
                    </div>
                    <span className="text-sm font-medium">{preset.name}</span>
                    <span className="text-xs text-gray-500">Quick preset</span>
                  </button>
                ))}
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="nitrogen" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Leaf className="h-4 w-4 text-krishi-600" />
                      Nitrogen (N) - kg/ha
                    </label>
                    <input
                      type="number"
                      id="nitrogen"
                      name="nitrogen"
                      value={formData.nitrogen}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-krishi-500"
                      placeholder="e.g., 50"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="phosphorus" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Leaf className="h-4 w-4 text-krishi-600" />
                      Phosphorus (P) - kg/ha
                    </label>
                    <input
                      type="number"
                      id="phosphorus"
                      name="phosphorus"
                      value={formData.phosphorus}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-krishi-500"
                      placeholder="e.g., 40"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="potassium" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Leaf className="h-4 w-4 text-krishi-600" />
                      Potassium (K) - kg/ha
                    </label>
                    <input
                      type="number"
                      id="potassium"
                      name="potassium"
                      value={formData.potassium}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-krishi-500"
                      placeholder="e.g., 45"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="temperature" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <ThermometerSnowflake className="h-4 w-4 text-orange-500" />
                      Temperature (°C)
                    </label>
                    <input
                      type="number"
                      id="temperature"
                      name="temperature"
                      value={formData.temperature}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-krishi-500"
                      placeholder="e.g., 25"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="humidity" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      Humidity (%)
                    </label>
                    <input
                      type="number"
                      id="humidity"
                      name="humidity"
                      value={formData.humidity}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-krishi-500"
                      placeholder="e.g., 65"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="ph" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Ruler className="h-4 w-4 text-purple-500" />
                      pH Value
                    </label>
                    <input
                      type="number"
                      id="ph"
                      name="ph"
                      value={formData.ph}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-krishi-500"
                      placeholder="e.g., 6.5"
                      step="0.1"
                      min="0"
                      max="14"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="rainfall" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <CloudRain className="h-4 w-4 text-blue-500" />
                      Rainfall (mm)
                    </label>
                    <input
                      type="number"
                      id="rainfall"
                      name="rainfall"
                      value={formData.rainfall}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-krishi-500"
                      placeholder="e.g., 200"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-krishi-600 text-white rounded-md hover:bg-krishi-700 transition-colors focus:outline-none focus:ring-2 focus:ring-krishi-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Analyzing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>Get Recommendation</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </Card>
          </div>
          
          {/* Right Column - Recommendation Results */}
          <div className="lg:col-span-1">
            <Card className="p-6 border-gray-200 h-full">
              <h2 className="text-xl font-semibold mb-4">Recommendation Results</h2>
              
              {recommendation ? (
                <div className="space-y-6">
                  <div className="bg-krishi-50 p-4 rounded-lg border border-krishi-100">
                    <h3 className="text-lg font-medium text-krishi-800 capitalize mb-2">
                      Recommended Crop: {recommendation}
                    </h3>
                    {cropInformation[recommendation] ? (
                      <p className="text-gray-600">
                        {cropInformation[recommendation].description}
                      </p>
                    ) : (
                      <p className="text-gray-600">
                        This crop is well-suited for your soil composition and environmental conditions.
                      </p>
                    )}
                  </div>
                  
                  {cropInformation[recommendation] && (
                    <div className="space-y-4">
                      <h3 className="text-md font-medium text-gray-800">Crop Information</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <span className="text-xs text-gray-500 block">Season</span>
                          <span className="font-medium text-gray-800">{cropInformation[recommendation].season}</span>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <span className="text-xs text-gray-500 block">Water Needs</span>
                          <span className="font-medium text-gray-800">{cropInformation[recommendation].waterNeeds}</span>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <span className="text-xs text-gray-500 block">Growth Period</span>
                          <span className="font-medium text-gray-800">{cropInformation[recommendation].growthPeriod}</span>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <span className="text-xs text-gray-500 block">Expected Yield</span>
                          <span className="font-medium text-gray-800">{cropInformation[recommendation].yield}</span>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="text-sm font-medium text-blue-800 mb-2">Tips for Cultivation</h4>
                        <ul className="text-sm text-gray-600 space-y-1 list-disc pl-4">
                          <li>Ensure proper field preparation before sowing</li>
                          <li>Monitor soil moisture regularly</li>
                          <li>Apply fertilizers according to recommended dosage</li>
                          <li>Implement integrated pest management practices</li>
                          <li>Harvest at optimal maturity for best quality</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Leaf className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700">No Recommendation Yet</h3>
                  <p className="text-gray-500 mt-2">
                    Enter your soil and environmental data on the left to get a personalized crop recommendation.
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CropRecommendation;

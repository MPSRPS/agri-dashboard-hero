
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sprout, BarChart, Leaf, Droplets, CloudRain, ThermometerSun } from "lucide-react";
import { toast } from "sonner";
import Chatbot from "@/components/Chatbot";

const CropRecommendation = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState("manual");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock recommendation based on input
      const recommendations = [
        "Rice: Based on your soil composition and climate data, rice would be an ideal crop. It thrives in the high humidity and rainfall conditions you've described.",
        "Wheat: The soil nutrient levels and moderate rainfall in your area make wheat a good choice. It performs well in these conditions.",
        "Maize: With the current nitrogen and phosphorus levels, maize would be an excellent choice. It's suitable for your temperature and humidity range.",
        "Sugarcane: The pH level and potassium content of your soil are perfect for sugarcane cultivation. The rainfall is also adequate.",
        "Cotton: Your soil composition and climate conditions are ideal for cotton. It requires the kind of temperature and humidity you've described."
      ];
      
      const randomIndex = Math.floor(Math.random() * recommendations.length);
      setRecommendation(recommendations[randomIndex]);
      setIsLoading(false);
      toast.success("Crop recommendation generated!");
    }, 2000);
  };

  const crops = [
    { name: "Rice", suitability: 92, icon: <Sprout size={18} /> },
    { name: "Wheat", suitability: 87, icon: <Sprout size={18} /> },
    { name: "Maize", suitability: 76, icon: <Sprout size={18} /> },
    { name: "Sugarcane", suitability: 65, icon: <Sprout size={18} /> },
    { name: "Cotton", suitability: 58, icon: <Sprout size={18} /> },
  ];

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Leaf className="text-krishi-500" />
          {t("crop_recommendation")}
        </h1>
        <p className="text-gray-500 mt-1">Get AI-powered crop suggestions based on your farm's conditions</p>
      </header>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="manual">Manual Input</TabsTrigger>
          <TabsTrigger value="sensor">Sensor Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual" className="space-y-4">
          <Card className="p-6 shadow-sm border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nitrogen">Nitrogen (N) in kg/ha</Label>
                  <div className="relative">
                    <ThermometerSun className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                      id="nitrogen"
                      name="nitrogen"
                      type="number"
                      placeholder="e.g., 80"
                      className="pl-10"
                      value={formData.nitrogen}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phosphorus">Phosphorus (P) in kg/ha</Label>
                  <div className="relative">
                    <ThermometerSun className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                      id="phosphorus"
                      name="phosphorus"
                      type="number"
                      placeholder="e.g., 40"
                      className="pl-10"
                      value={formData.phosphorus}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="potassium">Potassium (K) in kg/ha</Label>
                  <div className="relative">
                    <ThermometerSun className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                      id="potassium"
                      name="potassium"
                      type="number"
                      placeholder="e.g., 60"
                      className="pl-10"
                      value={formData.potassium}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature (°C)</Label>
                  <div className="relative">
                    <ThermometerSun className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                      id="temperature"
                      name="temperature"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 25.5"
                      className="pl-10"
                      value={formData.temperature}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="humidity">Humidity (%)</Label>
                  <div className="relative">
                    <Droplets className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                      id="humidity"
                      name="humidity"
                      type="number"
                      placeholder="e.g., 65"
                      className="pl-10"
                      value={formData.humidity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ph">pH level</Label>
                  <div className="relative">
                    <BarChart className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                      id="ph"
                      name="ph"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 6.5"
                      className="pl-10"
                      value={formData.ph}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rainfall">Rainfall (mm)</Label>
                  <div className="relative">
                    <CloudRain className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                      id="rainfall"
                      name="rainfall"
                      type="number"
                      placeholder="e.g., 200"
                      className="pl-10"
                      value={formData.rainfall}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full md:w-auto bg-krishi-500 hover:bg-krishi-600 mt-4"
                disabled={isLoading}
              >
                {isLoading ? "Analyzing..." : "Get Recommendation"}
              </Button>
            </form>
          </Card>
          
          {recommendation && (
            <Card className="p-6 shadow-sm border border-green-100 bg-green-50">
              <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Sprout className="text-krishi-500" />
                Recommended Crop
              </h2>
              <p className="text-gray-700">{recommendation}</p>
              
              <div className="mt-6">
                <h3 className="font-medium text-gray-800 mb-3">Other suitable crops:</h3>
                <div className="space-y-3">
                  {crops.map((crop, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-krishi-100 flex items-center justify-center text-krishi-700">
                        {crop.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{crop.name}</span>
                          <span className="text-sm text-gray-500">{crop.suitability}% suitable</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div 
                            className="bg-krishi-500 h-1.5 rounded-full" 
                            style={{ width: `${crop.suitability}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="sensor" className="space-y-4">
          <Card className="p-6 shadow-sm border border-gray-200">
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-krishi-100 text-krishi-500 mb-4">
                <Droplets size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Connect your sensor device</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Link your IoT sensors to automatically collect soil and environmental data for more accurate recommendations.
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline">
                  Connect Device
                </Button>
                <Button 
                  onClick={() => setTab("manual")}
                  className="bg-krishi-500 hover:bg-krishi-600"
                >
                  Manual Input
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <Chatbot />
    </div>
  );
};

export default CropRecommendation;

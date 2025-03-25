
import { supabase } from "@/integrations/supabase/client";

export interface SoilData {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
}

export interface WeatherForecast {
  forecast: Array<{
    day: number;
    temperature: number;
    humidity: number;
    rainfall: number;
  }>;
  totalExpectedRainfall: number;
}

export interface AlternativeCrop {
  name: string;
  score: number;
  marketPrice: number;
  marketTrend: string;
}

export interface CropInfo {
  name: string;
  description: string;
  season: string;
  waterNeeds: string;
  growthPeriod: string;
  yield: string;
  tips: string[];
  marketTrend?: string;
  marketPrice?: number;
  weatherForecast?: WeatherForecast;
  confidenceScore?: number;
  alternativeCrops?: AlternativeCrop[];
}

export interface AIMetrics {
  confidenceScore: number;
  dataPoints: number;
  modelVersion: string;
}

export interface CropRecommendationResponse {
  crop: CropInfo;
  aiMetrics?: AIMetrics;
}

export async function getCropRecommendation(soilData: SoilData, region?: string): Promise<CropRecommendationResponse> {
  try {
    // Call the crop recommendation API through our Supabase Edge Function
    const { data, error } = await supabase.functions.invoke("crop-recommendation", {
      body: { soilData, region }
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    if (data && data.crop) {
      return data as CropRecommendationResponse;
    }
    
    throw new Error("Invalid crop recommendation data received");
  } catch (error) {
    console.error("Error fetching crop recommendation:", error);
    
    // Return fallback crop recommendation
    return {
      crop: getFallbackCropRecommendation(soilData)
    };
  }
}

// Fallback crop recommendation logic based on soil properties
function getFallbackCropRecommendation(soilData: SoilData): CropInfo {
  // This is a simplified version of crop recommendation logic
  // In a real application, this would be much more sophisticated
  
  let recommendedCrop = "wheat"; // Default crop
  
  // High nitrogen and adequate rainfall favors leafy crops
  if (soilData.nitrogen > 70 && soilData.rainfall > 200) {
    recommendedCrop = "rice";
  } 
  // Balanced NPK and moderate rainfall is good for cereals
  else if (soilData.nitrogen > 40 && soilData.phosphorus > 30 && soilData.potassium > 30 && soilData.rainfall < 200) {
    recommendedCrop = "wheat";
  }
  // Low water, high phosphorus is good for pulses
  else if (soilData.phosphorus > 60 && soilData.rainfall < 150) {
    recommendedCrop = "chickpea";
  }
  // High potassium with warm temps is good for fruits
  else if (soilData.potassium > 50 && soilData.temperature > 28) {
    recommendedCrop = "mango";
  }
  // High rainfall and temperature for tropical fruits
  else if (soilData.temperature > 30 && soilData.rainfall > 250) {
    recommendedCrop = "banana";
  }
  
  // Get the detailed crop information from our database
  return getCropInformation(recommendedCrop);
}

function getCropInformation(cropName: string): CropInfo {
  const cropDatabase: Record<string, CropInfo> = {
    rice: {
      name: "Rice",
      description: "Rice is a staple food crop in many parts of the world. It thrives in warm and humid conditions with plenty of water.",
      season: "Kharif season (Monsoon)",
      waterNeeds: "High",
      growthPeriod: "3-6 months",
      yield: "3-5 tons per hectare",
      tips: [
        "Maintain 5-8 cm water level in the field during growth phase",
        "Apply nitrogenous fertilizer in 3 split doses",
        "Regular weeding is essential in the first month",
        "Harvest when 80% of grains turn golden yellow",
        "Proper drying reduces post-harvest losses"
      ]
    },
    wheat: {
      name: "Wheat",
      description: "Wheat is a cereal grain that is a worldwide staple food. It grows best in moderate temperatures.",
      season: "Rabi season (Winter)",
      waterNeeds: "Medium",
      growthPeriod: "4-5 months",
      yield: "2.5-3.5 tons per hectare",
      tips: [
        "Sow seeds at a depth of 5-6 cm",
        "First irrigation within 20-25 days of sowing is critical",
        "Apply potassium fertilizer to improve drought resistance",
        "Control weeds before they compete with the crop",
        "Harvest when the crop turns golden yellow"
      ]
    },
    chickpea: {
      name: "Chickpea",
      description: "Chickpea is a nutrient-rich pulse crop that improves soil health through nitrogen fixation.",
      season: "Rabi season (Winter)",
      waterNeeds: "Low",
      growthPeriod: "3-4 months",
      yield: "1.2-2 tons per hectare",
      tips: [
        "Use Rhizobium culture treatment for seeds",
        "Avoid excessive irrigation as it promotes vegetative growth",
        "Apply phosphorus fertilizer for better nodulation",
        "Monitor for pod borer during flowering and podding stages",
        "Harvest when plants turn yellow and pods become dry"
      ]
    },
    mango: {
      name: "Mango",
      description: "Mango is a tropical fruit known as the 'King of Fruits'. It grows best in tropical and subtropical regions.",
      season: "Perennial, fruiting in summer",
      waterNeeds: "Medium",
      growthPeriod: "Trees take 5-8 years to fruit",
      yield: "10-15 tons per hectare (mature trees)",
      tips: [
        "Ensure proper spacing of 10x10 meters between trees",
        "Regular pruning helps in maintaining tree shape",
        "Apply organic manure before flowering season",
        "Protect young fruits from fruit fly using appropriate measures",
        "Harvest when fruits are mature but still firm"
      ]
    },
    banana: {
      name: "Banana",
      description: "Banana is a tropical fruit grown year-round in suitable climates. It requires warm temperature and high humidity.",
      season: "Year-round (in tropical climates)",
      waterNeeds: "High",
      growthPeriod: "10-12 months",
      yield: "30-40 tons per hectare",
      tips: [
        "Plant suckers at a spacing of 2x2 meters",
        "Ensure good drainage as the crop is sensitive to waterlogging",
        "Regular de-suckering is important for good yield",
        "Provide support to plants with heavy bunches",
        "Harvest when fruits are mature but green"
      ]
    }
  };
  
  return cropDatabase[cropName] || cropDatabase.wheat;
}

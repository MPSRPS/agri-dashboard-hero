
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { soilData } = await req.json();
    
    if (!soilData) {
      throw new Error('Soil data is required');
    }

    // In a real-world scenario, we would call a machine learning model
    // or a specialized agricultural API here.
    // For now, we'll use a simplified rule-based approach

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
    
    // Get the detailed crop information
    const cropInfo = getCropInformation(recommendedCrop);

    return new Response(JSON.stringify({ crop: cropInfo }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in crop-recommendation function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      crop: getCropInformation("wheat") // Fallback to wheat
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getCropInformation(cropName: string) {
  const cropDatabase = {
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


import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// AI recommendation engine - simulates a trained ensemble model behavior
// with weighted feature importance similar to XGBoost output
function aiRecommendationEngine(soilData) {
  // Feature importance weights derived from "model training"
  const weights = {
    nitrogen: 0.23,
    phosphorus: 0.18,
    potassium: 0.17,
    temperature: 0.15,
    humidity: 0.09,
    ph: 0.08,
    rainfall: 0.10
  };
  
  // Normalized crop suitability scores based on soil/climate parameters
  // These would be derived from a model trained on agricultural datasets
  const cropScores = {
    rice: computeCropScore({
      baseline: 0.72,
      nitrogen: [50, 100], // [min, max] optimal ranges
      phosphorus: [30, 60],
      potassium: [20, 40],
      temperature: [22, 32],
      humidity: [60, 90],
      ph: [5.0, 6.5],
      rainfall: [200, 300]
    }, soilData, weights),
    
    wheat: computeCropScore({
      baseline: 0.68,
      nitrogen: [30, 70],
      phosphorus: [20, 40],
      potassium: [15, 35],
      temperature: [15, 24],
      humidity: [50, 70],
      ph: [5.5, 7.0],
      rainfall: [100, 200]
    }, soilData, weights),
    
    chickpea: computeCropScore({
      baseline: 0.64,
      nitrogen: [20, 40],
      phosphorus: [40, 70],
      potassium: [20, 40],
      temperature: [18, 30],
      humidity: [40, 60],
      ph: [6.0, 8.0],
      rainfall: [80, 150]
    }, soilData, weights),
    
    mango: computeCropScore({
      baseline: 0.58,
      nitrogen: [30, 60],
      phosphorus: [20, 40],
      potassium: [40, 80],
      temperature: [24, 35],
      humidity: [50, 75],
      ph: [5.5, 7.5],
      rainfall: [150, 250]
    }, soilData, weights),
    
    banana: computeCropScore({
      baseline: 0.62,
      nitrogen: [40, 80],
      phosphorus: [30, 60],
      potassium: [40, 90],
      temperature: [24, 36],
      humidity: [60, 90],
      ph: [5.5, 7.0],
      rainfall: [200, 350]
    }, soilData, weights)
  };
  
  // Find crop with highest suitability score
  let bestCrop = "wheat"; // Default
  let highestScore = 0;
  
  for (const [crop, score] of Object.entries(cropScores)) {
    console.log(`Crop: ${crop}, Score: ${score}`);
    if (score > highestScore) {
      highestScore = score;
      bestCrop = crop;
    }
  }
  
  console.log(`Selected crop: ${bestCrop} with score: ${highestScore}`);
  
  // Add confidence level based on how decisive the recommendation is
  const secondBestScore = Math.max(...Object.entries(cropScores)
    .filter(([crop]) => crop !== bestCrop)
    .map(([_, score]) => score));
  
  const confidenceLevel = Math.min(100, Math.round((highestScore - secondBestScore) / highestScore * 100) + 60);
  
  return { 
    recommendedCrop: bestCrop, 
    confidenceScore: confidenceLevel,
    alternativeCrops: Object.entries(cropScores)
      .filter(([crop]) => crop !== bestCrop)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([crop, score]) => ({ crop, score: Math.round(score * 100) }))
  };
}

// Helper function to compute crop suitability score based on parameters
function computeCropScore(cropParams, soilData, weights) {
  let score = cropParams.baseline;
  
  // Evaluate each parameter and adjust score
  for (const [param, weight] of Object.entries(weights)) {
    if (param in soilData && param in cropParams) {
      const [min, max] = cropParams[param];
      const value = soilData[param];
      
      // Parameter is within optimal range - full points
      if (value >= min && value <= max) {
        score += weight * 0.3;
      } 
      // Parameter is close to optimal range - partial points
      else if (value >= min * 0.7 && value <= max * 1.3) {
        score += weight * 0.15;
      }
      // Parameter is far from optimal - negative points
      else {
        score -= weight * 0.1;
      }
    }
  }
  
  // Apply environmental adjustments (simulating seasonal effects)
  if (soilData.temperature > 30 && soilData.humidity > 80) {
    // Hot and humid conditions
    if (cropParams.baseline > 0.65) { // If crop typically likes heat
      score += 0.05;
    } else {
      score -= 0.05;
    }
  }
  
  return Math.max(0, Math.min(1, score)); // Ensure score is between 0 and 1
}

// Simulate fetching weather forecast data
// In a real implementation, this would call OpenWeatherMap or similar API
async function getWeatherForecast(region = "default") {
  // Simulated 7-day forecast with rainfall predictions
  return {
    forecast: [
      { day: 1, temperature: 25, humidity: 65, rainfall: 0 },
      { day: 2, temperature: 26, humidity: 70, rainfall: 10 },
      { day: 3, temperature: 24, humidity: 75, rainfall: 20 },
      { day: 4, temperature: 23, humidity: 80, rainfall: 5 },
      { day: 5, temperature: 25, humidity: 60, rainfall: 0 },
      { day: 6, temperature: 26, humidity: 65, rainfall: 0 },
      { day: 7, temperature: 28, humidity: 60, rainfall: 0 },
    ],
    totalExpectedRainfall: 35
  };
}

// Simulate fetching market price data
// In a real implementation, this would call an agricultural commodity API
async function getMarketPrices() {
  return {
    rice: { trend: "stable", pricePerKg: 25 },
    wheat: { trend: "rising", pricePerKg: 30 },
    chickpea: { trend: "rising", pricePerKg: 45 },
    mango: { trend: "falling", pricePerKg: 60 },
    banana: { trend: "stable", pricePerKg: 35 }
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { soilData, region } = await req.json();
    
    if (!soilData) {
      throw new Error('Soil data is required');
    }

    console.log('Received soil data:', JSON.stringify(soilData));
    
    // Get AI-based crop recommendation
    const aiResult = aiRecommendationEngine(soilData);
    console.log('AI recommendation:', JSON.stringify(aiResult));
    
    // Get extended forecast data
    const weatherForecast = await getWeatherForecast(region);
    console.log('Weather forecast:', JSON.stringify(weatherForecast));
    
    // Get market price information
    const marketPrices = await getMarketPrices();
    console.log('Market prices:', JSON.stringify(marketPrices));
    
    // Get the detailed crop information
    const cropInfo = getCropInformation(aiResult.recommendedCrop);
    
    // Enhance crop info with market and weather data
    cropInfo.marketTrend = marketPrices[aiResult.recommendedCrop].trend;
    cropInfo.marketPrice = marketPrices[aiResult.recommendedCrop].pricePerKg;
    cropInfo.weatherForecast = weatherForecast;
    cropInfo.confidenceScore = aiResult.confidenceScore;
    cropInfo.alternativeCrops = aiResult.alternativeCrops.map(alt => {
      return {
        name: getCropInformation(alt.crop).name,
        score: alt.score,
        marketPrice: marketPrices[alt.crop].pricePerKg,
        marketTrend: marketPrices[alt.crop].trend
      };
    });

    return new Response(JSON.stringify({ 
      crop: cropInfo,
      aiMetrics: {
        confidenceScore: aiResult.confidenceScore,
        dataPoints: Object.keys(soilData).length,
        modelVersion: "1.0.3" // Simulated version tracking
      }
    }), {
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


import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PredictionRequest {
  imageUrl?: string;
  userId?: string;
  soilData?: {
    type: string;
    ph: number;
    nutrients: {
      nitrogen: number;
      phosphorus: number;
      potassium: number;
    };
  };
  locationData?: {
    latitude?: number;
    longitude?: number;
    region?: string;
  };
  financialData?: {
    budget: number;
    existingCrops: string[];
    marketPrices?: Record<string, number>;
  };
  weatherData?: {
    temperature: number;
    humidity: number;
    rainfall: number;
  };
  requestType: 'disease' | 'crop' | 'budget' | 'dashboard';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Deno runtime
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse the request body
    const requestData: PredictionRequest = await req.json();
    const { requestType, userId } = requestData;

    console.log(`Processing ${requestType} prediction for user ${userId || 'anonymous'}`);
    
    // Handle different types of ML predictions based on requestType
    switch (requestType) {
      case 'disease':
        return await handleDiseasePrediction(requestData, supabase);
      case 'crop':
        return await handleCropRecommendation(requestData, supabase);
      case 'budget':
        return await handleBudgetPlanning(requestData, supabase);
      case 'dashboard':
        return await handleDashboardInsights(requestData, supabase);
      default:
        throw new Error(`Invalid request type: ${requestType}`);
    }
  } catch (error) {
    console.error('Error in advanced-ml-prediction function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

async function handleDiseasePrediction(data: PredictionRequest, supabase: any) {
  const { imageUrl, userId } = data;

  if (!imageUrl) {
    throw new Error('Missing required field: imageUrl');
  }

  // In a real implementation, this would call a sophisticated ML model API
  // For now, we'll simulate with an enhanced version of the previous logic
  
  // Get all diseases with their related data
  const { data: allDiseases, error: diseasesError } = await supabase
    .from('plant_diseases')
    .select('*');
  
  if (diseasesError) {
    throw diseasesError;
  }
  
  // Select a main disease based on simulated analysis
  // In a real model, this would be based on image analysis
  // We're using a more sophisticated random approach for the simulation
  const mainDiseaseIndex = Math.floor(Math.random() * allDiseases.length);
  const mainDiseaseId = allDiseases[mainDiseaseIndex].id;
  
  // Get complete main disease details with all related information
  const { data: mainDiseaseData, error: mainDiseaseError } = await supabase
    .from('plant_diseases')
    .select('*')
    .eq('id', mainDiseaseId)
    .single();
  
  if (mainDiseaseError) {
    throw mainDiseaseError;
  }
  
  // Get related data for the main disease
  const [
    { data: symptoms, error: symptomsError },
    { data: treatments, error: treatmentsError },
    { data: measures, error: measuresError },
    { data: factors, error: factorsError }
  ] = await Promise.all([
    supabase.from('disease_symptoms').select('symptom').eq('disease_id', mainDiseaseId),
    supabase.from('disease_treatments').select('treatment').eq('disease_id', mainDiseaseId),
    supabase.from('disease_preventive_measures').select('measure').eq('disease_id', mainDiseaseId),
    supabase.from('disease_environmental_factors').select('factor_name, factor_value').eq('disease_id', mainDiseaseId)
  ]);
  
  if (symptomsError || treatmentsError || measuresError || factorsError) {
    throw symptomsError || treatmentsError || measuresError || factorsError;
  }
  
  // Advanced simulation: Calculate confidence based on multiple factors
  // In a real model, this would be the output of the ML algorithm
  // We're using the weather data if provided to affect confidence
  let mainDiseaseConfidence = 0.7 + (Math.random() * 0.3); // Base: between 0.7 and 1.0
  
  if (data.weatherData) {
    // Adjust confidence based on "weather conditions"
    const { temperature, humidity } = data.weatherData;
    
    // Example: if humidity is high, certain diseases become more likely
    if (humidity > 70) {
      mainDiseaseConfidence = Math.min(0.98, mainDiseaseConfidence + 0.1);
    }
    
    // Example: if temperature is in disease-favorable range
    if (temperature > 20 && temperature < 30) {
      mainDiseaseConfidence = Math.min(0.98, mainDiseaseConfidence + 0.08);
    }
  }
  
  // Assemble the main disease object with all related data
  const mainDisease = {
    ...mainDiseaseData,
    symptoms: symptoms?.map(s => s.symptom) || [],
    treatments: treatments?.map(t => t.treatment) || [],
    preventive_measures: measures?.map(m => m.measure) || [],
    environmental_factors: factors?.map(f => ({
      name: f.factor_name,
      value: f.factor_value
    })) || [],
    confidence: mainDiseaseConfidence
  };
  
  // Select other potential diseases with lower confidence scores
  // In a real model, these would be other potential matches from the ML model
  const otherDiseases = allDiseases
    .filter(d => d.id !== mainDiseaseId)
    .map(d => {
      // Generate more realistic confidence scores for alternatives
      let confidence = Math.random() * 0.5; // Base: between 0 and 0.5
      
      if (data.weatherData) {
        // Slightly adjust based on weather to make it more realistic
        confidence = Math.max(0.05, Math.min(0.6, confidence + 
          (data.weatherData.humidity > 70 ? 0.1 : 0) + 
          (data.weatherData.rainfall > 30 ? 0.08 : 0)));
      }
      
      return {
        ...d,
        confidence
      };
    })
    .sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
  
  // Save analysis to history if userId is provided
  if (userId) {
    await supabase.from('plant_analysis_history').insert({
      user_id: userId,
      image_path: imageUrl,
      main_disease_id: mainDiseaseId,
      confidence: mainDiseaseConfidence
    });
  }
  
  const result = {
    mainDisease,
    diseases: [mainDisease, ...otherDiseases.slice(0, 4)] // Return top 5 results including main
  };
  
  return new Response(
    JSON.stringify(result),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleCropRecommendation(data: PredictionRequest, supabase: any) {
  const { soilData, locationData, weatherData, userId } = data;
  
  if (!soilData) {
    throw new Error('Missing required field: soilData');
  }
  
  // Simulated crop recommendation system
  // In a real model, this would use a sophisticated ML model trained on historical data
  
  // Sample crop data for recommendation (in a real system, this would come from a database)
  const crops = [
    { 
      id: 1, name: 'Rice', 
      suitability: { 
        soilPh: { min: 5.5, max: 6.5 }, 
        temperature: { min: 20, max: 35 },
        rainfall: { min: 100, max: 200 },
        nutrients: { nitrogen: 'high', phosphorus: 'medium', potassium: 'medium' }
      },
      profitPotential: 'medium',
      growingPeriod: '3-4 months',
      waterRequirements: 'high'
    },
    { 
      id: 2, name: 'Wheat', 
      suitability: { 
        soilPh: { min: 6.0, max: 7.5 }, 
        temperature: { min: 15, max: 25 },
        rainfall: { min: 50, max: 100 },
        nutrients: { nitrogen: 'medium', phosphorus: 'medium', potassium: 'low' }
      },
      profitPotential: 'medium',
      growingPeriod: '4-5 months',
      waterRequirements: 'medium'
    },
    { 
      id: 3, name: 'Corn', 
      suitability: { 
        soilPh: { min: 5.8, max: 7.0 }, 
        temperature: { min: 18, max: 30 },
        rainfall: { min: 50, max: 100 },
        nutrients: { nitrogen: 'high', phosphorus: 'medium', potassium: 'medium' }
      },
      profitPotential: 'medium-high',
      growingPeriod: '3-4 months',
      waterRequirements: 'medium-high'
    },
    { 
      id: 4, name: 'Tomato', 
      suitability: { 
        soilPh: { min: 6.0, max: 6.8 }, 
        temperature: { min: 20, max: 30 },
        rainfall: { min: 40, max: 60 },
        nutrients: { nitrogen: 'medium', phosphorus: 'high', potassium: 'high' }
      },
      profitPotential: 'high',
      growingPeriod: '3-4 months',
      waterRequirements: 'medium'
    },
    { 
      id: 5, name: 'Soybean', 
      suitability: { 
        soilPh: { min: 6.0, max: 7.0 }, 
        temperature: { min: 20, max: 30 },
        rainfall: { min: 60, max: 120 },
        nutrients: { nitrogen: 'low', phosphorus: 'medium', potassium: 'medium' }
      },
      profitPotential: 'medium-high',
      growingPeriod: '3-4 months',
      waterRequirements: 'medium'
    },
  ];
  
  // Generate suitability scores for each crop based on provided data
  const scoredCrops = crops.map(crop => {
    let score = 0;
    
    // Score based on soil pH
    if (soilData.ph >= crop.suitability.soilPh.min && soilData.ph <= crop.suitability.soilPh.max) {
      score += 30;
    } else {
      // Partial score for being close to the suitable range
      const distanceFromRange = Math.min(
        Math.abs(soilData.ph - crop.suitability.soilPh.min),
        Math.abs(soilData.ph - crop.suitability.soilPh.max)
      );
      score += Math.max(0, 30 - (distanceFromRange * 10));
    }
    
    // Score based on nutrients
    const nutrientMapping = { 'low': 1, 'medium': 2, 'high': 3 };
    const nitrogenScore = (nutrientMapping[crop.suitability.nutrients.nitrogen] || 2);
    score += Math.max(0, 20 - (Math.abs(soilData.nutrients.nitrogen / 50 * 3 - nitrogenScore) * 10));
    
    // Score based on weather if available
    if (weatherData) {
      // Temperature suitability
      if (weatherData.temperature >= crop.suitability.temperature.min && 
          weatherData.temperature <= crop.suitability.temperature.max) {
        score += 25;
      } else {
        const tempDistanceFromRange = Math.min(
          Math.abs(weatherData.temperature - crop.suitability.temperature.min),
          Math.abs(weatherData.temperature - crop.suitability.temperature.max)
        );
        score += Math.max(0, 25 - (tempDistanceFromRange * 2));
      }
      
      // Rainfall suitability
      if (weatherData.rainfall >= crop.suitability.rainfall.min && 
          weatherData.rainfall <= crop.suitability.rainfall.max) {
        score += 25;
      } else {
        const rainDistanceFromRange = Math.min(
          Math.abs(weatherData.rainfall - crop.suitability.rainfall.min),
          Math.abs(weatherData.rainfall - crop.suitability.rainfall.max)
        );
        score += Math.max(0, 25 - (rainDistanceFromRange / 2));
      }
    } else {
      // If weather data not available, give average scores
      score += 25;
    }
    
    return {
      ...crop,
      suitabilityScore: score,
      confidencePercentage: Math.min(98, Math.round(score * 0.98)) // Convert score to percentage
    };
  });
  
  // Sort by suitability score
  const recommendations = scoredCrops
    .sort((a, b) => b.suitabilityScore - a.suitabilityScore)
    .map(crop => ({
      name: crop.name,
      suitabilityScore: crop.suitabilityScore,
      confidencePercentage: crop.confidencePercentage,
      growingPeriod: crop.growingPeriod,
      profitPotential: crop.profitPotential,
      waterRequirements: crop.waterRequirements,
      recommendation: generateRecommendation(crop, soilData, weatherData)
    }));
  
  return new Response(
    JSON.stringify({
      recommendations,
      soilAnalysis: analyzeSoil(soilData),
      weatherImpact: weatherData ? analyzeWeather(weatherData) : null,
      timestamp: new Date().toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

function generateRecommendation(crop, soilData, weatherData) {
  let recommendation = `${crop.name} is `;
  
  if (crop.confidencePercentage > 85) {
    recommendation += 'highly suitable for your conditions. ';
  } else if (crop.confidencePercentage > 70) {
    recommendation += 'suitable for your conditions with some adjustments. ';
  } else if (crop.confidencePercentage > 50) {
    recommendation += 'moderately suitable but may require significant soil amendments. ';
  } else {
    recommendation += 'not particularly suitable for your current conditions. Consider alternatives. ';
  }
  
  // Add specific recommendations based on soil analysis
  if (soilData.ph < crop.suitability.soilPh.min) {
    recommendation += `Your soil pH (${soilData.ph}) is below the optimal range. Consider adding lime to raise pH. `;
  } else if (soilData.ph > crop.suitability.soilPh.max) {
    recommendation += `Your soil pH (${soilData.ph}) is above the optimal range. Consider adding sulfur to lower pH. `;
  }
  
  // Add nutrient recommendations
  const nutrientLevels = {
    nitrogen: soilData.nutrients.nitrogen < 40 ? 'low' : (soilData.nutrients.nitrogen < 80 ? 'medium' : 'high'),
    phosphorus: soilData.nutrients.phosphorus < 40 ? 'low' : (soilData.nutrients.phosphorus < 80 ? 'medium' : 'high'),
    potassium: soilData.nutrients.potassium < 40 ? 'low' : (soilData.nutrients.potassium < 80 ? 'medium' : 'high')
  };
  
  if (nutrientLevels.nitrogen === 'low' && crop.suitability.nutrients.nitrogen !== 'low') {
    recommendation += 'Add nitrogen-rich fertilizers. ';
  }
  
  if (nutrientLevels.phosphorus === 'low' && crop.suitability.nutrients.phosphorus !== 'low') {
    recommendation += 'Add phosphorus-rich fertilizers. ';
  }
  
  if (nutrientLevels.potassium === 'low' && crop.suitability.nutrients.potassium !== 'low') {
    recommendation += 'Add potassium-rich fertilizers. ';
  }
  
  return recommendation;
}

function analyzeSoil(soilData) {
  let analysis = {
    phLevel: {
      value: soilData.ph,
      category: soilData.ph < 6.0 ? 'acidic' : (soilData.ph > 7.5 ? 'alkaline' : 'neutral'),
      recommendation: ''
    },
    nutrients: {
      nitrogen: {
        value: soilData.nutrients.nitrogen,
        category: soilData.nutrients.nitrogen < 40 ? 'low' : (soilData.nutrients.nitrogen < 80 ? 'medium' : 'high'),
        recommendation: ''
      },
      phosphorus: {
        value: soilData.nutrients.phosphorus,
        category: soilData.nutrients.phosphorus < 40 ? 'low' : (soilData.nutrients.phosphorus < 80 ? 'medium' : 'high'),
        recommendation: ''
      },
      potassium: {
        value: soilData.nutrients.potassium,
        category: soilData.nutrients.potassium < 40 ? 'low' : (soilData.nutrients.potassium < 80 ? 'medium' : 'high'),
        recommendation: ''
      }
    }
  };
  
  // Add recommendations based on analysis
  if (analysis.phLevel.category === 'acidic') {
    analysis.phLevel.recommendation = 'Consider adding agricultural lime to raise pH.';
  } else if (analysis.phLevel.category === 'alkaline') {
    analysis.phLevel.recommendation = 'Consider adding elemental sulfur to lower pH.';
  }
  
  if (analysis.nutrients.nitrogen.category === 'low') {
    analysis.nutrients.nitrogen.recommendation = 'Add nitrogen-rich fertilizers like urea or ammonium sulfate.';
  } else if (analysis.nutrients.nitrogen.category === 'high') {
    analysis.nutrients.nitrogen.recommendation = 'Reduce nitrogen application to prevent leaching and pollution.';
  }
  
  if (analysis.nutrients.phosphorus.category === 'low') {
    analysis.nutrients.phosphorus.recommendation = 'Add phosphorus-rich fertilizers like superphosphate.';
  }
  
  if (analysis.nutrients.potassium.category === 'low') {
    analysis.nutrients.potassium.recommendation = 'Add potassium-rich fertilizers like potassium chloride.';
  }
  
  return analysis;
}

function analyzeWeather(weatherData) {
  return {
    temperature: {
      value: weatherData.temperature,
      impact: weatherData.temperature < 15 ? 'May slow plant growth' : 
              (weatherData.temperature > 35 ? 'May cause heat stress' : 'Favorable for most crops')
    },
    humidity: {
      value: weatherData.humidity,
      impact: weatherData.humidity > 80 ? 'High humidity may increase disease risk' : 
              (weatherData.humidity < 30 ? 'Low humidity may increase water requirements' : 'Acceptable for most crops')
    },
    rainfall: {
      value: weatherData.rainfall,
      impact: weatherData.rainfall < 50 ? 'Irrigation may be necessary' : 
              (weatherData.rainfall > 150 ? 'Drainage may be required' : 'Adequate for most crops')
    }
  };
}

async function handleBudgetPlanning(data: PredictionRequest, supabase: any) {
  const { financialData, userId } = data;
  
  if (!financialData) {
    throw new Error('Missing required field: financialData');
  }
  
  const { budget, existingCrops, marketPrices } = financialData;
  
  // Sample crop production costs and yields (in a real system, this would be from a database)
  const cropProductionData = {
    Rice: { costPerAcre: 900, yieldPerAcre: 7500, unitPrice: marketPrices?.Rice || 0.25 },
    Wheat: { costPerAcre: 700, yieldPerAcre: 3000, unitPrice: marketPrices?.Wheat || 0.40 },
    Corn: { costPerAcre: 650, yieldPerAcre: 9500, unitPrice: marketPrices?.Corn || 0.15 },
    Tomato: { costPerAcre: 5000, yieldPerAcre: 25000, unitPrice: marketPrices?.Tomato || 0.80 },
    Soybean: { costPerAcre: 600, yieldPerAcre: 3500, unitPrice: marketPrices?.Soybean || 0.45 },
    Potato: { costPerAcre: 3000, yieldPerAcre: 20000, unitPrice: marketPrices?.Potato || 0.30 },
    Cotton: { costPerAcre: 800, yieldPerAcre: 1500, unitPrice: marketPrices?.Cotton || 0.90 },
    Sugarcane: { costPerAcre: 1200, yieldPerAcre: 40000, unitPrice: marketPrices?.Sugarcane || 0.05 }
  };
  
  // Calculate optimal budget allocation
  // In a real model, this would use linear programming or other optimization techniques
  
  const allocations = [];
  const recommendations = [];
  let remainingBudget = budget;
  
  // Create profitability ranking
  const cropProfitability = Object.entries(cropProductionData).map(([crop, data]) => {
    const revenue = data.yieldPerAcre * data.unitPrice;
    const profit = revenue - data.costPerAcre;
    const roi = profit / data.costPerAcre;
    
    return {
      crop,
      costPerAcre: data.costPerAcre,
      yieldPerAcre: data.yieldPerAcre,
      unitPrice: data.unitPrice,
      revenue,
      profit,
      roi
    };
  }).sort((a, b) => b.roi - a.roi);
  
  // Prioritize existing crops first (to maintain continuity)
  const prioritizedCrops = [
    ...cropProfitability.filter(item => existingCrops.includes(item.crop)),
    ...cropProfitability.filter(item => !existingCrops.includes(item.crop))
  ];
  
  // Allocate budget based on ROI
  for (const cropData of prioritizedCrops) {
    if (remainingBudget >= cropData.costPerAcre) {
      // Calculate how many acres we can afford
      const maxAcres = Math.floor(remainingBudget / cropData.costPerAcre);
      
      // Limit allocation to a reasonable amount (in a real system, this would be more sophisticated)
      const allocatedAcres = Math.min(maxAcres, 10);
      
      if (allocatedAcres > 0) {
        const allocatedBudget = allocatedAcres * cropData.costPerAcre;
        remainingBudget -= allocatedBudget;
        
        const expectedYield = allocatedAcres * cropData.yieldPerAcre;
        const expectedRevenue = expectedYield * cropData.unitPrice;
        const expectedProfit = expectedRevenue - allocatedBudget;
        
        allocations.push({
          crop: cropData.crop,
          acres: allocatedAcres,
          budgetAllocated: allocatedBudget,
          expectedYield,
          expectedRevenue,
          expectedProfit,
          roi: cropData.roi
        });
        
        // Add specific recommendations
        if (existingCrops.includes(cropData.crop)) {
          recommendations.push(`Continue growing ${cropData.crop} on ${allocatedAcres} acres with an expected profit of $${expectedProfit.toFixed(2)}.`);
        } else {
          recommendations.push(`Consider adding ${cropData.crop} on ${allocatedAcres} acres for a potential profit of $${expectedProfit.toFixed(2)}.`);
        }
      }
    }
  }
  
  // Calculate expected financials
  const totalInvestment = allocations.reduce((sum, item) => sum + item.budgetAllocated, 0);
  const totalRevenue = allocations.reduce((sum, item) => sum + item.expectedRevenue, 0);
  const totalProfit = allocations.reduce((sum, item) => sum + item.expectedProfit, 0);
  const overallROI = totalProfit / totalInvestment;
  
  // Generate risk assessment
  const riskAssessment = {
    diversificationLevel: allocations.length > 3 ? 'High' : (allocations.length > 1 ? 'Medium' : 'Low'),
    marketRisk: 'Medium', // This would be based on more data in a real system
    weatherRisk: 'Medium', // This would be based on historical weather data in a real system
    overallRisk: allocations.length > 3 ? 'Low to Medium' : (allocations.length > 1 ? 'Medium' : 'High')
  };
  
  // Add risk mitigation recommendations
  if (allocations.length < 3) {
    recommendations.push('Consider diversifying your crops to reduce risk.');
  }
  
  if (remainingBudget > 1000) {
    recommendations.push(`You have $${remainingBudget.toFixed(2)} remaining in your budget. Consider investing in equipment or storage facilities.`);
  }
  
  return new Response(
    JSON.stringify({
      budgetPlan: {
        totalBudget: budget,
        allocatedBudget: totalInvestment,
        remainingBudget,
        allocations,
        financialProjection: {
          totalRevenue,
          totalProfit,
          overallROI
        },
        riskAssessment,
        recommendations
      },
      timestamp: new Date().toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleDashboardInsights(data: PredictionRequest, supabase: any) {
  const { userId } = data;
  
  if (!userId) {
    throw new Error('Missing required field: userId');
  }

  try {
    // Fetch user's plant analysis history
    const { data: analysisHistory, error: historyError } = await supabase
      .from('plant_analysis_history')
      .select('*, main_disease_id(*)')
      .eq('user_id', userId)
      .order('analysis_date', { ascending: false });
    
    if (historyError) throw historyError;
    
    // Generate insights based on user's history and patterns
    // In a real system, this would involve sophisticated ML-based pattern recognition
    
    // Generate example insights
    const insights = [
      {
        type: 'disease_pattern',
        title: 'Disease Trends',
        description: 'Based on your plant analysis history, your crops tend to face disease issues during humid periods.',
        recommendation: 'Consider increasing air circulation in your growing areas and reduce overhead watering during high humidity periods.'
      },
      {
        type: 'seasonal_advice',
        title: 'Seasonal Recommendations',
        description: 'The current season is optimal for preventive treatments against common diseases in your region.',
        recommendation: 'Apply preventive fungicides and increase monitoring frequency for early disease detection.'
      },
      {
        type: 'efficiency_improvement',
        title: 'Resource Optimization',
        description: 'Your current water usage patterns could be optimized for better crop health.',
        recommendation: 'Consider implementing drip irrigation to reduce water usage and minimize leaf wetness.'
      }
    ];
    
    // Generate health metrics
    const healthMetrics = {
      overallHealth: 75, // Simulated percentage
      diseaseRisk: 30,   // Simulated percentage
      nutritionStatus: 80, // Simulated percentage
      waterEfficiency: 65  // Simulated percentage
    };
    
    // Weather impact assessment
    const weatherImpact = {
      shortTerm: 'Current weather conditions are favorable for crop growth, but may increase disease pressure.',
      longTerm: 'Seasonal forecast suggests increased rainfall, which may require adjustments to your disease management strategy.'
    };
    
    // Recent challenges detected
    const recentChallenges = analysisHistory && analysisHistory.length > 0 
      ? analysisHistory.slice(0, 3).map(record => ({
          date: record.analysis_date,
          issue: record.main_disease_id?.name || 'Unknown issue',
          confidence: record.confidence,
          imageUrl: record.image_path
        }))
      : [];
    
    return new Response(
      JSON.stringify({
        insights,
        healthMetrics,
        weatherImpact,
        recentChallenges,
        analysisHistory: analysisHistory || [],
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating dashboard insights:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate dashboard insights' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}

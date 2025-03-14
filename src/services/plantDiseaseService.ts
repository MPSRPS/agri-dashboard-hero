
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Disease {
  id: string;
  name: string;
  description: string;
  confidence?: number;
  symptoms?: string[];
  treatments?: string[];
  preventive_measures?: string[];
  environmental_factors?: {
    name: string;
    value: string;
  }[];
}

export interface PredictionResult {
  mainDisease: Disease;
  diseases: Disease[];
}

export interface SoilData {
  type: string;
  ph: number;
  nutrients: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
}

export interface LocationData {
  latitude?: number;
  longitude?: number;
  region?: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
}

export interface FinancialData {
  budget: number;
  existingCrops: string[];
  marketPrices?: Record<string, number>;
}

export interface CropRecommendation {
  name: string;
  suitabilityScore: number;
  confidencePercentage: number;
  growingPeriod: string;
  profitPotential: string;
  waterRequirements: string;
  recommendation: string;
}

export interface CropRecommendationResult {
  recommendations: CropRecommendation[];
  soilAnalysis: {
    phLevel: {
      value: number;
      category: string;
      recommendation: string;
    };
    nutrients: {
      nitrogen: {
        value: number;
        category: string;
        recommendation: string;
      };
      phosphorus: {
        value: number;
        category: string;
        recommendation: string;
      };
      potassium: {
        value: number;
        category: string;
        recommendation: string;
      };
    };
  };
  weatherImpact: {
    temperature: {
      value: number;
      impact: string;
    };
    humidity: {
      value: number;
      impact: string;
    };
    rainfall: {
      value: number;
      impact: string;
    };
  } | null;
  timestamp: string;
}

export interface BudgetAllocation {
  crop: string;
  acres: number;
  budgetAllocated: number;
  expectedYield: number;
  expectedRevenue: number;
  expectedProfit: number;
  roi: number;
}

export interface BudgetPlanResult {
  budgetPlan: {
    totalBudget: number;
    allocatedBudget: number;
    remainingBudget: number;
    allocations: BudgetAllocation[];
    financialProjection: {
      totalRevenue: number;
      totalProfit: number;
      overallROI: number;
    };
    riskAssessment: {
      diversificationLevel: string;
      marketRisk: string;
      weatherRisk: string;
      overallRisk: string;
    };
    recommendations: string[];
  };
  timestamp: string;
}

export interface Insight {
  type: string;
  title: string;
  description: string;
  recommendation: string;
}

export interface HealthMetrics {
  overallHealth: number;
  diseaseRisk: number;
  nutritionStatus: number;
  waterEfficiency: number;
}

export interface Challenge {
  date: string;
  issue: string;
  confidence: number;
  imageUrl: string;
}

export interface DashboardInsightsResult {
  insights: Insight[];
  healthMetrics: HealthMetrics;
  weatherImpact: {
    shortTerm: string;
    longTerm: string;
  };
  recentChallenges: Challenge[];
  analysisHistory: any[];
  timestamp: string;
}

export const fetchAllDiseases = async (): Promise<Disease[]> => {
  try {
    const { data: diseases, error } = await supabase
      .from('plant_diseases')
      .select('*');

    if (error) {
      throw error;
    }

    return diseases || [];
  } catch (error) {
    toast({
      title: "Error fetching diseases",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
};

export const fetchDiseaseDetails = async (diseaseId: string): Promise<Disease | null> => {
  try {
    // Fetch the disease
    const { data: disease, error: diseaseError } = await supabase
      .from('plant_diseases')
      .select('*')
      .eq('id', diseaseId)
      .single();

    if (diseaseError) throw diseaseError;
    if (!disease) return null;

    // Fetch symptoms
    const { data: symptoms, error: symptomsError } = await supabase
      .from('disease_symptoms')
      .select('symptom')
      .eq('disease_id', diseaseId);

    if (symptomsError) throw symptomsError;

    // Fetch treatments
    const { data: treatments, error: treatmentsError } = await supabase
      .from('disease_treatments')
      .select('treatment')
      .eq('disease_id', diseaseId);

    if (treatmentsError) throw treatmentsError;

    // Fetch preventive measures
    const { data: measures, error: measuresError } = await supabase
      .from('disease_preventive_measures')
      .select('measure')
      .eq('disease_id', diseaseId);

    if (measuresError) throw measuresError;

    // Fetch environmental factors
    const { data: factors, error: factorsError } = await supabase
      .from('disease_environmental_factors')
      .select('factor_name, factor_value')
      .eq('disease_id', diseaseId);

    if (factorsError) throw factorsError;

    return {
      ...disease,
      symptoms: symptoms?.map(s => s.symptom) || [],
      treatments: treatments?.map(t => t.treatment) || [],
      preventive_measures: measures?.map(m => m.measure) || [],
      environmental_factors: factors?.map(f => ({
        name: f.factor_name,
        value: f.factor_value
      })) || []
    };
  } catch (error) {
    toast({
      title: "Error fetching disease details",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

export const uploadPlantImage = async (file: File, userId?: string): Promise<string | null> => {
  try {
    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = userId ? `${userId}/${fileName}` : `public/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('plant_images')
      .upload(filePath, file);

    if (error) throw error;

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('plant_images')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    toast({
      title: "Error uploading image",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

export const analyzePlantDisease = async (
  imageUrl: string, 
  userId?: string, 
  weatherData?: WeatherData
): Promise<PredictionResult | null> => {
  try {
    // Call Supabase Edge Function with enhanced data
    const { data, error } = await supabase.functions.invoke('advanced-ml-prediction', {
      body: { 
        imageUrl, 
        userId,
        weatherData,
        requestType: 'disease'
      }
    });

    if (error) throw error;
    
    return data as PredictionResult;
  } catch (error) {
    toast({
      title: "Error analyzing plant disease",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

export const getCropRecommendations = async (
  soilData: SoilData,
  locationData?: LocationData,
  weatherData?: WeatherData,
  userId?: string
): Promise<CropRecommendationResult | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('advanced-ml-prediction', {
      body: {
        soilData,
        locationData,
        weatherData,
        userId,
        requestType: 'crop'
      }
    });

    if (error) throw error;
    
    return data as CropRecommendationResult;
  } catch (error) {
    toast({
      title: "Error getting crop recommendations",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

export const getBudgetPlan = async (
  financialData: FinancialData,
  userId?: string
): Promise<BudgetPlanResult | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('advanced-ml-prediction', {
      body: {
        financialData,
        userId,
        requestType: 'budget'
      }
    });

    if (error) throw error;
    
    return data as BudgetPlanResult;
  } catch (error) {
    toast({
      title: "Error creating budget plan",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

export const getDashboardInsights = async (
  userId: string,
  additionalData?: {
    weatherData?: WeatherData;
    soilData?: SoilData;
  }
): Promise<DashboardInsightsResult | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('advanced-ml-prediction', {
      body: {
        userId,
        weatherData: additionalData?.weatherData,
        soilData: additionalData?.soilData,
        requestType: 'dashboard'
      }
    });

    if (error) throw error;
    
    return data as DashboardInsightsResult;
  } catch (error) {
    toast({
      title: "Error fetching dashboard insights",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

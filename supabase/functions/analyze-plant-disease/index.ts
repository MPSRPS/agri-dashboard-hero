
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Disease {
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

interface PredictionResult {
  mainDisease: Disease;
  diseases: Disease[];
}

interface PlantTypeInfo {
  type: string;
  diseaseIds: string[];
  confidence: number;
}

// Simple plant type detection from image URL
// In a real system, this would use actual computer vision
const detectPlantType = (imageUrl: string): PlantTypeInfo => {
  console.log("Analyzing image URL for plant type:", imageUrl);
  
  // Extract a hash from the image URL to provide consistent results for the same image
  const urlHash = Array.from(imageUrl).reduce((hash, char) => {
    return ((hash << 5) - hash) + char.charCodeAt(0) | 0;
  }, 0);
  
  // Use the hash to select a plant type deterministically
  const plantTypes = [
    { type: "tomato", diseaseIds: ["tomato-blight", "tomato-spot"], confidenceRange: [0.65, 0.95] },
    { type: "rose", diseaseIds: ["rose-blackspot", "rose-powdery-mildew"], confidenceRange: [0.70, 0.90] },
    { type: "wheat", diseaseIds: ["wheat-rust", "wheat-powdery-mildew"], confidenceRange: [0.60, 0.85] },
    { type: "rice", diseaseIds: ["rice-blast", "rice-blight"], confidenceRange: [0.75, 0.92] },
    { type: "corn", diseaseIds: ["corn-rust", "corn-blight"], confidenceRange: [0.68, 0.88] }
  ];
  
  // Get month and day to add more variability
  const date = new Date();
  const monthDay = date.getMonth() * 31 + date.getDate();
  
  // Combine URL hash with date for consistent but slightly variable outcomes
  const combinedValue = (Math.abs(urlHash) + monthDay) % 100;
  
  // Select plant type based on image URL characteristics
  let selectedType;
  if (imageUrl.includes("rose") || combinedValue < 20) {
    selectedType = plantTypes[1]; // Rose
  } else if (imageUrl.includes("wheat") || (combinedValue >= 20 && combinedValue < 40)) {
    selectedType = plantTypes[2]; // Wheat
  } else if (imageUrl.includes("rice") || (combinedValue >= 40 && combinedValue < 60)) {
    selectedType = plantTypes[3]; // Rice
  } else if (imageUrl.includes("corn") || (combinedValue >= 60 && combinedValue < 80)) {
    selectedType = plantTypes[4]; // Corn
  } else {
    selectedType = plantTypes[0]; // Default to tomato
  }
  
  // Generate confidence value
  const [min, max] = selectedType.confidenceRange;
  const confidence = min + (Math.abs(urlHash % 1000) / 1000) * (max - min);
  
  return {
    type: selectedType.type,
    diseaseIds: selectedType.diseaseIds,
    confidence: confidence
  };
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Deno runtime
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Parse the request body
    const { imageUrl, userId, weatherData } = await req.json()

    console.log("Received request:", { imageUrl, userId, weatherData });

    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: imageUrl' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Detect plant type from the image URL
    const plantInfo = detectPlantType(imageUrl);
    console.log("Detected plant type:", plantInfo);
    
    // Get all diseases from the database
    const { data: allDiseases, error: diseasesError } = await supabase
      .from('plant_diseases')
      .select('*')
    
    if (diseasesError) {
      console.error("Error fetching diseases:", diseasesError);
      throw diseasesError;
    }
    
    if (!allDiseases || allDiseases.length === 0) {
      throw new Error("No diseases found in the database");
    }
    
    // Filter diseases based on detected plant type
    // In a real system, you'd use proper plant-disease associations
    // For demo purposes, we'll simulate this with name matching
    const relevantDiseases = allDiseases.filter(disease => {
      const diseaseName = disease.name.toLowerCase();
      return diseaseName.includes(plantInfo.type) || 
             plantInfo.diseaseIds.some(id => diseaseName.includes(id.split('-')[1]));
    });
    
    // If no relevant diseases found, fall back to random selection
    const diseasesToUse = relevantDiseases.length > 0 ? relevantDiseases : allDiseases;
    
    // Select a main disease
    const mainDiseaseIndex = Math.floor(Math.random() * diseasesToUse.length);
    const mainDiseaseId = diseasesToUse[mainDiseaseIndex].id;
    
    // Get details for the main disease
    const { data: mainDiseaseData, error: mainDiseaseError } = await supabase
      .from('plant_diseases')
      .select('*')
      .eq('id', mainDiseaseId)
      .single();
    
    if (mainDiseaseError) {
      console.error("Error fetching main disease:", mainDiseaseError);
      throw mainDiseaseError;
    }
    
    // Get symptoms for the main disease
    const { data: symptoms, error: symptomsError } = await supabase
      .from('disease_symptoms')
      .select('symptom')
      .eq('disease_id', mainDiseaseId);
    
    if (symptomsError) {
      console.error("Error fetching symptoms:", symptomsError);
      throw symptomsError;
    }
    
    // Get treatments for the main disease
    const { data: treatments, error: treatmentsError } = await supabase
      .from('disease_treatments')
      .select('treatment')
      .eq('disease_id', mainDiseaseId);
    
    if (treatmentsError) {
      console.error("Error fetching treatments:", treatmentsError);
      throw treatmentsError;
    }
    
    // Get preventive measures for the main disease
    const { data: measures, error: measuresError } = await supabase
      .from('disease_preventive_measures')
      .select('measure')
      .eq('disease_id', mainDiseaseId);
    
    if (measuresError) {
      console.error("Error fetching preventive measures:", measuresError);
      throw measuresError;
    }
    
    // Get environmental factors for the main disease
    const { data: factors, error: factorsError } = await supabase
      .from('disease_environmental_factors')
      .select('factor_name, factor_value')
      .eq('disease_id', mainDiseaseId);
    
    if (factorsError) {
      console.error("Error fetching environmental factors:", factorsError);
      throw factorsError;
    }
    
    // Use the detected confidence for the main disease
    const mainDiseaseConfidence = plantInfo.confidence;
    
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
    
    // Select other diseases with lower confidence
    const otherDiseases = diseasesToUse
      .filter(d => d.id !== mainDiseaseId)
      .map(d => ({
        ...d,
        confidence: Math.random() * 0.3 // Between 0 and 0.3
      }))
      .sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
    
    // Save analysis to history if userId is provided
    if (userId) {
      try {
        const validUserId = userId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i) 
          ? userId 
          : null;
          
        if (validUserId) {
          const { error: insertError } = await supabase.from('plant_analysis_history').insert({
            user_id: validUserId,
            image_path: imageUrl,
            main_disease_id: mainDiseaseId,
            confidence: mainDiseaseConfidence
          });
          
          if (insertError) {
            console.error("Error saving analysis to history:", insertError);
          } else {
            console.log("Analysis saved to history successfully");
          }
        } else {
          console.log("Skipping history save - invalid UUID format for user_id:", userId);
        }
      } catch (error) {
        console.error("Error in history save process:", error);
      }
    }
    
    const result: PredictionResult = {
      mainDisease,
      diseases: [mainDisease, ...otherDiseases.slice(0, 4)] // Limit to 5 total diseases
    };
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-plant-disease function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        mainDisease: {
          id: "fallback",
          name: "Analysis Failed",
          description: "We couldn't analyze the image. Please try again with a clearer image.",
          confidence: 0,
          symptoms: ["Unable to process image"],
          treatments: ["Try uploading a different image with better lighting"],
          preventive_measures: ["Ensure good lighting when taking photos", "Focus clearly on the affected area"],
          environmental_factors: []
        },
        diseases: []
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  }
});

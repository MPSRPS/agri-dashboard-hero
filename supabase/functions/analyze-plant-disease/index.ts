
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
}

interface PredictionResult {
  mainDisease: Disease;
  diseases: Disease[];
}

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

    // In a real-world scenario, this is where you would:
    // 1. Call an external AI model API with the image
    // 2. Process the response to get disease predictions

    // For now, we'll simulate by randomly selecting diseases from our database
    
    // Get all diseases
    const { data: allDiseases, error: diseasesError } = await supabase
      .from('plant_diseases')
      .select('*')
    
    if (diseasesError) {
      console.error("Error fetching diseases:", diseasesError);
      throw diseasesError
    }
    
    if (!allDiseases || allDiseases.length === 0) {
      throw new Error("No diseases found in the database")
    }
    
    // Randomly select a main disease
    const mainDiseaseIndex = Math.floor(Math.random() * allDiseases.length)
    const mainDiseaseId = allDiseases[mainDiseaseIndex].id
    
    // Get details for the main disease
    const { data: mainDiseaseData, error: mainDiseaseError } = await supabase
      .from('plant_diseases')
      .select('*')
      .eq('id', mainDiseaseId)
      .single()
    
    if (mainDiseaseError) {
      console.error("Error fetching main disease:", mainDiseaseError);
      throw mainDiseaseError
    }
    
    // Get symptoms for the main disease
    const { data: symptoms, error: symptomsError } = await supabase
      .from('disease_symptoms')
      .select('symptom')
      .eq('disease_id', mainDiseaseId)
    
    if (symptomsError) {
      console.error("Error fetching symptoms:", symptomsError);
      throw symptomsError
    }
    
    // Get treatments for the main disease
    const { data: treatments, error: treatmentsError } = await supabase
      .from('disease_treatments')
      .select('treatment')
      .eq('disease_id', mainDiseaseId)
    
    if (treatmentsError) {
      console.error("Error fetching treatments:", treatmentsError);
      throw treatmentsError
    }
    
    // Get preventive measures for the main disease
    const { data: measures, error: measuresError } = await supabase
      .from('disease_preventive_measures')
      .select('measure')
      .eq('disease_id', mainDiseaseId)
    
    if (measuresError) {
      console.error("Error fetching preventive measures:", measuresError);
      throw measuresError
    }
    
    // Get environmental factors for the main disease
    const { data: factors, error: factorsError } = await supabase
      .from('disease_environmental_factors')
      .select('factor_name, factor_value')
      .eq('disease_id', mainDiseaseId)
    
    if (factorsError) {
      console.error("Error fetching environmental factors:", factorsError);
      throw factorsError
    }
    
    // Set a random confidence for the main disease
    const mainDiseaseConfidence = Math.random() * 0.5 + 0.5 // Between 0.5 and 1.0
    
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
    }
    
    // Select other diseases with lower confidence
    const otherDiseases = allDiseases
      .filter(d => d.id !== mainDiseaseId)
      .map(d => ({
        ...d,
        confidence: Math.random() * 0.3 // Between 0 and 0.3
      }))
      .sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
    
    // Save analysis to history if userId is provided
    if (userId) {
      const { error: insertError } = await supabase.from('plant_analysis_history').insert({
        user_id: userId,
        image_path: imageUrl,
        main_disease_id: mainDiseaseId,
        confidence: mainDiseaseConfidence
      })
      
      if (insertError) {
        console.error("Error saving analysis to history:", insertError);
      }
    }
    
    const result: PredictionResult = {
      mainDisease,
      diseases: [mainDisease, ...otherDiseases.slice(0, 4)] // Limit to 5 total diseases
    }
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in analyze-plant-disease function:', error)
    
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
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 } // Changed to 200
    )
  }
})

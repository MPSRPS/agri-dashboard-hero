
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

export const analyzePlantDisease = async (imageUrl: string, userId?: string): Promise<PredictionResult | null> => {
  try {
    // Call Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('analyze-plant-disease', {
      body: { imageUrl, userId }
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

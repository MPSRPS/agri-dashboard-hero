
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabaseClient } from '@/integrations/supabase/client';

interface PlantDiseaseDetectionResult {
  disease: string;
  confidence: number;
  description: string;
  treatment: string;
  prevention: string;
}

export const usePlantDiseaseDetection = () => {
  const [result, setResult] = useState<PlantDiseaseDetectionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to detect plant disease from image
  const detectDisease = async (imageFile: File): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Create a unique file name for the image
      const fileName = `${Date.now()}-${imageFile.name}`;
      
      // Upload the image file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabaseClient
        .storage
        .from('plant-disease-images')
        .upload(fileName, imageFile);

      if (uploadError) {
        throw new Error(`Error uploading image: ${uploadError.message}`);
      }

      // Get the public URL for the uploaded image
      const { data: urlData } = await supabaseClient
        .storage
        .from('plant-disease-images')
        .getPublicUrl(fileName);

      const imageUrl = urlData.publicUrl;

      // Call the Edge Function for plant disease detection
      const { data, error: functionError } = await supabaseClient
        .functions
        .invoke('analyze-plant-disease', {
          body: { imageUrl },
        });

      if (functionError) {
        throw new Error(`Error analyzing image: ${functionError.message}`);
      }

      // Set the result
      setResult(data);
    } catch (error) {
      console.error('Error detecting plant disease:', error);
      setError(error instanceof Error ? error.message : 'Failed to analyze image');
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to analyze image',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    detectDisease,
    result,
    isLoading,
    error,
  };
};

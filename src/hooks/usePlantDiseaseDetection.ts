
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [prediction, setPrediction] = useState(null);

  // Function to handle file selection
  const handleFile = (file: File) => {
    if (!file) return;
    
    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }
    
    // Create a URL for the selected image
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    setError(null);
  };
  
  // Function to reset selected image
  const resetImage = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }
    setSelectedImage(null);
    setResult(null);
    setPrediction(null);
    setError(null);
  };
  
  // Function to analyze the selected image
  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    // Convert data URL to File object
    try {
      // Get the file from input element
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const file = new File([blob], "plant_image.jpg", { type: blob.type });
      
      // Call the detect disease function
      await detectDisease(file);
    } catch (error) {
      console.error("Error preparing image for analysis:", error);
      toast({
        title: "Error",
        description: "Failed to prepare image for analysis",
        variant: "destructive",
      });
    }
  };

  // Function to detect plant disease from image
  const detectDisease = async (imageFile: File): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Create a unique file name for the image
      const fileName = `${Date.now()}-${imageFile.name}`;
      
      // Upload the image file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('plant-disease-images')
        .upload(fileName, imageFile);

      if (uploadError) {
        throw new Error(`Error uploading image: ${uploadError.message}`);
      }

      // Get the public URL for the uploaded image
      const { data: urlData } = await supabase
        .storage
        .from('plant-disease-images')
        .getPublicUrl(fileName);

      const imageUrl = urlData.publicUrl;

      // Call the Edge Function for plant disease detection
      const { data, error: functionError } = await supabase
        .functions
        .invoke('analyze-plant-disease', {
          body: { imageUrl },
        });

      if (functionError) {
        throw new Error(`Error analyzing image: ${functionError.message}`);
      }

      // Set the result
      setResult(data);
      setPrediction(data);
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
    selectedImage,
    isDragging,
    setIsDragging,
    loading: isLoading,
    prediction,
    handleFile,
    resetImage,
    analyzeImage
  };
};

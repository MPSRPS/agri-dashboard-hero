
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  analyzePlantDisease, 
  PredictionResult,
  WeatherData 
} from '@/services/plantDiseaseService';
import { toast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

export const usePlantDiseaseDetection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const { user } = useAuth();

  // Get approximate weather data based on browser geolocation
  const detectWeatherData = async (): Promise<WeatherData | null> => {
    try {
      // This would ideally call a weather API based on geolocation
      // For now we're simulating with reasonable values
      return {
        temperature: 25 + (Math.random() * 10 - 5), // 20-30°C
        humidity: 60 + (Math.random() * 30 - 15),   // 45-75%
        rainfall: 20 + (Math.random() * 40)         // 20-60mm
      };
    } catch (error) {
      console.error('Error detecting weather data:', error);
      return null;
    }
  };

  const handleFile = async (file: File) => {
    if (!file.type.includes('image/')) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setPrediction(null);
    };
    reader.readAsDataURL(file);
    
    // Try to get weather data in the background
    detectWeatherData().then(data => {
      if (data) setWeatherData(data);
    });
  };

  const resetImage = () => {
    setSelectedImage(null);
    setPrediction(null);
    setWeatherData(null);
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setLoading(true);
    
    try {
      // For demo purposes, we'll simulate sending the image to the backend
      // In a real app, we would upload the image to storage first

      // If we don't have weather data yet, try to get it
      if (!weatherData) {
        const data = await detectWeatherData();
        if (data) setWeatherData(data);
      }
      
      // Call the analyze-plant-disease function directly
      const { data, error } = await supabase.functions.invoke("analyze-plant-disease", {
        body: {
          imageUrl: selectedImage || "dummy-url",
          userId: user?.id,
          weatherData: weatherData || undefined
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setPrediction(data);
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        title: "Analysis failed",
        description: error.message || "Failed to analyze image",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    selectedImage,
    setSelectedImage,
    isDragging,
    setIsDragging,
    loading,
    prediction,
    weatherData,
    handleFile,
    resetImage,
    analyzeImage
  };
};

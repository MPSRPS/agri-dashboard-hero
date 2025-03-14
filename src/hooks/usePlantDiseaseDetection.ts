
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  uploadPlantImage, 
  analyzePlantDisease, 
  PredictionResult,
  WeatherData 
} from '@/services/plantDiseaseService';

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
      // Convert data URL to file object if it's a data URL
      let imageUrl = selectedImage;
      
      // If the image is a data URL (from FileReader), upload it to Supabase storage
      if (selectedImage.startsWith('data:')) {
        const file = await dataURLtoFile(selectedImage, 'plant_image.jpg');
        const uploadedUrl = await uploadPlantImage(file, user?.id);
        
        if (!uploadedUrl) {
          throw new Error('Failed to upload image');
        }
        
        imageUrl = uploadedUrl;
      }
      
      // If we don't have weather data yet, try to get it
      if (!weatherData) {
        const data = await detectWeatherData();
        if (data) setWeatherData(data);
      }
      
      // Analyze the plant disease with weather data for enhanced accuracy
      const result = await analyzePlantDisease(imageUrl, user?.id, weatherData || undefined);
      
      if (result) {
        setPrediction(result);
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

  // Helper function to convert data URL to File object
  const dataURLtoFile = (dataUrl: string, filename: string): Promise<File> => {
    return new Promise((resolve, reject) => {
      const arr = dataUrl.split(',');
      if (arr.length < 2) {
        reject(new Error('Invalid data URL'));
        return;
      }
      
      const mime = arr[0].match(/:(.*?);/)?.[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      
      resolve(new File([u8arr], filename, { type: mime }));
    });
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

// Helper imports that were missing from the original implementation
import { toast } from "@/hooks/use-toast";

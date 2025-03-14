
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { uploadPlantImage, analyzePlantDisease, PredictionResult } from '@/services/plantDiseaseService';

export const usePlantDiseaseDetection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const { user } = useAuth();

  const handleFile = async (file: File) => {
    if (!file.type.includes('image/')) {
      alert('Please upload an image file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setPrediction(null);
    };
    reader.readAsDataURL(file);
  };

  const resetImage = () => {
    setSelectedImage(null);
    setPrediction(null);
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
      
      // Analyze the plant disease
      const result = await analyzePlantDisease(imageUrl, user?.id);
      
      if (result) {
        setPrediction(result);
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
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
    handleFile,
    resetImage,
    analyzeImage
  };
};

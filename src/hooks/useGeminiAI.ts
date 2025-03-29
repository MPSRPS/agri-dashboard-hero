
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface UseGeminiAIProps {
  prompt?: string;
  type?: 'general' | 'crop_advice' | 'disease_analysis';
  cropData?: any;
  soilData?: any;
  weatherData?: any;
}

export const useGeminiAI = () => {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callGeminiAI = async ({
    prompt = "",
    type = "general",
    cropData = null,
    soilData = null,
    weatherData = null
  }: UseGeminiAIProps) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: geminiError } = await supabase.functions.invoke(
        'gemini-ai', 
        {
          body: { 
            prompt, 
            type, 
            cropData, 
            soilData, 
            weatherData 
          }
        }
      );

      if (geminiError) {
        throw new Error(geminiError.message);
      }

      setResponse(data);
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while calling the AI';
      setError(errorMessage);
      
      toast({
        title: "AI Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    callGeminiAI,
    response,
    loading,
    error,
    clearResponse: () => setResponse(null)
  };
};

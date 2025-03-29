
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Get API key from environment variables
const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Check if API key is available
  if (!geminiApiKey) {
    return new Response(
      JSON.stringify({ error: 'Gemini API key is not configured' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }

  try {
    const { prompt, type, cropData, soilData, weatherData } = await req.json();

    if (!prompt && !type) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: prompt or type' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    let geminiPrompt = '';
    let apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    
    // Configure prompt based on request type
    if (type === 'crop_advice') {
      geminiPrompt = `You are an AI agricultural expert. Based on the following data, provide farming advice:
      
Soil Data: ${JSON.stringify(soilData)}
Weather Data: ${JSON.stringify(weatherData)}
Crop Information: ${JSON.stringify(cropData)}

Please provide detailed advice on:
1. Optimal farming practices
2. Potential risks and mitigation strategies
3. Expected yield and timeline
4. Sustainability recommendations

Format your response as JSON with the following structure:
{
  "advice": {
    "practices": ["practice1", "practice2",...],
    "risks": ["risk1", "risk2",...],
    "timeline": "detailed timeline",
    "sustainability": ["rec1", "rec2",...]
  }
}`;
    } else if (type === 'disease_analysis') {
      apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent';
      // This would be for image analysis with Gemini Pro Vision
    } else {
      // Default to general prompt
      geminiPrompt = prompt;
    }

    const payload = {
      contents: [
        {
          parts: [
            { text: geminiPrompt }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };

    // Make request to Gemini API
    const response = await fetch(`${apiEndpoint}?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    let result;
    try {
      // Try to extract and parse text from Gemini response
      const generatedText = data.candidates[0].content.parts[0].text;
      
      // If response is JSON formatted, parse it
      if (type === 'crop_advice' && generatedText.includes('{')) {
        const jsonStartIndex = generatedText.indexOf('{');
        const jsonEndIndex = generatedText.lastIndexOf('}') + 1;
        const jsonString = generatedText.substring(jsonStartIndex, jsonEndIndex);
        result = { 
          type: 'structured',
          data: JSON.parse(jsonString),
          rawText: generatedText
        };
      } else {
        result = { 
          type: 'text',
          text: generatedText 
        };
      }
    } catch (error) {
      console.error('Error processing Gemini response:', error);
      result = { 
        type: 'text',
        text: data.candidates[0].content.parts[0].text 
      };
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

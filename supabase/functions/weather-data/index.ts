
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Get API key from environment variable
const WEATHER_API_KEY = Deno.env.get('WEATHER_API_KEY') || 'demo_fallback_key';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location } = await req.json();
    
    if (!location || !location.lat || !location.lon) {
      throw new Error('Valid location coordinates are required');
    }

    // Use OpenWeatherMap API (free tier)
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${location.lat}&lon=${location.lon}&exclude=minutely,hourly&units=metric&appid=${WEATHER_API_KEY}`
    );

    if (!weatherResponse.ok) {
      throw new Error(`Weather API error: ${weatherResponse.status}`);
    }

    const weatherData = await weatherResponse.json();
    
    // Transform data into our application format
    const current = weatherData.current;
    const dailyForecast = weatherData.daily.slice(0, 7);
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const transformedData = {
      weather: {
        temperature: current.temp,
        humidity: current.humidity,
        condition: current.weather[0].main,
        windSpeed: current.wind_speed,
        rainfall: current.rain ? current.rain['1h'] : 0,
        forecast: dailyForecast.map((day: any) => {
          const date = new Date(day.dt * 1000);
          return {
            day: days[date.getDay()],
            temp: day.temp.day,
            rain: day.rain || 0,
            condition: day.weather[0].main
          };
        })
      }
    };

    return new Response(JSON.stringify(transformedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in weather-data function:', error);
    
    // Generate fallback data on error
    const fallbackData = generateFallbackWeatherData();
    
    return new Response(JSON.stringify({ 
      weather: fallbackData,
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateFallbackWeatherData() {
  const currentTemp = 25 + Math.random() * 10;
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return {
    temperature: Math.round(currentTemp * 10) / 10,
    humidity: Math.round(60 + Math.random() * 20),
    condition: getRandomCondition(),
    windSpeed: Math.round((5 + Math.random() * 15) * 10) / 10,
    rainfall: Math.round(Math.random() * 10),
    forecast: days.map(day => ({
      day,
      temp: Math.round((currentTemp + (Math.random() * 6 - 3)) * 10) / 10,
      rain: Math.round(Math.random() * 30),
      condition: getRandomCondition()
    }))
  };
}

function getRandomCondition() {
  const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Thunderstorm', 'Windy'];
  return conditions[Math.floor(Math.random() * conditions.length)];
}

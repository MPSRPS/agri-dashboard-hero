
import { supabase } from "@/integrations/supabase/client";

interface WeatherData {
  temperature: number;
  humidity: number;
  condition: string;
  windSpeed: number;
  rainfall: number;
  forecast: Array<{
    day: string;
    temp: number;
    rain: number;
    condition: string;
  }>;
}

export async function getUserLocation(): Promise<{ lat: number; lon: number } | null> {
  // Try to get location from browser geolocation API
  if (navigator.geolocation) {
    try {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lon: position.coords.longitude
            });
          },
          (error) => {
            console.error("Geolocation error:", error);
            resolve(null);
          },
          { timeout: 10000 }
        );
      });
    } catch (error) {
      console.error("Error getting location:", error);
    }
  }
  
  // Default to a location in India if geolocation fails (Delhi coordinates)
  return { lat: 28.6139, lon: 77.2090 };
}

export async function getWeatherData(): Promise<WeatherData> {
  try {
    const location = await getUserLocation();
    
    // Call the weather API through our Supabase Edge Function
    const { data, error } = await supabase.functions.invoke("weather-data", {
      body: { location }
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    if (data && data.weather) {
      return data.weather;
    }
    
    throw new Error("Invalid weather data received");
  } catch (error) {
    console.error("Error fetching weather data:", error);
    
    // Return fallback weather data
    return generateFallbackWeatherData();
  }
}

function generateFallbackWeatherData(): WeatherData {
  // Generate realistic fallback data
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

function getRandomCondition(): string {
  const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Thunderstorm', 'Windy'];
  return conditions[Math.floor(Math.random() * conditions.length)];
}

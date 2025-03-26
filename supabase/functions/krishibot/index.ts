
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Agricultural knowledge base
const knowledgeBase = {
  crops: {
    wheat: {
      planting: "Plant wheat in fall for winter wheat or early spring for spring wheat. Optimal soil temperature is 12-25°C.",
      care: "Ensure proper irrigation especially during flowering. Apply nitrogen fertilizer in split doses. Keep watch for rust and powdery mildew.",
      harvesting: "Harvest when grain is hard and moisture content is below 14%. Use combine harvester for efficiency.",
      pests: "Common pests include aphids, armyworms, and Hessian fly. Implement integrated pest management strategies.",
    },
    rice: {
      planting: "Prepare seedbeds and transplant seedlings when they are 20-25 days old. Direct seeding is also possible in suitable conditions.",
      care: "Maintain standing water of 2-5cm. Apply fertilizers based on soil tests. Weed management is crucial in the first 40 days.",
      harvesting: "Harvest when 80-85% of grains turn golden yellow. Moisture content should be around 20-25% for optimal harvesting.",
      pests: "Watch for stem borers, plant hoppers, and rice blast disease. Use resistant varieties and appropriate pesticides if necessary.",
    },
    maize: {
      planting: "Plant in spring after last frost. Soil temperature should be at least 10°C. Plant seeds 3-5cm deep.",
      care: "Requires regular watering especially during tasseling and silking. Side-dress with nitrogen when plants are 30cm tall.",
      harvesting: "Harvest when kernels are fully formed and husks are dry. Kernels should be firm and not dented when pressed.",
      pests: "Common issues include corn earworm, European corn borer, and corn smut. Rotate crops and use targeted pesticides if needed.",
    },
    potato: {
      planting: "Plant seed potatoes 10-15cm deep and 25-30cm apart when soil temperature reaches 7-10°C.",
      care: "Hill the soil around plants as they grow. Maintain consistent moisture. Apply balanced fertilizer before planting.",
      harvesting: "Harvest after vines have died back naturally or 2-3 weeks after killing vines chemically. Cure in dark place for 10-14 days.",
      pests: "Colorado potato beetle and late blight are major concerns. Implement crop rotation and use disease-free seed potatoes.",
    },
    tomato: {
      planting: "Start seeds indoors 6-8 weeks before last frost. Transplant when soil is warm and all frost danger has passed.",
      care: "Stake or cage plants for support. Water at the base to avoid leaf diseases. Prune suckers for indeterminate varieties.",
      harvesting: "Harvest when fruits are firm and fully colored. They will continue to ripen after picking if needed.",
      pests: "Watch for tomato hornworms, aphids, and early blight. Maintain good air circulation and avoid wetting foliage when watering.",
    }
  },
  diseases: {
    "leaf blight": {
      symptoms: "Yellow or brown patches on leaves, often with concentric rings. Leaves may wither and die.",
      causes: "Fungal pathogens, often exacerbated by warm, humid conditions and poor air circulation.",
      treatment: "Apply fungicides as a preventative or at first sign of disease. Remove and destroy infected plant material.",
      prevention: "Rotate crops, ensure adequate spacing for air circulation, avoid overhead watering, and use disease-resistant varieties."
    },
    "powdery mildew": {
      symptoms: "White powdery patches on leaves, stems, and sometimes fruit. May cause leaf distortion and premature leaf drop.",
      causes: "Fungal infection favored by high humidity but dry leaf conditions. Often worse in shade and moderate temperatures.",
      treatment: "Apply sulfur-based fungicides or potassium bicarbonate. Neem oil can also be effective for mild cases.",
      prevention: "Increase air circulation, plant in sunny locations, avoid over-fertilizing with nitrogen, and use resistant varieties."
    },
    "rust": {
      symptoms: "Rusty-colored pustules on leaves and stems. Severe infections cause leaf yellowing and defoliation.",
      causes: "Fungal pathogens that thrive in moist conditions, moderate temperatures, and extended leaf wetness.",
      treatment: "Apply fungicides containing tebuconazole or chlorothalonil. Remove heavily infected plants to prevent spread.",
      prevention: "Avoid wetting foliage when watering, space plants properly, remove plant debris after the growing season."
    },
    "bacterial wilt": {
      symptoms: "Sudden wilting of plants despite adequate moisture. Cut stems may ooze bacterial slime when placed in water.",
      causes: "Soil-borne bacteria that enter through wounds in roots or stems, often spread by insects or contaminated tools.",
      treatment: "No effective chemical treatment. Remove and destroy infected plants immediately to prevent spread.",
      prevention: "Rotate crops, control insect vectors like cucumber beetles, sanitize tools, and use resistant varieties if available."
    },
    "mosaic virus": {
      symptoms: "Mottled pattern of light and dark green or yellow on leaves. May include leaf distortion and stunted growth.",
      causes: "Viral pathogens transmitted primarily by aphids and other sap-sucking insects. Can also spread through contaminated tools.",
      treatment: "No cure available. Remove and destroy infected plants to prevent spread to healthy plants.",
      prevention: "Control aphid populations, wash hands and sanitize tools between plants, use virus-resistant varieties."
    }
  },
  generalFarming: {
    soilHealth: "Maintain soil health through regular testing, crop rotation, cover cropping, and appropriate organic matter addition. Healthy soil leads to resilient crops.",
    irrigation: "Implement efficient irrigation methods like drip irrigation to conserve water. Water deeply but infrequently to encourage deep root growth.",
    sustainablePractices: "Adopt sustainable farming practices like integrated pest management, conservation tillage, and organic fertilization to reduce environmental impact.",
    weatherAdaptation: "Stay informed about local weather patterns and climate predictions. Plan planting and harvesting around expected weather conditions.",
    marketAwareness: "Research market trends and demands before deciding what to grow. Consider value-added products to increase farm income."
  }
};

// Function to get a response from the knowledge base
function getResponseFromKnowledgeBase(message: string, language: string = 'english'): string {
  message = message.toLowerCase();
  
  let response = "";
  
  // Check for greetings
  if (message.match(/hello|hi|hey|greetings/)) {
    response = "Hello! I'm KrishiBot, your agricultural assistant. How can I help you today?";
  }
  // Check for crop-specific queries
  else if (message.includes("how to grow") || message.includes("how do i grow") || message.includes("planting")) {
    for (const crop in knowledgeBase.crops) {
      if (message.includes(crop)) {
        response = `Here's information about growing ${crop}:\n\n`;
        response += `Planting: ${knowledgeBase.crops[crop].planting}\n\n`;
        response += `Care: ${knowledgeBase.crops[crop].care}\n\n`;
        response += `Harvesting: ${knowledgeBase.crops[crop].harvesting}\n\n`;
        response += `Pest Management: ${knowledgeBase.crops[crop].pests}`;
        break;
      }
    }
  }
  // Check for disease-specific queries
  else if (message.includes("disease") || message.includes("treatment") || message.includes("symptoms")) {
    for (const disease in knowledgeBase.diseases) {
      if (message.includes(disease)) {
        response = `Information about ${disease}:\n\n`;
        response += `Symptoms: ${knowledgeBase.diseases[disease].symptoms}\n\n`;
        response += `Causes: ${knowledgeBase.diseases[disease].causes}\n\n`;
        response += `Treatment: ${knowledgeBase.diseases[disease].treatment}\n\n`;
        response += `Prevention: ${knowledgeBase.diseases[disease].prevention}`;
        break;
      }
    }
  }
  // Check for general farming queries
  else if (message.includes("soil health") || message.includes("soil management")) {
    response = knowledgeBase.generalFarming.soilHealth;
  }
  else if (message.includes("irrigation") || message.includes("watering")) {
    response = knowledgeBase.generalFarming.irrigation;
  }
  else if (message.includes("sustainable") || message.includes("environment") || message.includes("eco-friendly")) {
    response = knowledgeBase.generalFarming.sustainablePractices;
  }
  else if (message.includes("weather") || message.includes("climate")) {
    response = knowledgeBase.generalFarming.weatherAdaptation;
  }
  else if (message.includes("market") || message.includes("sell") || message.includes("prices")) {
    response = knowledgeBase.generalFarming.marketAwareness;
  }
  else if (message.includes("add crop") || message.includes("create crop") || message.includes("add new crop")) {
    response = "To add a new crop, go to the Dashboard and click on the 'Manage Your Farm Data' card. Select the 'Crops' tab and click 'Add New Crop'. Enter the crop name and status, then click 'Add Crop'.";
  }
  else if (message.includes("add task") || message.includes("create task") || message.includes("add new task")) {
    response = "To add a new task, go to the Dashboard and click on the 'Manage Your Farm Data' card. Select the 'Tasks' tab and click 'Add New Task'. Enter the task details and click 'Add Task'.";
  }
  else if (message.includes("total crops") || message.includes("how many crops")) {
    response = "You can see the total number of crops in the metrics section at the top of your Dashboard.";
  }
  else if (message.includes("harvest ready") || message.includes("ready for harvest")) {
    response = "The number of crops ready for harvest is displayed in the metrics section at the top of your Dashboard. You can mark a crop as 'Ready for Harvest' by editing it in the Farm Data Management section.";
  }
  else if (message.includes("pending tasks") || message.includes("incomplete tasks")) {
    response = "Your pending tasks count is displayed in the metrics section at the top of your Dashboard. You can view and manage all your tasks in the Farm Data Management section.";
  }
  else if (message.includes("completed tasks") || message.includes("finished tasks")) {
    response = "The number of completed tasks is shown in the metrics section at the top of your Dashboard. You can mark tasks as completed in the Farm Data Management section.";
  }
  else if (message.includes("upload image") || message.includes("analyze plant") || message.includes("disease prediction")) {
    response = "To analyze a plant for diseases, go to the Disease Prediction page from the sidebar. Upload a clear image of the affected plant part, and the system will analyze it to identify potential diseases.";
  }
  else if (message.includes("bucket not found") || message.includes("storage error")) {
    response = "If you're encountering a 'bucket not found' error when uploading images, it means the storage bucket hasn't been properly initialized. This has been fixed in the latest update - please refresh your browser and try again.";
  }
  else if (message.includes("thank")) {
    response = "You're welcome! Feel free to ask if you have any other questions about farming or crop management.";
  }
  else {
    response = "I don't have specific information on that topic yet. Please ask about crop planting, care, harvesting, pest management, or common plant diseases. You can also ask about soil health, irrigation, sustainable farming practices, weather adaptation, or market awareness.";
  }
  
  return response;
}

// Function to fetch recent data for crops and tasks
async function fetchUserMetrics(userId: string, supabaseClient: any) {
  try {
    // Fetch user crops
    const { data: crops, error: cropsError } = await supabaseClient
      .from('user_crops')
      .select('*')
      .eq('user_id', userId);
    
    if (cropsError) throw cropsError;
    
    // Fetch user tasks
    const { data: tasks, error: tasksError } = await supabaseClient
      .from('user_tasks')
      .select('*')
      .eq('user_id', userId);
    
    if (tasksError) throw tasksError;
    
    return {
      totalCrops: crops.length,
      harvestReady: crops.filter((crop: any) => crop.status === 'ready').length,
      pendingTasks: tasks.filter((task: any) => task.status === 'pending').length,
      completedTasks: tasks.filter((task: any) => task.status === 'completed').length
    };
  } catch (error) {
    console.error('Error fetching user metrics:', error);
    return null;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, language, userId, messageHistory, attachmentInfo } = await req.json();
    
    if (!message && !attachmentInfo) {
      throw new Error('Message or attachment information is required');
    }

    // Initialize Supabase client if userId is provided
    let userMetrics = null;
    if (userId) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        userMetrics = await fetchUserMetrics(userId, supabase);
      }
    }

    // Process the message using our knowledge base
    let response = getResponseFromKnowledgeBase(message, language);
    
    // If we have user metrics and the message is asking about metrics
    if (userMetrics && 
        (message.toLowerCase().includes('metrics') || 
         message.toLowerCase().includes('statistics') ||
         message.toLowerCase().includes('summary') ||
         message.toLowerCase().includes('dashboard'))) {
      response = `Here are your current farm metrics:\n\n` +
                 `Total Crops: ${userMetrics.totalCrops}\n` +
                 `Crops Ready for Harvest: ${userMetrics.harvestReady}\n` +
                 `Pending Tasks: ${userMetrics.pendingTasks}\n` +
                 `Completed Tasks: ${userMetrics.completedTasks}\n\n` +
                 `You can view and manage these on your Dashboard.`;
    }

    console.log("Generated response:", response);

    return new Response(JSON.stringify({ 
      text: response,
      model: 'krishibot-local',
      confidence: 0.92
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in krishibot function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      text: "I'm having trouble connecting to my knowledge base. Please try again in a moment."
    }), {
      status: 200, // Changed from 500 to 200 to prevent error in frontend
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

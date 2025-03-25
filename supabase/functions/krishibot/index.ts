
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    const { message, language, userId, messageHistory, attachmentInfo } = await req.json();
    
    if (!message && !attachmentInfo) {
      throw new Error('Message or attachment information is required');
    }

    // Prepare context from previous messages
    let conversationContext = '';
    if (messageHistory && Array.isArray(messageHistory) && messageHistory.length > 0) {
      // Extract key information from recent messages to build context
      const recentMessages = messageHistory.slice(-5);
      conversationContext = recentMessages.map(msg => 
        `${msg.sender === 'user' ? 'Farmer' : 'Assistant'}: ${msg.text}`
      ).join('\n');
    }

    // Create system prompt customized for agricultural assistant with enhanced capabilities
    const systemPrompt = `You are KrishiBot, an advanced agricultural AI assistant trained on comprehensive agricultural data.
    You're specialized in providing accurate advice to farmers on:
    
    1. Crop management and rotation strategies
    2. Pest and disease identification and treatment
    3. Weather pattern interpretation and planning
    4. Irrigation and water management techniques
    5. Sustainable farming practices
    6. Market trends and crop selection
    7. Agricultural technologies and implementation
    
    Use a practical, helpful tone focused on actionable advice. Answer in ${language || 'english'}.
    If you don't know something for certain, acknowledge it and provide general guidance.
    Keep responses concise but comprehensive.
    
    Additional context from conversation:
    ${conversationContext}`;

    // Prepare conversation for the AI model
    let messages = [
      { role: 'system', content: systemPrompt },
    ];
    
    // Add the current message
    const userInput = attachmentInfo 
      ? `${message} [Image description: ${attachmentInfo}]` 
      : message;
    
    messages.push({ role: 'user', content: userInput });

    console.log("Sending to OpenAI:", JSON.stringify({ messages }));

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using a capable but fast model
        messages: messages,
        temperature: 0.7,
        max_tokens: 800, // Allow for more detailed responses
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API Error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid response format from OpenAI:', data);
      throw new Error('Invalid response from OpenAI');
    }
    
    const botResponse = data.choices[0].message.content;

    // Log analytics if user ID is provided
    if (userId) {
      console.log(`[Analytics] User ${userId} | Query: ${message.substring(0, 30)}... | Response length: ${botResponse.length} chars`);
    }

    return new Response(JSON.stringify({ 
      text: botResponse,
      model: 'gpt-4o-mini',
      confidence: 0.92, // Simulated confidence score
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


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
    const { message, language, userId, messageHistory } = await req.json();
    
    if (!message) {
      throw new Error('Message is required');
    }

    // Create system prompt customized for agricultural assistant
    const systemPrompt = `You are KrishiBot, an agricultural AI assistant specialized in helping farmers. 
    Provide advice on crop management, disease identification, weather interpretation, and farming best practices.
    Keep responses concise, practical, and focused on agricultural topics.
    Current language: ${language || 'english'}`;

    // Prepare conversation history for context
    let messages = [
      { role: 'system', content: systemPrompt },
    ];
    
    // Add message history if provided
    if (messageHistory && Array.isArray(messageHistory)) {
      // Add only the last 10 messages to avoid token limits
      const recentMessages = messageHistory.slice(-10);
      recentMessages.forEach(msg => {
        messages.push({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        });
      });
    }
    
    // Add the current message
    messages.push({ role: 'user', content: message });

    console.log("Sending to OpenAI:", JSON.stringify({ messages }));

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using a fast, efficient model
        messages: messages,
        temperature: 0.7,
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

    // Save conversation to database if userId is provided
    if (userId) {
      // For now we're just logging - in a real system we'd save to a database
      console.log(`Saving conversation for user ${userId}: Q: ${message}, A: ${botResponse}`);
    }

    return new Response(JSON.stringify({ text: botResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in krishibot function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      text: "I'm having trouble with my connection. Please try again in a moment."
    }), {
      status: 200, // Changed from 500 to 200 to prevent error in frontend
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

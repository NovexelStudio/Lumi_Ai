import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const googleApiKey = process.env.GOOGLE_API_KEY;
const openRouterApiKey = process.env.OPENROUTER_API_KEY;
const groqApiKey = process.env.GROQ_API_KEY;

const genAI = new GoogleGenerativeAI(googleApiKey || "");

const systemPrompt = "Your name is Lumi. You are a helpful AI assistant. Use Markdown for formatting. Do not use emojis.";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, model = 'gemini', history = [] } = body;
    
    // Build messages array from history and current message
    const messages = history && Array.isArray(history) ? history : [];
    if (message && typeof message === 'string') {
      messages.push({ role: 'user', content: message, timestamp: Date.now() });
    }
    
    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    if (model === 'openrouter') {
      // Use OpenRouter
      if (!openRouterApiKey) {
        return NextResponse.json({ error: "OpenRouter API Key is missing" }, { status: 500 });
      }

      const claudeMessages = messages.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      }));

      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openRouterApiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'Lumi Chat',
          },
          body: JSON.stringify({
            model: 'openai/gpt-3.5-turbo',
            messages: claudeMessages,
            temperature: 0.7,
            max_tokens: 2048,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error('OpenRouter response error:', data);
          throw new Error(data.error?.message || data.error || `OpenRouter Error: ${response.statusText}`);
        }

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
          console.error('Invalid OpenRouter response:', data);
          throw new Error('Invalid response format from OpenRouter');
        }

        const text = data.choices[0].message.content;
        return NextResponse.json({ content: text });
      } catch (openrouterError: any) {
        console.error('OpenRouter Error:', openrouterError);
        throw openrouterError;
      }

    } else if (model === 'groq') {
      // Use Groq
      if (!groqApiKey) {
        return NextResponse.json({ error: "Groq API Key is missing" }, { status: 500 });
      }

      const groqMessages = messages.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      }));

      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: groqMessages,
            temperature: 0.7,
            max_tokens: 2048,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error('Groq response error:', data);
          throw new Error(data.error?.message || data.error || `Groq Error: ${response.statusText}`);
        }

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
          console.error('Invalid Groq response:', data);
          throw new Error('Invalid response format from Groq');
        }

        const text = data.choices[0].message.content;
        return NextResponse.json({ content: text });
      } catch (groqError: any) {
        console.error('Groq Error:', groqError);
        throw groqError;
      }

    } else {
      // Use Gemini (default)
      if (!googleApiKey) {
        return NextResponse.json({ error: "Google API Key is missing from .env.local" }, { status: 500 });
      }

      const genModel = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash", 
        systemInstruction: systemPrompt 
      });

      // --- Strict History Formatting ---
      // Gemini requires: 1. Starts with User, 2. Alternates User/Model
      const validRoles = messages.filter((m: any) => 
        (m.role === 'user' || m.role === 'assistant') && m.content.trim() !== ""
      );

      const firstUserIndex = validRoles.findIndex((m: any) => m.role === 'user');
      
      // If we haven't started a conversation yet, we'll handle that
      const cleanHistory = firstUserIndex !== -1 ? validRoles.slice(firstUserIndex) : [];

      const history = cleanHistory.slice(0, -1).map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

      const latestMessage = cleanHistory.length > 0 
        ? cleanHistory[cleanHistory.length - 1].content 
        : messages[messages.length - 1].content;

      const chatSession = genModel.startChat({ history });

      const result = await chatSession.sendMessage(latestMessage);
      const response = await result.response;
      const text = response.text();

      return NextResponse.json({ content: text });
    }

  } catch (error: any) {
    console.error('LUMI ERROR:', error);
    
    // Detailed error for debugging
    let msg = error.message || "Unknown connection error";
    if (msg.includes("404")) msg = "Model name out of date. Switched to Gemini 2.5 Flash.";

    return NextResponse.json(
      { error: `Lumi Connection Error: ${msg}` },
      { status: 500 }
    );
  }
}
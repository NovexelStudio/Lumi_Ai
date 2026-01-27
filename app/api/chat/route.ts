import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const googleApiKey = process.env.GOOGLE_API_KEY;
const openRouterApiKey = process.env.OPENROUTER_API_KEY;
const groqApiKey = process.env.GROQ_API_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({ apiKey: openaiApiKey || "" });

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

    // Try the requested model first, then fallback to alternatives on quota exceeded
    const modelPriority = model === 'gemini' 
      ? ['gemini', 'chatgpt', 'groq', 'openrouter']
      : model === 'chatgpt'
      ? ['chatgpt', 'gemini', 'groq', 'openrouter']
      : [model, 'gemini', 'groq', 'openrouter'];

    let lastError: any = null;

    for (const currentModel of modelPriority) {
      try {
        if (currentModel === 'chatgpt') {
          // Use ChatGPT (OpenAI)
          if (!openaiApiKey) {
            lastError = new Error("OpenAI API Key is missing from .env.local");
            continue;
          }

          const gptMessages = messages.map((m: any) => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.content,
          }));

          const response = await openai.chat.completions.create({
            model: 'gpt-4-turbo',
            messages: [
              { role: 'system', content: systemPrompt },
              ...gptMessages,
            ],
            temperature: 0.7,
            max_tokens: 2048,
          });

          if (!response.choices || !response.choices[0] || !response.choices[0].message) {
            lastError = new Error('Invalid response format from OpenAI');
            continue;
          }

          const text = response.choices[0].message.content;
          return NextResponse.json({ content: text, model: 'chatgpt' });

        } else if (currentModel === 'openrouter') {
          // Use OpenRouter
          if (!openRouterApiKey) {
            lastError = new Error("OpenRouter API Key is missing");
            continue;
          }

          const claudeMessages = messages.map((m: any) => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.content,
          }));

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
            lastError = new Error(data.error?.message || data.error || `OpenRouter Error: ${response.statusText}`);
            if (response.status === 429) continue; // Try next model
            throw lastError;
          }

          if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            lastError = new Error('Invalid response format from OpenRouter');
            continue;
          }

          const text = data.choices[0].message.content;
          return NextResponse.json({ content: text, model: 'openrouter' });

        } else if (currentModel === 'groq') {
          // Use Groq
          if (!groqApiKey) {
            lastError = new Error("Groq API Key is missing");
            continue;
          }

          const groqMessages = messages.map((m: any) => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.content,
          }));

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
            lastError = new Error(data.error?.message || data.error || `Groq Error: ${response.statusText}`);
            if (response.status === 429) continue; // Try next model
            throw lastError;
          }

          if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            lastError = new Error('Invalid response format from Groq');
            continue;
          }

          const text = data.choices[0].message.content;
          return NextResponse.json({ content: text, model: 'groq' });

        } else {
          // Use Gemini (default)
          if (!googleApiKey) {
            lastError = new Error("Google API Key is missing from .env.local");
            continue;
          }

          const genModel = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash", 
            systemInstruction: systemPrompt 
          });

          // --- Strict History Formatting ---
          // Gemini requires: 1. Starts with User, 2. Alternates User/Model
          const validRoles = messages.filter((m: any) => 
            (m.role === 'user' || m.role === 'assistant') && m.content && m.content.trim() !== ""
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

          return NextResponse.json({ content: text, model: 'gemini' });
        }
      } catch (error: any) {
        lastError = error;
        const errorMsg = error.message || "";
        
        // If this is a 429 (quota exceeded) error, try next model
        if (errorMsg.includes("429") || errorMsg.includes("quota") || errorMsg.includes("Too Many Requests")) {
          console.warn(`Model ${currentModel} quota exceeded, trying next...`);
          continue;
        }
        
        // For other errors, throw
        throw error;
      }
    }

    // If all models failed, return the last error
    throw lastError || new Error("All AI models are unavailable");

  } catch (error: any) {
    console.error('LUMI ERROR:', error);
    
    // Detailed error for debugging
    let msg = error.message || "Unknown connection error";
    if (msg.includes("404")) msg = "Model name out of date. Switched to Gemini 2.5 Flash.";
    if (msg.includes("429") || msg.includes("quota")) msg = "All AI services are at quota. Please try again in a few minutes.";

    return NextResponse.json(
      { error: `Lumi Connection Error: ${msg}` },
      { status: 500 }
    );
  }
}
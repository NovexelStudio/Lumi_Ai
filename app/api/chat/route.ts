import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
// Import the specific type to satisfy the build worker
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

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
    
    // 1. Build messages array from history
    const messages = Array.isArray(history) ? [...history] : [];
    if (message && typeof message === 'string') {
      messages.push({ role: 'user', content: message, timestamp: Date.now() });
    }
    
    if (messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    // Model fallback priority logic
    const modelPriority = model === 'gemini' 
      ? ['gemini', 'chatgpt', 'groq', 'openrouter']
      : model === 'chatgpt'
      ? ['chatgpt', 'gemini', 'groq', 'openrouter']
      : [model, 'gemini', 'groq', 'openrouter'];

    let lastError: any = null;

    for (const currentModel of modelPriority) {
      try {
        // --- CHATGPT (OPENAI) BLOCK ---
        if (currentModel === 'chatgpt') {
          if (!openaiApiKey) {
            lastError = new Error("OpenAI API Key missing");
            continue;
          }

          // FIX: Explicitly cast the roles to satisfy the OpenAI SDK's Discriminated Union
          const gptMessages: ChatCompletionMessageParam[] = messages.map((m: any) => ({
            role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
            content: m.content,
          }));

          const response = await openai.chat.completions.create({
            model: 'gpt-4-turbo',
            messages: [
              { role: 'system', content: systemPrompt } as ChatCompletionMessageParam,
              ...gptMessages,
            ],
            temperature: 0.7,
            max_tokens: 2048,
          });

          const text = response.choices[0]?.message?.content;
          if (!text) throw new Error("Empty response from OpenAI");

          return NextResponse.json({ content: text, model: 'chatgpt' });

        // --- OPENROUTER BLOCK ---
        } else if (currentModel === 'openrouter') {
          if (!openRouterApiKey) {
            lastError = new Error("OpenRouter API Key missing");
            continue;
          }

          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openRouterApiKey}`,
              'Content-Type': 'application/json',
              'X-Title': 'Lumi Chat',
            },
            body: JSON.stringify({
              model: 'openai/gpt-3.5-turbo',
              messages: [
                { role: 'system', content: systemPrompt },
                ...messages.map((m: any) => ({
                    role: m.role === 'user' ? 'user' : 'assistant',
                    content: m.content
                }))
              ],
              temperature: 0.7,
            }),
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.error?.message || "OpenRouter Error");
          
          return NextResponse.json({ content: data.choices[0].message.content, model: 'openrouter' });

        // --- GROQ BLOCK ---
        } else if (currentModel === 'groq') {
          if (!groqApiKey) {
            lastError = new Error("Groq API Key missing");
            continue;
          }

          const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${groqApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'llama-3.3-70b-versatile',
              messages: [
                { role: 'system', content: systemPrompt },
                ...messages.map((m: any) => ({
                    role: m.role === 'user' ? 'user' : 'assistant',
                    content: m.content
                }))
              ],
              temperature: 0.7,
            }),
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.error?.message || "Groq Error");

          return NextResponse.json({ content: data.choices[0].message.content, model: 'groq' });

        // --- GEMINI BLOCK (DEFAULT) ---
        } else {
          if (!googleApiKey) {
            lastError = new Error("Google API Key missing");
            continue;
          }

          // Use a confirmed model version (Gemini 1.5 Flash is the standard stable version)
          const genModel = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash", 
            systemInstruction: systemPrompt 
          });

          const validRoles = messages.filter((m: any) => 
            (m.role === 'user' || m.role === 'assistant') && m.content?.trim()
          );

          const firstUserIndex = validRoles.findIndex((m: any) => m.role === 'user');
          const cleanHistory = firstUserIndex !== -1 ? validRoles.slice(firstUserIndex) : [];

          // Format history for Gemini's specific requirements
          const geminiHistory = cleanHistory.slice(0, -1).map((m: any) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }],
          }));

          const latestMessage = cleanHistory.length > 0 
            ? cleanHistory[cleanHistory.length - 1].content 
            : message;

          const chatSession = genModel.startChat({ history: geminiHistory });
          const result = await chatSession.sendMessage(latestMessage);
          const text = result.response.text();

          return NextResponse.json({ content: text, model: 'gemini' });
        }
      } catch (error: any) {
        lastError = error;
        const errorMsg = error.message || "";
        
        // Quota fallback: If we hit a 429, 'continue' to the next model in the loop
        if (errorMsg.includes("429") || errorMsg.includes("quota") || errorMsg.includes("Too Many Requests")) {
          console.warn(`Model ${currentModel} exhausted. Falling back...`);
          continue; 
        }
        throw error; // For non-quota errors, stop and report
      }
    }

    throw lastError || new Error("All AI neural-links are offline.");

  } catch (error: any) {
    console.error('LUMI_OS CRITICAL ERROR:', error);
    return NextResponse.json(
      { error: `Bypass Failed: ${error.message}` },
      { status: 500 }
    );
  }
}
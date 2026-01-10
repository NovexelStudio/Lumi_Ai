import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const apiKey = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function POST(request: NextRequest) {
  try {
    if (!apiKey) {
      return NextResponse.json({ error: "API Key missing in .env.local" }, { status: 500 });
    }

    const { messages } = await request.json();
    
    // Using the stable 2026 Model ID
    const modelId = 'gemini-2.5-flash'; 
    const model = genAI.getGenerativeModel({ 
      model: modelId,
      systemInstruction: "You are Lumi, a brilliant and friendly school assistant. Your goal is to help students with homework, explain complex topics simply, and help with study plans. Use Markdown for formatting. Always be encouraging and academic but accessible."
    });

    // Format chat history correctly for Gemini SDK
    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const latestMessage = messages[messages.length - 1].content;

    // Start chat session with history
    const chatSession = model.startChat({ history });
    const result = await chatSession.sendMessage(latestMessage);
    const text = result.response.text();

    return NextResponse.json({ content: text });

  } catch (error: any) {
    console.error('API Error:', error);

    if (error.message?.includes('404')) {
      return NextResponse.json(
        { error: "Model ID error. Ensure your API key has access to the 2.5 or 3.0 models." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Lumi is having trouble connecting. Please try again." },
      { status: 500 }
    );
  }
}
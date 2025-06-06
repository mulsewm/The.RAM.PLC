import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getRelevantContext, getFallbackResponse } from '@/lib/knowledge-base';

// Initialize with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    
    // First try to use the Gemini API
    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-pro-latest"
      });
      
      // Get relevant context from our knowledge base
      const context = getRelevantContext(message);
      
      const prompt = `
      You are "the.RAM chat", an AI assistant for The.RAM.PLC, an AI-first verification and compliance company.
      
      Context about The.RAM.PLC:
      ${context}
      
      User question: ${message}
      
      Please provide a helpful, accurate and concise response based on the context above. 
      If you don't know the answer, politely say you don't have that information and suggest they contact support@theramplc.com.
      Keep responses professional but friendly.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return NextResponse.json({ text });
    } catch (apiError) {
      console.error('Gemini API Error:', apiError);
      // If API fails, use the fallback response from our knowledge base
      const fallbackResponse = getFallbackResponse(message);
      return NextResponse.json({ 
        text: fallbackResponse,
        isFallback: true
      });
    }
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { 
        text: "I'm having trouble processing your request. Please try again later or contact us at support@theramplc.com.",
        isFallback: true
      },
      { status: 200 } // Return 200 to prevent showing error in UI
    );
  }
}
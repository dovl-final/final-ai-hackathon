import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Ensure you have OPENAI_API_KEY set in your .env file
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userMessage = body.message;

    if (!userMessage) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set. Please add it to your .env file.');
      // Send a user-friendly message if the key is not set, but still a 200 OK for the chat interface
      return NextResponse.json(
        { 
          reply: "I'm currently unable to connect to my core processing unit (OpenAI API Key is missing). Please ask the site administrator to configure this."
        },
        { status: 200 } 
      );
    }

    // Placeholder for actual OpenAI API call
    // In a real scenario, you'd use openai.chat.completions.create(...)
    // For now, we'll simulate a response based on the user's message.
    const agentReply = `You said: "${userMessage}". I am the MCP Agent, ready to help you create a project. Could you please describe the project you have in mind?`;

    return NextResponse.json({ reply: agentReply });

  } catch (error) {
    console.error('Error in MCP chat API:', error);
    // Generic error for the client
    return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 });
  }
}

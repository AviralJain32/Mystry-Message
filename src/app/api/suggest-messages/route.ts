import { createOpenAI } from '@ai-sdk/openai';
 
export async function POST(request:Request) {

try {
    const openai = createOpenAI({
      // custom settings, e.g.
      compatibility: 'strict', // strict mode, enable when using the OpenAI API
    });
} catch (error) {
    
}
}
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage } from '@langchain/core/messages';

export async function analyzeWithLangChain(base64Pdf: string): Promise<string> {
  const model = new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-flash',
    apiKey: process.env.GEMINI_API_KEY!,
  });

  const message = new HumanMessage({
    content: [
      {
        type: 'media',
        mimeType: 'application/pdf',
        data: base64Pdf,
      },
      {
        type: 'text',
        text: 'このPDFを解析してください。',
      },
    ],
  });

  const response = await model.invoke([message]);
  return response.content as string;
}

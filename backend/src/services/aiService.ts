import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const analyzeReport = async (text: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      You are an expert academic supervisor. Analyze the following project report fragment and provide:
      1. A concise summary.
      2. Grammar and style corrections.
      3. Practical suggestions for improvement.
      4. A basic "relevance score" (0-100) based on academic standards.

      Report Text:
      "${text}"

      Response format: JSON with keys: summary, grammarFixes, suggestions, score.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonStr = response.text().replace(/```json|```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('AI Analysis Error:', error);
    return {
      summary: "AI analysis unavailable",
      grammarFixes: "N/A",
      suggestions: "N/A",
      score: 0
    };
  }
};

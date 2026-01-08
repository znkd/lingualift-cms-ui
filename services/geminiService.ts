import { GoogleGenAI, Type } from "@google/genai";

// Use process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuestionSuggestion = async (topic: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a multiple choice English placement test question for the topic: ${topic}. Provide the question body, 4 options, the correct answer ID (a, b, c, or d), and an explanation.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  text: { type: Type.STRING }
                },
                required: ["id", "text"]
              }
            },
            correctAnswerId: { type: Type.STRING },
            analysis: { type: Type.STRING },
            title: { type: Type.STRING }
          },
          required: ["content", "options", "correctAnswerId", "analysis", "title"]
        }
      }
    });

    // response.text is a property, but we ensure it exists before parsing
    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function solveQuery(query) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: query,
    config: {
      systemInstruction: `You are Code Mentor AI, an expert programming and computer science tutor.
      Your primary specialization is Data Structures and Algorithms (DSA), but you are happy to help with any coding or software engineering questions.
      Always explain concepts in the simplest, most intuitive way possible. Use analogies, clear step-by-step logic, and provide code examples where helpful.
      If the user asks a question completely unrelated to programming or computer science, politely steer them back to coding topics.`,
    },
  });
  return response.text;
}

export default solveQuery;
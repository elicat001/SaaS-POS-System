import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateBusinessInsight = async (salesData: any, recentOrders: any): Promise<string> => {
  if (!apiKey) return "API Key not configured.";

  try {
    const prompt = `
      Act as a senior business analyst for a restaurant using a SaaS system like KeRuYun.
      Analyze the following sales data and recent orders.
      Provide a concise, bulleted list of 3 strategic insights and 1 marketing recommendation to improve revenue.
      Keep the tone professional and encouraging.
      
      Data:
      ${JSON.stringify(salesData)}
      
      Recent Orders Sample:
      ${JSON.stringify(recentOrders.slice(0, 5))}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No insights generated.";
  } catch (error) {
    console.error("Error generating insight:", error);
    return "Failed to generate insights. Please try again later.";
  }
};

export const generateProductDescription = async (productName: string): Promise<string> => {
  if (!apiKey) return "API Key not configured.";

  try {
    const prompt = `Write a short, mouth-watering menu description (max 20 words) for a dish named: "${productName}".`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Delicious and fresh.";
  } catch (error) {
    return "Tasty choice.";
  }
};

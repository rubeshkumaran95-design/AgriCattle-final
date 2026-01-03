
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getProfitYieldCalculation = async (data: {
  cropType: string,
  areaSize: number,
  investment: number,
  expectedMarketPrice: number
}) => {
  const prompt = `Act as an expert Agricultural Economist. Calculate the estimated profit and yield for ${data.cropType} on an area of ${data.areaSize} acres. 
  Total Investment: ${data.investment} 
  Expected Market Price: ${data.expectedMarketPrice} per unit.
  Provide a JSON response with estimatedYield, totalRevenue, netProfit, and advice.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          estimatedYield: { type: Type.STRING },
          totalRevenue: { type: Type.NUMBER },
          netProfit: { type: Type.NUMBER },
          advice: { type: Type.STRING }
        },
        required: ["estimatedYield", "totalRevenue", "netProfit", "advice"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const getGeneralAgriCattleAdvice = async (data: {
  sector: string,
  name: string,
  investments: Record<string, number>,
  revenue: number,
  profit: number
}) => {
  const prompt = `Act as an expert Agricultural and Livestock Consultant. 
  Sector: ${data.sector}
  Batch/Item: ${data.name}
  Detailed Costs: ${JSON.stringify(data.investments)}
  Total Revenue: ₹${data.revenue}
  Net Profit: ₹${data.profit}
  Based on these numbers, provide 2-3 sentences of professional, strategic advice to the farmer on how to improve margins or efficiency.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });
  return response.text;
};

export const getCattleHealthAdvice = async (issue: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `I am a cattle farmer. My cattle is facing this issue: ${issue}. What should I do? Provide brief, professional advice.`,
  });
  return response.text;
};

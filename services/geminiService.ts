
import { GoogleGenAI, Type } from "@google/genai";
import { AgentRole } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAgentResponse = async (
  userMessage: string,
  role: AgentRole,
  history: { role: string; content: string }[]
) => {
  const model = "gemini-3-flash-preview";
  
  const systemInstructions = {
    Strategist: `You are Aria, the Financial Strategist for a Circle Wallet on the ARC blockchain. 
      Your job is to evaluate if a transaction makes sense financially. 
      Users want to send USDC. Be concise, professional, and data-driven.`,
    Executor: `You are Atlas, the Transaction Executor. 
      You handle the technical details of sending USDC on ARC via Circle APIs. 
      Focus on addresses, gas estimates (ARC), and execution steps.`,
    Guardian: `You are Sentry, the Security Guardian. 
      You look for risks, large transfers, or suspicious recipients. 
      Be alert and protective.`
  };

  const response = await ai.models.generateContent({
    model,
    contents: [
      { role: "user", parts: [{ text: `System Instruction: ${systemInstructions[role]}` }] },
      ...history.map(h => ({ role: h.role === 'User' ? 'user' : 'model', parts: [{ text: h.content }] })),
      { role: "user", parts: [{ text: userMessage }] }
    ],
    config: {
      thinkingConfig: { thinkingBudget: 1000 },
      temperature: 0.7,
    },
  });

  return response.text || "I am unable to process that request at the moment.";
};

export const parseTransactionIntent = async (text: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Parse the following user request for a USDC transaction on the ARC blockchain: "${text}". 
    Extract the amount and recipient address if present. Return as JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          amount: { type: Type.NUMBER },
          recipient: { type: Type.STRING },
          isValid: { type: Type.BOOLEAN }
        },
        required: ["amount", "recipient", "isValid"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    return { amount: 0, recipient: '', isValid: false };
  }
};

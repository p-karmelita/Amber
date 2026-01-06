
import { ApiLog } from "../types";

/**
 * This service simulates the Circle W3S SDK.
 * In production, you would use: import { createCloudforceClient } from '@circle-fin/developer-controlled-wallets';
 */

export const simulateCircleApiCall = async (
  method: ApiLog['method'],
  endpoint: string,
  data?: any
): Promise<{ success: boolean; data: any; log: ApiLog }> => {
  // Artificial latency for "realism"
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000));

  const log: ApiLog = {
    id: Math.random().toString(36).substring(7),
    method,
    endpoint,
    status: 200,
    timestamp: new Date().toLocaleTimeString(),
    payload: data
  };

  return {
    success: true,
    data: { 
      id: Math.random().toString(36).substring(2, 15),
      state: 'COMPLETE',
      ...data 
    },
    log
  };
};

export const getArcGasPrice = async () => {
  return (Math.random() * 0.05 + 0.01).toFixed(4);
};

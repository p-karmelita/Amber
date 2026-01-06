
export type AgentRole = 'Strategist' | 'Executor' | 'Guardian';

export interface Transaction {
  id: string;
  amount: number;
  recipient: string;
  status: 'Pending' | 'Completed' | 'Failed';
  timestamp: string;
  txHash?: string;
}

export interface Message {
  id: string;
  role: AgentRole | 'User' | 'System';
  content: string;
  timestamp: Date;
  isTechnical?: boolean;
}

export interface WalletState {
  balance: number;
  currency: 'USDC';
  network: 'ARC';
  address: string;
  isLive: boolean;
}

export interface AgentInfo {
  role: AgentRole;
  name: string;
  description: string;
  status: 'Idle' | 'Thinking' | 'Executing' | 'Alert';
}

export interface CircleConfig {
  apiKey: string;
  entitySecret: string;
  appId: string;
  status: 'Disconnected' | 'Connected';
}

export interface ApiLog {
  id: string;
  method: 'GET' | 'POST' | 'PUT';
  endpoint: string;
  status: number;
  timestamp: string;
  payload?: any;
}

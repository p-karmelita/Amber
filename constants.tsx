
import React from 'react';
import { AgentInfo } from './types';

export const AGENTS: AgentInfo[] = [
  {
    role: 'Strategist',
    name: 'Aria',
    description: 'Analyzes market conditions and optimizes transaction timings for efficiency.',
    status: 'Idle',
  },
  {
    role: 'Executor',
    name: 'Atlas',
    description: 'Interfaces with Circle Wallet APIs to sign and broadcast transactions to ARC.',
    status: 'Idle',
  },
  {
    role: 'Guardian',
    name: 'Sentry',
    description: 'Monitors for security risks, compliance, and unusual transaction patterns.',
    status: 'Idle',
  }
];

export const MOCK_TX_HISTORY = [
  { id: '1', amount: 250, recipient: '0xabc...123', status: 'Completed', timestamp: '2024-05-20 14:30' },
  { id: '2', amount: 1200, recipient: '0xdef...456', status: 'Completed', timestamp: '2024-05-19 09:15' },
  { id: '3', amount: 50, recipient: '0xghi...789', status: 'Failed', timestamp: '2024-05-18 16:45' },
];


import React, { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  AgentInfo, 
  Message, 
  Transaction, 
  WalletState,
  CircleConfig,
  ApiLog
} from './types';
import { AGENTS, MOCK_TX_HISTORY } from './constants';
import { getAgentResponse, parseTransactionIntent } from './services/geminiService';
import { simulateCircleApiCall, getArcGasPrice } from './services/circleService';
import BalanceCard from './components/BalanceCard';
import AgentStatus from './components/AgentStatus';
import TransactionFeed from './components/TransactionFeed';
import MultiAgentTerminal from './components/MultiAgentTerminal';
import DeveloperConfig from './components/DeveloperConfig';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const App: React.FC = () => {
  const [wallet, setWallet] = useState<WalletState>({
    balance: 5420.50,
    currency: 'USDC',
    network: 'ARC',
    address: '0x3f1a...9e4b',
    isLive: false
  });
  const [circleConfig, setCircleConfig] = useState<CircleConfig>({
    apiKey: '',
    entitySecret: '',
    appId: 'arc-multi-agent-v1',
    status: 'Disconnected'
  });
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [agents, setAgents] = useState<AgentInfo[]>(AGENTS);
  const [messages, setMessages] = useState<Message[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TX_HISTORY as Transaction[]);
  const [apiLogs, setApiLogs] = useState<ApiLog[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Analytics data
  const analyticsData = [
    { name: 'Mon', amount: 400 },
    { name: 'Tue', amount: 300 },
    { name: 'Wed', amount: 900 },
    { name: 'Thu', amount: 200 },
    { name: 'Fri', amount: 1500 },
    { name: 'Sat', amount: 600 },
    { name: 'Sun', amount: 800 },
  ];

  const updateAgentStatus = (role: string, status: AgentInfo['status']) => {
    setAgents(prev => prev.map(a => a.role === role ? { ...a, status } : a));
  };

  const addLog = (log: ApiLog) => {
    setApiLogs(prev => [log, ...prev].slice(0, 10));
    setMessages(prev => [...prev, {
      id: uuidv4(),
      role: 'System',
      content: `[SDK] ${log.method} ${log.endpoint} - HTTP ${log.status}`,
      timestamp: new Date(),
      isTechnical: true
    }]);
  };

  const handleSendMessage = async (text: string) => {
    setIsProcessing(true);
    const userMsg: Message = { id: uuidv4(), role: 'User', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);

    try {
      // Step 1: Strategist Analyzes
      updateAgentStatus('Strategist', 'Thinking');
      const strategyResponse = await getAgentResponse(text, 'Strategist', messages.filter(m => !m.isTechnical).map(m => ({ role: m.role, content: m.content })));
      setMessages(prev => [...prev, { id: uuidv4(), role: 'Strategist', content: strategyResponse, timestamp: new Date() }]);
      updateAgentStatus('Strategist', 'Idle');

      // Step 2: Guardian Checks
      updateAgentStatus('Guardian', 'Thinking');
      const guardianResponse = await getAgentResponse(text, 'Guardian', messages.filter(m => !m.isTechnical).map(m => ({ role: m.role, content: m.content })));
      setMessages(prev => [...prev, { id: uuidv4(), role: 'Guardian', content: guardianResponse, timestamp: new Date() }]);
      updateAgentStatus('Guardian', 'Idle');

      // Step 3: Intent Parsing & Real Execution Hook
      const intent = await parseTransactionIntent(text);
      if (intent.isValid && intent.amount > 0) {
        updateAgentStatus('Executor', 'Thinking');
        
        // Technical Hook: Check Balance API
        const balanceCheck = await simulateCircleApiCall('GET', `/v1/w3s/wallets/${wallet.address}/balances`);
        addLog(balanceCheck.log);

        // Technical Hook: Gas Estimation on ARC
        const gasPrice = await getArcGasPrice();
        setMessages(prev => [...prev, { 
          id: uuidv4(), 
          role: 'Executor', 
          content: `Checking network resources... ARC Gas Price: ${gasPrice} ARC. Ready for Circle API broadcast.`, 
          timestamp: new Date() 
        }]);

        updateAgentStatus('Executor', 'Executing');
        
        // BroadCast Transaction via Circle W3S
        const broadcast = await simulateCircleApiCall('POST', '/v1/w3s/developer/transactions', {
          walletId: wallet.address,
          tokenId: 'usdc-token-id',
          amounts: [intent.amount.toString()],
          destinationAddress: intent.recipient
        });
        addLog(broadcast.log);

        setMessages(prev => [...prev, { 
          id: uuidv4(), 
          role: 'Executor', 
          content: `Transaction initiated successfully. Circle ID: ${broadcast.data.id}. Monitoring ARC for finality...`, 
          timestamp: new Date() 
        }]);
        
        // Simulate real transaction completion
        setTimeout(() => {
          const newTx: Transaction = {
            id: uuidv4(),
            amount: intent.amount,
            recipient: intent.recipient,
            status: 'Completed',
            timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
            txHash: '0x' + Math.random().toString(16).slice(2, 10) + '...'
          };
          setTransactions(prev => [newTx, ...prev]);
          setWallet(prev => ({ ...prev, balance: prev.balance - intent.amount }));
          updateAgentStatus('Executor', 'Idle');
        }, 2000);
      } else {
        updateAgentStatus('Executor', 'Thinking');
        const executorResponse = await getAgentResponse("No valid transaction intent found. Standing by for instructions.", 'Executor', []);
        setMessages(prev => [...prev, { id: uuidv4(), role: 'Executor', content: executorResponse, timestamp: new Date() }]);
        updateAgentStatus('Executor', 'Idle');
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: uuidv4(), role: 'Guardian', content: "An error occurred during agent coordination. System reset.", timestamp: new Date() }]);
      setAgents(AGENTS);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <i className="fa-solid fa-circle-nodes text-blue-500 mr-3"></i>
            ARC Multi-Agent Hub
          </h1>
          <p className="text-slate-400">Programmable Multi-Agent Transaction Layer for Circle USDC</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setIsConfigOpen(true)}
            className={`glass px-4 py-2 rounded-full border flex items-center transition-all ${circleConfig.status === 'Connected' ? 'border-green-500/50 text-green-400' : 'border-blue-500/30 text-blue-400'}`}
          >
            <span className={`w-2 h-2 rounded-full mr-2 ${circleConfig.status === 'Connected' ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}`}></span>
            <span className="text-xs font-mono uppercase">{circleConfig.status === 'Connected' ? 'Circle Live' : 'Connect Circle SDK'}</span>
          </button>
          <button className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg transition-colors">
            <i className="fa-solid fa-gear"></i>
          </button>
        </div>
      </header>

      <DeveloperConfig 
        isOpen={isConfigOpen} 
        onClose={() => setIsConfigOpen(false)} 
        config={circleConfig} 
        onUpdate={(u) => setCircleConfig(prev => ({ ...prev, ...u }))} 
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          <BalanceCard wallet={wallet} />
          <AgentStatus agents={agents} />
          
          <div className="glass p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Network Activity (USDC Flow)</h3>
              <div className="text-[10px] text-slate-500 font-mono">NODE: rpc.arc.blockchain.io</div>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                    {analyticsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 4 ? '#3b82f6' : '#1e293b'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          <TransactionFeed transactions={transactions} />
          
          {/* Real-time Logs */}
          <div className="glass rounded-2xl p-6 flex-grow border-l-4 border-slate-700">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-tighter mb-4 flex items-center">
              <i className="fa-solid fa-microchip mr-2"></i>
              Execution Logs
            </h3>
            <div className="space-y-2 font-mono text-[10px]">
              {apiLogs.length === 0 && <p className="text-slate-600 italic">Waiting for transaction broadcast...</p>}
              {apiLogs.map(log => (
                <div key={log.id} className="p-2 bg-black/30 rounded border border-white/5">
                  <div className="flex justify-between mb-1">
                    <span className="text-blue-400">{log.method} {log.endpoint}</span>
                    <span className="text-green-500">{log.status}</span>
                  </div>
                  <div className="text-slate-500">{log.timestamp}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Terminal */}
      <div className="grid grid-cols-1">
        <MultiAgentTerminal 
          messages={messages} 
          onSendMessage={handleSendMessage} 
          isProcessing={isProcessing} 
        />
      </div>

      <footer className="text-center py-6 text-slate-500 text-sm opacity-50">
        <p>Simulation active. To deploy, use Circle's node.js / python SDKs with ARC endpoints.</p>
      </footer>
    </div>
  );
};

export default App;

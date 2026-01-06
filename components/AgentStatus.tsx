
import React from 'react';
import { AgentInfo } from '../types';

interface Props {
  agents: AgentInfo[];
}

const AgentStatus: React.FC<Props> = ({ agents }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Thinking': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Executing': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Alert': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {agents.map((agent) => (
        <div key={agent.role} className="glass p-4 rounded-xl relative overflow-hidden">
          <div className="flex items-center space-x-3 mb-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-slate-800 border ${agent.status !== 'Idle' ? 'animate-pulse ring-2 ring-blue-500/50' : 'border-slate-700'}`}>
              <i className={`fa-solid ${agent.role === 'Strategist' ? 'fa-brain' : agent.role === 'Executor' ? 'fa-bolt' : 'fa-shield-halved'} text-blue-400`}></i>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">{agent.name}</h3>
              <p className="text-slate-400 text-xs">{agent.role}</p>
            </div>
          </div>
          <p className="text-slate-400 text-xs mb-3 line-clamp-2">{agent.description}</p>
          <div className={`text-[10px] font-bold uppercase tracking-tighter px-2 py-1 rounded border w-fit ${getStatusColor(agent.status)}`}>
            {agent.status}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AgentStatus;

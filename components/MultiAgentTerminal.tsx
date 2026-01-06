
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';

interface Props {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isProcessing: boolean;
}

const MultiAgentTerminal: React.FC<Props> = ({ messages, onSendMessage, isProcessing }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onSendMessage(input);
      setInput('');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Strategist': return 'fa-brain text-purple-400';
      case 'Executor': return 'fa-bolt text-blue-400';
      case 'Guardian': return 'fa-shield-halved text-emerald-400';
      case 'User': return 'fa-user text-slate-400';
      case 'System': return 'fa-code text-slate-500';
      default: return 'fa-robot text-slate-400';
    }
  };

  return (
    <div className="glass rounded-2xl h-[450px] flex flex-col border-t-4 border-slate-600">
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          Agent Collaboration Terminal
        </h3>
        {isProcessing && (
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
        )}
      </div>

      <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center px-10">
            <i className="fa-solid fa-terminal text-4xl mb-4 opacity-10"></i>
            <p className="text-sm">Initiate a command to start coordination.</p>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'User' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] p-3 rounded-xl transition-all ${
              m.role === 'User' ? 'bg-blue-600 text-white shadow-lg' : 
              m.isTechnical ? 'bg-black/40 border border-slate-700 font-mono text-[10px] text-slate-500' :
              'bg-slate-800 text-slate-200 border border-slate-700'
            }`}>
              {!m.isTechnical && (
                <div className="flex items-center space-x-2 mb-1">
                  <i className={`fa-solid ${getRoleIcon(m.role)} text-[10px]`}></i>
                  <span className="text-[10px] font-bold uppercase opacity-70">{m.role}</span>
                </div>
              )}
              <p className={`${m.isTechnical ? '' : 'text-sm'} whitespace-pre-wrap`}>{m.content}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-700">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isProcessing}
            placeholder="Type a request (e.g., 'Pay the vendor 50 USDC')..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="submit"
            disabled={isProcessing || !input.trim()}
            className="absolute right-2 top-2 h-9 w-9 bg-blue-600 rounded-lg text-white disabled:bg-slate-700"
          >
            <i className="fa-solid fa-paper-plane text-xs"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default MultiAgentTerminal;

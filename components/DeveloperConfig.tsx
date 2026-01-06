
import React from 'react';
import { CircleConfig } from '../types';

interface Props {
  config: CircleConfig;
  onUpdate: (updates: Partial<CircleConfig>) => void;
  isOpen: boolean;
  onClose: () => void;
}

const DeveloperConfig: React.FC<Props> = ({ config, onUpdate, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass w-full max-w-md p-8 rounded-3xl shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <i className="fa-solid fa-code text-blue-400 mr-2"></i>
            Circle API Integration
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">API Key</label>
            <input 
              type="password" 
              value={config.apiKey}
              onChange={(e) => onUpdate({ apiKey: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-blue-300 font-mono focus:ring-1 focus:ring-blue-500 outline-none" 
              placeholder="TEST_API_KEY_..."
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Entity Secret</label>
            <input 
              type="password" 
              value={config.entitySecret}
              onChange={(e) => onUpdate({ entitySecret: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-blue-300 font-mono focus:ring-1 focus:ring-blue-500 outline-none" 
              placeholder="••••••••••••••••"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Environment</label>
            <select className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white outline-none">
              <option>Sandbox (ARC Testnet)</option>
              <option>Production (ARC Mainnet)</option>
            </select>
          </div>

          <div className="pt-4">
            <button 
              onClick={() => onUpdate({ status: 'Connected' })}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20"
            >
              Initialize SDK Connection
            </button>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 mt-2">
            <p className="text-[10px] text-slate-400 uppercase font-bold mb-2">Integration Guide</p>
            <p className="text-xs text-slate-300 leading-relaxed">
              This panel mimics the authentication required for <span className="text-blue-400">Circle Web3 Services</span>. 
              The Executor agent uses these hooks to broadcast real USDC transactions on the ARC blockchain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperConfig;

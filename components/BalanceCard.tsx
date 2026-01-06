
import React from 'react';
import { WalletState } from '../types';

interface Props {
  wallet: WalletState;
}

const BalanceCard: React.FC<Props> = ({ wallet }) => {
  return (
    <div className="glass p-6 rounded-2xl border-l-4 border-blue-500 shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Balance</p>
          <h2 className="text-4xl font-bold text-white mt-1">
            {wallet.balance.toLocaleString()} <span className="text-blue-400 text-2xl">USDC</span>
          </h2>
        </div>
        <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
          <i className="fa-solid fa-wallet text-blue-400 text-xl"></i>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-slate-500 text-xs mb-1">Network</p>
          <p className="text-slate-200 text-sm font-mono">{wallet.network}</p>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-slate-500 text-xs mb-1">Address</p>
          <p className="text-slate-200 text-sm font-mono truncate">{wallet.address}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center space-x-2 text-xs text-green-400">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
        <span>Connected to Circle Programmable Wallets</span>
      </div>
    </div>
  );
};

export default BalanceCard;

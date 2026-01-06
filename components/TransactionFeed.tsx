
import React from 'react';
import { Transaction } from '../types';

interface Props {
  transactions: Transaction[];
}

const TransactionFeed: React.FC<Props> = ({ transactions }) => {
  return (
    <div className="glass rounded-2xl p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
        <button className="text-blue-400 text-sm hover:underline">View All</button>
      </div>
      <div className="space-y-4 overflow-y-auto flex-grow pr-2">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 hover:bg-slate-800/60 transition-colors">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.status === 'Completed' ? 'bg-green-500/10 text-green-500' : tx.status === 'Failed' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                <i className={`fa-solid ${tx.status === 'Completed' ? 'fa-check' : tx.status === 'Failed' ? 'fa-xmark' : 'fa-clock'}`}></i>
              </div>
              <div>
                <p className="text-sm font-medium text-white">To: {tx.recipient}</p>
                <p className="text-xs text-slate-500">{tx.timestamp}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-white">-{tx.amount} USDC</p>
              <p className={`text-[10px] uppercase ${tx.status === 'Completed' ? 'text-green-500' : tx.status === 'Failed' ? 'text-red-500' : 'text-yellow-500'}`}>
                {tx.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionFeed;

import React, { createContext, useState } from 'react';
import { Transaction } from '../types';

type ExpenseContextType = {
  transactions: Transaction[];
  addTransaction: (txn: Transaction) => void;
};

export const ExpenseContext = createContext<ExpenseContextType | null>(null);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const addTransaction = (txn: Transaction) => {
    const updated = [...transactions, txn];
    setTransactions(updated);
    localStorage.setItem('transactions', JSON.stringify(updated));
  };

  return (
    <ExpenseContext.Provider value={{ transactions, addTransaction }}>
      {children}
    </ExpenseContext.Provider>
  );
};

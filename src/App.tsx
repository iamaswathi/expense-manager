import React from 'react';
import './App.css';
import Header from './components/Header';
import { ExpenseProvider } from './context/ExpenseContext';
import AccountBalance from './components/AccountBalance/AccountBalance';
import TransactionsList from './components/TransactionsList/TransactionsList';

export default function App() {
  return (
    <ExpenseProvider>
      <div className="min-h-screen">
        <Header />
        <main className="p-4">
          <AccountBalance available={1299.38} spendable={650.44}/>
          <TransactionsList />
        </main>
      </div>
    </ExpenseProvider>
  );
}

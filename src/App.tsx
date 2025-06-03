import React from 'react';
import './App.css';
import Header from './components/Header';
import { ExpenseProvider } from './context/ExpenseContext';
import TransactionList from './components/TransactionsList';
import AccountBalance from './components/AccountBalance';

export default function App() {
  return (
    <ExpenseProvider>
      <div className="min-h-screen">
        <Header />
        <main className="p-4">
          {/* <TransactionForm /> */}
          <AccountBalance available={1299.38} spendable={650.44}/>
          <TransactionList />
        </main>
      </div>
    </ExpenseProvider>
  );
}

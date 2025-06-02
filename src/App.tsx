import React from 'react';
import './App.css';
import Header from './components/Header';
import { ExpenseProvider } from './context/ExpenseContext';
import TransactionList from './components/TransactionsList';

export default function App() {
  return (
    <ExpenseProvider>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="p-4">
          {/* <TransactionForm /> */}
          <TransactionList />
        </main>
      </div>
    </ExpenseProvider>
  );
}

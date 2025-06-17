import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import { ExpenseProvider } from './context/ExpenseContext';
import AccountBalance from './components/AccountBalance/AccountBalance';
import TransactionsList from './components/TransactionsList/TransactionsList';
import { Provider } from 'react-redux';
import { store } from './state/store';
import TransactionDetail from './components/TransactionDetail/TransactionDetail';

export default function App() {
  return (
    // <Provider store={store}>
    //   <div className="min-h-screen">
    //     <Header />
    //     <main className="p-4 font-custom">
    //       <AccountBalance available={1299.38} spendable={650.44}/>
    //       <TransactionsList />
    //     </main>
    //   </div>
    //   </Provider>

    <Router>
      <Routes>
        <Route path="/" element={<TransactionsList />} />
      </Routes>
    </Router>
  );
}

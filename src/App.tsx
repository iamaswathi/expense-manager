import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import AccountBalance from './components/AccountBalance/AccountBalance';
import TransactionsList from './components/TransactionsList/TransactionsList';

export default function App() {
  return (
    <div>
      <Header />
      <AccountBalance available={1299.38} spendable={650.44}/>
      <Router>
        <Routes>
          <Route path="/" element={<TransactionsList />} />
        </Routes>
      </Router>
    </div>
  );
}

import { render, screen, waitFor } from '@testing-library/react';
import TransactionsList from './TransactionsList';
import { vi } from 'vitest';
import * as dataService from '../../services/dataService';
import '@testing-library/jest-dom';

const mockTransactions = [
  {
    id: "1",
    date: "2023-10-11",
    debit: "20",
    description: "A2B Geelong",
    category: "Food"
  },
  {
    id: "2",
    date: "2023-10-11",
    debit: "3.75",
    description: "VIC Roads",
    category: "Transport"
  },
  {
    id: "3",
    date: "2023-10-01",
    credit: "2000",
    description: "Company",
    category: "Salary"
  }
];

vi.mock('../../services/dataService', () => ({
    fetchTransactionsList: vi.fn(),
}));

describe('TransactionList Component', () => {
  beforeEach(() => {
    (dataService.fetchTransactionsList as jest.Mock).mockResolvedValue(mockTransactions);
  });

  test('renders grouped transactions by date', async () => {
    render(<TransactionsList />);

    // Wait for async loading
    await waitFor(() => {
      expect(screen.getByText('11 Oct 2023')).toBeInTheDocument();
    });

    // Transaction descriptions
    expect(screen.getByText('A2B Geelong')).toBeInTheDocument();
    expect(screen.getByText('VIC Roads')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
  });

  test('renders debit with negative sign and credit with + sign', async () => {
    render(<TransactionsList />);
    await waitFor(() => {
      expect(screen.getByText('-$20.00')).toBeInTheDocument();
      expect(screen.getByText('-$3.75')).toBeInTheDocument();
      expect(screen.getByText('+$2000.00')).toBeInTheDocument();
    });
  });

  test('renders date section headings', async () => {
    render(<TransactionsList />);
    await waitFor(() => {
      expect(screen.getByText('1 Oct 2023')).toBeInTheDocument();
    });
  });
});

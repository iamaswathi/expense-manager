import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccountBalance from './AccountBalance';
describe('AccountBalance Component', () => {
  const available = 1200.5;
  const spendable = 950.25;

  test('renders available balance by default', () => {
    render(<AccountBalance available={available} spendable={spendable} />);
    
    expect(screen.getByText(`$${available.toFixed(2)}`)).toBeInTheDocument();
    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  test('toggles to spendable balance on click', () => {
    render(<AccountBalance available={available} spendable={spendable} />);
    
    const container = screen.getByText(`$${available.toFixed(2)}`).closest('div')!;
    fireEvent.click(container);

    expect(screen.getByText(`$${spendable.toFixed(2)}`)).toBeInTheDocument();
    expect(screen.getByText('Spendable')).toBeInTheDocument();
  });

  test('toggles back to available balance on second click', () => {
    render(<AccountBalance available={available} spendable={spendable} />);
    
    const container = screen.getByText(`$${available.toFixed(2)}`).closest('div')!;
    
    // Toggle to spendable
    fireEvent.click(container);
    expect(screen.getByText('Spendable')).toBeInTheDocument();

    // Toggle back to available
    fireEvent.click(container);
    expect(screen.getByText('Available')).toBeInTheDocument();
  });
});
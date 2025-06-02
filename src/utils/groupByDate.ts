import { Transaction } from "../types";

interface GroupedTransactions {
    [formattedDate: string]: {
        transactions: Transaction[];
        totalDebit: number;
        rawDate: string;
      };
}

const formatDate = (dateStr: string): string => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
    return new Date(dateStr).toLocaleDateString('en-AU', options).toUpperCase(); // → 7 May 2025
  };
  
  export const groupByDate = (transactions: Transaction[]): GroupedTransactions => {
    return transactions.reduce<GroupedTransactions>((groups, transaction) => {
      const date = transaction.date;
      const formattedDate = formatDate(date);
      const debitAmount = parseFloat(transaction.debit || "0");
  
      if (!groups[formattedDate]) {
        groups[formattedDate] = {
          transactions: [],
          totalDebit: 0,
          rawDate: date,
        };
      }
  
      groups[formattedDate].transactions.push(transaction);
      groups[formattedDate].totalDebit += debitAmount;
  
      return groups;
    }, {});
  };
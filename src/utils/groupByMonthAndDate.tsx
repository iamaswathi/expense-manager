import { Transaction } from "../types"

type MonthDateGroupedTransactions = {
    [monthKey: string]: {
        monthDate: Date;
        totalDebit: number;
        dates: {
            [dateKey: string]: {
                date: Date;
                transactions: Transaction[];
                total: number;
                isCredit: Boolean;
            };
        };
    };
};

const getMonthKey = (dateStr: string): [string, Date] => {
    const date = new Date(dateStr);
    const key = date.toLocaleDateString('en-AU', {
        year: 'numeric',
        month: 'short'});
    return [key, new Date(date.getFullYear(), date.getMonth())];
}

const getDateKey = (dateStr: string): [string, Date] => {
    const date = new Date(dateStr);
    const key = date.toLocaleDateString('en-AU', { 
        weekday: 'short',
        day: 'numeric',
        month: 'short',
    }).toLocaleUpperCase();
    return [key, date];
};

export const groupByMonthAndDate = (transactions: Transaction[]): MonthDateGroupedTransactions => {
    return transactions.reduce((acc: MonthDateGroupedTransactions, transaction) => {
        const [monthKey, monthDate] = getMonthKey(transaction.date);
        const [dateKey, fullDate] = getDateKey(transaction.date);
        const amount = parseFloat(transaction.credit || transaction.debit || '0');
        const isCredit = !!transaction.credit;
        if(!acc[monthKey]) {
            acc[monthKey] = { monthDate, totalDebit: 0, dates: {} };
        }
        if(!acc[monthKey].dates[dateKey]) {
            acc[monthKey].dates[dateKey] = { date: fullDate, transactions: [], total: 0, isCredit };
        }
        acc[monthKey].dates[dateKey].transactions.push(transaction);
        acc[monthKey].dates[dateKey].total += amount;
        acc[monthKey].dates[dateKey].isCredit = isCredit;

        if(!isCredit) acc[monthKey].totalDebit += amount;
        return acc;

    }, {});
};
import { Transaction } from "./interface/transactionInterface";
import { findIfCredit, removeCreditDebitSign } from "./utilities";


type MonthDateGroupedTransactions = {
    [monthKey: string]: {
        monthDate: Date;
        totalDebit: number;
        dates: {
            [dateKey: string]: {
                date: Date;
                transactions: Transaction[];
                total: number;
                isCredit: boolean;
            };
        };
    };
};

const getMonthKey = (date: Date): [string, Date] => {
    const key = date.toLocaleDateString('en-AU', {
        year: 'numeric',
        month: 'short'});
    return [key, new Date(date.getFullYear(), date.getMonth())];
}

const getDateKey = (date: Date): [string, Date] => {
    const key = date.toLocaleDateString('en-AU', { 
        weekday: 'short',
        day: 'numeric',
        month: 'short',
    }).toLocaleUpperCase();
    return [key, date];
};

export const groupByMonthAndDate = (transactions: Transaction[]): MonthDateGroupedTransactions => {
    return transactions.reduce((acc: MonthDateGroupedTransactions, transaction) => {
        const rawDate = new Date(transaction.attributes.createdAt);
        const [monthKey, monthDate] = getMonthKey(rawDate);
        const [dateKey, fullDate] = getDateKey(rawDate);
        const amount = parseFloat(removeCreditDebitSign(transaction.attributes.amount.value) || '0');
        const isCredit = findIfCredit(transaction.attributes.amount.value);
        if(!acc[monthKey]) {
            acc[monthKey] = { monthDate, totalDebit: 0, dates: {} };
        }
        if(!acc[monthKey].dates[dateKey]) {
            acc[monthKey].dates[dateKey] = { date: fullDate, transactions: [], total: 0, isCredit};
        }
        acc[monthKey].dates[dateKey].transactions.push(transaction);
        acc[monthKey].dates[dateKey].total += amount;
        acc[monthKey].dates[dateKey].isCredit = isCredit;
        
        if(!isCredit) acc[monthKey].totalDebit += amount;
        return acc;

    }, {});
};

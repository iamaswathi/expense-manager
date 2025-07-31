import { MonthDateGroupedTransactions, TransformedTransaction } from "./interface/transactionInterface";

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

export const groupByMonthAndDate = (transactions: TransformedTransaction[]): MonthDateGroupedTransactions => {
    return transactions.reduce((acc: MonthDateGroupedTransactions, transaction) => {
        const rawDate = new Date(transaction.date);
        const [monthKey, monthDate] = getMonthKey(rawDate);
        const [dateKey, fullDate] = getDateKey(rawDate);
        const amount = transaction.amount;
        const transType = transaction.type;

        if(!acc[monthKey]) {
            acc[monthKey] = { monthDate, totalDebit: 0, dates: {} };
        }
        if(!acc[monthKey].dates[dateKey]) {
            acc[monthKey].dates[dateKey] = { date: fullDate, transactions: [], total: 0};
        }
        acc[monthKey].dates[dateKey].transactions.push(transaction);
        acc[monthKey].dates[dateKey].total += amount;
        
        if(transType.toLowerCase() === 'debit') acc[monthKey].totalDebit += amount;
        return acc;

    }, {});
};

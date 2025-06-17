export const removeCreditDebitSign = (transactionValue: string) => {
    return transactionValue.slice(1);
}

export const getTimeFromDateString = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).toLowerCase();
}

export const getDateDay = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-AU', { 
        day: 'numeric',
        month: 'short',
    });
};

export const findIfCredit = (transactionValue: string) => {
    return (transactionValue.startsWith('+'));
};

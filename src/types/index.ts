export type Transaction = {
    id: string;
    name: string;
    category: string;
    date: string;
    time: string;
    description?: string;
    credit?: string;
    debit?: string;
};
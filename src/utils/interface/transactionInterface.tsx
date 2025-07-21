export interface UpApiResponse {
    data: Transaction[];
    links: {
        prev: string | null;
        next: string | null;
    };
}

export interface Account {
    id: string;
    name: string;
    last4digits: string;
    institution: string;
    type: 'checking' | 'savings' | 'credit';
    bankLogo?: string;
    bankAltText?: string;
}

export interface Category {
    id: string;
    name: string;
}

export interface Transaction {
    type: string;
    id: string;
    accountId: string;
    attributes: TransactionAttributes;
    relationships: TransactionRelationships;
    links: {
        self: string;
    }
}

export interface TransactionAmount {
    currencyCode: string;
    value: string;
    valueInBaseUnits: string;
}

export interface TransactionAttributes {
    status: TransactionStatus;
    rawText: string | null;
    description: string;
    message: string | null;
    isCategorizable: boolean;
    holdInfo: { //any | null
        amount: TransactionAmount;
        foreignAmount: TransactionAmount;
    };
    roundUp: { //any | null
        amount: TransactionAmount;
        foreignAmount: TransactionAmount;
        boostPortion: string | null;
    };
    cashBack: any | null;
    amount: TransactionAmount;
    foreignAmount: TransactionAmount; //any | null
    cardPurchasedMethod: { //any | null
        method: string;
        cardNumberSuffix: string;
    };
    settledAt: string;
    createdAt: string;
    transactionType: string | null;
    note: string | null;
    performingCustomer: {
        displayName: string;
    };
    deepLinkUrl: string;
}

export interface TransactionRelationships {
    account: {
        data: {
            type: string;
            id: string;
        };
        links: {
            related: string;
        };
    };
    transferAccount: {
        data: null;
    };
    category: {
        data: null
        links: {
            self: string;
        };
    };
    parentCategory: {
        data: null;
    };
    tags: {
        data: {
            type: string;
            id: string;
        }[];
        links: {
            self: string;
        };
    };
    attachment: {
        data: null;
    };
}

export enum TransactionStatus {
    PENDING = 'PENDING',
    SETTLED = 'SETTLED',
    HOLD = 'HOLD',
}

export interface TransactionListTags {
    type: string;
    id: string;
    relationships: {
        transactions: {
            links: {
                related: string;
            };
        };
    };
}

export interface TransactionCategories {
    type: string;
    id: string;
    relationships: {
        parent: {
            data: {
                type: string;
                id: string;
            };
            links: {
                related: string;
            };
        };
    };
    attributes: {
        name: string;
    };
    children: {
        data: any[];
        links: {
            related: string;
        };
    };
    links: {
        self: string;
    };
}
export interface MonthDateGroupedTransactions {
    [monthKey: string]: {
        monthDate: Date;
        totalDebit: number;
        dates: {
            [dateKey: string]: {
                date: Date;
                transactions: TransformedTransaction[];
                total: number;
                isCredit: boolean;
            };
        };
    };
}

export interface TransformedTransaction {
    id: string;
    accountId: string;
    description: string;
    amount: string;
    date: string;
    category: string;
    status: string;
    message: string;
    biller: string;
    bankLogo: string;
    bankAltText: string;
}

export interface BankLogoConfig {
    [instituteName: string]: {
        logo: string;
        altText: string;
    };
}
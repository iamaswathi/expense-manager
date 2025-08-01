import { Account, BankLogoConfig, Transaction, TransformedTransaction } from "./interface/transactionInterface";

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

export const isTypeCredit = (amount: string): string => {
    return (amount.startsWith('-')) ? 'debit' : 'credit';
};

export const transformAccounts = (accounts: Account[]): Account[] => {
    return accounts.map(account => {
        const bankInfo = BANK_LOGOS[account.institution] || BANK_LOGOS.default
        return {
            ...account,
            bankLogo: bankInfo.logo,
            bankAltText: bankInfo.altText
        };
    });
};

export const transformTransactions = (transaction: Transaction, accounts: Account[]): TransformedTransaction => {
    const account = accounts.find(a => a.id === transaction.accountId);
    const bankInfo = account ? BANK_LOGOS[account.institution] || BANK_LOGOS.default
        : BANK_LOGOS.default;

    return {
        id: transaction.id,
        accountId: transaction.accountId,
        description: transaction.attributes.description,
        amount: Math.abs(parseFloat(transaction.attributes.amount.value)),
        type: isTypeCredit(transaction.attributes.amount.value),
        date: transaction.attributes.settledAt,
        category: transaction.relationships.tags?.data[0]?.id || 'Uncategorised',
        status: transaction.attributes.status,
        message: transaction.attributes.message || '',
        biller: transaction.attributes.performingCustomer.displayName,
        bankLogo: bankInfo.logo,
        bankAltText: bankInfo.altText
    }
};

export const BANK_LOGOS: BankLogoConfig = {
    'Comonwealth Bank of Australia': {
        logo: '/assets/images/cba.png',
        altText: 'CommBank'
    },
    'Bendigo And Adelaide Bank': {
        logo: '/assets/images/bendigo.jpeg',
        altText: 'Bendigo'
    },
    'Up Bank': {
        logo: '/assets/images/upb.jpeg',
        altText: 'Up'
    },
    'National Australia Bank': {
        logo: '/assets/images/nab.png',
        altText: 'Nab'
    },
    'default': {
        logo: '/assets/images/cba.png',
        altText: 'default'
    }
}
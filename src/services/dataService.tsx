import { error } from "console";
import { Account, Transaction } from "../utils/interface/transactionInterface";

export const fetchAccountsList = async (): Promise<Account[]> => {
  try {
    const response = await fetch('/data/accountsList.json', {
      headers: {
        'Cache-Control': 'no-cache', // Optional: to avoid 304 caching
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.statusText}`);
    }

    const data = await response.json();
    if(!Array.isArray(data?.data)){
      throw new Error('Invalid data format');
    }
    console.log("Returned value - ",data.data);
    return data.data;
  } catch (error) {
    console.error('Fetching data failed:', error);
    return [];
  }
};

export const fetchTransactionsList =  async (accountIds?: string[]): Promise<Transaction[]> => {
    try {

      // fetch all accounts if none selected
      let targetAccountIds: string[] = [];

      if(!accountIds || accountIds.length === 0) {
        const accountsResponse = await fetch('/data/accountsList.json', {
      headers: {
        'Cache-Control': 'no-cache', // Optional: to avoid 304 caching
      },
    });
    const accountsData = await accountsResponse.json();
    targetAccountIds = accountsData.data.map((account: Account) => account.id);
      } else {
        targetAccountIds = accountIds;
      }

      //Fetching transactions of each accounts in parallel
      const transactionsPromise: Promise<Transaction[]>[] = targetAccountIds?.map(async (accId) => {
try {
      const response = await fetch(`/data/transactionsOf${accId}.json`, {
        headers: {
          'Cache-Control': 'no-cache', // Optional: to avoid 304 caching
        },
      });
  
      if (!response.ok) {
        console.warn(`No transactions found for the account ${accId}.`);
        // throw new Error(`HTTP error! status: ${response.statusText}`);
        return [];
      }
  
      const transactionsData = await response.json();
      console.log("Returned value - ",transactionsData.data);
      return transactionsData.data || [];
    } catch (error) {
      console.error(`Error loading transactions for the account- ${accId}`, error);
      return [];
    }
  });
  const transactionsByAccount: Transaction[][] = await Promise.all(transactionsPromise);
    return transactionsByAccount.flat();
  } catch (error) {
    console.error('Error loading transactions:', error);
    return [];
  }
};

  // export const fetchTransactionById = async (): Promise<Transaction | null> => {
  //   try {
  //     const response = await fetch('/data/transaction.json', {
  //       headers: {
  //         'Cache-Control': 'no-cache', // Optional: to avoid 304 caching
  //       },
  //     });
  
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.statusText}`);
  //     }
  
  //     const data = await response.json();
  //     console.log("Returned value - ",data.data);
  //     return data.data;
  //   } catch (error) {
  //     console.error('Fetching data failed:', error);
  //     return null;
  //   }
  // };
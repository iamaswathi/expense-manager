import { error } from "console";
import { Transaction } from "../utils/interface/transactionInterface";

export const fetchTransactionsList =  async (): Promise<Transaction[]> => {
    try {
      const response = await fetch('/data/transactionsList.json', {
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
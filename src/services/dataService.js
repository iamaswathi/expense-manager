export const fetchTransactionsList = async () => {
    try {
      const response = await fetch('/data/transactions.json', {
        headers: {
          'Cache-Control': 'no-cache', // Optional: to avoid 304 caching
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Returned value - ",data.data);
      return data.data;
    } catch (error) {
      console.error('Fetching data failed:', error);
      return [];
    }
  };
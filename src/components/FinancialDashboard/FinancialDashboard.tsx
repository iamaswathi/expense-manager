import { Doughnut } from 'react-chartjs-2'; // Easier than raw Chart.js
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useMemo } from 'react';
import { TransformedTransaction } from '../../utils/interface/transactionInterface';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface FinancialDashboardProps {
    transactions: TransformedTransaction[];
}

export const FinancialDashboard = ({ transactions }: FinancialDashboardProps) => {
    // Process transaction data
    const { chartData, summary } = useMemo(() => {
        const categoryMap = new Map();
        let totalExpenses = 0;
        const dayCount = new Map();
        
        // Initialize all days with 0 counts
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        daysOfWeek.forEach(day => dayCount.set(day, 0));
      
        transactions.forEach(txn => {
        //    if(!isCredit) {
          totalExpenses += txn.amount;
        //   } 

        
          // Category breakdown
          const category = txn.category || 'Other';
          categoryMap.set(category, (categoryMap.get(category) || 0) + txn.amount);
          
          // Day of week analysis
          const day = new Date(txn.date).toLocaleString('en-US', { weekday: 'long' });
          dayCount.set(day, (dayCount.get(day) || 0) + 1);
        });
      
        // Safely find busiest day (won't throw on empty array)
        const busiestDayEntry = [...dayCount.entries()].reduce(
          (a, b) => a[1] > b[1] ? a : b,
          ['None', 0] // Initial value
        );
        
        return {
          chartData: {
            labels: [...categoryMap.keys()],
            datasets: [{
              data: [...categoryMap.values()],
              backgroundColor: [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                '#9966FF', '#FF9F40', '#8AC24A'
              ],
              borderWidth: 0
            }]
          },
          summary: {
            totalExpenses,
            averageExpenses: transactions.length ? totalExpenses / transactions.length : 0,
            busiestDay: busiestDayEntry[0],
            transactionCount: transactions.length
          }
        };
      }, [transactions]);

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Summary Cards */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-500 text-sm">Total expenses</p>
                    <p className="text-2xl font-bold">${summary.totalExpenses.toFixed(2)}</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-500 text-sm">Avrg expenses</p>
                    <p className="text-2xl font-bold">${summary.averageExpenses.toFixed(2)}</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-500 text-sm">Busiest day</p>
                    <p className="text-2xl font-bold">{summary.busiestDay}</p>
                </div>
            </div>

            {/* Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-lg shadow lg:col-span-2">
                    <h3 className="font-semibold mb-4">Expense Distribution</h3>
                    <div className="h-64">
                        <Doughnut
                            data={chartData}
                            options={{
                                cutout: '70%',
                                plugins: {
                                    legend: {
                                        position: 'right',
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: (context) => {
                                                const label = context.label || '';
                                                const value = context.raw as number; // Type assertion here
                                                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                                                const percentage = Math.round((value / total) * 100);
                                                return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                                            }
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Percentage Breakdown */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-semibold mb-4">Category Breakdown</h3>
                    <div className="space-y-3">
                        {chartData.labels.map((label, i) => {
                            const total = chartData.datasets[0].data.reduce((a, b) => a + b, 0);
                            const value = chartData.datasets[0].data[i];
                            const percentage = Math.round((value / total) * 100);
                            const color = chartData.datasets[0].backgroundColor[i];

                            return (
                                <div key={label} className="flex items-center">
                                    <div
                                        className="w-3 h-3 rounded-full mr-2"
                                        style={{ backgroundColor: color }}
                                    />
                                    <span className="flex-1">{label}</span>
                                    <span className="font-medium">{percentage}%</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
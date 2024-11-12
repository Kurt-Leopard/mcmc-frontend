<template>
  <div class="my-[150px] px-4 lg:px-[50px] xl:px-32">
    <div class="charts">
      <div class="chart-container">
        <Bar :data="combinedChartData" :options="chartOptions" />
      </div>
    </div>
    <div class="transaction-table">
      <h3>Recent Transactions</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in transactions" :key="transaction.id">
            <td>{{ transaction.date }}</td>
            <td>{{ transaction.description }}</td>
            <td>{{ transaction.amount }}</td>
            <td>{{ transaction.category }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { onMounted } from 'vue';
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Income data
const incomeData = [5000, 7000, 8000, 6000, 9000, 10000];

// Expense data (positive values for Bar chart)
const expenseData = [3000, 4000, 2500, 5000, 3000];

// Combined chart data
const combinedChartData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      label: 'Income',
      backgroundColor: '#42A5F5',
      data: incomeData,
    },
    {
      label: 'Expenses',
      backgroundColor: '#FF7043',
      data: expenseData,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

// Sample transaction data
const transactions = [
  { id: 1, date: '2024-01-15', description: 'Sunday Offering', amount: 1500, category: 'Tithe' },
  { id: 2, date: '2024-01-20', description: 'Event Expenses', amount: 1200, category: 'Events' },
  { id: 3, date: '2024-01-25', description: 'Maintenance', amount: 600, category: 'Maintenance' },
  { id: 4, date: '2024-01-30', description: 'Outreach Program', amount: 800, category: 'Outreach' },
  { id: 5, date: '2024-02-02', description: 'Monthly Salary', amount: 2000, category: 'Salaries' },
];
onMounted(()=>{
  window.scrollTo(0, 0)
})
</script>

<style scoped>

.charts {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.chart-container {
  width: 100%;
  height: 40vh; /* Adjust as needed */
}
.transaction-table {
  margin-top: 20px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
</style>

<template>
  <main
    class="py-8 px-4 lg:px-[50px] xl:px-32 mb-12 mt-[115px] lg:mt-32 xl:mt-32"
  >
    <div class="flex">
      <div
        class="w-full bg-background lg:border xl:border rounded-lg bg-card lg:p-4 xl:p-4 gap-2"
      >

       <div>
    <h2 class="text-lg font-bold">Church Cash Flow <button @click="announce">announce</button></h2>
    <div class="chart-container">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
        <main class="w-full mt-12" v-for="(item, index) in 3" :key="index">
          <div class="flex items-center gap-2 my-2 w-full">
            <img
              src="../../assets/smbg.png"
              alt="Expense Image"
              class="w-12 h-12 rounded-full"
            />
            <h2 class="font-semibold my-2">Mark Angelo Jannandre</h2>
          </div>
          <main
            class="w-full grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2"
          >
            <section>
              <div class="border">
                <div class="w-full">
                  <div class="px-2 py-2">
                    <h2
                      class="text-lg font-mono font-bold text-center border-b pb-2 mb-4"
                    >
                      MCMC Allocation Receipt
                    </h2>
                  </div>
                  <div class="px-2">
                    <div class="flex justify-between mb-2">
                      <span class="text-xs text-gray-700 font-mono">Date:</span>
                      <span class="text-xs font-mono">October 6, 2024</span>
                    </div>
                    <div class="flex justify-between mb-2">
                      <span class="text-xs text-gray-700 font-mono"
                        >Leader Name:</span
                      >
                      <span class="text-xs font-mono">Jinky Dela Torre</span>
                    </div>
                    <div class="flex justify-between mb-2">
                      <span class="text-xs text-gray-700 font-mono"
                        >Allocation Amount:</span
                      >
                      <span class="text-xs font-mono">P 10,000</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-xs text-gray-700 font-mono"
                        >Allocation Purpose:</span
                      >
                    </div>
                    <span class="text-xs font-mono"
                      >Purchased supplies for the children's camp on October 4,
                      2024.
                    </span>
                    <div class="border-t border-gray-300 my-2"></div>
                    <div class="flex justify-between mb-2 text-center">
                      <p class="text-xs font-mono text-center">
                        Recorded on March 3,2024
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div class="border">
                <div class="w-full">
                  <div class="px-2 py-2">
                    <h2
                      class="text-lg font-mono font-bold text-center border-b pb-2 mb-4"
                    >
                      Music Ministry
                    </h2>
                  </div>
                  <div class="px-2">
                    <div class="flex justify-between mb-2">
                      <span class="text-xs text-gray-700 font-mono"
                        >Amount:</span
                      >
                      <span class="text-xs font-mono">P 10,000</span>
                    </div>
                    <div class="flex justify-between mb-2">
                      <span class="text-xs text-gray-700 font-mono"
                        >Amount Spent:</span
                      >
                      <span class="text-xs font-mono">P 8,500</span>
                    </div>
                    <div class="flex justify-between mb-2">
                      <span class="text-xs text-gray-700 font-mono"
                        >Remaining Balance:</span
                      >
                      <span class="text-xs font-mono">P 1,500</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-xs text-gray-700 font-mono"
                        >Remarks:</span
                      >
                    </div>
                    <span class="text-xs font-mono"
                      >Purchased supplies for the children's camp on October 4,
                      2024.</span
                    >
                    <div class="border-t border-gray-300 my-2"></div>
                    <div class="flex justify-between mb-2 text-center">
                      <p class="text-xs font-mono text-center">
                        Posted on March 3,2024
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </main>
      </div>

      <div
        class="hidden lg:block xl:block border rounded-lg sticky top-[150px] p-3 w-auto lg:w-1/3 xl:w-1/3 max-h-[530px] overflow-y-auto mx-2"
      >
        <h2 class="font-bold">MCMC</h2>
        <div class="bg-secondary text-secondary-foreground p-4 rounded-lg mt-2">
          <h3 class="font-semibold">Meeting Schedule Reminder</h3>
          <p><strong>When:</strong> 03/02/2024</p>
          <p><strong>Where:</strong> Cordis Twin Building Construction</p>
          <p><strong>Time:</strong> 10:00 AM - 12:00 PM</p>
        </div>
      </div>
    </div>

    <button
      id="toggleSidebar"
      class="fixed bottom-4 right-4 bg-primary text-primary-foreground rounded-full p-3 shadow-md lg:hidden xl:hidden bg-white"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  </main>
</template>
<script setup>

import { onMounted} from 'vue';
import axios from "axios";

const announce =()=>{
  axios.post(`https://mcmc-socket.onrender.com/api/announcements/14a02df2-0e57-4a8c-ac94-72423ed47a96`,{ title:'title', description:'description' });
}


import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Define chart data and options
const chartData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      label: 'Income',
      backgroundColor: '#42A5F5',
      data: [5000, 7000, 8000, 6000, 9000, 10000]
    },
    {
      label: 'Expenses',
      backgroundColor: '#FFA726',
      data: [3000, 4000, 2500, 5000, 3000, 4500]
    }
  ]
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true
    }
  }
};
onMounted(()=>{window.scrollTo(0, 0)})
</script>
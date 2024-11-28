<template>
  <main
    class="py-8 px-4 lg:px-[50px] xl:px-32 mb-12 mt-[115px] lg:mt-32 xl:mt-32"
  >
    <div class="border p-4 rounded-lg shadow-md">
      <h2 class="text-lg font-bold">
        Overview
        <!-- <button @click="announce">announce</button> -->
      </h2>
      <div class="chart-container">
        <Bar :data="chartData" :options="chartOptions" />
      </div>
    </div>
    <div
      class="flex flex-col-reverse lg:flex-row xl:flex-row gap-2 w-full mt-5"
    >
      <div class="w-full">
        <main class="w-full" v-for="(item, index) in expenses" :key="index">
          <main class="w-full gap-2 bg-white">
            <section>
              <div>
                <div class="w-full mb-2">
                  <div class="border rounded-md">
                    <div class="px-2 py-2">
                      <h2
                        class="text-lg font-mono font-bold text-center border-b pb-2 mb-4"
                      >
                        MCMC Allocation Receipt
                      </h2>
                    </div>
                    <div class="px-2">
                      <div class="flex justify-between mb-2">
                        <span class="text-xs text-gray-700 font-mono"
                          >Date:</span
                        >
                        <span class="text-xs font-mono">{{
                          getDate(item.expense_created_at)
                        }}</span>
                      </div>
                      <div class="flex justify-between mb-2">
                        <span class="text-xs text-gray-700 font-mono"
                          >Reciever:</span
                        >
                        <span class="text-xs font-mono">{{
                          item.user_name
                        }}</span>
                      </div>
                      <div class="flex justify-between mb-2">
                        <span class="text-xs text-gray-700 font-mono"
                          >Amount:</span
                        >
                        <span class="text-xs font-mono"
                          >P {{ item.expense_amount }}</span
                        >
                      </div>
                      <div class="flex justify-between mb-2">
                        <span class="text-xs text-gray-700 font-mono"
                          >Particular:</span
                        >
                        <span class="text-xs font-mono"
                          >{{ item.particular }}
                        </span>
                      </div>
                      <div class="flex justify-between mb-2">
                        <span class="text-xs text-gray-700 font-mono"
                          >Total Spent:</span
                        >
                        <span class="text-xs font-mono">{{ item.spent }} </span>
                      </div>
                      <div class="flex justify-between mb-2">
                        <span class="text-xs text-gray-700 font-mono"
                          >Total Change:</span
                        >
                        <span class="text-xs font-mono"
                          >{{ item.total_change }}
                        </span>
                      </div>

                      <div class="border-t border-gray-300 my-2"></div>
                      <div class="flex justify-center mb-2 text-center">
                        <div class="text-xs font-mono text-center">
                          <div
                            v-if="
                              parseImages(expenses[index].reciept).length !== 0
                            "
                          >
                            <div
                              class="flex items-center justify-start w-full h-full gap-6 py-4 overflow-auto lg:gap-8 element-with-horizontal-scroll relative"
                            >
                              <div
                                class="relative flex flex-shrink-0 sm:w-[500px] object-cover "
                              >
                                <img
                                  class="rounded-xl w-full"
                                  :src="`https://storage.googleapis.com/mcm-chuch.appspot.com/${
                                    index === indexParent[index]
                                      ? parseImages(expenses[index].reciept)[
                                          currentImageIndex[index]
                                        ]
                                      : parseImages(expenses[index].reciept)[0]
                                  }`"
                                  alt="Image 1"
                                  loading="lazy"
                                />
                              </div>
                              <button
                                v-if="currentImageIndex[index] > 0"
                                @click="showPrevImage(index)"
                                class="absolute top-1/2 left-1 md:left-4 lg:left-4 xl:left-4 transform -translate-y-1/2 text-white h-10 w-10 rounded-full bg-black bg-opacity-50"
                              >
                                <i class="fas fa-arrow-left"></i>
                              </button>
                              <button
                                :class="[
                                  parseImages(expenses[index].reciept).length -
                                    1 !==
                                  0
                                    ? 'block'
                                    : 'hidden',
                                  parseImages(expenses[index].reciept).length -
                                    1 ==
                                  currentImageIndex[index]
                                    ? 'hidden'
                                    : 'block',
                                ]"
                                @click="showNextImage(index)"
                                class="absolute top-1/2 right-1 md:right-4 lg:right-4 xl:right-4 transform -translate-y-1/2 text-white p-2 rounded-full h-10 w-10 bg-black bg-opacity-50"
                              >
                                <i class="fas fa-arrow-right"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </main>
      </div>

      <div
        class="border rounded-md lg:sticky xl:sticky top-[150px] w-full h-full max-h-[530px] overflow-y-auto"
      >
        <h2 class="font-bold bg-blue-600 p-3 text-white flex gap-2">
          <span>Meeting Schedule</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
            />
          </svg>
        </h2>
        <div class="relative">
          <VCalendar
            transparent
            borderless
            style="width: 100%"
            :attributes="attributes"
            @dayclick="handleDateClick"
          />
          <div
            class="bottom-0 left-6 border-t py-3 px-4 text-xs text-gray-600"
            v-for="(item, index) in attributes"
            :key="index"
            v-show="
              item.dates[0] === currentDate && item.description.length != 0
            "
          >
            <p class="py-1"> {{item.popover.label}}</p>
            <p class="py-1">{{ item.time }}</p>
            <p class="py-1">{{ item.description }}</p>
          </div>
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
import { onMounted, ref, nextTick } from "vue";
import axios from "../../../axios";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { getDate } from "../../composables/date";

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);
const parseImages = (images) => {
  const image = JSON.parse(images);

  return image.reverse();
};
const expenses = ref([]);

const currentImageIndex = ref([0]);
const indexParent = ref([0]);

const showNextImage = (index) => {
  if (index !== indexParent.value[index]) {
    currentImageIndex.value[index] = 0;
  }

  const image = expenses.value[index];
  if (currentImageIndex.value[index] < parseImages(image.reciept).length - 1) {
    indexParent.value[index] = index;
    currentImageIndex.value[index]++;
    console.log("current: " + currentImageIndex.value[index]);
  }
};

const showPrevImage = (index) => {
  currentImageIndex.value[index]--;
};
// Define chart data and options
const chartData = {
  labels: [], // This will hold month names dynamically
  datasets: [
    {
      label: "Income",
      backgroundColor: "#3b82f6",
      data: [],
    },
    {
      label: "Expenses",
      backgroundColor: "#FFA726",
      data: [],
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

// Initialize the expense overview
const expenseOverview = ref([]);
const fundsOverview = ref([]);

// Fetch data for expense overview
const getExpenseOverview = async () => {
  try {
    const response = await axios.get("/api/expense-overview");
    if (response.status === 200) {
      expenseOverview.value = response.data.results;
      console.log(expenseOverview.value);

      // Group the expenses by month and sum them
      const monthlyExpenses = {};

      expenseOverview.value.forEach((item) => {
        const date = new Date(item.created_at);
        const month = date.toLocaleString("default", {
          month: "long",
          year: "numeric",
        }); // Get month and year (e.g., 'November 2024')

        if (!monthlyExpenses[month]) {
          monthlyExpenses[month] = 0;
        }

        monthlyExpenses[month] += item.amount; // Add amount to the corresponding month
      });

      // Sort months in chronological order (optional)
      const sortedMonths = Object.keys(monthlyExpenses).sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateA - dateB;
      });

      // Update chart data with sorted months and their corresponding sums
      nextTick(() => {
        sortedMonths.forEach((month) => {
          // Ensure the month is added to the labels only once
          if (!chartData.labels.includes(month)) {
            chartData.labels.push(month); // Add month name to labels
          }

          chartData.datasets[1].data.push(monthlyExpenses[month]); // Add summed amount for the month to expenses dataset
        });

        console.log("Monthly expenses:", monthlyExpenses);
      });
    }
  } catch (error) {
    console.error(error.response);
  }
};
const currentDate = ref(null);
const handleDateClick = (date) => {
  currentDate.value = date.id;
};
// Fetch data for funds overview
const getFundsOverview = async () => {
  try {
    const response = await axios.get("/api/get-total-funds");
    if (response.status === 200) {
      fundsOverview.value = response.data.results;
      console.log(fundsOverview.value);

      // Group the income by month and sum them (similar to expenses)
      const monthlyIncome = {};

      fundsOverview.value.forEach((item) => {
        const date = new Date(item.created_at);
        const month = date.toLocaleString("default", {
          month: "long",
          year: "numeric",
        }); // Get month and year (e.g., 'November 2024')

        if (!monthlyIncome[month]) {
          monthlyIncome[month] = 0;
        }

        monthlyIncome[month] += item.amount; // Add amount to the corresponding month
      });

      // Sort months in chronological order (optional)
      const sortedMonths = Object.keys(monthlyIncome).sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateA - dateB;
      });

      // Update chart data with sorted months and their corresponding sums
      nextTick(() => {
        sortedMonths.forEach((month) => {
          // Add month name to labels (ensure uniqueness)
          if (!chartData.labels.includes(month)) {
            chartData.labels.push(month); // Add month name to labels
          }

          // Add summed amount for the month to both expenses and income datasets
          chartData.datasets[0].data.push(monthlyIncome[month]); // Income dataset
        });

        console.log("Monthly income:", monthlyIncome);
      });
    }
  } catch (error) {
    console.error(error.response);
  }
};
const currentPage = ref(1);
const itemsPerPage = 10;

const refreshData = async () => {
  try {
    const response = await axios.get(
      `/api/get-changelog-response?page=${currentPage.value}&limit=${itemsPerPage}`
    );
    if (response.status === 200) {
      expenses.value = response.data.results;
    }
  } catch (error) {
    console.log(error.response);
  }
};
const attributes = ref(null);
const refreshDataMeeting = async () => {
  try {
    const response = await axios.get(`/api/get-meeting`);
    if (response.status === 200) {
      attributes.value = response.data.results;
    }
  } catch (error) {
    console.log(error.response);
  }
};

// Call getExpenseOverview and getFundsOverview after component is mounted
onMounted(() => {
  window.scrollTo(0, 0);
  getExpenseOverview();
  getFundsOverview();
  refreshData();
  refreshDataMeeting();
});
</script>

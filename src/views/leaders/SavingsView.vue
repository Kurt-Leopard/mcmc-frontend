<template>
  <div class="px-4 lg:px-32 xl:px-32 mt-32">
    <div v-if="loading" class="text-center text-lg text-gray-500">
      Loading...
    </div>
    <div class="-mx-4 flex flex-wrap" v-else>
      <div class="w-full px-4 md:w-1/2 xl:w-1/3 mt-12">
        <div class="relative">
          <div class="overflow-hidden rounded-[10px]">
            <img
              src="../../assets/income.jpg"
              alt="portfolio"
              class="w-full h-[200px] object-cover"
            />
          </div>
          <div
            class="relative z-10 mx-7 -mt-20 rounded-lg bg-white dark:bg-dark-2 py-[10px] px-3 text-center shadow-portfolio dark:shadow-box-dark border"
          >
            <span class="text-primary mb-2 block text-lg font-medium">
              ₱ {{ income.toFixed(2) }}
            </span>
            <h3 class="text-dark dark:text-white mb-5 text-xl font-bold">
              {{ tabs[0] }}
            </h3>
            <div class="flex justify-evenly items-center mb-4 space-x-4">
              <button
                @click="activeTab = tabs[0]"
                :class="[
                  'px-4 py-2 rounded-lg font-semibold text-gray-600 hover:bg-[#3658F9] hover:text-white',
                  activeTab === tabs[0]
                    ? 'bg-[#3658F9] text-white'
                    : 'text-gray-700  bg-gray-100',
                ]"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- 2 -->
      <div class="w-full px-4 md:w-1/2 xl:w-1/3 mt-12">
        <div class="relative">
          <div class="overflow-hidden rounded-[10px]">
            <img
              src="../../assets/restrictedfunds.jpg"
              alt="portfolio"
              class="w-full h-[200px] object-cover"
            />
          </div>
          <div
            class="relative z-10 mx-7 -mt-20 rounded-lg bg-white dark:bg-dark-2 py-[10px] px-3 text-center shadow-portfolio dark:shadow-box-dark border"
          >
            <span class="text-primary mb-2 block text-lg font-medium">
              ₱ {{ totalRestrictedFunds.toFixed(2) }}
            </span>
            <h3 class="text-dark dark:text-white mb-5 text-xl font-bold">
              {{ tabs[1] }}
            </h3>

            <div class="flex justify-evenly items-center mb-4 space-x-4">
              <button
                @click="activeTab = tabs[1]"
                :class="[
                  'px-4 py-2 rounded-lg font-semibold text-gray-600 hover:bg-[#3658F9] hover:text-white',
                  activeTab === tabs[1]
                    ? 'bg-[#3658F9] text-white'
                    : 'text-gray-700 bg-gray-100',
                ]"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- 3 -->
      <div class="w-full px-4 md:w-1/2 xl:w-1/3 mt-12">
        <div class="relative">
          <div class="overflow-hidden rounded-[10px]">
            <img
              src="../../assets/thites.jpg"
              alt="portfolio"
              class="w-full h-[200px] object-cover"
            />
          </div>
          <div
            class="relative z-10 mx-7 -mt-20 rounded-lg bg-white dark:bg-dark-2 py-[10px] px-3 text-center shadow-portfolio dark:shadow-box-dark border"
          >
            <span class="text-primary mb-2 block text-lg font-medium">
              ₱ {{ totalTithesOfTithes.toFixed(2) }}
            </span>
            <h3 class="text-dark dark:text-white mb-5 text-xl font-bold">
              {{ tabs[2] }}
            </h3>
            <div class="flex justify-evenly items-center mb-4 space-x-4">
              <button
                @click="activeTab = tabs[2]"
                :class="[
                  'px-4 py-2 rounded-lg font-semibold text-gray-600 hover:bg-[#3658F9] hover:text-white',
                  activeTab === tabs[2]
                    ? 'bg-[#3658F9] text-white'
                    : 'text-gray-700  bg-gray-100',
                ]"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Content -->
    <div id="exportContent" class="my-10">
      <div
        v-if="activeTab === 'Operational Income'"
        class="bg-white p-6 rounded-lg shadow-lg border"
      >
          <div class="flex items-center justify-between my-3">
          <h3 class="text-lg font-semibold text-gray-700">
            Operational income Details
          </h3>
          <!-- Export Buttons -->
          <form class="flex items-center">
            <label for="simple-search" class="sr-only">Search</label>
            <div class="relative w-full">
              <div
                class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none"
              >
                <svg
                  class="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                id="simple-search"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search"
                required
              />
            </div>
            <button
              type="submit"
              class="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </button>
          </form>
        </div>
        <table class="w-full text-left table-auto">
          <thead>
            <tr class="bg-gray-100 text-gray-600 border-y">
              <th class="p-3">Date</th>
              <th class="p-3">Description</th>
              <th class="p-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b text-gray-500" v-for="(item, index) in operationalIncomeData" :key="index">
              <td class="p-3">{{ item.date }}</td>
              <td class="p-3">₱ {{ item.allocation_amount.toFixed(2) }}</td>
              <td class="p-3 ">₱ {{ item.amount.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="activeTab === 'Restricted Funds'"
        class="bg-white p-6 rounded-lg shadow-lg border"
      >
        <div class="flex items-center justify-between my-3">
          <h3 class="text-lg font-semibold text-gray-700">
            Restricted funds Details
          </h3>
          <!-- Export Buttons -->
          <form class="flex items-center">
            <label for="simple-search" class="sr-only">Search</label>
            <div class="relative w-full">
              <div
                class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none"
              >
                <svg
                  class="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                id="simple-search"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search"
                required
              />
            </div>
            <button
              type="submit"
              class="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </button>
          </form>
        </div>
        <table class="w-full text-left table-auto">
          <thead>
            <tr class="bg-gray-100 text-gray-600 border-y">
              <th class="p-3">Date</th>
              <th class="p-3">Allocated budget</th>
              <th class="p-3">Restricted funds(10%)</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b text-gray-500" v-for="(item, index) in restrictedFundsData" :key="index">
              <td class="p-3">{{ getDate(item.allocation_created_at) }}</td>
              <td class="p-3">₱ {{ item.allocation_amount.toFixed(2) }}</td>
              <td class="p-3">
                ₱ {{ item.restricted_funds.toFixed(2) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="activeTab === 'Tithes of Tithes'"
        class="bg-white p-6 rounded-lg shadow-lg border"
      >
        <div class="flex items-center justify-between my-3">
          <h3 class="text-lg font-semibold text-gray-700">
            Tithes of Tithes Details
          </h3>
          <!-- Export Buttons -->
          <form class="flex items-center">
            <label for="simple-search" class="sr-only">Search</label>
            <div class="relative w-full">
              <div
                class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none"
              >
                <svg
                  class="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                id="simple-search"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search"
                required
              />
            </div>
            <button
              type="submit"
              class="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </button>
          </form>
        </div>
        <table class="w-full text-left table-auto">
          <thead>
            <tr class="bg-gray-100 text-gray-600 border-y">
              <th class="p-3">Date</th>
              <th class="p-3">Allocated budget</th>
              <th class="p-3">Thites of thites(10%)</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="border-b text-gray-500"
              v-for="(item, index) in tithesOfTithesData"
              :key="index"
            >
              <td class="p-3">{{ getDate(item.allocation_created_at) }}</td>
              <td class="p-3">₱ {{ item.allocation_amount.toFixed(2) }}</td>
              <td class="p-3">₱ {{ item.tithes_of_tithes.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="flex justify-end gap-1 mt-6 border-b pb-12">
      <button
        @click="exportPDF"
        class="px-4 py-2 bg-green-900 text-white flex items-center gap-2"
      >
        Export as PDF
      </button>
      <button
        @click="exportExcel"
        class="px-4 py-2 hover:bg-gray-100 text-gray-600"
      >
        Export as Excel
      </button>
      <button
        @click="exportWord"
        class="px-4 py-2 hover:bg-gray-100 text-gray-600"
      >
        Export as Word
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "../../../axios";
import html2pdf from "html2pdf.js";
import * as XLSX from "xlsx";
import { getDate } from "../../composables/date";
// Data and loading state
const operationalIncomeData = ref([]);

const restrictedFundsData = ref([]);

const tithesOfTithesData = ref([]);

onMounted(async () => {
  try {
    const response = await axios.get("/api/savings/details");
    if (response.status === 200) {
      tithesOfTithesData.value = response.data.result;
      restrictedFundsData.value = response.data.result;
    }
  } catch (error) {
    console.error("Error fetching data", error);
  }
});

const income = ref(null);
const totalRestrictedFunds = ref(null);
const totalTithesOfTithes = ref(null);
const loading = ref(true);

// Fetch data on component mount
onMounted(async () => {
  try {
    // Fetch income data
    const incomeResponse = await axios.get("/api/saving-income");
    income.value = incomeResponse.data.result[0]?.amount || 0;

    // Fetch savings data
    const savingsResponse = await axios.get("/api/savings");
    totalRestrictedFunds.value =
      savingsResponse.data.result[0]?.total_restricted_funds || 0;
    totalTithesOfTithes.value =
      savingsResponse.data.result[0]?.total_tithes_of_tithes || 0;

    // Set loading to false after data is fetched
    loading.value = false;
  } catch (error) {
    console.error("Error fetching data", error);
    loading.value = false;
  }
});
const activeTab = ref("Operational Income");
const tabs = ["Operational Income", "Restricted Funds", "Tithes of Tithes"];

// Fetch data on component mount (mocking with example data for now)
onMounted(async () => {
  try {
    loading.value = false; // Set loading to false once data is "fetched"
  } catch (error) {
    console.error("Error fetching data", error);
    loading.value = false;
  }
});

// Export functions (PDF, Excel, Word)
const exportPDF = () => {
  const element = document.getElementById("exportContent");
  html2pdf()
    .set({ filename: `${activeTab.value}.pdf`, html2canvas: { scale: 2 } })
    .from(element)
    .save();
};

const exportExcel = () => {
  const worksheet = XLSX.utils.table_to_sheet(
    document.querySelector(`#exportContent table`)
  );
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, activeTab.value);
  XLSX.writeFile(workbook, `${activeTab.value}.xlsx`);
};

const exportWord = () => {
  const content = document.getElementById("exportContent").innerHTML;
  const header =
    "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>" +
    "<head><meta charset='utf-8'><title>Export HTML to Word</title></head><body>";
  const footer = "</body></html>";
  const sourceHTML = header + content + footer;
  const blob = new Blob(["\ufeff", sourceHTML], { type: "application/msword" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${activeTab.value}.doc`;
  link.click();
};
</script>

<style scoped>
/* Add your custom styles here */
</style>

<script setup>
import axios from "../../../axios";
import { onMounted, ref ,watch} from "vue";
import { getDate } from "../../composables/date";
import html2pdf from "html2pdf.js";
import * as XLSX from "xlsx";
const allocation = ref([]);

const selectedDate = ref(null);
const refreshAllocation = async () => {
  try {
    const response = await axios.get(`/api/allocation-summary/${formatDateToMySQL(selectedDate.value)}`);

    if (response.status === 200) {
      allocation.value = response.data.results;
    }
  } catch (error) {
    allocation.value = { amount: 0.0 };
    if (error.response) {
      console.log(error.response.message);
    }
  }
};
const allocation_summary_date = ref([]);
const refreshAllocation_summary_date = async () => {
  try {
    const response = await axios.get("/api/allocation-summary");

    if (response.status === 200) {
      allocation_summary_date.value = response.data.results;
    }
  } catch (error) {
    if (error.response) {
      console.log(error.response.message);
    }
  }
};

const allocation_balance = ref([]);
const getBalance = async () => {
  try {
    const response = await axios.get(`/api/allocation-balance/${formatDateToMySQL(selectedDate.value)}`);
    if (response.status === 200) {
      allocation_balance.value = response.data.results;
    }
  } catch (error) {
    allocation_balance.value = { balance: 0.0 };
    console.error(error.response);
  }
};
const totalChange = ref([]);
const getChange = async () => {
  try {
    const response = await axios.get("/api/total-change");
    if (response.status === 200) {
      totalChange.value = response.data.results;
    }
  } catch (error) {
    totalChange.value = { total_change_sum: 0.0 };
    console.error(error.response);
  }
};
const selectedExpenseDate =ref(null)
const expenses = ref([]);
const getExpenses = async () => {
  try {
    const response = await axios.get(`/api/get-expense-summary/${formatDateToMySQL(selectedExpenseDate.value)}`);
    if (response.status === 200) {
      expenses.value = response.data.results;
    }
  } catch (error) {
    totalChange.value = { total_change_sum: 0.0 };
    console.error(error.response);
  }
};

const otherExpenses = ref([]);
const getOtherExpenses = async () => {
  try {
    const response = await axios.get(`/api/other-expense/${formatDateToMySQL(selectedExpenseDate.value)}`);
    if (response.status === 200) {
      otherExpenses.value = response.data.results;
    }
  } catch (error) {
    totalChange.value = { total_change_sum: 0.0 };
    console.error(error.response);
  }
};

const summaryIncome = ref([]);
const getsummaryIncome = async () => {
  try {
    const response = await axios.get("/api/summary-savings-income");
    if (response.status === 200) {
      summaryIncome.value = response.data.results;
    }
  } catch (error) {
    totalChange.value = { total_change_sum: 0.0 };
    console.error(error.response);
  }
};
const hideSearch = ref(true);

// Export functions (PDF, Excel, Word)
const exportPDF = () => {
  hideSearch.value = false;
  setTimeout(() => {
    const element = document.getElementById("exportContent");
    html2pdf()
      .set({ filename: `mcmc.pdf`, html2canvas: { scale: 2 } })
      .from(element)
      .save();
    hideSearch.value = true;
  }, 0);
};

const exportExcel = () => {
  hideSearch.value = false;
  setTimeout(() => {
    const worksheet = XLSX.utils.table_to_sheet(
      document.querySelector(`#exportContent table`)
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, activeTab.value);
    XLSX.writeFile(workbook, `mcmc.xlsx`);
    hideSearch.value = true;
  }, 0);
};

const exportWord = () => {
  hideSearch.value = false;
  setTimeout(() => {
    const content = document.getElementById("exportContent").innerHTML;
    const header =
      "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>" +
      "<head><meta charset='utf-8'><title>Export HTML to Word</title></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + content + footer;
    const blob = new Blob(["\ufeff", sourceHTML], {
      type: "application/msword",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `mcmc.doc`;
    link.click();
    hideSearch.value = true;
  }, 0);
};

// function formatDateToMySQL(dateString) {
//     const date = new Date(dateString);
//     return date.toISOString().slice(0, 19).replace('T', ' ');
// }

// Function to format the date
function formatDateToMySQL(isoDate) {
  const date = new Date(isoDate);
  
  // Format the date as YYYY-MM-DD HH:MM:SS
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
watch(selectedDate, (newDate) => {
selectedExpenseDate.value=formatDateToMySQL(newDate);
  getExpenses();
  refreshAllocation();
  getBalance();
  getOtherExpenses();
});
onMounted(() => {
  refreshAllocation();
  getBalance();
  getExpenses();
  getOtherExpenses();
  getsummaryIncome();
  refreshAllocation_summary_date();

});
</script>
<template>
  <div
    :class="{
      'py-3 px-4 lg:px-[50px] xl:px-32 mb-12 mt-[115px] lg:mt-32 xl:mt-32': true,
      'text-[12px]': !hideSearch,
      'text-sm': hideSearch,
    }"
  >
    <div
      :class="{
        'bg-white rounded-lg px-8 py-10 my-6': true,
        'shadow-lg border': hideSearch,
      }"
      id="exportContent"
    >
      <div class="lg:flex xl:flex items-center justify-between mb-8">
        <div class="flex items-center">
          <section class="flex items-center w-full">
            <img
              src="/src/assets/logo.png"
              alt="Company Logo"
              loading="lazy"
              class="block w-10 h-10 lg:w-14 lg:h-14"
            />
            <div class="px-6">
              <h1
                class="lg:text-sm text-gray-600 hover:text-gray-800 font-bold tracking-[7px]"
              >
                MCM-CHURCH 
              </h1>
              <h3 class="text-xs text-gray-600 hover:text-gray-800">
                Steward-Trust-Manage-Sustain
              </h3>
            </div>
          </section>
        </div>
        <div class="text-gray-700 mt-5">
          <div>Date: <select v-model="selectedDate"  className="py-2 px-3 rounded-md border">
                  <option
                    v-for="(record, index) in allocation_summary_date"
                    :key="index"
                    :value="record.created_at"
                  >
                    {{ getDate(record.created_at) }}
                  </option>
                </select></div>
          <div>Invoice #: INV12345</div>
        </div>
      </div>
      <div class="border-b-2 border-gray-300">
        <h2 class="lg:text-2xl font-bold mb-4">Expense Summary</h2>
        <div class="text-gray-700 mb-2 pb-8">
          As of
          <span v-for="(allocated, index) in allocation" :key="index">
            {{ getDate(allocated.created_at) }}
            <span
              v-if="
                getDate(allocated.created_at) !==
                getDate(new Date().toISOString())
              "
              >to {{ getDate(new Date().toISOString()) }}</span
            >
          </span>
        </div>
      </div>
      <div class="uppercase py-2">Allocation</div>
      <table class="w-full text-left mb-8">
        <thead>
          <tr class="text-xs">
            <th class="text-gray-700 font-bold uppercase py-2">Date</th>
            <th class="text-gray-700 font-bold uppercase py-2">Name</th>
            <th class="text-gray-700 font-bold uppercase py-2">Method</th>
            <th class="text-gray-700 font-bold uppercase py-2">Particular</th>
            <th class="text-gray-700 font-bold uppercase py-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(expense, index) in expenses" :key="index">
            <td class="py-4 text-gray-700">
              {{ getDate(expense.expense_created_at) }}
            </td>
            <td class="py-4 text-gray-700">{{ expense.receiver_name }}</td>
            <td class="py-4 text-gray-700">{{ expense.method }}</td>
            <td class="py-4 text-gray-700">{{ expense.particular }}</td>
            <td class="py-4 text-gray-700">
              {{
                (expense.amount ?? 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              }}
            </td>
          </tr>
          <tr>
            <td v-for="(item, index) in 4" :key="index"></td>

            <div class="mb-4 text-gray-700">
              Total:
              {{
                (
                  expenses.reduce((sum, item) => sum + item.amount, 0) ?? 0
                ).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              }}
            </div>
          </tr>
        </tbody>
      </table>

      <div class="grid grid-cols-2 border-b pb-5">
        <div class="text-gray-700 mb-2">
          <div>
            Allocated:
            <span v-for="(allocated, index) in allocation" :key="index">
              {{
                (allocated.amount ?? 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              }}
            </span>
          </div>
          <div>
            Remaining Balance:
            <span v-for="(balance, index) in allocation_balance" :key="index">
              {{
                (balance.balance ?? 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              }}
            </span>
          </div>
          <div>
            Total Change:
            <span v-for="(change, index) in totalChange" :key="index">
              {{
                (change.total_change_sum ?? 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="text-gray-700 mb-2">
            <div class="font-semibold">Savings Deduction (10%)</div>
            <div>
              Tithes of Tithes:
              <span v-for="(balance, index) in allocation_balance" :key="index">
                {{
                  ((balance.balance ?? 0) * 0.1).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                }}
              </span>
            </div>
          </div>

          <div class="text-gray-700 mb-2">
            <div class="font-semibold">Restricted Funds Deduction (10%)</div>
            <div>
              <span v-for="(balance, index) in allocation_balance" :key="index">
                {{
                  ((balance.balance ?? 0) * 0.1).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="uppercase py-2">Contingency</div>
      <table class="w-full text-left">
        <thead>
          <tr class="text-xs">
            <th class="text-gray-700 font-bold uppercase py-2">Date</th>
            <th class="text-gray-700 font-bold uppercase py-2">Name</th>
            <th class="text-gray-700 font-bold uppercase py-2">Method</th>
            <th class="text-gray-700 font-bold uppercase py-2">Particular</th>
            <th class="text-gray-700 font-bold uppercase py-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(expense, index) in otherExpenses" :key="index">
            <td class="py-4 text-gray-700">
              {{ getDate(expense.created_at) }}
            </td>
            <td class="py-4 text-gray-700">{{ expense.fullname }}</td>
            <td class="py-4 text-gray-700">{{ expense.method }}</td>
            <td class="py-4 text-gray-700">{{ expense.particular }}</td>
            <td class="py-4 text-gray-700">
              {{
                (expense.amount ?? 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              }}
            </td>
          </tr>
          <tr>
            <td v-for="(item, index) in 4" :key="index"></td>
            <div class="mb-4 text-gray-700">
              Total:
              {{
                (
                  otherExpenses.reduce((sum, item) => sum + item.amount, 0) ?? 0
                ).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              }}
            </div>
          </tr>
        </tbody>
      </table>

      <div class="border-t-2 border-gray-300 pt-8 mb-8">
        <div class="text-gray-700 mb-2">
          This report provides a detailed summary of the church’s expenses
        </div>
        <div class="text-gray-700 mb-2">
          and corresponding savings allocations for the specified period.
        </div>
      </div>
    </div>
    <div
      class="flex justify-center gap-1 mt-6 border-b pb-12 text-[10px] md:text-lg lg:text-[14px]"
    >
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
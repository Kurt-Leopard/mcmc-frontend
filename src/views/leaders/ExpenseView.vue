<script setup>
import axios from "../../../axios";
import { onMounted, ref, watch, provide, watchEffect, computed } from "vue";
import PostComponent from "../../components/leader/modal/PostComponent.vue";
import RequestComponent from "../../components/leader/modal/RequestComponent.vue";
import ChangeLogComponent from "../../components/leader/modal/ChangeLogComponent.vue";
import {getDateTime } from "../../composables/date";
import { useAuthStore } from "../../stores/store";
import { decodeJWT } from "../../stores/token";
import { accessControl } from "../../composables/user";
const access_control = ref("");
const buttonPost = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const searchBy = ref("");
const searchByDate = ref(new Date().toISOString().slice(0, 7));
const request = ref(false);
const expensesRequest = ref([]);
const typeOfExpense = ref("Ministry");
const store = useAuthStore();
const isBoxShow = ref(true);

const filterType = ref("Filter");
const isDropdownOpen = ref(false);
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};
const setFilterType = (type) => {
  filterType.value = type;
  isDropdownOpen.value = false;
  refreshData();
};

const user = ref("");
if (store) {
  user.value = decodeJWT(store.token);
}
const viewRequest = () => {
  request.value = !request.value;
};
const closeRequest = () => {
  request.value = false;
  refreshDataRequest();
  getBalance();
  getChange();
};

const expenseLog = ref([]);
const isExpenseLog = ref(false);
const indexBtn = ref([]);
const changeLog = (expense) => {
  isExpenseLog.value = true;
  console.log("expense ni", expense);
  expenseLog.value = expense;
};

const closeExpenseLog = () => {
  isExpenseLog.value = false;
  getChange();
};
provide("request", request);
provide("expenseLog", expenseLog);
provide("isExpenseLog", isExpenseLog);

const buttonPostEntry = () => {
  buttonPost.value = true;
};

const closePostEntry = () => {
  buttonPost.value = false;
};
const allocation = ref([]);
const refreshAllocation = async () => {
  try {
    const response = await axios.get("/api/allocation");

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

const expandedIds = ref([]);

// Group expenses by `id` and keep only the latest
const latestExpenses = computed(() => {
  const groups = expenses.value.reduce((acc, expense) => {
    if (
      !acc[expense.id] ||
      new Date(expense.created_at) > new Date(acc[expense.id].created_at)
    ) {
      acc[expense.id] = expense;
    }
    return acc;
  }, {});
  return Object.values(groups);
});

// Get all expenses for a specific `id`
const getAllExpensesById = (id) =>
  expenses.value.filter((expense) => expense.id === id);

// Toggle group visibility
const toggleExpand = (id, index) => {
  if (!indexBtn.value.includes(index)) {
    indexBtn.value.push(index);
  } else {
    indexBtn.value = indexBtn.value.filter((item) => item !== index);
  }
  if (expandedIds.value.includes(id)) {
    expandedIds.value = expandedIds.value.filter(
      (expandedId) => expandedId !== id
    );
  } else {
    expandedIds.value.push(id);
  }
};
watch(
  () => store.getMethod(), // Source: the reactive data or function to watch
  (methodResult) => {
    // Callback: triggered when the value changes
    if (methodResult) {
      getBalance();
      getChange();
      refreshAllocation();
      refreshDataRequest();
      store.setMethod(null);
    }
  }
);

const expenses = ref([]);
const refreshData = async () => {
  try {
    const response = await axios.get(
      `/api/expense/${typeOfExpense.value}?page=${currentPage.value}&limit=${itemsPerPage.value}&searchBy=${searchBy.value}&searchByDate=${searchByDate.value}`
    );

    if (response.status === 200) {
      expenses.value = response.data.results;
      errorResponse.value = false;
    } else {
      expenses.value = [];
    }
  } catch (error) {
    expenses.value = [];
    if (error.response) {
      if (error.response.status === 404) {
        errorResponse.value = true;
      } else {
        console.log(error.response.message);
      }
    }
  }
};

watch([currentPage, searchBy, searchByDate, typeOfExpense], refreshData);
const errorResponse = ref(false);
const refreshDataRequest = async () => {
  try {
    const response = await axios.get(`/api/expense/request/${user.value.id}`);

    if (response.status === 200) {
      expensesRequest.value = response.data.results;
    }
  } catch (error) {
    if (error.response) {
      console.log(error.response.message);
    }
  }
};

provide("expensesRequest", expensesRequest);
// Fetch initial data
refreshData();

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    refreshData();
  }
};

const nextPage = () => {
  currentPage.value++;
  refreshData();
};

// allocation balance
const allocation_balance = ref([]);
const getBalance = async () => {
  try {
    const response = await axios.get("/api/allocation-in-expense-balance");
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
const getTotalSum = (total) => {
  return total.reduce((sum, expense) => sum + expense.spent, 0);
};
onMounted(async () => {
  refreshAllocation();
  refreshData();
  refreshDataRequest();
  getBalance();
  getChange();
  await accessControl();
  access_control.value = store.getAccessControl().access_control;
  window.scrollTo(0, 0);
  store.getMethod();
});
</script>


<template>
  <main
    :class="
      store.getRole().role !== 'admin'
        ? 'py-3 px-4 lg:px-[50px] xl:px-32 mb-12 mt-[115px] lg:mt-32 xl:mt-32 flex justify-center'
        : 'px-4'
    "
  >
    <div
      class="my-6 w-full"
      :class="
        store.getRole().role === 'admin'
          ? 'lg:h-[80vh] xl:h-[80vh]  overflow-y-auto lg:px-2 xl:px-2 element-with-horizontal-scroll'
          : ''
      "
    >
      <!--  -->

      <div
        class="font-tenor text-primary flex justify-between items-center py-[20px] bg-white px-[15px]"
        :class="isBoxShow ? 'border-t' : 'border-y'"
      >
        <span class="text-gray-500 font-semibold">Expense Allocation</span>
        <span :class="!isBoxShow ? 'rotate-180' : ''"
          ><svg
            @click="isBoxShow = !isBoxShow"
            xmlns="http://www.w3.org/2000/svg"
            width="17.543"
            height="10"
            viewBox="0 0 17.543 10"
            class="fill-primary"
          >
            <g
              id="arrow-down-sign-to-navigate"
              transform="translate(-0.001 -97.141)"
            >
              <path
                id="Path_200"
                data-name="Path 200"
                d="M8.772,107.141a1.225,1.225,0,0,1-.868-.36L.361,99.238A1.229,1.229,0,0,1,2.1,97.5l6.674,6.675L15.446,97.5a1.228,1.228,0,0,1,1.737,1.737l-7.543,7.543A1.225,1.225,0,0,1,8.772,107.141Z"
                fill="#555"
                class="fill-current"
              ></path>
            </g></svg
        ></span>
      </div>
      <div v-if="isBoxShow">
        <div>
          <div
            class="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4"
          >
            <div
              class="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-xl mb-2 shadow-lg"
            >
              <div class="flex justify-between items-center mb-4">
                <span class="text-sm uppercase tracking-wide"> Allocated </span>
                <div class="text-xs">MCMC</div>
              </div>
              <div
                class="text-right text-3xl font-semibold"
                v-for="(allocated, index) in allocation"
                :key="index"
              >
                {{
                  (allocated.amount ?? 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                }}
              </div>
            </div>

            <div
              class="bg-gradient-to-r from-green-500 to-green-700 text-white p-6 rounded-xl mb-2 shadow-lg"
            >
              <div class="flex justify-between items-center mb-4">
                <span class="text-sm uppercase tracking-wide"
                  >Remaining Balance</span
                >
                <div class="text-xs">MCMC</div>
              </div>
              <div
                class="text-right text-3xl font-semibold"
                v-for="(balance, index) in allocation_balance"
                :key="index"
              >
                {{
                  (balance.balance ?? 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                }}
              </div>
            </div>

            <div
              class="bg-gradient-to-r from-orange-500 to-orange-700 text-white p-6 rounded-xl mb-2 shadow-lg"
            >
              <div class="flex justify-between items-center mb-4">
                <span class="text-sm uppercase tracking-wide"
                  >Total Change</span
                >
                <div class="text-xs">MCMC</div>
              </div>
              <div
                class="text-right text-3xl font-semibold"
                v-for="(totalChange, index) in totalChange"
                :key="index"
              >
                {{
                  (totalChange.total_change_sum ?? 0).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )
                }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--  -->
      <PostComponent v-if="buttonPost" @closePostEntry="closePostEntry" />
      <div class="w-full lg:flex xl:flex items-center justify-between">
        <section class="flex justify-end items-center gap-2 w-full my-5">
          <input
            v-if="filterType === 'Search' || filterType === 'Filter'"
            v-model="searchBy"
            @input="refreshData"
            type="text"
            placeholder="Search by particular or amount"
            class="p-2 border rounded w-full"
          />

          <input
            v-if="filterType === 'Month'"
            v-model="searchByDate"
            @input="refreshData"
            type="month"
            placeholder="Search by month and year"
            class="border border-gray-300 p-2 rounded w-full"
          />
          <select
            v-if="filterType === 'Type'"
            v-model="typeOfExpense"
            class="py-3 px-4 pe-9 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
          >
            <option value="Bill">Bill</option>
            <option value="Ministry">Ministry</option>
            <option value="Honorarium">Honorarium</option>
            <option value="Others">Others</option>
          </select>

          <div class="relative rounded-lg">
            <button
              @click="toggleDropdown"
              class="flex items-center gap-2 py-3 px-4 block w-[90px] text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              {{ filterType === "Filter" ? "Filter" : filterType }}
              <svg
                :class="isDropdownOpen ? 'rotate-180' : ''"
                xmlns="http://www.w3.org/2000/svg"
                width="17.543"
                height="10"
                viewBox="0 0 17.543 10"
                class="fill-primary"
              >
                <g
                  id="arrow-down-sign-to-navigate"
                  transform="translate(-0.001 -97.141)"
                >
                  <path
                    id="Path_200"
                    data-name="Path 200"
                    d="M8.772,107.141a1.225,1.225,0,0,1-.868-.36L.361,99.238A1.229,1.229,0,0,1,2.1,97.5l6.674,6.675L15.446,97.5a1.228,1.228,0,0,1,1.737,1.737l-7.543,7.543A1.225,1.225,0,0,1,8.772,107.141Z"
                    fill="#555"
                    class="fill-current"
                  ></path>
                </g>
              </svg>
            </button>
            <div
              v-if="isDropdownOpen"
              class="absolute bg-white border border-gray-200 rounded-lg w-full z-10 mt-1"
            >
              <div
                @click="setFilterType('Search')"
                class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[14px]"
              >
                Keyword
              </div>
              <div
                @click="setFilterType('Month')"
                class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[14px]"
              >
                Month
              </div>
              <div
                @click="setFilterType('Type')"
                class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[14px]"
              >
                Type
              </div>
            </div>
          </div>
          <a
            class="text-gray-500 flex items-center justify-center hover:text-gray-700 relative"
          >
            <button
              v-if="store.getRole().role !== 'admin'"
              @click="viewRequest"
              class="py-2.5 px-4 rounded-lg bg-gray-100"
            >
              <i class="fas fa-clipboard"></i></button
            ><small
              v-if="expensesRequest.length !== 0"
              class="bg-red-500 text-xs px-1.5 rounded-full flex items-center justify-center text-white absolute left-6 bottom-3"
              >{{ expensesRequest.length }}</small
            >
          </a>
        </section>
      </div>
      <div
        :class="
          errorResponse
            ? 'w-full py-24 flex items-center justify-center'
            : 'my-4 grid md:grid-cols-3 gap-4'
        "
      >
        <div
          v-if="errorResponse"
          class="flex items-center justify-center w-full h-1/2"
        >
          <div class="text-center">
            <i class="fas fa-database text-[100px] text-gray-200"></i>
            <h1 class="py-3 text-gray-500 font-semibold">
              No data available yet.
            </h1>
          </div>
        </div>
        <div
          expenses.value="response.data.results;"
          v-for="(expense, index) in latestExpenses"
          :key="expense.id"
          class="w-full border border-gray-300 p-6 mb-4"
          :class="indexBtn.includes(index) ? '' : 'max-h-[400px]'"
        >
          <div class="px-2 py-2">
            <h2
              class="text-lg font-mono font-bold text-center border-b pb-2 mb-4"
            >
              MCMC Allocation Receipt
            </h2>
          </div>
          <div class="px-2">
            <div class="flex justify-between mb-4">
              <span class="text-xs text-gray-700 font-mono">Date:</span>
              <span class="text-xs font-mono">{{
                getDateTime(expense.created_at)
              }}</span>
            </div>
            <div class="flex justify-between mb-4">
              <span class="text-xs text-gray-700 font-mono">Receiver:</span>
              <span class="text-xs font-mono">{{ expense.fullname }}</span>
            </div>
            <div class="flex justify-between mb-4">
              <span class="text-xs text-gray-700 font-mono">Amount:</span>
              <span class="text-xs font-mono">
                {{
                  (expense.amount ?? 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                }}
              </span>
            </div>
            <div class="flex justify-between mb-4">
              <span class="text-xs text-gray-700 font-mono"
                >Total Change:
              </span>
              <span
                class="text-xs font-mono"
                v-for="exp in getAllExpensesById(expense.id)"
                :key="exp.created_at"
                v-show="exp.row_num === getAllExpensesById(expense.id).length"
              >
                {{
                  getTotalSum(getAllExpensesById(expense.id)) === expense.amount
                    ? "0.00"
                    : exp.total_change
                }}
              </span>
            </div>
            <div class="flex justify-between mb-4">
              <span class="text-xs text-gray-700 font-mono">Particular: </span>
              <span class="text-xs font-mono">
                {{
                 expense.particular
                }}
              </span>
            </div>
             <div class="flex-col justify-between mb-4">
              <div class="text-xs text-gray-700 font-mono">Particular: </div>
              <div class="text-xs font-mono my-1">
                {{
                 expense.particular?expense.particular:'N/A'
                }}
              </div>
            </div>

            <div
              class="flex justify-between items-center w-full"
              v-if="access_control === 'Bookkeeper'"
            >
              <!-- <span
                class="text-sm font-bold font-mono"
                v-if="expense.spent === null"
                >Change: {{ expense.spent }}</span
              > -->

              <button  :disabled="getTotalSum(getAllExpensesById(expense.id)) === expense.amount"
                v-for="exp in getAllExpensesById(expense.id)"
                :class="
                  getTotalSum(getAllExpensesById(expense.id)) === expense.amount
                    ? 'w-full'
                    : 'border w-1/3'
                "
                :key="exp.created_at"
                v-show="exp.row_num === getAllExpensesById(expense.id).length"
                @click="changeLog(exp)"
                type="button"
                class="p-1 px-1 text-center hover:border-gray-500 rounded-md text-sm font-bold font-mono"
              >
                {{getTotalSum(getAllExpensesById(expense.id)) === expense.amount? 'Full Expense Utilization':'Add'}}
              </button>
            </div>
            <!-- Button to toggle visibility of all entries for the same id -->
            <button
              @click="toggleExpand(expense.id, index)"
              class="border w-full p-2 rounded-md text-sm font-bold font-mono mt-2"
            >
              {{ expandedIds.includes(expense.id) ? "Hide All" : "Show All" }}
            </button>

            <!-- Show all expenses for the current id when expanded -->
            <div v-if="expandedIds.includes(expense.id)" class="mt-4">
              <h3 class="text-sm font-bold font-mono border-b mb-2">Entries</h3>
              <div
                v-for="exp in getAllExpensesById(expense.id)"
                :key="exp.created_at"
                class="mb-2"
              >
                <div class="flex justify-between">
                  <span class="text-xs text-gray-700 font-mono">Date:</span>
                  <span class="text-xs font-mono">{{
                    getDateTime(exp.created_at)
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-xs text-gray-700 font-mono">Amount:</span>
                  <span class="text-xs font-mono">
                    {{
                      (exp.spent ?? 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="flex justify-center items-center text-gray-500 space-x-4 my-4 w-full"
      >
        <button
          @click="previousPage"
          :disabled="currentPage <= 1"
          class="hover:text-gray-800 cursor-pointer text-sm"
        >
          Prev
        </button>
        <small>Page {{ currentPage }}</small>
        <button
          @click="nextPage"
          :disabled="expenses.length < itemsPerPage"
          class="hover:text-gray-800 cursor-pointer text-sm"
        >
          Next
        </button>
      </div>
    </div>
    <RequestComponent v-if="request" @closeRequest="closeRequest" />
    <ChangeLogComponent
      v-if="isExpenseLog"
      @closeExpenseLog="closeExpenseLog"
      @refreshData="refreshData"
    />
  </main>
</template>

<script setup>
import axios from "../../../axios";
import { onMounted, ref, watch, provide } from "vue";
import PostComponent from "../../components/leader/modal/PostComponent.vue";
import RequestComponent from "../../components/leader/modal/RequestComponent.vue";
import ChangeLogComponent from "../../components/leader/modal/ChangeLogComponent.vue";
import { getDate } from "../../composables/date";
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
const user = ref("");
if (store) {
  user.value = decodeJWT(store.token);
}
const viewRequest = () => {
  request.value = !request.value;
};
const closeRequest = () => {
  request.value = false;
};
const expenseLog = ref([]);
const isExpenseLog = ref(false);
const changeLog = (expense) => {
  isExpenseLog.value = true;
  expenseLog.value = expense;
};

const closeExpenseLog = () => {
  isExpenseLog.value = false;
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
    if (error.response) {
      console.log(error.response.message);
    }
  }
};
const expenses = ref([]);
const refreshData = async () => {
  try {
    const response = await axios.get(
      `/api/expense/${typeOfExpense.value}?page=${currentPage.value}&limit=${itemsPerPage.value}&searchBy=${searchBy.value}&searchByDate=${searchByDate.value}`
    );

    if (response.status === 200) {
      expenses.value = response.data.results;
      errorResponse.value = false;
    }
  } catch (error) {
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
onMounted(async () => {
  refreshAllocation();
  refreshData();
  refreshDataRequest();
  await accessControl();
  access_control.value = store.getAccessControl().access_control;
  window.scrollTo(0, 0);
});
</script>


<template>
  <main
    class="py-3 px-4 lg:px-[50px] xl:px-32 mb-12 mt-[115px] lg:mt-32 xl:mt-32 flex justify-center"
  >
    <div class="my-6 w-full">
      <!--  -->
      <div
        class="md:p-6 lg:p-6 xl:p-6 bg-background rounded-lg md:shadow-md lg:shadow-md xl:shadow-md"
      >
        <div>
          <div class="w-full hidden md:grid lg:grid xl:grid grid-cols-3 gap-4">
            <div
              class="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-xl mb-2 shadow-lg md:block lg:block xl:block"
            >
              <div class="flex justify-between items-center mb-4">
                <span class="text-sm uppercase tracking-wide">
                  Allocated Budget
                </span>
                <div class="text-xs">MCMC</div>
              </div>
              <div
                class="text-right text-3xl font-semibold"
                v-for="(allocated, index) in allocation"
                :key="index"
              >
                {{ allocated.amount }}
              </div>
            </div>

            <div
              class="bg-gradient-to-r from-green-500 to-green-700 text-white p-6 rounded-xl mb-2 shadow-lg md:block lg:block xl:block hidden"
            >
              <div class="flex justify-between items-center mb-4">
                <span class="text-sm uppercase tracking-wide"
                  >Remaining Balance</span
                >
                <div class="text-xs">MCMC</div>
              </div>
              <div class="text-right text-3xl font-semibold">25,000</div>
            </div>

            <div
              class="bg-gradient-to-r from-orange-500 to-orange-700 text-white p-6 rounded-xl mb-2 shadow-lg md:block lg:block xl:block hidden"
            >
              <div class="flex justify-between items-center mb-4">
                <span class="text-sm uppercase tracking-wide"
                  >Total Change</span
                >
                <div class="text-xs">MCMC</div>
              </div>
              <div class="text-right text-3xl font-semibold">1,000</div>
            </div>
          </div>
        </div>
      </div>
      <!--  -->
      <PostComponent v-if="buttonPost" @closePostEntry="closePostEntry" />
      <div class="w-full lg:flex xl:flex items-center justify-between">
        <section class="md:flex lg:flex xl:flex items-center gap-2 w-full">
          <input
            v-model="searchBy"
            @input="refreshData"
            type="text"
            placeholder="Search by particular or amount"
            class="p-2 my-5 border rounded w-full"
          />
          <input
            v-model="searchByDate"
            @input="refreshData"
            type="month"
            placeholder="Search by month and year"
            class="border border-gray-300 p-2 rounded lg:w-1/2 xl:w-1/2 w-full"
          />
        </section>
        <section
          class="lg:w-1/3 xl:w-1/3 flex items-center my-2 lg:justify-even xl:justify-even lg:px-6 xl:px-6 gap-6"
        >
          <select
            v-model="typeOfExpense"
            class="py-3 px-4 pe-9 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
          >
            <option value="Bill">Bill</option>
            <option value="Ministry">Ministry</option>
            <option value="Honorarium">Honorarium</option>
            <option value="Others">Others</option>
          </select>
          <a
            class="text-gray-500 flex items-center justify-center px-3.5 hover:text-gray-700 relative"
          >
            <button @click="viewRequest">
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
            <h1 class="py-3">No data available yet.</h1>
          </div>
        </div>
        <div
          v-show="!errorResponse"
          class="w-full border border-gray-300 p-6"
          v-for="(expense, index) in expenses"
          :key="index"
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
                getDate(expense.created_at)
              }}</span>
            </div>
            <div class="flex justify-between mb-4">
              <span class="text-xs text-gray-700 font-mono">Receiver:</span>
              <span class="text-xs font-mono">{{ expense.fullname }}</span>
            </div>
            <div class="flex justify-between mb-4">
              <span class="text-xs text-gray-700 font-mono">Amount:</span>
              <span class="text-xs font-mono">{{ expense.amount }}</span>
            </div>
            <div class="flex justify-between mb-4">
              <span class="text-xs text-gray-700 font-mono">Particular:</span>
              <span class="text-xs font-mono">{{ expense.particular }}</span>
            </div>
            <div class="flex justify-between mb-4">
              <span class="text-xs text-gray-700 font-mono">total Spent:</span>
              <span class="text-xs font-mono">{{ expense.spent || '0.00' }}</span>
            </div>
             <div class="flex justify-between mb-4">
              <span class="text-xs text-gray-700 font-mono">total Change:</span>
              <span :class="expense.spent!==null? ' bg-green-100 rounded-md p-1 text-xs font-mono':'text-xs font-mono'" >{{ expense.total_change || '0.00' }}</span>
            </div>
            <div class="border-t border-gray-300 my-3"></div>
            <div
              class="flex justify-between items-center w-full"
              v-if="access_control === 'Bookkeeper'"
            >
              <span
                class="text-sm font-bold font-mono"
                v-if="expense.spent === null"
                >Change: {{ expense.spent }}</span
              >
              <button
                v-if="expense.spent === null"
                @click="changeLog(expense)"
                type="button"
                class="border w-1/3 p-1 px-1 text-center hover:border-gray-500 rounded-md text-sm font-bold font-mono"
              >
                o.oo
              </button>
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
      @closeExpenseLog="closeExpenseLog" @refreshData="refreshData"
    />
  </main>
</template>

<script setup>
import HeaderComponent from "../../components/admin/HeaderComponent.vue";
import axios from "../../../axios";
import { onMounted, ref, watch } from "vue";
import PostComponent from "../../components/leader/modal/PostComponent.vue";
import { getDate } from "../../composables/date";
const buttonPost = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const searchBy = ref("");

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
      `/api/expense?page=${currentPage.value}&limit=${itemsPerPage.value}&searchBy=${searchBy.value}`
    );

    if (response.status === 200) {
      expenses.value = response.data.results;
    }
  } catch (error) {
    if (error.response) {
      console.log(error.response.message);
    }
  }
};
watch([currentPage, searchBy], refreshData);

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
onMounted(() => {
  refreshAllocation();
  refreshData();
  window.scrollTo(0, 0);
});
</script>
<template>
  <main>
    <HeaderComponent />
    <main
      class="pb-3 px-4  mb-12  flex justify-center"
    >
      <div class="my-6 w-full bg-white text-black">
        <!--  -->
        <div
          class="md:p-6 lg:p-6 xl:p-6 bg-background rounded-lg md:shadow-md lg:shadow-md xl:shadow-md"
        >
          <div>
            <div class="w-full md:grid lg:grid xl:grid grid-cols-3 gap-4">
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
        <div class="w-full flex items-center justify-end">
          <input
            v-model="searchBy"
            @input="refreshData"
            type="text"
            placeholder="Search..."
            class="p-2 my-5 border rounded"
          />
        </div>
        <div class="my-5 grid md:grid-cols-3 gap-4">
          <div
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
                <span class="text-xs font-mono">{{ expense.receiver }}</span>
              </div>
              <div class="flex justify-between mb-4">
                <span class="text-xs text-gray-700 font-mono">Amount:</span>
                <span class="text-xs font-mono">{{ expense.amount }}</span>
              </div>
              <div class="flex justify-between mb-4">
                <span class="text-xs text-gray-700 font-mono">Particular:</span>
                <span class="text-xs font-mono">{{ expense.particular }}</span>
              </div>
              <div class="flex items-center justify-between mb-4">
                <span class="text-xs text-gray-700 font-mono"
                  >Response status:</span
                >
                <span class="text-xs font-mono p-1 bg-red-300 rounded-md"
                  >pending</span
                >
              </div>
              <div class="border-t border-gray-300 my-4"></div>
              <div class="flex justify-between mb-2">
                <span class="text-sm font-bold font-mono">Total:</span>
                <span class="text-sm font-bold font-mono">{{
                  expense.amount
                }}</span>
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
    </main>
  </main>
</template>


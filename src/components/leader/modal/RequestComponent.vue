<script setup>
import axios from "../../../../axios";
import { onMounted, ref, inject } from "vue";
import { getDate } from "../../../composables/date";
import { useAuthStore } from "../../../stores/store";
import { decodeJWT } from "../../../stores/token";

import { useToast } from "vue-toastification";
const toast = useToast();

const emit = defineEmits(["closeRequest"]);
const store = useAuthStore();
const user = ref("");
const expensesRequest = inject("expensesRequest");
if (store) {
  user.value = decodeJWT(store.token);
}
const closeRequest = () => {
  emit("closeRequest");
};
const request = inject("request");
const acknowledge = async (id, amount, typeOfExpense) => {
  try {
    const response = await axios.put(`/api/expense/request/${id}`, {
      amount: amount,
      typeOfExpense: typeOfExpense,
    });
    if (response.status === 200) {
      toast.success(response.data.message);
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.response.message);
      }
    }
  }
};
</script>
<template>
  <main
    class="flex items-center justify-center h-full w-full fixed top-0 left-0 z-30"
    :class="request ? 'animate-slide-in' : ''"
  >
    <div
      class="w-full lg:w-1/2 xl:w-1/2 h-full bg-white p-6 border max-h-full overflow-y-auto element-with-horizontal-scroll"
    >
      <button @click="closeRequest" class="underline">Close</button>
      <div
        class="w-full h-full flex items-center justify-center"
        v-if="expensesRequest.length === 0"
      >
        <div>
          <i class="fas fa-clipboard text-[100px] text-gray-200"></i>
          <h1 class="py-2">No request.</h1>
        </div>
      </div>
      <div
        class="w-full border border-gray-300 p-6 my-3"
        v-for="(expense, index) in expensesRequest"
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
            <span class="text-xs text-gray-700 font-mono">Particular: </span>
            <span class="text-xs font-mono">{{ expense.particular }}</span>
          </div>

          <div class="border-t border-gray-300 my-3"></div>
          <div class="flex justify-center items-center w-full">
            <button
              class="bg-green-700 py-2 px-3 text-white rounded-lg"
              @click="
                acknowledge(
                  expense.expenseId,
                  expense.amount,
                  expense.type_of_expense
                )
              "
            >
              Acknowledge
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
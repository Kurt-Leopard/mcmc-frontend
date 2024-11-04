<template>
  <main>
    <!-- Main modal -->
    <div
      class="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-screen bg-black bg-opacity-50"
    >
      <div
        class="relative md:p-4 lg:p-4 xl:p-4 w-full md:w-2/3 lg:w-1/2 xl:w-1/2"
      >
        <!-- Modal content -->
        <div
          class="relative bg-white md:rounded-lg lg:rounded-lg xl:rounded-lg shadow"
        >
          <!-- Modal header -->
          <div
            class="flex items-center justify-between p-4 md:p-5 border-b rounded-t "
          >
            <h3 class="text-lg font-semibold text-gray-900 ">
              Budget Allocation Entry
            </h3>
            <button
              @click="closeExpenseLog"
              type="button"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
            >
              <svg
                class="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <!-- Modal body -->
          <form class="p-4 md:p-5" @submit.prevent="submitForm">
            <div class="grid gap-4 mb-4 grid-cols-1">
              <div class="col-span-2 sm:col-span-1">
                <label
                  for="price"
                  class="block mb-2 text-sm font-medium text-gray-900 "
                  >Amount</label
                >
                <input
                  v-model="expense.amount"
                  disabled
                  type="number"
                  name="price"
                  id="price"
                  class="bg-gray-50 border border-gray-300 mr-1 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                  placeholder="₱ 2999"
                  required
                />
              </div>
              <div class="col-span-2 sm:col-span-1">
                <label
                  for="spent"
                  class="block mb-2 text-sm font-medium text-gray-900 "
                  >Spent</label
                >
                <input
                  v-model="expense.spent"
                  type="number"
                  name="spent"
                  id="spent"
                  class="bg-gray-50 border border-gray-300 mr-1 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                  placeholder="₱ 2999"
                  required
                />
              </div>
              <div class="col-span-2 sm:col-span-1">
                <label
                  for="change"
                  class="block mb-2 text-sm font-medium text-gray-900 "
                  >Change</label
                >
                <input
                  type="number"
                  name="change"
                  id="change"
                  :value="calculatedChange"
                  class="bg-gray-50 border border-gray-300 mr-1 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                  placeholder="₱ 0.00"
                  disabled
                />
              </div>
            </div>
            <button
              type="submit"
              class="text-white inline-flex items-center justify-center w-full text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-4 "
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, inject, computed } from "vue";
import { useAuthStore } from "../../../stores/store";
import axios from "../../../../axios";
import { decodeJWT } from "../../../stores/token";

const store = useAuthStore();
const user = ref("");
if (store) {
  user.value = decodeJWT(store.token);
}
const emit = defineEmits(["closeExpenseLog", "refreshData"]);
const isExpenseLog = inject("isExpenseLog");
const expenseLog = inject("expenseLog");

const expense = ref({
  expenseId: expenseLog.value.id,
  amount: expenseLog.value.amount,
  spent: "",
});

// Computed property to calculate change
const calculatedChange = computed(() => {
  if (expense.value.spent) {
    if (expense.value.amount > expense.value.spent) {
      return expense.value.amount - expense.value.spent || 0;
    }
  }
});

const closeExpenseLog = () => {
  emit("closeExpenseLog");
};

// Function to handle the form submission and make an Axios request
const submitForm = async () => {
  try {
    if (expense.amount >= expense.spent) {
      const payload = {
        expenseId: expense.value.expenseId,
        user_id: user.value.id,
        amount: expense.value.amount,
        spent: expense.value.spent,
        change: calculatedChange.value,
      };

      const response = await axios.post("/api/expense/changelog", payload);

      if (response.status === 200) {
        alert(response.data.message);
        emit("closeExpenseLog");
        emit("refreshData");
      }
    }else{
      alert("Spent cannot be less than amount")
    }
  } catch (error) {
    console.error("Error submitting the form", error);
  }
};
</script>


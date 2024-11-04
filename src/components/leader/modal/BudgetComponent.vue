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
              @click="closeBudgetEntry"
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
                  v-model="budget.amount"
                  type="number"
                  name="price"
                  id="price"
                  class="bg-gray-50 border border-gray-300 mr-1 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                  placeholder="₱ 2999"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              class="text-white inline-flex items-center justify-center w-full text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-4"
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
import axios from "../../../../axios";
import { onMounted, ref } from "vue";
import { fetchUser } from "../../../composables/user";
import { useAuthStore } from "../../../stores/store";
const store = useAuthStore();
const emit = defineEmits(["closeBudgetEntry"]);
const budget = ref({
  user_id: "",
  amount: "",
});

const closeBudgetEntry = () => {
  emit("closeBudgetEntry");
};

const submitForm = async () => {
  budget.value.user_id = store.user.id;
  try {
    const response = await axios.post("/api/allocation", budget.value);
    if (response.status === 200) {
      alert("budget allocated submitted:", response.data.message);
    }
  } catch (error) {
    if (error.response) {
      alert(error.response.data.message);
    }
  }
};

onMounted(async () => {
  await fetchUser();
});
</script>

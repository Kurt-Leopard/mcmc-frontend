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
          class="relative bg-white md:rounded-lg lg:rounded-lg xl:rounded-lg shadow dark:bg-gray-700"
        >
          <!-- Modal header -->
          <div
            class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600"
          >
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Create New Entry
            </h3>
            <button
              @click="closeCashEntry"
              type="button"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
            <div class="grid gap-4 mb-4 grid-cols-2">
              <div class="col-span-2 sm:col-span-1">
                <label
                  for="price"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Amount</label
                >
                <section
                  class="flex bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                >
                  <input
                    v-model="inflow.amount"
                    type="number"
                    name="price"
                    id="price"
                    class="bg-gray-50 mr-1 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="₱ 2999"
                    required
                  />
                  <select
                    v-model="inflow.method"
                    class="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 mr-1 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Gcash">Gcash</option>
                    <option value="Bank">Bank</option>
                  </select>
                </section>
              </div>
              <div class="col-span-2 sm:col-span-1">
                <label
                  for="category"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Particular</label
                >
                <select
                  v-if="
                    inflow.particular === 'Thites & offerings' ||
                    inflow.particular === 'Donation'
                  "
                  v-model="inflow.particular"
                  id="category"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                >
                  <option value="Thites & offerings">Thites & offerings</option>
                  <option value="Donation">Donation</option>
                  <option value="">Others</option>
                </select>
                <input
                  v-else
                  v-model="inflow.particular"
                  type="text"
                  placeholder="Specify Others"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 mt-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                />
              </div>
              <div class="col-span-2">
                <label
                  for="description"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Description (optional)</label
                >
                <textarea
                  v-model="inflow.description"
                  id="description"
                  rows="4"
                  class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Write description here"
                ></textarea>
              </div>
            </div>
            <button
              type="submit"
              class="text-white inline-flex items-center justify-center w-full text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-4 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
import { inject, onMounted, ref } from "vue";
import axios from "../../../../axios";
import { useAuthStore } from "../../../stores/store";
const store = useAuthStore();
const emit = defineEmits(["closeCashEntry", "refreshData"]);
const typeEntry = inject("typeEntry", false);
const updateEntry = inject('updateEntry', () => {
  console.warn('updateEntry not provided');
});



const inflow = ref({
  user_id: "",
  amount: updateEntry?.value?.amount || "",
  method: updateEntry?.value?.method || "Cash",
  particular: updateEntry?.value?.particular || "Thites & offerings",
  description: updateEntry?.value?.description || "",
});

const closeCashEntry = () => {
  emit("closeCashEntry");
};

const submitForm = async () => {
  if (typeEntry.value !== "update") {
    inflow.value.user_id = store.user.id;
    try {
      const response = await axios.post("/api/entry", inflow.value);
      if (response.status === 200) {
        alert("Inflow submitted:", response.data.message);
        emit("refreshData");
      }
    } catch (error) {
      if (error.response) {
        alert("Error submitting inflow:", error.response.message);
      }
    }
  } else {
    try {
      const data = {
        amount: inflow.value.amount,
        method: inflow.value.method,
        particular: inflow.value.particular,
        description: inflow.value.description,
      };
      const response = await axios.put(
        `/api/entry/${updateEntry.value.id}`,
        data
      );
      if (response.status === 200) {
        alert("Inflow updated submitted:", response.data.message);
        emit("refreshData");
      }
    } catch (error) {
      if (error.response) {
        alert("Error submitting inflow:", error.response.message);
      }
    }
  }
};
onMounted(async () => {});
</script>

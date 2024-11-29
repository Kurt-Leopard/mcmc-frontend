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
            class="flex items-center justify-between p-4 md:p-5 border-b rounded-t"
          >
            <h3 class="text-lg font-semibold text-gray-900">
              Create New Entry
            </h3>
            <button
              @click="closeCashEntry"
              type="button"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
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
                  class="block mb-2 text-sm font-medium text-gray-900"
                  >Amount</label
                >
                <section
                  class="flex bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full"
                >
                  <input
                    v-model="inflow.amount"
                    @input="
                      inflow.amount = inflow.amount < 0 ? 0 : inflow.amount
                    "
                    type="number"
                    name="price"
                    id="price"
                    class="bg-gray-50 mr-1 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="₱ 0.00"
                    required
                  />
                  <select
                    v-model="inflow.method"
                    class="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 mr-1"
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
                  class="block mb-2 text-sm font-medium text-gray-900"
                  >Particular</label
                >
                <select
                  v-if="
                    inflow.particular === 'Thites & offerings' ||
                    inflow.particular === 'Donation'
                  "
                  v-model="inflow.particular"
                  id="category"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
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
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 mt-2"
                />
              </div>
              <div class="col-span-2">
                <label
                  for="description"
                  class="block mb-2 text-sm font-medium text-gray-900"
                  >Description (optional)</label
                >
                <textarea
                  v-model="inflow.description"
                  id="description"
                  rows="4"
                  class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Write description here"
                ></textarea>
              </div>
            </div>
            <button
              type="submit"
              class="text-white inline-flex items-center justify-center w-full text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-4"
            >
              <svg
                v-if="buttonText==='Saving...'"
                width="20"
                height="20"
                fill="currentColor"
                class="mr-2 animate-spin"
                viewBox="0 0 1792 1792"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z"
                ></path>
              </svg>
              {{ buttonText }}
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
import { useToast } from "vue-toastification";
const toast = useToast();
const buttonText=ref("Save");
const updateEntry = inject("updateEntry", () => {
  console.warn("updateEntry not provided");
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
  buttonText.value = "Saving...";
  if (typeEntry.value !== "update") {
    inflow.value.user_id = store.user.id;
    try {
      const response = await axios.post("/api/entry", inflow.value);
      if (response.status === 200) {
        toast.success(response.data.message);
        emit("refreshData");
        emit("closeCashEntry");
        store.setMethod(true);
        buttonText.value = "Save";
      }
    } catch (error) {
      if (error.response) {
        toast.error("Error submitting inflow:", error.response.message);
      }else if (error.request) {
    
      toast.error('No Response:', error.request);
    } else {
   
      toast.error('Error:', error.message);
    }
       buttonText.value = "Save";
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
        toast.success(response.data.message);
        emit("refreshData");
          buttonText.value = "Save";
      }
    } catch (error) {
      if (error.response) {
        toast.error("Error submitting inflow:", error.response.message);
      }
        buttonText.value = "Save";
    }
  }
};
onMounted(async () => {});
</script>

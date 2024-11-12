<template>
  <main>
    <!-- Main modal -->
    <div
      class="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-screen bg-black bg-opacity-50"
    >
      <div
        class="relative w-full md:w-2/3 lg:w-1/2 max-h-[1000px] rounded-sm md:max-h-[600px] lg:max-h-[600px] xl:max-h-[600px] overflow-y-auto bg-white element-with-horizontal-scroll"
      >
        <!-- Modal content -->
        <div
          class="relative bg-white shadow  h-screen md:h-auto"
        >
          <!-- Modal header -->
          <div
            class="flex items-center justify-between p-4 border-b rounded-t "
          >
            <h3 class="text-lg font-semibold text-gray-900 ">
              New Entry
            </h3>
            <button
              @click="closePostEntry"
              type="button"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center  "
            >
              <svg
                class="w-3 h-3"
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
          <form @submit.prevent="submitForm">
            <div class="p-3">
              <h3
                class="text-sm text-gray-900  bg-blue-100 p-3 rounded-md"
              >
                <a class="font-semibold">Luke 16:10</a>
                Whoever can be trusted with very little can also be trusted with
                much, and whoever is dishonest with very little will also be
                dishonest with much. <i class="fas fa-bible"></i>
              </h3>
            </div>
            <main class="p-3 sm:p-4">
              <div class="grid gap-4 mb-4 grid-cols-2">
                <div class="col-span-1">
                  <label
                    for="price"
                    class="block mb-2 text-sm font-medium text-gray-900 "
                    >Amount</label
                  >
                  <input
                    v-model="data.amount"
                    type="number"
                    id="price"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5   "
                    placeholder="₱ 2999"
                    required
                  />
                </div>
                <div class="col-span-1">
                  <label
                    for="category"
                    class="block mb-2 text-sm font-medium text-gray-900 "
                    >Particular</label
                  >
                  <select
                    v-model="data.particular"
                    id="category"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5   "
                  >
                    <option value="">Thites & offerings</option>
                    <option value="Donation">Donation</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div class="col-span-1">
                  <label
                    for="spent"
                    class="block mb-2 text-sm font-medium text-gray-900 "
                    >Total Spent</label
                  >
                  <input
                    v-model="data.spent"
                    type="number"
                    id="spent"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5   "
                    placeholder="₱ 2999"
                    required
                  />
                </div>
                <div class="col-span-1">
                  <label
                    for="change"
                    class="block mb-2 text-sm font-medium text-gray-900 "
                    >Total Change</label
                  >
                  <input
                    v-model="data.change"
                    type="number"
                    id="change"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5   "
                    placeholder="₱ 2999"
                    required
                  />
                </div>

                <div class="col-span-2">
                  <label
                    for="description"
                    class="block mb-2 text-sm font-medium text-gray-900 "
                    >Description (optional)</label
                  >
                  <textarea
                    v-model="data.description"
                    id="description"
                    rows="3"
                    class="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500   "
                    placeholder="Write description here"
                  ></textarea>
                </div>
              </div>

              <div
                class="px-2 py-3 border rounded-lg max-h-[200px] overflow-y-auto"
              >
                <input
                  type="file"
                  @change="handleFileChange"
                  id="images"
                  multiple
                  accept="image/*"
                  class="opacity-0 h-[150px] absolute z-10 w-full"
                />
                <div
                  class="relative cursor-pointer w-full h-[150px] flex items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100"
                >
                  <div class="absolute top-center text-center">
                    <i
                      class="fas fa-images bg-gray-200 rounded-full p-3 text-[18px]"
                    ></i>
                    <h1 class="font-semibold">Add photos</h1>
                    <small class="text-gray-500">or drag and drop</small>
                  </div>
                </div>
              </div>

              <div class="mt-2 grid grid-cols-3 gap-2">
                <div v-for="(image, index) in imagePreviews" :key="index">
                  <img
                    :src="image"
                    alt="Preview"
                    loading="lazy"
                    class="w-full h-24 object-cover rounded-md"
                  />
                </div>
              </div>
            </main>

            <div class="p-4 border-t">
              <button
                type="submit"
                class="w-full text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm py-4"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import axios from "../../../../axios";
const emit = defineEmits(["closePostEntry"]);
const data = ref({
  amount: "",
  particular: "",
  spent: "",
  change: "",
  spent: "",
  description: "",
});
const images = ref([]);
const imagePreviews = ref([]);

const closePostEntry = () => emit("closePostEntry");

const handleFileChange = (event) => {
  images.value = Array.from(event.target.files);
  imagePreviews.value = [];
  images.value.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreviews.value.push(e.target.result);
    };
    reader.readAsDataURL(file);
  });
};
const responseStatus = ref(null);
const responseMessage = ref("");
const submitForm = async () => {
  const formData = new FormData();
  formData.append("amount", data.value.amount);
  formData.append("particular", data.value.particular);
  formData.append("spent", data.value.spent);
  formData.append("change",data.value.change);
  formData.append("description", description.value);

  images.value.forEach((image) => {
    formData.append("images", image);
  });

  try {
    const response = await axios.post("/api/inflow", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 200 || response.status === 201) {
      const data = {
        responseStatus: response.status,
        responseMessage: response.data.message,
      };
      store.setToastSuccess(data);
    }
  } catch (err) {
    if (err.response) {
      responseStatus.value = err.response.status;
      responseMessage.value = err.response.data.message;
    } else if (err.request) {
      responseStatus.value = 500;
      responseMessage.value =
        "No response received from the server. Please check your internet connection.";
    } else if (err.message && err.message.includes("timeout")) {
      responseStatus.value = 500;
      responseMessage.value = "The request timed out. Please try again later.";
    } else {
      responseStatus.value = 500;
      responseMessage.value = "An error occurred: " + err.message;
    }
  }
};
</script>

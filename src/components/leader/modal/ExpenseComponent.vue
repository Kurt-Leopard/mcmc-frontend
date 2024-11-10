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
              Expense Entry
            </h3>
            <button
              @click="closeExpenseEntry"
              type="button"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
            >
              <svg
                class="w-3 h-3"
                aria-hidden="true"
                
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
              <div class="col-span-2">
                <label
                  for="name"
                  class="block mb-2 text-sm font-medium text-gray-900 "
                  >Fullname</label
                >
                <select
                  v-model="expense.reciever"
                  id="receiver"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                  required
                >
                  <option
                    :value="leader.id"
                    v-for="(leader, index) in leaders"
                    :key="index"
                  >
                    {{ leader.fullname }}
                  </option>
                </select>
              </div>
              <div class="col-span-2 sm:col-span-1">
                <label
                  for="price"
                  class="block mb-2 text-sm font-medium text-gray-900 "
                  >Amount</label
                >
                <section
                  class="flex bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full "
                >
                  <input
                    v-model="expense.amount"
                    type="number"
                    name="price"
                    id="price"
                    class="bg-gray-50 mr-1 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    placeholder="₱ 2999"
                    required
                  />
                  <select
                    v-model="expense.method"
                    class="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 mr-1 "
                  >
                    <option value="Cash">Cash</option>
                    <option value="Gcash">Gcash</option>
                    <option value="Back">Bank</option>
                  </select>
                </section>
              </div>
              <div class="col-span-2 sm:col-span-1">
                <label
                  for="category"
                  class="block mb-2 text-sm font-medium text-gray-900 "
                  >Particular</label
                >

                <input
                  type="text"
                  v-model="expense.particular"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 "
                />
              </div>
              <div class="col-span-2">
                <label
                  for="description"
                  class="block mb-2 text-sm font-medium text-gray-900 "
                  >Description (optional)</label
                >
                <textarea
                  v-model="expense.description"
                  id="description"
                  rows="4"
                  class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                  placeholder="Write description here"
                ></textarea>
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
    <!-- modal -->
    <div
      v-if="acknowledgement"
      class="fixed left-0 top-0 w-full min-h-screen bg-white flex flex-col items-center justify-center z-50"
    >
      <!-- Header -->
      <div class="absolute top-10 left-4 text-white text-lg font-semibold">
        <i class="fas fa-arrow-left"></i> Scan QR code
      </div>

      <!-- QR Code Scanner Area -->
      <div
        class="relative w-72 h-72 border-4 border-blue-500 rounded-md overflow-hidden"
      >
        <!-- Video element for the QR scanner -->
        <video
          id="qr-video"
          ref="qrVideo"
          @canplay="enableScanner"
          autoplay
          class="absolute inset-0 w-full h-full object-cover"
        ></video>

        <!-- Scanning Line -->
        <div
          class="absolute w-full h-20 bg-blue-500 scanning-line"
          style="opacity: 0.2"
        ></div>
      </div>

      <!-- Flash and Instruction -->
      <div class="mt-8 flex flex-col items-center text-white">
        <button class="text-gray-700">
          <i class="fas fa-bolt text-xl"></i>Please scan the QR code 
        </button>
        <p class="my-2 text-black">or </p>
         <button class="text-gray-700 bg-blue-500 p-3 rounded-lg text-white" @click="sendRequest">
           Send a confirmation request
        </button>
      </div>
    </div>
  </main>
</template>

<script setup>
import axios from "../../../../axios";
import { inject, onMounted, ref, onUnmounted } from "vue";
import jsQR from "jsqr";
import { useAuthStore } from "../../../stores/store";
const store = useAuthStore();
const emit = defineEmits(["closeExpenseEntry"]);
const typeOfExpense = inject("typeOfExpense");
const expense = ref({
  qrcode:"",
  typeOfExpense: typeOfExpense.value,
  bookkeeper:store.user.id,
  reciever: "",
  amount: "",
  method: "Cash",
  particular: "",
  description: "",
});
const leaders = ref([]);
const refreshData = async () => {
  try {
    const response = await axios.get("/api/leaders-account");
    if (response.status === 200) {
      leaders.value = response.data.result;
      console.log("leaders ni");
    }
  } catch (error) {
    if (error.response) {
      console.log("error occured!");
    }
  }
};

const closeExpenseEntry = () => {
  emit("closeExpenseEntry");
};
const acknowledgement = ref(false);
const submitForm = () => {
  acknowledgement.value = true;
  if (acknowledgement.value === true) {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then(function (stream) {
        videoStream = stream;
        qrVideo.value.srcObject = stream;
        enableScanner(); // Start scanning when video is ready
      })
      .catch((err) => console.error(err));
  }
  refreshData();
};

const qrVideo = ref(null);
let videoStream = null;
let scanInterval = null;

// Start scanning for QR codes
const enableScanner = () => {
  scanInterval = setInterval(scanQR, 100); // Scan every 100ms
};

const scanQR = async () => {
  if (
    qrVideo.value &&
    qrVideo.value.readyState === qrVideo.value.HAVE_ENOUGH_DATA
  ) {
    const video = qrVideo.value;
    const canvasElement = document.createElement("canvas");
    canvasElement.width = video.videoWidth;
    canvasElement.height = video.videoHeight;
    const canvas = canvasElement.getContext("2d");

    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
    const imageData = canvas.getImageData(
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });

    if (code && code.data) {
      // Stop scanning when QR code is found
      clearInterval(scanInterval); // Stop the scanning interval
      videoStream.getTracks().forEach((track) => track.stop()); // Stop the video stream
      expense.value.qrcode=code.data;
      try {
        const response = await axios.post("/api/expense", expense.value);
        if (response.status === 200) {
        acknowledgement.value=false;
        }
      } catch (error) {
        if (error.response) {
          alert("Error submitting inflow:", error.response.message);
          acknowledgement.value=false;
        }
      }
    }
  }
};
const sendRequest =async()=>{
  try {
        const response = await axios.post("/api/expense", expense.value);
        if (response.status === 200) {
        acknowledgement.value=false;
        }
      } catch (error) {
        if (error.response) {
          alert("Error submitting inflow:", error.response.message);
          acknowledgement.value=false;
        }
      }
}
// Setup the video stream when the component is mounted
onMounted(() => {
  refreshData();
});

// Stop scanning when the component is unmounted
onUnmounted(() => {
  if (videoStream) {
    videoStream.getTracks().forEach((track) => track.stop());
  }
  if (scanInterval) {
    clearInterval(scanInterval);
  }
});
</script>
<style scoped>
.scanning-line {
  position: absolute;
  top: 0;
  animation: scanning 2s infinite;
}

@keyframes scanning {
  0% {
    top: 0;
  }
  50% {
    top: 100%;
  }
  100% {
    top: 0;
  }
}
</style>
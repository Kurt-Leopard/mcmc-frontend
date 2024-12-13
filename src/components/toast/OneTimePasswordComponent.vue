<template>
  <div
    v-if="datas[0]"
    class="fixed top-0 left-0 h-full w-full bg-white flex items-center justify-center bg-white sm:bg-black sm:bg-opacity-50 md:bg-black md:bg-opacity-50 lg:bg-black lg:bg-opacity-50 xl:bg-black xl:bg-opacity-50"
  >
    <form
      @submit.prevent="sendOneTimePasswordButton"
      class="md:shadow-md lg:shadow-md xl:shadow-md px-10 py-6 rounded-md bg-white"
    >
      <div class="flex flex-col space-y-2 text-center my-3">
        <h2
          class="block sm:hidden md:hidden lg:hidden xl:hidden text-3xl md:text-4xl font-bold"
        >
          Confirm OTP
        </h2>
        <p class="text-md md:text-xl">Enter the OTP we just sent you.</p>
      </div>
      <div class="flex justify-center gap-2 mb-6">
        <input
          class="w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
          type="text"
          maxlength="1"
          pattern="[0-9]"
          inputmode="numeric"
          autocomplete="one-time-code"
          required
          v-model="first"
        />
        <input
          class="w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
          type="text"
          maxlength="1"
          pattern="[0-9]"
          inputmode="numeric"
          autocomplete="one-time-code"
          v-model="second"
        />
        <input
          class="w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
          type="text"
          maxlength="1"
          pattern="[0-9]"
          inputmode="numeric"
          autocomplete="one-time-code"
          required
          v-model="third"
        />
        <input
          class="w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
          type="text"
          maxlength="1"
          pattern="[0-9]"
          inputmode="numeric"
          autocomplete="one-time-code"
          required
          v-model="fourth"
        />
        <input
          class="w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
          type="text"
          maxlength="1"
          pattern="[0-9]"
          inputmode="numeric"
          autocomplete="one-time-code"
          required
          v-model="fifth"
        />
        <input
          class="w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
          type="text"
          maxlength="1"
          pattern="[0-9]"
          inputmode="numeric"
          autocomplete="one-time-code"
          required
          v-model="sixth"
        />
      </div>
      <div class="flex items-center justify-center">
        <button
          class="bg-[#D98757] hover:bg-[#D98757] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Verify
        </button>
      </div>
    </form>
    <Danger-Component
      :errors="[responseStatus, responseMessage]"
      @closeToast="closeToast"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "../../../axios";
import { useAuthStore } from "../../stores/store";
import DangerComponent from "../toast/DangerComponent.vue";

const store = useAuthStore();
const emit = defineEmits(["goBackToRegister"]);

const props = defineProps({
  datas: {
    type: Array,
  },
});
const first = ref();
const second = ref();
const third = ref();
const fourth = ref();
const fifth = ref();
const sixth = ref();

const responseStatus = ref(null);
const responseMessage = ref("");

const closeToast = () => {
  responseStatus.value = null;
  responseMessage.value = "";
};

const sendOneTimePasswordButton = async () => {
  try {
    const pin = `${first.value}${second.value}${third.value}${fourth.value}${fifth.value}${sixth.value}`;
    const oneTimePassword = parseInt(pin);

    const data = {
      fullname: props.datas[1][0],
      username: props.datas[1][1],
      password: props.datas[1][2],
      pin: oneTimePassword,
    };

    const response = await axios.post("/user", data);

    if (response.status === 200) {
      const data = {
        responseStatus: response.status,
        responseMessage:'Thank you for registering! Your account is under review and will be approved shortly.',
      };
      emit("goBackToRegister", true);
      setTimeout(() => {
        store.setToastSuccess(data);
      }, 500);
    }
  } catch (error) {
    if (error.response) {
      responseStatus.value = error.response.status;
      responseMessage.value = error.response.data.message;
    } else if (error.request) {
      responseStatus.value = 500;
      responseMessage.value =
        "No response received from the server. Please check your internet connection.";
    } else if (error.message && error.message.includes("timeout")) {
      responseStatus.value = 500;
      responseMessage.value = "The request timed out. Please try again later.";
    } else {
      responseStatus.value = 500;
      responseMessage.value = "An error ocured " + error.message;
    }
  }
};
</script>

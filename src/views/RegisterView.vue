<script setup>
import { ref } from "vue";
import axios from "../../axios.js";
import { arrowRightButton } from "../assets/svg/button";
import DangerComponent from "../components/toast/DangerComponent.vue";
import OneTimePasswordComponent from "../components/toast/OneTimePasswordComponent.vue";

const emit = defineEmits(["hide", "openLogin", "goBackToRegister"]);
const hide = () => {
  emit("hide", false);
};
const openLogin = () => {
  emit("openLogin", true);
};
const goBackToRegister = () => {
  emit("openLogin", true);
  showOtpModal.value = false;
  dataResponse.value = [];
};

const getRow = (num) => {
  for (let i = 0; i < msgRow.value.length; i++) {
    if (msgRow.value[i] === num) {
      return i;
    }
  }
  return false;
};

// register
const data = ref({
  fullname: "",
  username: "",
  password: "",
});

const registerButtonText = ref("Register");
const duplicate = ref();
const msgRequired = ref([]);
const msgRow = ref([]);
const responseStatus = ref(null);
const responseMessage = ref("");
const showOtpModal = ref(false);
const dataResponse = ref();
// const pin=ref();

const registerUser = async () => {
  registerButtonText.value = "Registering your account...";
  msgRequired.value = ["", "", ""];
  msgRow.value = ["", "", ""];
  duplicate.value = false;
  responseMessage.value = "";
  responseStatus.value = null;
  try {
    const response = await axios.post(
      "/user/otp",
      { ...data.value },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (response.status === 200) {
      showOtpModal.value = true;
      dataResponse.value = response.data.result;
      // emit("openLogin", true);
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 400) {
        error.response.data.errors.forEach((element) => {
          msgRequired.value.push(element.msg.msgRequired);
          msgRow.value.push(element.msg.type);
        });
        console.log(msgRow.value);
      } else if (error.response.status === 409) {
        duplicate.value = error.response.data.message;
      } else {
        responseStatus.value = 500;
        responseMessage.value = error.response.data.message;
      }
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
  } finally {
    registerButtonText.value = "Register";
  }
};

const closeToast = () => {
  responseStatus.value = null;
  responseMessage.value = "";
};
</script>
<template>
  <section class="flex items-center justify-center bg-white h-screen">
    <div
      class="w-[450px] rounded-lg flex items-center justify-center px-4 lg:px-6 xl:px-6 py-6 bg-white"
    >
      <div class="w-full">
        <!-- button -->
        <span v-html="arrowRightButton()" @click="hide"></span>

        <img src="../assets/logo.png" alt="logo" class="mx-auto mb-6" />
        <div class="flex w-full my-2">
          <ul>
            <li
              class="text-2xl lg:text-2xl xl:text-2xl font-bold text-[#D98757]"
            >
              Sign up,
            </li>
            <li
              class="text-lg lg:text-1xl xl:text-1xl font-semibold subtext text-gray-600"
            >
              create an account!
            </li>
          </ul>
        </div>

        <form class="space-y-6" @submit.prevent="registerUser">
          <div>
            <div
              class="flex items-center rounded-md bg-gray-50 text-gray-900 shadow-sm border placeholder:text-gray-400 outfit-subtext"
              :class="{
                'shake border border-red-400': getRow('0'),
              }"
            >
              <div class="w-full">
                <div class="flex items-center w-full px-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 482 512"
                    fill="currentColor"
                    class="h-9 w-9 px-2 text-[#D98757] rounded-md"
                    :class="{ 'shake text-red-400': getRow('0') }"
                  >
                    <path
                      d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"
                    />
                  </svg>
                  <input
                    name="fullname"
                    type="text"
                    autocomplete="fullname"
                    required
                    class="block w-full py-3 px-2 m-1 ml-2 outline-none rounded-md bg-gray-50"
                    placeholder="Fullname"
                    v-model="data.fullname"
                  />
                </div>
                <small v-if="getRow('0')" class="absolute text-red-400">{{
                  msgRequired[getRow("0")]
                }}</small>
              </div>
            </div>
          </div>

          <div>
            <div
              class="flex items-center rounded-md bg-gray-50 text-gray-900 shadow-sm border placeholder:text-gray-400 outfit-subtext"
              :class="{
                'shake border border-red-400': getRow('1'),
              }"
            >
              <div class="w-full">
                <div class="flex items-center w-full px-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 482 512"
                    fill="currentColor"
                    class="h-9 w-9 px-2 text-[#D98757] rounded-md"
                    :class="{ 'shake text-red-400': getRow('1') }"
                  >
                    <path
                      d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"
                    />
                  </svg>

                  <input
                    name="email"
                    type="email"
                    autocomplete="email"
                    required
                    class="block w-full py-3 px-2 m-1 ml-2 outline-none rounded-sm bg-gray-50"
                    placeholder="Email"
                    v-model="data.username"
                  />
                </div>
                <small class="absolute text-red-400">{{
                  msgRequired[getRow("1")]
                }}</small>
                <small v-if="duplicate" class="absolute text-red-400">{{
                  duplicate
                }}</small>
              </div>
            </div>
          </div>

          <div>
            <div
              class="flex items-center rounded-md bg-gray-50 text-gray-900 shadow-sm border placeholder:text-gray-400 outfit-subtext"
              :class="{
                'shake border border-red-400': getRow('2'),
              }"
            >
              <div class="w-full">
                <div class="flex items-center px-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 482 512"
                    fill="currentColor"
                    class="h-9 w-9 px-2 text-[#D98757] rounded-md"
                    :class="{ 'shake text-red-400': getRow('2') }"
                  >
                    <path
                      d="M144 144l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0z"
                    />
                  </svg>
                  <input
                    name="password"
                    type="password"
                    autocomplete="current-password"
                    required
                    class="block w-full py-3 px-2 m-1 ml-2 outline-none rounded-sm bg-gray-50"
                    placeholder="Password"
                    v-model="data.password"
                  />
                </div>
                <small class="absolute text-red-400">{{
                  msgRequired[getRow("2")]
                }}</small>
              </div>
            </div>
          </div>
          <div>
            <button :disabled="registerButtonText === 'Registering your account...'? true : false"
              type="submit"
              class="flex w-full justify-center rounded-md bg-[#D98757] px-4 py-4 outfit-font font-bold leading-6 text-white shadow-sm hover:bg-[#D98757] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <svg
                 v-show="registerButtonText == 'Registering your account...'"
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
              {{ registerButtonText }}
            </button>
          </div>
        </form>

        <p class="mt-5 text-center text-gray-500 outfit-subtext">
          Already have an account?
          {{ " " }}
          <a
            @click="openLogin"
            class="cursor-pointer text-[#D98757] hover:text-[#D98757] font-bold"
            >Sign In</a
          >
        </p>
      </div>
    </div>
    <Danger-Component
      :errors="[responseStatus, responseMessage]"
      @closeToast="closeToast"
    />
    <OneTimePasswordComponent :datas="[showOtpModal, dataResponse]" @goBackToRegister="goBackToRegister" />
  </section>
</template>

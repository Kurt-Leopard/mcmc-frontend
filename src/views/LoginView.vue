<script setup>
import { ref } from "vue";
import axios from "../../axios.js";
import { useRouter } from "vue-router";
import { arrowRightButton } from "../assets/svg/button";
import ChangePasswordComponent from "../components/modal/ChangePasswordComponent.vue";
const router = useRouter();
const emit = defineEmits(["hide", "openRegister"]);
const hide = () => {
  emit("hide", false);
};
const openRegister = () => {
  emit("openRegister", true);
};
// login
const data = ref({
  username: "",
  password: "",
});
const showPasswordModal =ref(false);
const isErrorResponseDisplay = ref();
const isErrorResponseDisplayHide = ref();
const isValidationSuccess = ref();
const errorResponseMessage = ref("");

const setTimeOutToHideToast = () => {
  setTimeout(() => {
    isErrorResponseDisplayHide.value = true; // 5 seconds: Waits before performing the action inside the first timeout.
    setTimeout(() => {
      isErrorResponseDisplay.value = false; // 350 milliseconds: Additional wait time after the first action before performing the action in the second timeout.
    }, 350);
  }, 5000);
};

axios.defaults.withCredentials = true;
const loginButtonText = ref("Login");
const loginUser = async () => {
  loginButtonText.value = "Logging into your account...";
  isValidationSuccess.value = false;
  isErrorResponseDisplay.value = false;
  isErrorResponseDisplayHide.value = false;
  errorResponseMessage.value = "";
  try {
    const response = await axios.post(
      "/user/login",
      { ...data.value },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (response.status === 200) {
        emit("hide", false);
        router.push({ path: "/view/home" });
        sessionStorage.setItem("accessRole", response.data.token);
        location.reload();
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        // validate password & required

        errorResponseMessage.value = error.response.data.message;
      } else if (error.response.data.errors) {
        // validate username & required
        isValidationSuccess.value = true;

        errorResponseMessage.value = error.response.data.errors[0].msg.message;
      } else if (error.response.status !== 401) {
        isErrorResponseDisplay.value = true;

        errorResponseMessage.value = error.response.data.message;
        setTimeOutToHideToast();
      }
    } else if (error.request) {
      isErrorResponseDisplay.value = true;
      errorResponseMessage.value =
        "No response received from the server. Please check your internet connection.";
      setTimeOutToHideToast();
    } else if (error.message && error.message.includes("timeout")) {
      isErrorResponseDisplay.value = true;
      errorResponseMessage.value =
        "The request timed out. Please try again later.";
      setTimeOutToHideToast();
    } else {
      isErrorResponseDisplay.value = true;
      errorResponseMessage.value = "An erroror occurred: " + error.message;
      setTimeOutToHideToast();
    }
  } finally {
    loginButtonText.value = "Login";
  }
};

const closePasswordModal=()=>{
  showPasswordModal.value=false;
}
const forgotPassword =()=>{
  showPasswordModal.value=true;
}
</script>
<template>
  <section class="flex items-center justify-center bg-white h-screen">
    <div
      class="w-[450px] rounded-lg flex items-center justify-center px-4 lg:px-6 xl:px-6 py-6 bg-white"
    >
      <div class="w-full">
        <!-- button -->
        <span v-html="arrowRightButton()" @click="hide"></span>
        <img src="../assets/logo.png" alt="logo" class="mx-auto" />
        <div class="flex w-full my-2">
          <ul>
            <li
              class="text-2xl lg:text-2xl xl:text-2xl font-bold text-[#D98757]"
            >
              Welcome,
            </li>
            <li
              class="text-lg lg:text-1xl xl:text-1xl font-semibold subtext text-gray-600"
            >
              sign in to your account!
            </li>
          </ul>
        </div>
        <form class="space-y-6" @submit.prevent="loginUser">
          <div>
            <div
              :class="
                errorResponseMessage === 'Invalid email format' ||
                errorResponseMessage === 'Email is required'
                  ? 'border border-red-500 shake'
                  : ''
              "
              class="flex items-center rounded-md px-3 bg-gray-50 text-gray-900 shadow-sm border placeholder:text-gray-400 outfit-subtext"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 482 512"
                fill="currentColor"
                class="h-9 w-9 px-2 text-[#D98757] rounded-md"
                :class="
                  errorResponseMessage === 'Invalid email format' ||
                  errorResponseMessage === 'Email is required'
                    ? 'text-red-400 shake'
                    : ''
                "
              >
                <path
                  d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"
                />
              </svg>
              <!-- <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-400 mx-3"
                :class="
                  errorResponseMessage === 'Invalid email format' ||
                  errorResponseMessage === 'Username is required'
                    ? 'text-red-400 shake'
                    : ''
                "
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg> -->
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
          </div>
          <small
            v-if="
              errorResponseMessage === 'Invalid email format' ||
              errorResponseMessage === 'Email is required'
            "
            class="text-red-400"
            >{{ errorResponseMessage }}</small
          >
          <div>
            <div class="flex items-center justify-end">
              <span @click="forgotPassword" class="text-gray-600 hover:text-gray-600 cursor-pointer">
                Forgot password?</span
              >
            </div>
            <div
              :class="
                errorResponseMessage === 'Invalid password!' ||
                errorResponseMessage === 'Password is required'
                  ? 'border border-red-500 shake'
                  : ''
              "
              class="flex items-center rounded-md px-3 bg-gray-50 text-gray-900 shadow-sm border placeholder:text-gray-400 outfit-subtext"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 482 512"
                fill="currentColor"
                class="h-9 w-9 px-2 text-[#D98757] rounded-md"
                :class="
                  errorResponseMessage === 'Invalid password!' ||
                  errorResponseMessage === 'Password is required'
                    ? 'text-red-400 shake'
                    : ''
                "
              >
                <path
                  d="M144 144l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0z"
                />
              </svg>
              <!-- <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-400 mx-3"
                :class="
                  errorResponseMessage === 'Invalid password!' ||
                  errorResponseMessage === 'Password is required'
                    ? 'text-red-400 shake'
                    : ''
                "
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd"
                />
              </svg> -->
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
          </div>
          <small
            v-if="
              errorResponseMessage === 'Invalid password!' ||
              errorResponseMessage === 'Password is required'
            "
            class="text-red-400"
            >{{ errorResponseMessage }}</small
          >
          <div>
            <button :disabled="loginButtonText === 'Logging into your account...'? true : false"
              type="submit"
              class="flex items-center justify-center w-full rounded-md bg-[#D98757] px-4 py-4 outfit-font font-bold leading-6 text-white shadow-sm hover:bg-[#D98757] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
               <svg
                 v-show="loginButtonText == 'Logging into your account...'"
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
            
              <div>{{ loginButtonText }}</div>
            </button>
          </div>
        </form>

        <p class="mt-10 text-center text-gray-500 outfit-subtext">
          Don't have an account?
          {{ " " }}
          <a
            @click="openRegister"
            class="cursor-pointer text-[#D98757] hover:text-[#D98757] font-bold"
            >Sign Up</a
          >
        </p>
      </div>
    </div>

    <!-- alert error-->
    <div
      v-show="isErrorResponseDisplay"
      :class="{
        'toast-animation-in': isErrorResponseDisplay,
        'toast-animation-out': isErrorResponseDisplayHide,
      }"
      role="alert"
      class="fixed w-[300px] top-10 left-4 rounded border-s-4 border-red-500 bg-red-50 p-4"
    >
      <div class="flex items-center gap-2 text-red-800">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="h-5 w-5"
        >
          <path
            fill-rule="evenodd"
            d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
            clip-rule="evenodd"
          />
        </svg>

        <strong class="block font-medium"> Something went wrong </strong>
      </div>

      <p class="mt-2 text-sm text-red-700">{{ errorResponseMessage }}</p>
    </div>
      <ChangePasswordComponent v-if="showPasswordModal" @closePasswordModal="closePasswordModal"/>
  </section>
</template>

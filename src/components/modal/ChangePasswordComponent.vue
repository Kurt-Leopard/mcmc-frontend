<template>
  <main>
    <section
      v-if="!success"
      class="min-h-screen bg-gray-100 flex items-center justify-center fixed top-0 left-0 border w-full z-30"
    >
      <div
        class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md w-full"
      >
        <h1 class="text-center text-2xl font-bold mb-6">Change Password</h1>
        <form @submit.prevent="submitChangePassword">
          <div class="mb-4">
            <label class="block text-gray-700 font-bold mb-2" for="email">
              Email Address
            </label>
            <input
              class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              v-model="email"
              placeholder="Enter your email address"
            />
          </div>
          <button
            :disabled="resetPassword === 'Sending...' ? true : false" :class="access? 'text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl  focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2':'bg-[#D98757]'"
            class="flex items-center justify-center text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            type="submit"
          >
            <svg
              v-show="resetPassword == 'Sending...'"
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

            {{ resetPassword }}
          </button>
        </form>
      </div>
    </section>

    <section
      v-else
      class="flex items-center justify-center bg-white h-screen fixed top-0 left-0 border w-full z-30"
    >
      <div
        class="w-[450px] rounded-lg flex items-center justify-center px-4 lg:px-6 xl:px-6 py-6 bg-white"
      >
        <div class="w-full">
          <!-- button -->
          <span v-html="arrowRightButton()" @click="closePasswordModal"></span>
          <img src="../../assets/logo.png" alt="logo" class="mx-auto mb-6" v-if="!access" />
          <img src="../../assets/cashflow.png" alt="logo" class="h-24 w-24 mx-auto mb-6" v-else />
          <form class="space-y-6" @submit.prevent="submitChange">
            <div class="flex items-center justify-between w-full">
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

            <div>
              <div
                class="flex items-center rounded-md bg-gray-50 text-gray-900 shadow-sm border placeholder:text-gray-400 outfit-subtext"
              >
                <div class="w-full">
                  <div class="flex items-center px-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 482 512"
                      fill="currentColor"
                      class="h-9 w-9 px-2 rounded-md"
                       :class="access? 'text-gray-500':'text-[#D98757]'"
                    >
                      <path
                        d="M144 144l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0z"
                      />
                    </svg>
                    <input
                      name="password"
                      type="password"
                      v-model="password"
                      class="block w-full py-3 px-2 m-1 ml-2 outline-none rounded-sm bg-gray-50"
                      placeholder="New Password"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div
                class="flex items-center rounded-md bg-gray-50 text-gray-900 shadow-sm border placeholder:text-gray-400 outfit-subtext"
              >
                <div class="w-full">
                  <div class="flex items-center px-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 482 512"
                      fill="currentColor"
                      class="h-9 w-9 px-2  rounded-md"
                      :class="access? 'text-gray-500':'text-[#D98757]'"
                    >
                      <path
                        d="M144 144l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0z"
                      />
                    </svg>
                    <input
                      name="password"
                      type="password"
                      v-model="newpassword"
                      class="block w-full py-3 px-2 m-1 ml-2 outline-none rounded-sm bg-gray-50"
                      placeholder="Confirm Password"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                :disabled="savingPassword === 'Saving...' ? true : false" :class="access? 'text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl  focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2':'bg-[#D98757]'"
                type="submit"
                class="flex items-center w-full justify-center rounded-md  px-4 py-4 font-bold leading-6 text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <svg
                  v-show="savingPassword == 'Saving...'"
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

                {{ savingPassword }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
    <Danger-Component
      :errors="[responseStatus, responseMessage]"
      @closeToast="closeToast"
    />
  </main>
</template>
<script setup>
import { arrowRightButton } from "../../assets/svg/button";
import { onMounted, ref } from "vue";
import axios from "../../../axios";
import { useAuthStore } from "../../stores/store";
import DangerComponent from "../toast/DangerComponent.vue";
import { fetchUser } from "../../composables/user";
const access = localStorage.getItem("access");

const emit = defineEmits(["closePasswordModal"]);
const closePasswordModal = () => {
  emit("closePasswordModal");
};
const success = ref(false);

const store = useAuthStore();
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
const email = ref("");
const password = ref("");
const newpassword = ref("");

const resetPassword = ref("Reset Password");
const savingPassword = ref("Save");
const submitChangePassword = async () => {
  resetPassword.value = "Sending...";
  try {
    const response = await axios.post("/user/change-password/", {
      email: email.value,
    });

    if (response.status === 200) {
      const data = {
        responseStatus: response.status,
        responseMessage: response.data.message,
      };
      resetPassword.value = "Reset Password";
      success.value = true;
      setTimeout(() => {
        store.setToastSuccess(data);
      }, 500);
    }
  } catch (error) {
    if (error.response) {
      responseStatus.value = error.response.status;
      responseMessage.value = error.response.data.message;
      resetPassword.value = "Reset Password";
    } else if (error.request) {
      responseStatus.value = 500;
      responseMessage.value =
        "No response received from the server. Please check your internet connection.";
      resetPassword.value = "Reset Password";
    } else if (error.message && error.message.includes("timeout")) {
      responseStatus.value = 500;
      responseMessage.value = "The request timed out. Please try again later.";
      resetPassword.value = "Reset Password";
    } else {
      responseStatus.value = 500;
      responseMessage.value = "An error ocured " + error.message;
      resetPassword.value = "Reset Password";
    }
  }
};

const submitChange = async () => {
  savingPassword.value = "Saving...";
  try {
    const pin = `${first.value}${second.value}${third.value}${fourth.value}${fifth.value}${sixth.value}`;
    const oneTimePassword = parseInt(pin);
    if (password.value === newpassword.value) {
      const data = {
        password: password.value,
        pin: oneTimePassword,
      };

      const response = await axios.post(
        `/user/submit-change-password/${store.user.id}`,
        data
      );

      if (response.status === 200) {
        const data = {
          responseStatus: response.status,
          responseMessage: response.data.message,
        };
        savingPassword.value = "Save";
        setTimeout(() => {
          store.setToastSuccess(data);
        }, 500);
      }
    } else {
      responseStatus.value = "500";
      responseMessage.value = "Password doesn't match";
      savingPassword.value = "Saving...";
    }
  } catch (error) {
    if (error.response) {
      responseStatus.value = error.response.status;
      responseMessage.value = error.response.data.message;
      savingPassword.value = "Saving...";
    } else if (error.request) {
      responseStatus.value = 500;
      responseMessage.value =
        "No response received from the server. Please check your internet connection.";
      savingPassword.value = "Saving...";
    } else if (error.message && error.message.includes("timeout")) {
      responseStatus.value = 500;
      responseMessage.value = "The request timed out. Please try again later.";
      savingPassword.value = "Saving...";
    } else {
      responseStatus.value = 500;
      responseMessage.value = "An error ocured " + error.message;
      savingPassword.value = "Saving...";
    }
  }
};
onMounted(async () => {
  await fetchUser();
});
</script>

<template>
  <div
    class="flex items-center justify-center fixed left-0 top-0 w-full h-full bg-white  z-30"
  >
    <form
      class="max-w-2xl mx-4 sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto mt-16 bg-white shadow-xl rounded-lg text-gray-900"
      @submit.prevent="updateProfile"
    >
      <div class="rounded-t-lg h-32 overflow-hidden">
        <img
          class="object-cover object-top w-full"
          src="../../assets/lgbg1.png"
          alt="bg"
        />
      </div>
      <div
        class="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden cursor-pointer"
        @click="triggerFileInput"
      >
        <img
          class="object-cover object-center h-32"
          :src="profileImage"
          alt="Profile Image"
        />
        <input
          type="file"
          ref="fileInput"
          @change="onFileChange"
          class="hidden"
        />
      </div>
      <div class="text-center mt-2 px-4">
        <h2 class="font-semibold">Edit your name</h2>
        <input
          v-model="fullname"
          class="text-gray-500 border w-full p-2 text-center rounded-lg"
          placeholder="Enter your name"
        />
      </div>

      <div
        class="p-4 border-t mx-8 gap-2 mt-2 flex items-center justify-between"
      >
        <button
          type="submit" :class="access? 'text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl  focus:outline-none  font-medium  text-sm px-5 py-2.5 text-center':'bg-[#D98757]'"
          class="w-1/2 block mx-auto rounded-full  hover:shadow-lg font-semibold text-white px-6 py-2"
        >
          {{textButton}}
        </button>
        <button
          type="button"
          @click="closeProfile"
          class="w-1/2 block mx-auto rounded-full border border-black hover:shadow-lg font-semibold px-6 py-2"
        >
          Close
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
import { onMounted, ref } from "vue";
import axios from "../../../axios";
import { fetchUser } from "../../composables/user";
import { useAuthStore } from "../../stores/store";
import DangerComponent from "../../components/toast/DangerComponent.vue";

const access = localStorage.getItem("access");
const emit = defineEmits(["closeProfile"]);
const closeProfile = () => {
  emit("closeProfile");
};
const closeToast = () => {
  responseStatus.value = null;
  responseMessage.value = "";
};
const textButton=ref("Save");
const responseStatus = ref(null);
const responseMessage = ref("");
const store = useAuthStore();
const fullname = ref(store.user.fullname); // Two-way binding
const profileImage = ref(
  `https://storage.googleapis.com/mcm-chuch.appspot.com/${store.user.profile}`
); // Default image
const selectedFile = ref(null); // For storing the selected file
const fileInput = ref(null); // Reference for file input

onMounted(async () => {
  await fetchUser();
});

// Trigger file input click
const triggerFileInput = () => {
  fileInput.value.click();
};

// Handle file selection
const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    profileImage.value = URL.createObjectURL(file); // Preview the selected image
  }
};

const updateProfile = async () => {
  textButton.value="Saving...";
  try {
    const formData = new FormData();
    formData.append("fullname", fullname.value);
    if (selectedFile.value) {
      formData.append("profile", selectedFile.value); // Append selected file
    }

    const response = await axios.put(
      `/user/update/${store.user.id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status === 200) {
      const data = {
        responseStatus: response.status,
        responseMessage: response.data.message,
      };

      store.setToastSuccess(data);
      textButton.value="Save";
    }
  } catch (error) {
    if (error.response) {
      responseStatus.value = error.response.status;
      responseMessage.value = error.response.data.message;
      textButton.value="Save";
    } else if (error.request) {
      responseStatus.value = 500;
      responseMessage.value =
        "No response received from the server. Please check your internet connection.";
        textButton.value="Save";
    } else if (error.message && error.message.includes("timeout")) {
      responseStatus.value = 500;
      responseMessage.value = "The request timed out. Please try again later.";
      textButton.value="Save";
    } else {
      responseStatus.value = 500;
      responseMessage.value = "An error occurred: " + error.message;
      textButton.value="Save";
    }
  }
};
</script>

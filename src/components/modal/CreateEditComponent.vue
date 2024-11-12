<script setup>
import { ref, watch, computed } from "vue";
import axios from "../../../axios";
import { getDate } from "../../composables/date";
import { useAuthStore } from "../../stores/store";
import { decodeJWT } from "../../stores/token";
import DangerComponent from "../../components/toast/DangerComponent.vue";
const emit = defineEmits(["buttonHideModal", "refreshData"]);
const props = defineProps({
  isModalShow: {
    type: Boolean,
    required: true,
  },
  sendBy: {
    type: String,
  },
  method: {
    type: String,
  },
  setDefault: {
    type: Object,
  },
  id: {
    type: String,
  },
});

// form
const heading = ref("");
const caption = ref("");
const images = ref([]);
const imagePreviews = ref([]);
const token = ref("");
const profile = ref(null);
const scripture = ref("");
const translation = ref("NIV");
const passage = ref("");
const loaderText = ref("");

const responseStatus = ref(null);
const responseMessage = ref("");
const supported_translation = ref([
  "CEB",
  "ESV",
  "KJV",
  "LEB",
  "MSG",
  "NIV",
  "NKJV",
  "NLT",
]);

const description_translation = ref([
  "Common English Bible (CEB)",
  "English Standard Version (ESV)",
  "King James Version (KJV)",
  "Lexham English Bible (LEB)",
  "The Message (MSG)",
  "New International Version (NIV)",
  "New King James Version (NKJV)",
  "New Living Translation (NLT)",
]);
let userId;
const closeToast = () => {
  responseStatus.value = null;
  responseMessage.value = "";
};

// store
let store = useAuthStore();

if (store.token) {
  token.value = decodeJWT(store.token);
}
const fetchUserProfile = () => {
  profile.value = store.getUser();
};

watch(
  () => props.isModalShow,
  (newVal) => {
    if (newVal) {
      fetchUserProfile();
    } else {
      profile.value = null; // Clear profile data when modal is hidden
    }
  }
);

//  hide modal gallery
const buttonHideModal = () => {
  emit("buttonHideModal");
  passage.value = "";
  scripture.value = "";
};

const handleFileChange = (event) => {
  images.value = Array.from(event.target.files);
  imagePreviews.value = [];

  for (let i = 0; i < images.value.length; i++) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreviews.value.push(e.target.result);
    };
    reader.readAsDataURL(images.value[i]);
  }
};

const submitForm = async () => {
  loaderText.value = props.method;
  userId = token.value.id;
  switch (props.sendBy) {
    case "gallery":
      if (props.method === "post") {
        const formData = new FormData();
        formData.append("user_id", userId);
        formData.append("heading", heading.value);
        formData.append("caption", caption.value);

        images.value.forEach((image) => {
          formData.append("images", image);
        });

        try {
          const response = await axios.post("/gallery", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (response.status === 200 || response.status === 201) {
            heading.value = "";
            caption.value = "";
            imagePreviews.value.length = 0;

            const data = {
              responseStatus: response.status,
              responseMessage: response.data.message,
            };
            store.setToastSuccess(data);
            emit("refreshData");
            emit("buttonHideModal", "GalleryPost");
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
            responseMessage.value =
              "The request timed out. Please try again later.";
          } else {
            responseStatus.value = 500;
            responseMessage.value = "An error occurred: " + err.message;
          }
        } finally {
          loaderText.value = "";
        }
      } else if (props.method === "put") {
        const formData = new FormData();
        formData.append("heading", heading.value);
        formData.append("caption", caption.value);

        images.value.forEach((image) => {
          formData.append("images", image);
        });

        try {
          const response = await axios.put(`/gallery/${props.id}`, formData, {
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
            emit("refreshData");
            emit("buttonHideModal");
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
            responseMessage.value =
              "The request timed out. Please try again later.";
          } else {
            responseStatus.value = 500;
            responseMessage.value = "An error occurred: " + err.message;
          }
        } finally {
          loaderText.value = "";
        }
      }
      break;
    case "event":
      if (props.method === "post") {
        const formData = new FormData();
        formData.append("user_id", userId);
        formData.append("heading", heading.value);
        formData.append("description", caption.value);
        images.value.forEach((image) => {
          formData.append("image", image);
        });
        try {
          const response = await axios.post("/events", formData, {
            headers: {
              "Content-Type": "multipart-form-data",
            },
          });

          if (response.status === 200 || response.status === 201) {
            heading.value = "";
            caption.value = "";
            imagePreviews.value.length = 0;

            const data = {
              responseStatus: response.status,
              responseMessage: response.data.message,
            };

            store.setToastSuccess(data);

            emit("refreshData");
            emit("buttonHideModal");
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
            responseMessage.value =
              "The request timed out. Please try again later.";
          } else {
            responseStatus.value = 500;
            responseMessage.value = "An error occurred: " + err.message;
          }
        } finally {
          loaderText.value = "";
        }
      } else if (props.method === "put") {
        const formData = new FormData();

        formData.append("heading", heading.value);
        formData.append("description", caption.value);
        images.value.forEach((image) => {
          formData.append("image", image);
        });
        try {
          const response = await axios.put(`/events/${props.id}`, formData, {
            headers: {
              "Content-Type": "multipart-form-data",
            },
          });

          if (response.status === 200 || response.status === 201) {
            const data = {
              responseStatus: response.status,
              responseMessage: response.data.message,
            };

            store.setToastSuccess(data);

            emit("refreshData");
            emit("buttonHideModal");
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
            responseMessage.value =
              "The request timed out. Please try again later.";
          } else {
            responseStatus.value = 500;
            responseMessage.value = "An error occurred: " + err.message;
          }
        } finally {
          loaderText.value = "";
        }
      }
      break;
    case "devotional":
      if (props.method === "post") {
        const data = {
          user_id: userId,
          translation: translation.value,
          verses: passage.value,
          reflection: caption.value,
        };

        try {
          const response = await axios.post("/devotional", data);

          if (response.status === 200 || response.status === 201) {
            scripture.value = "";
            passage.value = "";
            caption.value = "";

            const data = {
              responseStatus: response.status,
              responseMessage: response.data.message,
            };

            store.setToastSuccess(data);

            emit("refreshData");
            emit("buttonHideModal", "DevotionalPost");
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
            responseMessage.value =
              "The request timed out. Please try again later.";
          } else {
            responseStatus.value = 500;
            responseMessage.value = "An error occurred: " + err.message;
          }
        } finally {
          loaderText.value = "";
        }
      } else if (props.method === "put") {
        const data = {
          translation: translation.value,
          verses: passage.value,
          reflection: caption.value,
        };
        try {
          const response = await axios.put(`/devotional/${props.id}`, data);

          if (response.status === 200 || response.status === 201) {
            const data = {
              responseStatus: response.status,
              responseMessage: response.data.message,
            };

            store.setToastSuccess(data);

            emit("refreshData");
            emit("buttonHideModal");
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
            responseMessage.value =
              "The request timed out. Please try again later.";
          } else {
            responseStatus.value = 500;
            responseMessage.value = "An error occurred: " + err.message;
          }
        } finally {
          loaderText.value = "";
        }
      }
  }
};

watch(
  () => props.setDefault,
  (newValue, oldValue) => {
    if (props.method === "put") {
      heading.value = newValue.heading;
      caption.value =
        props.sendBy === "gallery"
          ? newValue.caption
          : props.sendBy === "event"
          ? newValue.description
          : newValue.reflection;
      passage.value = newValue.verses ? newValue.verses : null;
    }
  }
);
watch([scripture, translation], async ([newScripture, newTranslation]) => {
  if (newScripture && newTranslation) {
    try {
      const encodedReferences = encodeURIComponent(newScripture);
      const translation = newTranslation;

      const response = await axios(
        `/devotional/daily-bread?references=${encodedReferences}&translation=${encodeURIComponent(
          translation
        )}`
      );

      passage.value = response.data.scriptures;
    } catch (error) {
      console.log("Fetch error:", error);
    }
  } else {
    passage.value = "";
  }
});
</script>
<template>
  <div
    v-show="isModalShow"
    class="fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-white sm:bg-black sm:bg-opacity-50 md:bg-black md:bg-opacity-50 lg:bg-black lg:bg-opacity-50 xl:bg-black xl:bg-opacity-50 z-[101]"
  >
    <form v-if="profile" 
      @submit.prevent="submitForm"
      class="bg-white rounded-lg sm:shadow-lg md:shadow-lg lg:shadow-lg xl:shadow-lg w-full sm:w-[500px] h-screen sm:h-auto md:h-auto lg:h-auto xl:h-auto md:w-[500px] lg:w-[500px] xl:w-[500px]"
    >
      <div
        class="flex items-center justify-between p-4 border-b w-full font-bold text-center"
      >
        <div></div>
        <div class="text-lg">
          {{
            method === "post"
              ? "Create post"
              : method === "put"
              ? "Edit post"
              : ""
          }}
        </div>
        <div>
          <i
            @click="buttonHideModal"
            class="fas fa-times p-3 border rounded-lg hover:bg-gray-100"
          ></i>
        </div>
      </div>
      <section class="flex py-5 justify-center w-full h-full">
        <Danger-Component
          :errors="[responseStatus, responseMessage]"
          @closeToast="closeToast"
        />
        <div class="max-h-[580px] overflow-y-auto w-full">
          <div class="flex items-center px-4" v-if="store.token">
            <img 
              :src="`https://storage.googleapis.com/mcm-chuch.appspot.com/${profile.profile}`"
              class="rounded-full h-[45px] w-[45px] mr-4"
              loading="lazy"
            />
            <div>
              <div class="font-semibold">{{ profile.fullname }}</div>
              <small class="text-gray-500" v-if="method === 'put'"
                >Posted on {{ getDate(setDefault.posted_at) }}</small
              >
            </div>
          </div>
          <div class="px-4" v-if="sendBy === 'devotional'">
            <div class="w-full my-2">
              <small class="font-semibold">Passage</small>
              <input
                type="text"
                v-model="scripture"
                id="scripture"
                required
                class="mt-1 px-2 block outline-none w-full border-b border-gray-300 py-3"
                placeholder="Matthew7:12-14, John1:1"
              />
            </div>
            <div class="w-full my-2">
              <small class="font-semibold">Translation</small>
              <select
                name=""
                id=""
                v-model="translation"
                class="mt-1 block outline-none w-full border-b border-gray-300 py-3"
              >
                <option
                  v-for="(translation, index) in supported_translation"
                  :key="index"
                  :value="translation"
                >
                  {{ description_translation[index] }}
                </option>
              </select>
            </div>
          </div>
          <div class="px-4" v-if="sendBy !== 'devotional'">
            <input
              type="text"
              v-model="heading"
              id="heading"
              required
              class="mt-1 px-2 block outline-none w-full border-b border-gray-300 py-3"
              :placeholder="
                sendBy === 'event'
                  ? 'Enter a title for MCMC\'s event...'
                  : 'Enter a title for your post...'
              "
            />
          </div>
          <div class="px-4 py-3">
            <textarea
              v-model="caption"
              id="caption"
              required
              :class="passage ? 'h-14' : 'h-24'"
              class="mt-1 px-2 block outline-none w-full border-b border-gray-300 py-3"
              :placeholder="
                sendBy === 'devotional'
                  ? 'Share your insights and learning from today\'s devotion...'
                  : sendBy === 'event'
                  ? 'Enter a description for MCMC\'s event...'
                  : 'Share your thoughts, prayers, or updates here...'
              "
            ></textarea>
          </div>
          <!-- passage -->
          <div
            class="mx-4 py-2 max-h-[140px] overflow-y-auto element-with-horizontal-scroll py-2"
            v-if="passage"
          >
            <p v-for="(passage, index) in passage" :key="index" class="my-2">
              <span class="font-semibold text-sm mr-2">{{
                passage.reference
              }}</span>
              <small>{{ passage.text }}</small>
            </p>
          </div>
          <div
            class="mx-4 px-2 py-3 border rounded-lg max-h-[230px] overflow-y-auto element-with-horizontal-scroll"
            v-if="sendBy !== 'devotional'"
          >
            <input
              type="file"
              @change="handleFileChange"
              id="images"
              :multiple="sendBy !== 'event'"
              accept="image/*"
              class="opacity-0 h-[150px] absolute z-10"
            />
            <div
              for="images"
              class="relative cursor-pointer w-full h-[110px] sm:h-[150px] md:h-[150px] lg:h-[150px] xl:h-[150px] bg-gray-50 hover:bg-gray-100 flex items-center justify-center rounded-lg"
            >
              <div class="absolute top-center mt-5 text-center">
                <i
                  class="fas fa-images bg-gray-200 rounded-full p-3 text-[18px] text-center"
                ></i>
                <h1 class="font-semibold">Add photos</h1>
                <small class="text-gray-500">or drag and drop</small>
              </div>
            </div>

            <!-- Image previews -->
            <div
              :class="
                sendBy === 'event'
                  ? 'mt-2 gap-2'
                  : 'mt-2 grid grid-cols-3 gap-2'
              "
            >
              <div v-for="(image, index) in imagePreviews" :key="index">
                <img
                  :src="image"
                  :class="
                    sendBy === 'event'
                      ? 'w-full object-cover rounded-md'
                      : 'w-full h-24 object-cover rounded-md'
                  "
                  v-if="image"
                  alt="Preview"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
          <div class="w-full px-4 py-3">
            <button
              :disabled="loaderText === '' ? false : true"
              type="submit"
            
              class="bg-[#D98757] hover:bg-[#D98757] w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D98757]"
            >
              <svg
                v-if="loaderText"
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
              {{
                loaderText === ""
                  ? method === "post"
                    ? "Post"
                    : method === "put"
                    ? "Save"
                    : ""
                  : loaderText === "post"
                  ? "Please wait..."
                  : "Saving changes..."
              }}
            </button>
          </div>
        </div>
      </section>
    </form>
  </div>
</template>
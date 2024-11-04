<template>
  <div
    class="px-4 inset-x-0 flex flex-row items-center justify-center w-full md:w-[600px] lg:w-[600px] xl:w-[600px] mx-auto relative bottom-0"
  >
    <div
      v-show="showIndex"
      class="fixed left-0 top-0 md:left-auto lg:left-auto xl:left-auto shadow-lg bg-white rounded-sm w-full md:w-[600px] lg:w-[600px] xl:w-[600px] flex flex-col h-screen overflow-y-auto overflow-x-hidden element-with-horizontal-scroll"
    >
      <nav class="flex justify-end px-4">
        <button
          class="px-4 py-2 bg-gray-100 rounded-lg my-3"
          @click="buttonHideshowModalComment(index)"
        >
          &times;
        </button>
      </nav>
      <main
        class="border h-[500px] overflow-y-auto overflow-x-hidden element-with-horizontal-scroll"
        ref="scrollContainer"
      >
        <div
          class="p-3 my-1 toast-animation-in"
          v-for="(comment, index) in comments"
          :key="comment.id"
        >
          <section class="flex">
            <img
              :src="`https://storage.googleapis.com/mcm-chuch.appspot.com/${comment.profile}`"
              :alt="`profile${index}`"
              class="h-10 w-10 rounded-full mr-2"
            />
            <nav class="bg-gray-50 w-full p-3 rounded-xl">
              <div class="flex items-center justify-between">
                <p class="font-semibold">{{ comment.fullname }}</p>
                <nav class="flex items-center">
                  <p class="text-xs text-gray-500">
                    {{ relativeTime(comment.created_at) }}
                  </p>
                </nav>
              </div>
              <small v-html="highlightMentions(comment.comment)"></small>
              <br />
              <small
                class="text-blue-500 cursor-pointer"
                @click="mention(comment.fullname, comment.user_id)"
                >reply
              </small>
            </nav>
          </section>
          <section class="flex items-center justify-end">
            <i
              v-if="tokenId === comment.user_id"
              class="fas fa-edit text-sm mt-1 px-2 text-gray-300 hover:text-gray-500"
              @click="buttonEditComment(comment.id, 'put', comment.comment)"
            ></i>
            <i
              v-if="tokenId === comment.user_id"
              class="fas fa-trash text-sm mt-1 px-2 text-gray-300 hover:text-gray-500"
              @click="buttonDeleteComment(comment.id, 'deleteComment')"
            ></i>
          </section>
        </div>
        <div
          class="flex items-center justify-center h-full w-full text-center"
          v-if="comments.length === 0"
        >
          <ul>
            <i
              class="fas fa-comments combined-icon text-[150px] text-gray-100"
            ></i>

            <p class="font-semibold my-2">No comments yet.</p>
          </ul>
        </div>
      </main>
      <form
        @submit.prevent="buttonSendComment(id, userID)"
        class="px-4 md:pl-4 lg:pl-4 xl:pl-4 fixed left-0 bottom-5 md:left-auto lg:left-auto xl:left-auto bg-white rounded-sm w-full md:w-[600px] lg:w-[600px] xl:w-[600px] flex items-center justify-center"
      >
        <input
          v-model="comment"
          class="w-full outline-none border rounded-lg p-3"
          placeholder="Write a comment here..."
        />
        <button type="submit">
          <i
            class="fas fa-paper-plane bg-orange-500 p-3 ml-2 rounded-lg text-white"
          ></i>
        </button>
      </form>
    </div>
    <Delete-Component
      :isDeleteModalShow="isDeleteModalShow"
      :sendBy="sendBy"
      :id="id"
      @refreshData="refreshData"
      @cancelButtonShowDeleteModal="cancelButtonShowDeleteModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import axios from "../../../axios";
import { relativeTime } from "../../composables/relativeTime";
import DeleteComponent from "../../components/modal/DeleteComponent.vue";
import { useAuthStore } from "../../stores/store";
import { fetchUser } from "../../composables/user";

const store = useAuthStore();

const emit = defineEmits(["buttonHideshowModalComment"]);

const props = defineProps({
  showIndex: {
    type: Boolean,
  },
  index: {
    type: Number,
  },
  id: {
    type: String,
  },
  userID: {
    type: String,
  },
  tokenId: {
    type: String,
  },
});

const comment = ref("");
const comments = ref([]);
const scrollContainer = ref(null);
const intervalId = ref(null);
const type = ref("");
const id = ref();

// detelet properties
const isDeleteModalShow = ref(false);
const sendBy = ref();

const buttonHideshowModalComment = (index) => {
  emit("buttonHideshowModalComment", index);
};

const user_1 = ref("");
const user_2 = ref("");
const notify_event_id = ref("");
const typeOf = ref("events");
const mention = (name, user_id) => {
  user_1.value = store.user.id;
  user_2.value = user_id;
  notify_event_id.value = props.id;
  console.log(store.user.id);
  comment.value = `@${name} `;
};
const highlightMentions = (text) => {
  return text.replace(/@(\w+)/g, (match, username) => {
    return `<span class="text-blue-500">${match}</span>`;
  });
};
const buttonEditComment = (Id, typed, commented) => {
  id.value = Id;
  type.value = typed;
  comment.value = commented;
};
const buttonDeleteComment = (Id, sendby) => {
  isDeleteModalShow.value = true;
  sendBy.value = sendby;
  id.value = Id;
};
const cancelButtonShowDeleteModal = () => {
  isDeleteModalShow.value = false;
};
const buttonSendComment = async (event_id, user_id) => {
  console.log(type.value);
  if (type.value !== "put") {
    const data = {
      event_id: props.id,
      user_id: props.userID,
      comment: comment.value,
      user_1: user_1.value,
      user_2: user_2.value,
      notify_event_id: notify_event_id.value,
      type: typeOf.value,
    };
    try {
      const response = await axios.post("/api/comment", data);

      if (response.status === 200) {
        refreshData();
        setTimeout(() => {
          scroolToBottom();
        }, 300);
        fetch(`http://localhost:4000/api/announcements/${user_2.value}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Specify the content type
          },
          body: JSON.stringify({
            title: user_1.value,
            description: comment.value,
          }),
        });
        comment.value = "";
      }
    } catch (error) {
      alert(error.response);
    }
  } else {
    const data = {
      comment: comment.value,
    };
    try {
      const response = await axios.put(`/api/comment/${event_id}`, data);

      if (response.status === 200) {
        refreshData();
        setTimeout(() => {
          scroolToBottom();
        }, 300);
        comment.value = "";
        type.value = "";
      }
    } catch (error) {
      alert(error.response);
    }
  }
};
const scroolToBottom = async () => {
  await nextTick();
  scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
};
// start at the bottom
watch(
  () => props.showIndex,
  (newVal, oldVal) => {
    if (newVal) {
      scroolToBottom();
    }
  }
);

const refreshData = async () => {
  try {
    const response = await axios.get(`/api/comment/${props.id}`);
    if (response.status === 200) {
      comments.value = response.data.results;
      scroolToBottom();
    }
  } catch (error) {
    if (error.response.status === 404) {
      console.log(error.response.data.message);
      comments.value = [];
    }
  }
};

const updateRelativeTime = () => {
  comments.value = comments.value.map((comment) => ({
    ...comment,
    relativeTime: relativeTime(comment.created_at),
  }));
};

onMounted(async () => {
  refreshData();
  await fetchUser();
  intervalId.value = setInterval(updateRelativeTime, 60000); // Update every minute
});

onUnmounted(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
});
</script>

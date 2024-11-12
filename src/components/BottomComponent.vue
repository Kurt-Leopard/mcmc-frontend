<script setup>
import { useAuthStore } from "@/stores/store";
import { computed, onMounted, ref, watch, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import axios from "../../axios";
import { relativeTime } from "../composables/relativeTime";
import { accessRole, fetchUser } from "../composables/user";
import SwitchLoaderComponent from "./leader/LoaderComponent.vue";
import { io } from "socket.io-client";
import { decodeJWT } from "../stores/token";
const store = useAuthStore();
const user = ref("");
if (store) {
  user.value = decodeJWT(store.token);
}
const role = ref("");
const router = useRouter();
let unreadCount = ref(0);
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
const logout = async () => {
  try {
    const response = await axios.put(`/api/logout/${store.user.id}`);
    if (response.status === 200) {
      sessionStorage.removeItem("accessRole");
      location.reload();
    }
  } catch (error) {
    if (error.response) {
      alert(error.response.data.data);
    }
  }
};

const canDisplayLink = computed(() => {
  return (
    role.value.role !== "member" &&
    role.value.role !== "admin" &&
    role.value.role !== null &&
    role.value.role !== undefined
  );
});
const isSwitch = ref(localStorage.getItem("access"));
const switchLoader = ref(false);

const switching = async () => {
  switchLoader.value = true; // Start loader
  try {
    const response = await axios.post(`/switching`, { role: role.value.role });

    if (response.status === 200) {
      localStorage.setItem("access", response.data.access);
      setTimeout(() => {
        location.reload();

        switchLoader.value = false;
      }, 2000);
    }
  } catch (error) {
    switchLoader.value = false;
    if (error.response) {
      console.log(error.response.data.message);
    } else {
      console.log("Error:", error.message);
    }
  }
};

const Closeswitching = () => {
  localStorage.removeItem("access");
  isSwitch.value = !isSwitch.value;
  location.reload();
};
// notification
const isNotification = ref(false);
const buttonNotification = () => {
  isNotification.value = true;
};
const closeNotification = () => {
  isNotification.value = false;
};
const notify = ref([]);
const refreshData = async () => {
  const response = await axios.get(`/api/notification/${store.user.id}`);

  try {
    if (response.status === 200) {
      notify.value = response.data.data;

      unreadCount.value = notify.value.filter((n) => n.is_read === 0).length;
    }
  } catch (error) {
    console.log(response.data.message);
  }
};

const goTo = async (type, notification_id) => {
  isNotification.value = false;
  if (type === "events") {
    localStorage.removeItem("access");

    router.push({ path: "/view/events" });
    try {
      const response = await axios.put(
        `/api/notification-update/${notification_id}`
      );

      if (response.status === 200) {
      
        refreshData();
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.message);
      } else {
        console.log("Error:", error.message);
      }
    }
  }
};
const socket = io("https://mcmc-socket.onrender.com");
const refresh = ref(false);
onMounted(() => {
  socket.on("announcement", (announcement) => {
    if (announcement.userid === user.value.id) {
      refreshData();
      refresh.value = true;
    }
  });
});
onUnmounted(() => {
  socket.off("announcement");
});

onMounted(async () => {
  await accessRole();
  role.value = store.getRole();
  await fetchUser();
  refreshData();
});
</script>
<template>
  <main>
    <SwitchLoaderComponent v-if="switchLoader" style="z-index: 100%" />
    <header
      class="fixed bottom-0 left-0 z-12 py-2 flex items-center justify-between px-4 bg-white border-t shadow-lg w-full"
    >
      <RouterLink
        v-show="store.getToken()"
        to="/"
        class="w-full flex items-center justify-center"
        ><img
          :src="`https://storage.googleapis.com/mcm-chuch.appspot.com/${store.user.profile}`"
          alt="avatar"
          class="h-[45px] w-[45px] rounded-full"
          loading="lazy"
      /></RouterLink>
      <a
        @click="buttonNotification"
        v-show="store.getToken()"
        class="w-full flex items-center justify-center text-gray-600 hover:text-gray-800 "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M6.429 2.413a.75.75 0 0 0-1.13-.986l-1.292 1.48a4.75 4.75 0 0 0-1.17 3.024L2.78 8.65a.75.75 0 1 0 1.5.031l.056-2.718a3.25 3.25 0 0 1 .801-2.069z"
          />
          <path
            fill="currentColor"
            fill-rule="evenodd"
            d="M6.237 7.7a4.214 4.214 0 0 1 4.206-3.95H11V3a1 1 0 1 1 2 0v.75h.557a4.214 4.214 0 0 1 4.206 3.95l.221 3.534a7.376 7.376 0 0 0 1.308 3.754a1.617 1.617 0 0 1-1.135 2.529l-3.407.408V19a2.75 2.75 0 1 1-5.5 0v-1.075l-3.407-.409a1.617 1.617 0 0 1-1.135-2.528a7.377 7.377 0 0 0 1.308-3.754zm4.206-2.45a2.714 2.714 0 0 0-2.709 2.544l-.22 3.534a8.877 8.877 0 0 1-1.574 4.516a.117.117 0 0 0 .082.183l3.737.449c1.489.178 2.993.178 4.482 0l3.737-.449a.117.117 0 0 0 .082-.183a8.876 8.876 0 0 1-1.573-4.516l-.221-3.534a2.714 2.714 0 0 0-2.709-2.544zm1.557 15c-.69 0-1.25-.56-1.25-1.25v-.75h2.5V19c0 .69-.56 1.25-1.25 1.25"
            clip-rule="evenodd"
          />
          <path
            fill="currentColor"
            d="M17.643 1.355a.75.75 0 0 0-.072 1.058l1.292 1.48a3.25 3.25 0 0 1 .8 2.07l.057 2.717a.75.75 0 0 0 1.5-.031l-.057-2.718a4.75 4.75 0 0 0-1.17-3.024l-1.292-1.48a.75.75 0 0 0-1.058-.072"
          />
        </svg>
        <div
          v-if="unreadCount !== 0"
          :class="
            unreadCount === 0
              ? ''
              : 'rounded-full bg-red-500 w-4 h-4 flex items-center justify-center text-[10px] text-white'
          "
        >
          {{ unreadCount }}
        </div>
      </a>
      <!-- modal notification -->
      <section
        v-if="isNotification"
        class="fixed left-0 bottom-0 border w-full bg-white text-left p-3 z-10 max-h-[300px] overflow-y-auto rounded-md shadow-md animate-slide-in-notificatication"
      >
        <h1
          class="flex items-center justify-between text-gray-700 border-b pb-2 text-center font-semibold"
        >
          <p>Notifications</p>
          <button class="text-xl" @click="closeNotification">&times;</button>
        </h1>
        <section
          @click="goTo(notification.type, notification.notification_id)"
          class="inline-block p-2 hover:bg-gray-50 cursor-pointer flex items-center justify-center w-full gap-4"
          v-for="(notification, index) in notify"
          :key="index"
        >
          <img
            :src="`https://storage.googleapis.com/mcm-chuch.appspot.com/${notification.profile}`"
            loading="lazy"
            role="presentation"
            alt=""
            class="h-[30px] w-[30px] rounded-full"
          />
          <div class="w-full">
            <div class="italic text-gray-500 text-xs">
              {{ notification.user_2_username }} replied to your comment.
            </div>
            <div class="flex items-center justify-between">
              <small class="italic">{{ notification.heading }} Events</small
              ><small class="italic text-xs text-gray-500">{{
                relativeTime(notification.created_at)
              }}</small>
              <small
                v-if="notification.is_read === 0"
                class="p-1 bg-green-500 rounded-full"
              ></small>
            </div>
          </div>
        </section>
      </section>
      <a
        v-if="role.role === 'leader'"
        class="w-full flex items-center justify-center text-gray-600 hover:text-gray-800 "
      >
        <svg
          v-if="!isSwitch"
          v-show="canDisplayLink"
          @click="switching"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
        <svg
          v-else
          v-show="canDisplayLink"
          @click="Closeswitching"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
      </a>
      <!-- parametre -->
      <a
        v-if="store.getToken()"
        class="relative w-full flex items-center justify-center text-gray-600 hover:text-gray-800  group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M19.9 12.66a1 1 0 0 1 0-1.32l1.28-1.44a1 1 0 0 0 .12-1.17l-2-3.46a1 1 0 0 0-1.07-.48l-1.88.38a1 1 0 0 1-1.15-.66l-.61-1.83a1 1 0 0 0-.95-.68h-4a1 1 0 0 0-1 .68l-.56 1.83a1 1 0 0 1-1.15.66L5 4.79a1 1 0 0 0-1 .48L2 8.73a1 1 0 0 0 .1 1.17l1.27 1.44a1 1 0 0 1 0 1.32L2.1 14.1a1 1 0 0 0-.1 1.17l2 3.46a1 1 0 0 0 1.07.48l1.88-.38a1 1 0 0 1 1.15.66l.61 1.83a1 1 0 0 0 1 .68h4a1 1 0 0 0 .95-.68l.61-1.83a1 1 0 0 1 1.15-.66l1.88.38a1 1 0 0 0 1.07-.48l2-3.46a1 1 0 0 0-.12-1.17ZM18.41 14l.8.9l-1.28 2.22l-1.18-.24a3 3 0 0 0-3.45 2L12.92 20h-2.56L10 18.86a3 3 0 0 0-3.45-2l-1.18.24l-1.3-2.21l.8-.9a3 3 0 0 0 0-4l-.8-.9l1.28-2.2l1.18.24a3 3 0 0 0 3.45-2L10.36 4h2.56l.38 1.14a3 3 0 0 0 3.45 2l1.18-.24l1.28 2.22l-.8.9a3 3 0 0 0 0 3.98m-6.77-6a4 4 0 1 0 4 4a4 4 0 0 0-4-4m0 6a2 2 0 1 1 2-2a2 2 0 0 1-2 2"
          />
        </svg>
        <section
          class="absolute right-0 bottom-6 border w-[220px] bg-white text-left p-3 rounded-md shadow-md hidden group-hover:block"
        >
          <h1 class="text-gray-700 border-b pb-2 text-center font-semibold">
            Settings
          </h1>
          <RouterLink
            class="inline-block p-2 hover:bg-gray-50 cursor-pointer w-full"
            to="/view/profile"
          >
            Profile
          </RouterLink>
          <section class="p-2 hover:bg-gray-50 cursor-pointer" @click="logout">
            Logout
          </section>
        </section>
      </a>
      <a
        class="w-full flex items-center justify-center text-gray-600 hover:text-gray-800 "
      >
        <svg
          @click="scrollToTop"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
          />
        </svg>
      </a>
    </header>
  </main>
</template>

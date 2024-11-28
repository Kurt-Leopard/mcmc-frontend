<script setup>
import { ref, onMounted, watchEffect, computed, inject, watch } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/store";
import { fetchUser } from "@/composables/user";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import SuccessComponent from "../components/toast/SuccessComponent.vue";
import SwitchLoaderComponent from "./leader/LoaderComponent.vue";
import { accessRole } from "../composables/user";
import axios from "../../axios";
import { relativeTime } from "../composables/relativeTime";

import { useRoute } from "vue-router";

const route = useRoute();
const currentPath = ref(route.path);

function pathRefresh() {
  console.log(currentPath.value);
}

watch(
  () => route.path,
  (newPath) => {
    currentPath.value = newPath;
    pathRefresh();
  }
);
const store = useAuthStore();
const role = ref("");
const router = useRouter();
const showbar = ref(false);
const closebar = ref(false);
const slideAnimation = ref(false);
const showScrollButton = ref(false);
const loginVisible = ref(false);
const registerVisible = ref(false);
const accessToken = ref(localStorage.getItem("access"));
let unreadCount = ref(0);
const responseStatus = ref(null);
const responseMessage = ref("");

const onScroll = () => {
  showScrollButton.value = window.scrollY > 10;
};

const btnMenu = () => {
  closebar.value = false;
  showbar.value = true;
};

const closeMenu = () => {
  closebar.value = true;
  setTimeout(() => {
    showbar.value = false;
  }, 150);
};

const goTologin = () => {
  slideAnimation.value = false;
  loginVisible.value = true;
};
const openLogin = (status) => {
  loginVisible.value = status;
  registerVisible.value = false;
};
const hideLogin = () => {
  slideAnimation.value = true;
};

// register
const openRegister = (status) => {
  loginVisible.value = false;
  registerVisible.value = status;
};
const hideRegister = (status) => {
  slideAnimation.value = true;
  loginVisible.value = true;
  registerVisible.value = status;
};

const closeToast = () => {
  responseStatus.value = null;
  responseMessage.value = "";
  store.clearToast();
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

// route to home
const routeTo = (token, routeName) => {
  if (token) {
    switch (routeName) {
      case "home":
        router.push({ path: "/view/home" });
        break;
      case "about":
        router.push({ path: "/view/about" });
        break;
      case "contact":
        router.push({ path: "/view/contact" });
        break;
      case "gallery":
        router.push({ path: "/view/gallery" });
        break;
      case "events":
        router.push({ path: "/view/events" });
        break;
    }
  } else {
    switch (routeName) {
      case "home":
        router.push({ path: "/" });
        break;
      case "about":
        router.push({ path: "/about" });
        break;
      case "contact":
        router.push({ path: "/contact" });
        break;
      case "gallery":
        router.push({ path: "/gallery" });
        break;
      case "events":
        router.push({ path: "/events" });
        break;
    }
  }
  closebar.value = true;
  setTimeout(() => {
    showbar.value = false;
  }, 200);
};

// listening to the chnages of value of store toast
watchEffect(() => {
  let res = store.getToastSuccess();

  if (res.length) {
    responseStatus.value = res[0].responseStatus;
    responseMessage.value = res[0].responseMessage;
  }
});
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

const notify = ref([]);
const refreshData = async () => {
  const response = await axios.get(`/api/notification/${store.user.id}`);

  try {
    if (response.status === 200) {
      notify.value = response.data.data;

      unreadCount.value = notify.value.filter((n) => n.is_read === 0 && n.statusRead!==1).length;
    }
  } catch (error) {
    console.log(response.data.message);
  }
};

const goTo = async (type, notification_id, user_1) => {
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
  } else if(type==='event announcement'){
     localStorage.removeItem("access");
     router.push({ path: "/view/events" });
     try {
      const response = await axios.post(
        `/api/notification-read/${notification_id}`,{userId:store.user.id}
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
const refresh = inject("refresh");
watch(refresh, async (newValue) => {
  if (newValue) {
    await refreshData();
    refresh.value = false;
  }
});
// Ensure fetchUser is properly awaited
onMounted(async () => {
  await accessRole();
  role.value = store.getRole();
  await fetchUser();
  refreshData();
  window.addEventListener("scroll", onScroll);
});
</script>

<template>
  <main>
    <RegisterView
      @hide="hideRegister"
      @openLogin="openLogin"
      v-show="registerVisible"
      class="fixed w-full top-0 left-0 animate-slide-in-login"
      :class="slideAnimation ? 'animate-slide-out-login' : ''"
      style="z-index: 101"
    />

    <LoginView
      v-show="loginVisible"
      @hide="hideLogin"
      @openRegister="openRegister"
      class="fixed w-full top-0 left-0 animate-slide-in-login"
      :class="slideAnimation ? 'animate-slide-out-login' : ''"
      style="z-index: 101"
    />
    <header
      :class="
        showScrollButton
          ? 'border-b shadow-b-sm lg:border-0 lg:border-b-0 lg:shadow-none'
          : ''
      "
      class="fixed top-0 left-0 z-30 bg-white flex justify-between py-3 px-4 lg:px-[50px] xl:px-32 w-full"
    >
      <section class="flex items-center">
        <img
          src="../assets/logo.png"
          alt="Company Logo"
          loading="lazy"
          class="block w-14 h-14"
        />

        <!-- loader animate -->
        <!-- <div class="w-14 h-14 rounded-full bg-gray-200 animate-pulse"></div> -->
        <div class="px-6">
          <h1
            class="text-sm text-gray-600 hover:text-gray-800 font-bold tracking-[7px]"
          >
            MCM-CHURCH
          </h1>

          <h3 class="text-xs text-gray-600 hover:text-gray-800">
            Glorify-Nurture-Equip-Expand
          </h3>
        </div>
      </section>
      <section
        class="hidden lg:flex xl:flex items-center justify-end gap-8"
        :class="store.getToken() ? '' : 'w-[74%]'"
      >
        <RouterLink
          :to="store.getToken() ? '/view/home' : '/'"
          :class="`text-xs font-bold ${currentPath === '/' || currentPath==='/view/home'? 'text-[#D98757]':'text-gray-600 hover:text-gray-800'}`"
          >HOME</RouterLink
        >
        <RouterLink
          :to="store.getToken() ? '/view/about' : '/about'"
          :class="`text-xs  font-bold ${currentPath === '/about' || currentPath==='/view/about'
              ? 'text-[#D98757]'
              : 'text-gray-600 hover:text-gray-800'
          }`"
          >ABOUT US</RouterLink
        >
        <RouterLink
          :to="store.getToken() ? '/view/contact' : '/contact'"
           :class="`text-xs  font-bold ${currentPath === '/contact' || currentPath ==='/view/contact'
              ? 'text-[#D98757]'
              : 'text-gray-600 hover:text-gray-800'
          }`"
          >CONTACT</RouterLink
        >
        <RouterLink
          :to="store.getToken() ? '/view/gallery' : '/gallery'"
           :class="`text-xs  font-bold ${currentPath === '/gallery' || currentPath === '/view/gallery'
              ? 'text-[#D98757]'
              : 'text-gray-600 hover:text-gray-800'
          }`"
          >GALLERY</RouterLink
        >
        <RouterLink
          :to="store.getToken() ? '/view/events' : '/events'"
           :class="`text-xs  font-bold ${currentPath === '/events' || currentPath ==='/view/events'
              ? 'text-[#D98757]'
              : 'text-gray-600 hover:text-gray-800'
          }`"
          >CHURCH EVENTS</RouterLink
        >
      </section>
      <div
        :class="
          store.getToken()
            ? 'flex items-center justify-end sm:space-x-4 md:space-x-4 lg:space-x-4 xl:space-x-4 -full'
            : 'flex items-center justify-end'
        "
      >
        <a
          v-show="store.getToken()"
          class="relative text-gray-600 hover:text-gray-800 group flex hidden md:flex lg:flex xl:flex"
        >
          <svg
            class="hidden md:block lg:block xl:block"
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

          <!--  -->
          <section
            class="absolute right-0 top-6 border w-[350px] max-h-[500px] overflow-y-auto bg-white text-left p-3 rounded-md shadow-md hidden group-hover:block"
          >
            <h1 class="text-gray-700 border-b pb-2 text-center font-semibold">
              Notifications
            </h1>
            <section
              @click="goTo(notification.type, notification.notification_id, notification.user_1)"
              class="inline-block p-2 hover:bg-gray-50 cursor-pointer flex items-center justify-center w-full gap-4"
              v-for="(notification, index) in notify"
              :key="index"
            >
              <img
                :src="`https://storage.googleapis.com/mcm-chuch.appspot.com/${notification.profile}`"
                loading="lazy"
                role="presentation"
                alt=""
                class="h-[30px] w-[30px] rounded-full hidden md:block lg:block xl:block"
              />
              <div class="w-full">
                <div class="italic text-gray-500 text-xs">
                  {{ notification.user_2_username }} {{ notification.type==='event announcement'? 'posted a new event schedule':'replied to your comment.'}}
                </div>
                <div class="flex items-center justify-between">
                  <small class="italic">{{ notification.heading }}  {{ notification.type==='event announcement'? 'posted a new event schedule':'Events.'}}</small
                  ><small class="italic text-xs text-gray-500">{{
                    relativeTime(notification.created_at)
                  }}</small>
                   <small
                    v-if="notification.is_read === 0 && notification.statusRead!==1"
                    class="p-1 bg-green-500 rounded-full"
                  ></small>
               
                </div>
              </div>
            </section>
          </section>
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

        <!-- settings -->
        <a
          v-show="store.getToken()"
          class="relative text-gray-600 hover:text-gray-800 group"
        >
          <svg
            class="hidden md:block lg:block xl:block"
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
            class="absolute right-0 top-6 border w-[220px] bg-white text-left p-3 rounded-md shadow-md hidden group-hover:block"
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
            <section
              class="p-2 hover:bg-gray-50 cursor-pointer"
              @click="logout"
            >
              Logout
            </section>
          </section>
        </a>
        <a v-if="canDisplayLink" class="text-gray-600 hover:text-gray-800">
          <svg
            v-if="!isSwitch"
            v-show="canDisplayLink"
            @click="switching"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6 hidden md:block lg:block xl:block"
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
            class="size-6 hidden md:block lg:block xl:block"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </a>
        <RouterLink v-show="store.getToken()" to="/view/profile"
          ><img
            :src="`https://storage.googleapis.com/mcm-chuch.appspot.com/${store.user.profile}`"
            loading="lazy"
            role="presentation"
            alt=""
            class="h-[45px] w-[45px] rounded-full hidden md:block lg:block xl:block"
        /></RouterLink>

        <a class="flex lg:hidden xl:hidden items-center justify-center">
          <svg
            @click="btnMenu"
            v-if="!showbar"
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8 mb-1 md:mb-0 lg:mb-0 xl:mb-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
          <svg
            v-show="showbar"
            @click="closeMenu"
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8 mb-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </a>
      </div>
      <!-- sm side bar -->

      <section
        class="block lg:hidden xl:hidden bg-white h-screen fixed top-0 left-0 shadow-lg z-50"
        v-show="showbar"
        :class="{ 'animate-slide-in': showbar, 'animate-slide-out': closebar }"
      >
        <div class="flex items-center py-3 px-4">
          <img
            src="../assets/logo.png"
            alt="Company Logo"
            loading="lazy"
            class="block w-14 h-14"
          />
          <div class="px-6">
            <h1 class="font-semibold text-sm text-slate-900 tracking-[7px]">
              MCM-CHURCH
            </h1>
            <h3 class="text-xs text-slate-800">Glorify-Nurture-Equip-Expand</h3>
          </div>
        </div>
        <div
          class="block px-4 py-3 bg-[#D98757] cursor-pointer"
          @click="routeTo(store.getToken(), 'home')"
        >
          <i
            class="fas fa-home p-3 bg-gray-100 rounded-lg text-[#D98757] mr-4"
          ></i>
          <a class="text-xs font-semibold text-white">HOME</a>
        </div>

        <div
          class="block px-4 py-3 navhover cursor-pointer"
          @click="routeTo(store.getToken(), 'about')"
        >
          <i
            class="fas fa-user p-3 bg-gray-100 rounded-lg text-[#D98757] mr-4"
          ></i>
          <a class="text-xs font-semibold subtext text-gray-600">ABOUT US</a>
        </div>
        <div
          class="block px-4 py-3 navhover cursor-pointer"
          @click="routeTo(store.getToken(), 'contact')"
        >
          <i
            class="fas fa-envelope p-3 bg-gray-100 rounded-lg text-[#D98757] mr-4"
          ></i>
          <a class="text-xs font-semibold subtext text-gray-600">CONTACT</a>
        </div>
        <div
          class="block px-4 py-3 navhover cursor-pointer"
          @click="routeTo(store.getToken(), 'gallery')"
        >
          <i
            class="fas fa-images p-3 bg-gray-100 rounded-lg text-[#D98757] mr-4"
          ></i>
          <a class="text-xs font-semibold subtext text-gray-600">GALLERY</a>
        </div>
        <div
          class="block px-4 py-3 navhover cursor-pointer"
          @click="routeTo(store.getToken(), 'events')"
        >
          <i
            class="fas fa-calendar-alt p-3 bg-gray-100 rounded-lg text-[#D98757] mr-4"
          ></i>
          <a class="text-xs font-semibold subtext text-gray-600"
            >CHURCH EVENTS</a
          >
        </div>
        <div
          class="block px-4 py-3 navhover cursor-pointer"
          @click="goTologin"
          v-if="!store.getToken()"
        >
          <i
            class="fas fa-calendar-alt p-3 bg-gray-100 rounded-lg text-[#D98757] mr-4"
          ></i>
          <a class="text-xs font-semibold subtext text-gray-600"
            >SIGN IN / SIGN UP</a
          >
        </div>
      </section>
    </header>
    <RouterView />
    <!-- toast success -->
    <Success-Component
      :errors="[responseStatus, responseMessage]"
      @closeToast="closeToast"
    />
    <SwitchLoaderComponent v-if="switchLoader" />
  </main>
</template>
<style scoped>
.navhover:hover {
  background: #e5e7eb;
}

@keyframes slide-in {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(0);
  }
}

@keyframes slide-out {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-100%);
  }
}

.animate-slide-in {
  animation: slide-in 0.5s forwards;
}

.animate-slide-out {
  animation: slide-out 0.5s forwards;
}
/* login */
@keyframes slide-in-login {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
}

.animate-slide-in-login {
  animation: slide-in-login 0.5s forwards;
}

@keyframes slide-out-login {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(100%);
  }
}

.animate-slide-out-login {
  animation: slide-out-login 0.5s forwards;
}

.animate-pulse {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}
</style>

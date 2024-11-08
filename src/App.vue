<script setup>
import HeaderComponent from "./components/HeaderComponent.vue";
import LeaderHeaderComponent from "./components/leader/HeaderComponent.vue";
import SidebarComponent from "./components/admin/SidebarComponent.vue";
import ScrollToTopComponent from "./components/ScrollToTopComponent.vue";
import LoaderComponent from "./components/LoaderComponent.vue";
import { useAuthStore } from "./stores/store";
import {
  ref,
  onMounted,
  watch,
  onBeforeUnmount,
  defineAsyncComponent,
  onUnmounted,
  provide,
} from "vue";
import axios from "../axios";

const BottomComponent = defineAsyncComponent(() =>
  import("./components/BottomComponent.vue")
);

import { io } from "socket.io-client";
import { decodeJWT } from "./stores/token";

const user = ref("");
const store = useAuthStore();

if (store) {
  user.value = decodeJWT(store.token);
}
const socket = io("http://wnh5c088-3000.asse.devtunnels.ms:4000");
const refresh = ref(false);
onMounted(() => {
  socket.on("announcement", (announcement) => {
    if (announcement.userid === user.value.id) {
      alert(
        `New Announcement!\nTitle: ${announcement.title}\nDescription: ${announcement.description}`
      );
      refresh.value = true;
    }
  });
});

provide("refresh", refresh);

onUnmounted(() => {
  socket.off("announcement");
});

const role = ref(["member", "leader", "admin"]);
axios.defaults.withCredentials = true;

const responseMessage = ref("");
const switching = ref(localStorage.getItem("access") || false);

const refreshData = async () => {
  try {
    const response = await axios.get("/api/validate-token");
    responseMessage.value = response.data.message;
    if (
      response.data.message === "jwt expired" ||
      response.data.message === "Token malformed" ||
      (response.data.message === "Authorized" && store.getToken() == null)
    ) {
      // location.reload();
      console.log(store.getToken());
    }
  } catch (error) {
    console.error("Error refreshing data:", error);
  }
};

const updateSwitching = () => {
  switching.value = localStorage.getItem("access");
};

// Initial setup
onMounted(() => {
  refreshData();
  updateSwitching(); // Initial call to set switching
  console.log(switching.value);
  window.addEventListener("storage", updateSwitching);
});

watch(
  () => localStorage.getItem("access"),
  (newValue) => {
    switching.value = newValue !== null;
  }
);

onBeforeUnmount(() => {
  window.removeEventListener("storage", updateSwitching);
});

const deferredPrompt = ref(null); // Store the beforeinstallprompt event

// Function to trigger the PWA install prompt
const installPWA = () => {
  if (deferredPrompt.value) {
    // Show the install prompt
    deferredPrompt.value.prompt();

    // Wait for the user to respond to the prompt
    deferredPrompt.value.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      // Reset the deferred prompt variable
      deferredPrompt.value = null;
    });
  }
};

// Setup the beforeinstallprompt event listener
onMounted(() => {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); // Prevent the default mini-infobar
    deferredPrompt.value = e; // Store the event to use later
  });
});
</script>

<template>
  <section>
    <div
      v-if="deferredPrompt"
      class="p-4 bg-white  md:w-1/3 xl:w-1/3 lg:w-1/3 border-t-orange-500 border-t-[5px] rounded-t-lg md:lg:rounded-r-lg lg:rounded-r-lg text-left fixed bottom-0 left-0  border z-50  flex items-center justify-center"
    >
      <div >
        <div class="mb-4">
          <h2 class="text-xl font-semibold text-gray-800">
            Join Us on the Go!
          </h2>
          <p class="text-gray-600 text-sm ">
            Install the Minister of Christian Mission Church app for easy access
            to sermons, events, and community updates.
          </p>
        </div>
        <button @click="installPWA" class="bg-[#D98757] text-white p-2 rounded py-2 mr-2">
          Download
        </button>
        <button @click="installPWA" class="bg-gray-50 border text-black p-2 rounded py-2">
          Close
        </button>
      </div>
    </div>
    <main v-if="store.getRole().role === role[0]">
      <LoaderComponent />
      <HeaderComponent v-if="store.getRole().role !== undefined" />
      <BottomComponent
        v-if="store.getToken()"
        class="block md:hidden lg:hidden xl:hidden"
      />
      <ScrollToTopComponent />
    </main>
    <main v-else-if="store.getRole().role === role[1]">
      <LoaderComponent />
      <LeaderHeaderComponent v-if="switching" />
      <HeaderComponent v-if="!switching" />
      <BottomComponent
        v-if="store.getToken()"
        class="block md:hidden lg:hidden xl:hidden"
      />
      <!-- <LeaderBottomComponent
        v-if="store.getToken()"
        class="block md:hidden lg:hidden xl:hidden"
      /> -->
      <ScrollToTopComponent />
    </main>
    <main v-else-if="store.getRole().role === role[2]">
      <SidebarComponent />
      <LoaderComponent />
      <ScrollToTopComponent />
    </main>
    <main v-if="!store.getToken()">
      <LoaderComponent />
      <HeaderComponent />
      <BottomComponent
        v-if="store.getToken()"
        class="block md:hidden lg:hidden xl:hidden"
      />
      <ScrollToTopComponent />
    </main>
  </section>
</template>

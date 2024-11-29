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

import { downloadIcons } from "../src/assets/svg/icons";

const BottomComponent = defineAsyncComponent(() =>
  import("./components/BottomComponent.vue")
);

import { io } from "socket.io-client";
import { decodeJWT } from "./stores/token";
import { useToast } from "vue-toastification";

const user = ref("");
const store = useAuthStore();
const toast =useToast();
if (store) {
  user.value = decodeJWT(store.token);
}
const socket = io("https://mcmc-socket.onrender.com");
const refresh = ref(false);
onMounted(() => {
  socket.on("announcement", (announcement) => {
    if (announcement.userid === user.value.id) {
      toast.success(
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
    console.log("Error refreshing data:", error);
  }
};

const updateSwitching = () => {
  switching.value = localStorage.getItem("access");
};

// Initial setup
onMounted(() => {
  refreshData();
  updateSwitching(); // Initial call to set switching
  
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
    <!-- v-if="deferredPrompt" -->

    <button v-if="deferredPrompt" class="fixed left-0 top-1/3 z-50 bg-white border">
      <!-- <div class="relative group">
        <nav
          v-html="downloadIcons.closeDownload()"
          class="w-[45px] h-[45px] flex items-center justify-center"
        ></nav>
        <div
          class="absolute left-14 top-0 border p-2 bg-white rounded-lg w-[100px] hidden group-hover:block"
        >
          <button @click="deferredPrompt=true">Close</button>
        </div>
      </div> -->
      <div class="relative group">
        <nav
          v-html="downloadIcons.download()"
          class="bg-[#D98757] w-[45px] h-[45px] text-white flex items-center justify-center"
          @click="installPWA"
        ></nav>
        <div
          class="absolute left-14 top-0 border p-2 bg-white rounded-lg w-[100px] hidden group-hover:block"
        >
          <button>Install PWA</button>
        </div>
      </div>
      <nav class="w-[45px] h-[45px] flex items-center justify-center"></nav>
    </button>

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

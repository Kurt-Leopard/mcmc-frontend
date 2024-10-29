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
  provide
} from "vue";
import axios from "../axios";

const BottomComponent = defineAsyncComponent(() =>
  import("./components/BottomComponent.vue")
);

import { io } from 'socket.io-client';
import { decodeJWT } from './stores/token';

const user=ref("");
const store = useAuthStore();

if(store){
  user.value=decodeJWT(store.token);
}
const socket = io('http://wnh5c088-3000.asse.devtunnels.ms:4000'); 
const refresh=ref(false);
onMounted(() => {
  socket.on('announcement', (announcement) => {
    if(announcement.userid===user.value.id){
    alert(`New Announcement!\nTitle: ${announcement.title}\nDescription: ${announcement.description}`);
    refresh.value=true;
    }
  });
});

provide("refresh",refresh)


onUnmounted(() => {
  socket.off('announcement');
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
</script>

<template>
  <section>
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

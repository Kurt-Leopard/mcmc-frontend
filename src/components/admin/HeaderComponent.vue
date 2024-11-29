<script setup>
import { ref, watch, onMounted } from "vue";
import { useAuthStore } from "../../stores/store";

const store = useAuthStore();
const show = ref(false);
const btnMenu = () => {
  store.setShowmenuAdmin((show.value = !show.value));
};

watch(
  () => store.showmenuAdmin,
  (newVal, oldVal) => {
    if (!newVal) {
      console.log("Menu is closed");
    } else {
      console.log("Menu is open");
    }
  }
);

onMounted(() => {
  store.getShowmenuAdmin();
});
</script>

<template>
  <main
    class="w-full flex lg:justify-end xl:justify-end lg:py-3 xl:py-3 justify-between px-4 border-b"
  >
    <div class="flex items-center py-3 lg:hidden xl:hidden">
      <img
        src="../../assets/logo.png"
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
    <div class="flex items-center gap-3 p-2"> 
      <!-- <svg
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
          d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
        />
      </svg> -->

      <a class="flex items-center justify-center lg:hidden xl:hidden">
        <svg
          @click="btnMenu()"
          v-if="!store.showmenuAdmin"
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
          v-show="store.showmenuAdmin"
          @click="btnMenu()"
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
  </main>
</template>
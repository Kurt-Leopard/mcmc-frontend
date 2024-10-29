<template>
  <i
    v-if="showScrollButton"
    class="fas fa-arrow-up w-12 h-12 fixed bottom-4 right-4 bg-black text-white text-center p-4 shadow-lg hover:bg-gray-900 rounded-lg"
    :class="store.getToken() ? 'showUp ' : ''"
    @click="scrollToTop"
  ></i>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "@/stores/store";
const store = useAuthStore();
const showScrollButton = ref(false);

const onScroll = () => {
  showScrollButton.value = window.scrollY > 200;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

onMounted(() => {
  window.addEventListener("scroll", onScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>

<style scoped>
@media (max-width: 767px) {
  .showUp {
    display: none !important;
  }
}
</style>

<template>
  <div v-if="isLoading" class="fixed top-0 left-0 flex items-center justify-center h-screen bg-white w-screen bg-opacity-60" style="z-index: 109;">
    <div class="p-5 border-4 border-transparent border-t-gray-300 rounded-full animate-spin"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isLoading = ref(true); 

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false; 
  }, 1000); 
});
</script>

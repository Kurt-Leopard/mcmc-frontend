<template>
   <div
       v-if="props.errors[0] !== 200 && props.errors[0] !== null && props.errors[0]!==false"
    id="toast-danger"
    :class="{
      'toast-animation-in': props.errors[0] !== 200,
      'toast-animation-out': isClose,
    }"
      role="alert"
      class="fixed w-[300px] top-10 left-4 rounded border-s-4 border-red-500 bg-red-50 p-4 z-30"
    >
      <div class="flex items-center gap-2 text-red-800">
        <svg
          
          viewBox="0 0 24 24"
          fill="currentColor"
          class="h-5 w-5"
        >
          <path
            fill-rule="evenodd"
            d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
            clip-rule="evenodd"
          />
        </svg>

        <strong class="block font-medium"> Something went wrong </strong>
            <button
      @click="closeToast"
      type="button"
      class="ml-auto -mx-1.5 -my-1.5  text-red-900 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white  dark:hover:bg-gray-700"
      data-dismiss-target="#toast-danger"
      aria-label="Close"
    >
      <span class="sr-only">Close</span>
      <svg
        class="w-3 h-3"
        aria-hidden="true"
        
        fill="none"
        viewBox="0 0 14 14"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
        />
      </svg>
    </button>
      </div>

      <p class="mt-2 text-sm text-red-700">{{ props.errors[1] }}</p>
    </div>
</template>

<script setup>
import { ref, watch } from "vue";

const emit = defineEmits(["closeToast"]);

const props = defineProps({
  errors: {
    type: Array,
    required: true,
  },
});

const isClose = ref(false);
const closeToast = () => {
  isClose.value = true;
  setTimeout(() => {
    emit("closeToast");
    isClose.value = false;
  }, 350);
};

watch(
  () => props.errors,
  (newValue) => {
    if (newValue[0] !== 200 && newValue[0] !== null) {
      setTimeout(() => {
        isClose.value = true;
        setTimeout(() => {
          emit("closeToast");
          isClose.value = false;
        }, 350);
      }, 5000);
    }
  }
);
</script>
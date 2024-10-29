<template>
  <footer class="w-full mb-20 sm:mb-0 md:mb-0 lg:mb-0 xl:mb-0">
    <div
      :class="galleries[1] ? 'flex' : 'hidden lg:flex xl:flex'"
      class="flex justify-center items-center text-gray-500 space-x-4 my-4"
    >
      <small @click="prevPage" class="hover:text-gray-800 cursor-pointer">
        Prev
      </small>
      <small>Page {{ galleries[2] }}</small>
      <small @click="nextPage" class="hover:text-gray-800 cursor-pointer">
        Next
      </small>
    </div>
  </footer>
</template>

<script setup>
const emit = defineEmits(["prevPage", "nextPage"]);

const props = defineProps({
  galleries: {
    type: Array,
  },
});
const nextPage = () => {
  emit("nextPage");
};

const prevPage = () => {
  emit("prevPage");
};
</script>

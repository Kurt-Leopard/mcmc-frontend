<template>
  <footer class="w-full mb-20 sm:mb-0 md:mb-0 lg:mb-0 xl:mb-0">
    <td
      class="flex justify-center items-center text-gray-500 space-x-4 my-4 w-full"
    >
      <small @click="devoPrevPage" class="hover:text-gray-800 cursor-pointer">
        Prev
      </small>
      <small>Page {{ devotional[1] }}</small>
      <small @click="devoNextPage" class="hover:text-gray-800 cursor-pointer">
        Next
      </small>
    </td>
  </footer>
</template>
<script setup>
const emit = defineEmits(["devoPrevPage", "devoNextPage"]);

const props = defineProps({
  devotional: {
    type: Array,
  },
});

const devoPrevPage = () => {
  emit("devoPrevPage");
};
const devoNextPage = () => {
  emit("devoNextPage");
};
</script>

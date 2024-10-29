<template>
  <table :class="showAllpost ? 'block' : 'hidden lg:block xl:block'">
    <slot></slot>
  </table>
</template>

<script setup>
const props = defineProps({
  showAllpost: {
    type: Boolean,
    required: true,
  },
});
</script>
<template>
  <header
    class="w-full sticky top-[75px] z-20 pt-2 bg-white lg:px-4 xl:px-4 rounded-t-lg"
  >
    <div
      class="flex mt-2 w-full flex flex-col bg-white dark:border-gray-400 dark:bg-gray-800 border-b"
    >
        <slot></slot>
    </div>
  </header>
</template>
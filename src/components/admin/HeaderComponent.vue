<script setup>

</script>
<template>
      <main class="w-full flex lg:justify-end xl:justify-end lg:py-3 xl:py-3 justify-between  px-4 border-b">
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
         <a class="flex  items-center justify-center">
          <svg
            @click="btnMenu"
            v-if="!showbar"
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8 mb-1 md:mb-0 lg:mb-0 xl:mb-0 "
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
            v-show="showbar"
            @click="closeMenu"
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
  </main>
</template>
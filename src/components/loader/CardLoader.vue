<template>
  <section
    class="bg-white dark:bg-gray-900 py-3 px-4 lg:px-[50px] xl:px-32 mt-24 animate-pulse"
  >
    <div class="border-b mb-5 flex justify-between text-sm">
      <div class="flex pb-2 pr-2 border-b-2 border-gray-300 uppercase">
        <i class="bg-gray-300 p-4 rounded-lg mr-2"></i>
        <a
          class="font-semibold inline-block bg-gray-300 px-12 py-2 rounded-lg"
        ></a>
      </div>
      <div class="text-gray-600 flex items-center pb-2 uppercase">
        <a class="flex items-center ursor-pointer"
          ><i class="p-4 bg-gray-300 rounded-lg"></i
        ></a>
      </div>
    </div>
    <div>
      <div
        class="grid grid-cols-1 gap-8 mt-8 xl:mt-12 xl:gap-12 sm:grid-cols-2 xl:grid-cols-3 lg:grid-cols-3"
      >
        <div class="w-full" v-for="(item, index) in 6" :key="index">
          <div
            class="w-full h-64 bg-gray-300 rounded-lg dark:bg-gray-600"
          ></div>

          <h1
            class="w-56 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"
          ></h1>
          <p class="w-24 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
        </div>
      </div>
    </div>
  </section>
</template>
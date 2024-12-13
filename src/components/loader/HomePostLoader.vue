<template>
  <div
    class="bg-white dark:bg-gray-900 py-3 px-4 lg:px-[50px] xl:px-32 my-24 animate-pulse"
  >
    <div
      class="grid grid-cols-1 gap-8 xl:gap-12 sm:grid-cols-2 xl:grid-cols-2 lg:grid-cols-2"
    >
      <div>
        <div class="w-full mb-4" v-for="(item, index) in 2" :key="index">
          <div class=" h-16 rounded-lg flex items-center gap-3 justify-between " v-if="index == 0">
            <div class="p-6 bg-gray-300 rounded-full "></div>
           <div class="w-full h-12 bg-gray-300 rounded-full"></div>
             <a class="flex items-center ursor-pointer"
          ><i class="p-4 bg-gray-300 rounded-lg"></i
        ></a>
          </div>
          <div class="flex items-center ">
            <div class="p-6 bg-gray-300 rounded-full my-3 mr-3"></div>
            <div class="items-center text-left">
              <p class="w-32 h-2 my-1 bg-gray-200 rounded-lg"></p>
              <p class="w-24 h-2 bg-gray-200 rounded-lg"></p>
            </div>
          </div>
          <div class="w-full h-64 bg-gray-300 rounded-lg"></div>

          <h1 class="w-56 h-2 mt-4 bg-gray-200 rounded-lg"></h1>
          <p class="w-24 h-2 mt-4 bg-gray-200 rounded-lg"></p>
        </div>
      </div>
      <div>
        <div class="w-full border-t" v-for="(item, index) in 4" :key="index">
          <div class="pb-8">
            <div class="flex items-center">
              <div class="p-6 bg-gray-300 rounded-full my-3 mr-3"></div>
              <div class="items-center text-left">
                <p class="w-32 h-2 my-1 bg-gray-200 rounded-lg"></p>
                <p class="w-24 h-2 bg-gray-200 rounded-lg"></p>
              </div>
            </div>
            <div class="w-full p-1 bg-gray-200 rounded-lg my-2"></div>
            <div class="w-full p-1 bg-gray-200 rounded-lg my-2"></div>
            <div class="w-full p-1 bg-gray-200 rounded-lg my-2"></div>

            <h1 class="w-56 h-2 mt-4 bg-gray-200 rounded-lg"></h1>
            <p class="w-24 h-2 mt-4 bg-gray-200 rounded-lg"></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
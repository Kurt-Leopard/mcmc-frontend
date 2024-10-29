<template>
  <div v-if="datas[0]"
    class="fixed top-0 left-0 h-full w-full bg-white flex items-center justify-center bg-white sm:bg-black sm:bg-opacity-50 md:bg-black md:bg-opacity-50 lg:bg-black lg:bg-opacity-50 xl:bg-black xl:bg-opacity-50"
  >
    <form class="md:shadow-md lg:shadow-md xl:shadow-md px-10 py-6 rounded-md bg-white">
        <div class="flex flex-col space-y-2 text-center my-3">
        <h2 class="block sm:hidden md:hidden lg:hidden xl:hidden text-3xl md:text-4xl font-bold">Confirm OTP</h2>
        <p class="text-md md:text-xl">
            Enter the OTP we just sent you. 
        </p>
    </div>
      <div class="flex justify-center gap-2 mb-6">
        <input
          class="w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
          type="text"
          maxlength="1"
          pattern="[0-9]"
          inputmode="numeric"
          autocomplete="one-time-code"
          required
        />
        <input
          class="w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
          type="text"
          maxlength="1"
          pattern="[0-9]"
          inputmode="numeric"
          autocomplete="one-time-code"
          required
        />
        <input
          class="w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
          type="text"
          maxlength="1"
          pattern="[0-9]"
          inputmode="numeric"
          autocomplete="one-time-code"
          required
        />
        <input
          class="w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
          type="text"
          maxlength="1"
          pattern="[0-9]"
          inputmode="numeric"
          autocomplete="one-time-code"
          required
        />
        <input
          class="w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
          type="text"
          maxlength="1"
          pattern="[0-9]"
          inputmode="numeric"
          autocomplete="one-time-code"
          required
        />
        <input
          class="w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
          type="text"
          maxlength="1"
          pattern="[0-9]"
          inputmode="numeric"
          autocomplete="one-time-code"
          required
        />
      </div>
      <div class="flex items-center justify-center">
        <button
          class="bg-[#D98757] hover:bg-[#D98757] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
        >
          Verify
        </button>
       
      </div>
    </form>
  </div>
</template>

<script setup>

const props = defineProps({
    datas:{
    type:Array,
    },
});

</script>

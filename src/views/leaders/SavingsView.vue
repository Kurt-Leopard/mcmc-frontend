<template>
  <div class="px-4 lg:px-32 xl:px-32 mt-32 pb-10">
    <div v-if="loading" class="text-center text-lg text-gray-500">
      Loading...
    </div>
    <div
      class="w-full border-b grid grid-cols-3 text-center pt-5 text-[10px] font-semibold text-gray-700 md:hidden lg:hidden xl:hidden"
    >
      <div
        :class="`py-3 cursor-pointer ${
          activeTab === tabs[0] ? 'bg-gray-100' : ''
        }`"
        @click="activeTab = tabs[0]"
      >
        Operational Income
      </div>
      <div
        :class="`py-3 cursor-pointer ${
          activeTab === tabs[1] ? 'bg-gray-100' : ''
        }`"
        @click="activeTab = tabs[1]"
      >
        Restricted funds
      </div>
      <div
        :class="`py-3 cursor-pointer ${
          activeTab === tabs[2] ? 'bg-gray-100' : ''
        }`"
        @click="activeTab = tabs[2]"
      >
        Thites of thites
      </div>
    </div>
    <div class="-mx-4 flex-wrap hidden md:flex lg:flex xl:flex">
      <div class="w-full px-4 md:w-1/2 xl:w-1/3 mt-12">
        <div class="relative">
          <div class="overflow-hidden rounded-[10px]">
            <img
              src="../../assets/income.jpg"
              alt="portfolio"
              class="w-full h-[200px] object-cover"
            />
          </div>
          <div
            class="relative z-10 mx-7 -mt-20 rounded-lg bg-white dark:bg-dark-2 py-[10px] px-3 text-center shadow-portfolio dark:shadow-box-dark border"
          >
            <span class="text-primary mb-2 block text-lg font-medium">
              ₱
              {{
                (income ?? 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              }}
            </span>
            <h3 class="text-dark dark:text-white mb-5 text-xl font-bold">
              {{ tabs[0] }}
            </h3>
            <div class="flex justify-evenly items-center mb-4 space-x-4">
              <button
                @click="activeTab = tabs[0]"
                :class="[
                  'px-4 py-2 rounded-lg font-semibold text-gray-600 hover:bg-[#3658F9] hover:text-white',
                  activeTab === tabs[0]
                    ? 'bg-[#3658F9] text-white'
                    : 'text-gray-700  bg-gray-100',
                ]"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full px-4 md:w-1/2 xl:w-1/3 mt-12">
        <div class="relative">
          <div class="overflow-hidden rounded-[10px]">
            <img
              src="../../assets/restrictedfunds.jpg"
              alt="portfolio"
              class="w-full h-[200px] object-cover"
            />
          </div>
          <div
            class="relative z-10 mx-7 -mt-20 rounded-lg bg-white dark:bg-dark-2 py-[10px] px-3 text-center shadow-portfolio dark:shadow-box-dark border"
          >
            <span class="text-primary mb-2 block text-lg font-medium">
              ₱
              {{
                (totalRestrictedFunds ?? 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              }}
            </span>
            <h3 class="text-dark dark:text-white mb-5 text-xl font-bold">
              {{ tabs[1] }}
            </h3>

            <div class="flex justify-evenly items-center mb-4 space-x-4">
              <button
                @click="activeTab = tabs[1]"
                :class="[
                  'px-4 py-2 rounded-lg font-semibold text-gray-600 hover:bg-[#3658F9] hover:text-white',
                  activeTab === tabs[1]
                    ? 'bg-[#3658F9] text-white'
                    : 'text-gray-700 bg-gray-100',
                ]"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full px-4 md:w-1/2 xl:w-1/3 mt-12">
        <div class="relative">
          <div class="overflow-hidden rounded-[10px]">
            <img
              src="../../assets/thites.jpg"
              alt="portfolio"
              class="w-full h-[200px] object-cover"
            />
          </div>
          <div
            class="relative z-10 mx-7 -mt-20 rounded-lg bg-white dark:bg-dark-2 py-[10px] px-3 text-center shadow-portfolio dark:shadow-box-dark border"
          >
            <span class="text-primary mb-2 block text-lg font-medium">
              ₱
              {{
                (totalTithesOfTithes ?? 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              }}
            </span>
            <h3 class="text-dark dark:text-white mb-5 text-xl font-bold">
              {{ tabs[2] }}
            </h3>
            <div class="flex justify-evenly items-center mb-4 space-x-4">
              <button
                @click="activeTab = tabs[2]"
                :class="[
                  'px-4 py-2 rounded-lg font-semibold text-gray-600 hover:bg-[#3658F9] hover:text-white',
                  activeTab === tabs[2]
                    ? 'bg-[#3658F9] text-white'
                    : 'text-gray-700  bg-gray-100',
                ]"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Content -->
    <div id="exportContent" class="my-10">
      <div
        v-if="activeTab === 'Operational Income'"
        :class="{
          'bg-white p-6 rounded-lg shadow-lg': true,
          border: hideSearch,
        }"
      >
        <div class="md:flex lg:flex xl:flex items-center justify-between my-3">
          <h3
            class="text-[12px] md:text-lg lg:text-lg xl:text-lg font-semibold text-gray-700 my-2"
          >
            Operational income
          </h3>
          <!-- Export Buttons -->
          <form
            class="lg:flex xl:flex items-center my-2 gap-2"
            v-if="hideSearch"
          >
            <!-- limiter -->
            <nav class="flex gap-2 my-2">
              <div class="rounded-lg border-gray-300">
                <div id="limit" class="relative flex items-center text-center">
                  <input
                    type="number"
                    name=""
                    id=""
                    class="pl-8 pr-3 py-2 border border-gray-300 rounded-md w-24 flex text-center"
                    v-model="pagemNumber"
                    @change="refreshByPage"
                  />
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-5 h-5 text-gray-500 absolute left-2 dark:text-gray-400"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5"
                    />
                  </svg>
                </div>
              </div>
              <div class="rounded-lg border-gray-300">
                <div id="limit" class="relative flex items-center text-center">
                  <select
                    class="pl-8 pr-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Select a number"
                    v-model="limiter"
                    @change="refreshOperational"
                  >
                    <option
                      class=""
                      v-for="num in numbers"
                      :key="num"
                      :value="num"
                    >
                      {{ num }}
                    </option>
                  </select>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-5 h-5 text-gray-500 dark:text-gray-400 absolute left-2 cursor-pointer"
                    @click="
                      limiter = '5';
                      refreshOperational();
                    "
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                    />
                  </svg>
                </div>
              </div>
            </nav>
            <!-- <nav class="flex my-2">
              <div class="relative w-full">
                <div
                  class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none"
                >
                  <svg
                    class="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
                <input
                  type="text"
                  id="simple-search"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search"
                  required
                />
              </div>
              <button
                type="submit"
                class="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </button>
            </nav> -->
          </form>
        </div>
        <table
          class="w-full text-left table-auto text-[10px] md:txet-[14px] lg:text-[14px] xl:text-[14px]"
        >
          <thead>
            <tr class="bg-gray-100 text-gray-600 border-y">
              <th class="p-3">Date</th>
              <th class="p-3">Amount</th>
              <th class="p-3">Particular</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="border-b text-gray-500"
              v-for="(item, index) in operationalIncomeData"
              :key="index"
            >
              <td class="p-3">{{ getDate(item.created_at) }}</td>
              <td class="p-3">
                ₱
                {{
                  (item.operational_amount ?? 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                }}
              </td>
              <td class="p-3">
                {{
                  item?.combined_particular
                    ? item?.combined_particular
                    : item?.source_table !== "unknown"
                    ? item?.source_table
                    : "Allocation Balance"
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- restricted -->
      <div
        v-if="activeTab === 'Restricted Funds'"
        class="bg-white p-6 rounded-lg shadow-lg border"
      >
        <div class="md:flex lg:flex xl:flex items-center justify-between my-3">
          <h3
            class="text-[12px] md:text-lg lg:text-lg xl:text-lg font-semibold text-gray-700 my-2"
          >
            Restricted funds
          </h3>

          <!-- Export Buttons -->
          <form
            class="lg:flex xl:flex items-center my-2 gap-2"
            v-if="hideSearch"
          >
            <nav class="flex gap-2 my-2">
              <div class="rounded-lg border-gray-300">
                <div id="limit" class="relative flex items-center text-center">
                  <input
                    type="number"
                    name=""
                    id=""
                    class="pl-8 pr-3 py-2 border border-gray-300 rounded-md w-24 flex text-center"
                    v-model="restrictedPageStart"
                    @change="savingDetails"
                  />
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-5 h-5 text-gray-500 absolute left-2 dark:text-gray-400"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5"
                    />
                  </svg>
                </div>
              </div>
              <div class="rounded-lg border-gray-300">
                <div id="limit" class="relative flex items-center text-center">
                  <select
                    class="pl-8 pr-3 py-2 border border-gray-300 rounded-md w-24 flex text-center"
                    placeholder="Select a number"
                    v-model="restrictedLimiter"
                    @change="savingDetails"
                  >
                    <option
                      class=""
                      v-for="num in restirctedNumbers"
                      :key="num"
                      :value="num"
                    >
                      {{ num }}
                    </option>
                  </select>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-5 h-5 text-gray-500 dark:text-gray-400 absolute left-2 cursor-pointer"
                    @click="
                      restrictedLimiter = '5';
                      savingDetails();
                    "
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                    />
                  </svg>
                </div>
              </div>
            </nav>

            <!-- <nav class="flex my-2">
              <div class="relative w-full">
                <div
                  class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none"
                >
                  <svg
                    class="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
                <input
                  type="text"
                  id="simple-search"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search"
                  required
                />
              </div>
              <button
                type="submit"
                class="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </button>
            </nav> -->
          </form>
        </div>
        <table
          class="w-full text-left table-auto text-[10px] md:txet-[14px] lg:text-[14px] xl:text-[14px]"
        >
          <thead>
            <tr class="bg-gray-100 text-gray-600 border-y">
              <th class="p-3">Date</th>
              <th class="p-3">Allocated budget</th>
              <th class="p-3">Restricted funds(10%)</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="border-b text-gray-500"
              v-for="(item, index) in restrictedFundsData"
              :key="index"
            >
              <td class="p-3">{{ getDate(item.allocation_created_at) }}</td>
              <td class="p-3">
                ₱
                {{
                  (item.allocation_amount ?? 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                }}
              </td>
              <td class="p-3">
                ₱
                {{
                  (item.restricted_funds ?? 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="activeTab === 'Tithes of Tithes'"
        class="bg-white p-6 rounded-lg shadow-lg border"
      >
        <div class="md:flex lg:flex xl:flex items-center justify-between my-3">
          <h3
            class="text-[12px] md:text-lg lg:text-lg xl:text-lg font-semibold text-gray-700 my-2"
          >
            Tithe of thites
          </h3>

          <!-- Export Buttons -->
          <form
            class="lg:flex xl:flex items-center my-2 gap-2"
            v-if="hideSearch"
          >
            <nav class="flex gap-2 my-2">
              <div class="rounded-lg border-gray-300">
                <div id="limit" class="relative flex items-center text-center">
                  <input
                    type="number"
                    name=""
                    id=""
                    class="pl-8 pr-3 py-2 border border-gray-300 rounded-md w-24 flex text-center"
                    v-model="restrictedPageStart"
                    @change="savingDetails"
                  />
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-5 h-5 text-gray-500 absolute left-2 dark:text-gray-400"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5"
                    />
                  </svg>
                </div>
              </div>
              <div class="rounded-lg border-gray-300">
                <div id="limit" class="relative flex items-center text-center">
                  <select
                    class="pl-8 pr-3 py-2 border border-gray-300 rounded-md w-24 flex text-center"
                    placeholder="Select a number"
                    v-model="restrictedLimiter"
                    @change="savingDetails"
                  >
                    <option
                      class=""
                      v-for="num in restirctedNumbers"
                      :key="num"
                      :value="num"
                    >
                      {{ num }}
                    </option>
                  </select>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-5 h-5 text-gray-500 dark:text-gray-400 absolute left-2 cursor-pointer"
                    @click="
                      restrictedLimiter = '5';
                      savingDetails();
                    "
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                    />
                  </svg>
                </div>
              </div>
            </nav>
            <!-- <nav class="flex my-2">
              <div class="relative w-full">
                <div
                  class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none"
                >
                  <svg
                    class="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
                <input
                  type="text"
                  id="simple-search"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search"
                  required
                />
              </div>
              <button
                type="submit"
                class="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </button>
            </nav> -->
          </form>
        </div>
        <table
          class="w-full text-left table-auto text-[10px] md:txet-[14px] lg:text-[14px] xl:text-[14px]"
        >
          <thead>
            <tr class="bg-gray-100 text-gray-600 border-y">
              <th class="p-3">Date</th>
              <th class="p-3">Allocated budget</th>
              <th class="p-3">Thites of thites(10%)</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="border-b text-gray-500"
              v-for="(item, index) in tithesOfTithesData"
              :key="index"
            >
              <td class="p-3">{{ getDate(item.allocation_created_at) }}</td>
              <td class="p-3">
                ₱
                {{
                  (item.allocation_amount ?? 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                }}
              </td>
              <td class="p-3">
                ₱
                {{
                  (item.tithes_of_tithes ?? 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div
      class="flex justify-center gap-1 mt-6 border-b pb-12 text-[10px] md:text-lg lg:text-[14px]"
    >
      <button
        @click="exportPDF"
        class="px-4 py-2 bg-green-900 text-white flex items-center gap-2"
      >
        Export as PDF
      </button>
      <button
        @click="exportExcel"
        class="px-4 py-2 hover:bg-gray-100 text-gray-600"
      >
        Export as Excel
      </button>
      <button
        @click="exportWord"
        class="px-4 py-2 hover:bg-gray-100 text-gray-600"
      >
        Export as Word
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "../../../axios";
import html2pdf from "html2pdf.js";
import * as XLSX from "xlsx";
import { getDate } from "../../composables/date";
import { useAuthStore } from "../../stores/store";
const store = useAuthStore();

const operationalIncomeData = ref([]);

const restrictedFundsData = ref([]);
const limiter = ref(5);
const numbers = ref([5, 10, 15, 20, 25, 30]);
const pagemNumber = ref(0);

const restrictedPageStart = ref(0);
const restirctedNumbers = ref([5, 10, 15, 20, 25, 30]);
const restrictedLimiter = ref(5);

const tithesOfTithesData = ref([]);
const hideSearch = ref(true);
watch(
  () => store.getMethod(),
  (methodResult) => {
    if (methodResult) {
      refreshSavings();
      refreshOperational();
      savingDetails();
      store.setMethod(null);
    }
  }
);

const refreshByPage = () => {
  refreshOperational();
};

const savingDetails = async () => {
  try {
    const response = await axios.get(
      `/api/savings/details?offset=${restrictedPageStart.value}&limit=${restrictedLimiter.value}`
    );
    if (response.status === 200) {
      tithesOfTithesData.value = response.data.result;
      restrictedFundsData.value = response.data.result;
    }
  } catch (error) {
    console.error("Error fetching data", error);
  }
};

const income = ref(null);
const totalRestrictedFunds = ref(null);
const totalTithesOfTithes = ref(null);
const loading = ref(true);

const refreshSavings = async () => {
  try {
    const offset = pagemNumber.value;
    const limit = limiter.value;
    const searchBy = "";

    const incomeResponse = await axios.get(
      `/api/saving-income?offset=${offset}&limit=${limit}`
    );
    income.value = incomeResponse.data.result[0]?.amount || 0;

    const savingsResponse = await axios.get(
      `/api/savings?offset=${offset}&limit=${limit}&searchBy=${searchBy}`
    );
    totalRestrictedFunds.value =
      savingsResponse.data.result[0]?.total_restricted_funds || 0;
    totalTithesOfTithes.value =
      savingsResponse.data.result[0]?.total_tithes_of_tithes || 0;
  } catch (error) {
    console.error("Error fetching data", error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
};

const activeTab = ref("Operational Income");
const tabs = ["Operational Income", "Restricted Funds", "Tithes of Tithes"];

onMounted(async () => {
  try {
    loading.value = false;
  } catch (error) {
    console.error("Error fetching data", error);
    loading.value = false;
  }
});

const refreshOperational = async () => {
  const searchBy = "";
  try {
    const response = await axios.get(
      `/api/savings/operational-details?limit=${limiter.value}&offset=${pagemNumber.value}&searchBy=${searchBy}`
    );
    if (response.status === 200) {
      operationalIncomeData.value = response.data.result;
    }
  } catch (error) {
    console.error("Error fetching data", error);
  }
};

onMounted(async () => {
  refreshSavings();
  refreshOperational();
  savingDetails();
});
// Export functions (PDF, Excel, Word)
const exportPDF = () => {
  hideSearch.value = false;
  setTimeout(() => {
    const element = document.getElementById("exportContent");
    html2pdf()
      .set({ filename: `${activeTab.value}.pdf`, html2canvas: { scale: 2 } })
      .from(element)
      .save();
    hideSearch.value = true;
  }, 0);
};

const exportExcel = () => {
  hideSearch.value = false;
  setTimeout(() => {
    const worksheet = XLSX.utils.table_to_sheet(
      document.querySelector(`#exportContent table`)
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, activeTab.value);
    XLSX.writeFile(workbook, `${activeTab.value}.xlsx`);
    hideSearch.value = true;
  }, 0);
};

const exportWord = () => {
  hideSearch.value = false;
  setTimeout(() => {
    const content = document.getElementById("exportContent").innerHTML;
    const header =
      "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>" +
      "<head><meta charset='utf-8'><title>Export HTML to Word</title></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + content + footer;
    const blob = new Blob(["\ufeff", sourceHTML], {
      type: "application/msword",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${activeTab.value}.doc`;
    link.click();
    hideSearch.value = true;
  }, 0);
};
</script>

<style scoped>
/* Add your custom styles here */
</style>

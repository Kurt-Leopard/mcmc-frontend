<script setup>
import axios from "../../axios";
import { onMounted, ref } from "vue";
import FooterComponent from "../components/FooterComponent.vue";

const leaders = ref([]);
const refreshData = async () => {
  const response = await axios.get(`/api/leaders`);

  try {
    if (response.status === 200) {
      leaders.value = response.data.result;
    }
  } catch (error) {
    console.log(response.data.message);
  }
};
onMounted(() => {
  refreshData();

  window.scrollTo(0, 0);
});
</script>
<template>
  <main class="py-3 px-4 lg:px-[50px] xl:px-32 mt-24">
    <section>
      <div class="w-full">
        <section>
          <div>
            <div>
              <div class="border-b mb-5 flex justify-between text-sm">
                <div
                  class="text-[#D98757] flex items-center pb-2 pr-2 border-b-2 border-[#D98757] uppercase"
                >
                  <i class="fas fa-church text-lg mr-2"></i>
                  <a class="font-semibold inline-block">ABOUT US</a>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
              <div
                class="relative h-64 overflow-hidden rounded-lg sm:h-80 lg:order-last lg:h-full"
              >
                <img
                  alt=""
                  src="../assets/smbg.png"
                  class="absolute inset-0 w-full object-cover"
                />
              </div>

              <div class="lg:py-24">
                <h2 class="text-3xl font-bold sm:text-4xl">
                  Minister Of Christian Mission Church
                </h2>

                <p class="mt-4 text-gray-600">
                  At the Christian Mission Church, we strive to serve and uplift
                  our community. We are committed to faith and compassion,
                  offering support and guidance to those in need. Our mission is
                  to foster spiritual growth and create a welcoming environment
                  for all.
                </p>

                <a
                  href="#more"
                  class="mt-8 inline-block rounded bg-[#D98757] px-12 py-3 text-sm font-medium text-white transition hover:bg-[#D98757] focus:outline-none focus:ring focus:ring-orange-200"
                >
                  Find out more →
                </a>
              </div>
            </div>
          </div>
        </section>
        <h1 class="text-3xl font-bold sm:text-4xl mt-24">Pastor & Leaders</h1>
        <div class="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <a
            v-for="(leader, index) in leaders"
            :key="index"
            class="block rounded-md border p-2 shadow-xl transition hover:border-gray-500/10 hover:shadow-gray-500/10"
          >
            <img
              :src="`https://storage.googleapis.com/mcm-chuch.appspot.com/${leader.profile}`"
              alt=""
              class="h-auto w-full max-h-[300px] rounded-lg object-cover"
            />

            <h2 class="mt-4 text-xl font-bold text-center">
              {{ leader.sub_role }}
            </h2>

            <p class="mt-1 text-sm text-gray-500 text-center">
              Name: {{ leader.fullname }}
            </p>
          </a>
        </div>

        <div class="mt-12 text-center">
          <!-- <a
            href="#"
            class="inline-block rounded bg-[#D98757] px-12 py-3 text-sm font-medium text-white transition hover:bg-[#D98757] focus:outline-none focus:ring focus:ring-orange-200"
          >
            View more
          </a> -->
        </div>
      </div>
    </section>
    <section class="my-24">
      <div class="w-full" id="more">
        <div class="w-full">
          <h2 class="text-3xl font-bold sm:text-4xl">
            Minister Of Christian Mission Church
          </h2>

          <p class="mt-4 text-gray-500">
            We desire to honor God in every area of life. Our starting point,
            goal, and motive is the honor of God. This is foundational for
            understanding why we do what we do. It is all about Him, not us. We
            follow Jesus and help others follow Him. We make disciples by
            engaging culture and community, establishing biblical foundations,
            equipping believers to minister, and empowering disciples to make
            disciples.
          </p>
        </div>

        <div
          class="mt-8 grid grid-cols-1 gap-8 md:mt-16 md:grid-cols-2 md:gap-12 lg:grid-cols-3"
        >
          <div class="flex items-start gap-4">
            <span class="shrink-0 text-white rounded-lg bg-[#D98757] p-4">
              <i class="fas fa-church"></i>
            </span>

            <div>
              <h2 class="text-lg font-bold">Our History.</h2>

              <p class="mt-1 text-sm text-gray-500">
                Founded in the early 2012, the Christian Mission Church in
                Cordova, Cebu City has a rich history of service and community
                engagement. Initially established as a small chapel, the church
                grew through the dedication of its early members and local
                leaders. Over the decades, it has expanded its mission to
                include various outreach programs and community support
                initiatives. Our history is marked by a commitment to fostering
                spiritual growth, aiding those in need, and creating a nurturing
                environment for all residents of Cordova.
              </p>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <span class="shrink-0 text-white rounded-lg bg-[#D98757] p-4">
              <i class="fas fa-info-circle"></i>
            </span>

            <div>
              <h2 class="text-lg font-bold">Our Statement of Faith.</h2>

              <p class="mt-1 text-sm text-gray-500">
                We believe in the eternal truth of the Gospel and the
                transformative power of God's love. Our faith is rooted in the
                teachings of Jesus Christ and guided by the Scriptures. We are
                committed to living out the principles of compassion, justice,
                and mercy, embracing a life of worship and service. Our core
                belief is that through faith, individuals and communities can
                find purpose, hope, and renewal.
              </p>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <span class="shrink-0 text-white rounded-lg bg-[#D98757] p-4">
              <i class="fas fa-heart"></i>
            </span>

            <div>
              <h2 class="text-lg font-bold">Our Core Values.</h2>

              <p class="mt-1 text-sm text-gray-500">
                At the Christian Mission Church, our core values are built on a
                foundation of faith, integrity, and compassion. Our mission is
                to serve our community with unwavering dedication, guided by the
                principles of love and respect. We envision a world where every
                individual is uplifted and empowered through spiritual growth
                and communal support. Our goals include fostering a supportive
                environment, expanding our outreach efforts, and continually
                enriching the lives of those we serve.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <FooterComponent />
  </main>
</template>

<script setup lang="ts">
import Hero from "@/components/home/Hero.vue";
import About from "@/components/home/About.vue";
import Readings from "@/components/home/PersonalDailyHoroscope.vue";
import PersonalDailyHoroscope from "@/components/home/Readings.vue";
import Products from "@/components/home/Products.vue";
import Ifa from "@/components/home/Ifa.vue";
</script>

<template>
  <main class="min-h-screen overflow-hidden bg-[#090711] text-white selection:bg-amber-300 selection:text-black">
    <Hero />
    <About />
    <PersonalDailyHoroscope />
    <Readings />
    <Products />
    <Ifa />
  </main>
</template>
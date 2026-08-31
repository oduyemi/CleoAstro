<script setup lang="ts">
import Hero from "@/components/home/Hero.vue";
import About from "@/components/home/About.vue";
import Readings from "@/components/home/Readings.vue";
import Karma from "@/components/home/Karma.vue";
import Planets from "@/components/home/Planets.vue";
</script>

<template>
  <main class="min-h-screen overflow-hidden bg-[#090711] text-white selection:bg-amber-300 selection:text-black">
    <Hero />
    <About />
    <Readings />
    <Karma />
    <Planets />
  </main>
</template>
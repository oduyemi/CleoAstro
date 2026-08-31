<script setup lang="ts">
definePageMeta({
  title: "Horoscope",
});

useSeoMeta({
  title: "Horoscope | Vedic Guru",
  description:
    "Discover daily, weekly, and monthly Vedic astrology horoscopes.",
});
</script>

<template>
  <div>
    <section class="section-padding">
      <div class="container-page">
        <div class="mx-auto max-w-3xl text-center">
          <p
            class="text-sm font-semibold uppercase tracking-[0.25em] text-gold-600"
          >
            Vedic Astrology
          </p>

          <h1
            class="mt-3 heading-display text-spiritual-dark"
          >
            Your Horoscope
          </h1>

          <p
            class="mt-5 text-lg leading-8 text-gray-600"
          >
            Explore your daily, weekly, and monthly
            horoscope according to the wisdom of Vedic
            astrology.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
import {
  ArrowRight,
  Compass,
  Eye,
  Orbit,
} from "lucide-vue-next";

const readingTypes = [
  {
    number: "01",
    title: "Vedic Astrology",
    description:
      "Explore your birth chart through the ancient wisdom of Vedic astrology and gain perspective on the patterns, cycles, and themes shaping your journey.",
    icon: Orbit,
  },
  {
    number: "02",
    title: "Intuitive Readings",
    description:
      "Receive intuitive and channeled guidance designed to help you reflect on relationships, life direction, and the questions currently sitting on your heart.",
    icon: Eye,
  },
  {
    number: "03",
    title: "Ancestral & Karmic Patterns",
    description:
      "Explore recurring patterns and ancestral influences that may be showing up across relationships, family, identity, and personal growth.",
    icon: Compass,
  },
];
</script>

<template>
  <section
    id="readings"
    class="relative border-y border-white/[0.06] bg-white/[0.015] py-28"
  >
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <!-- Section heading -->
      <div class="max-w-2xl">
        <p
          class="text-[10px] uppercase tracking-[0.3em] text-amber-200/60"
        >
          Ways to explore
        </p>

        <h2
          class="mt-5 font-serif text-4xl leading-tight sm:text-5xl"
        >
          Meet the questions beneath the questions.
        </h2>

        <p class="mt-6 text-base leading-7 text-white/45">
          Every reading begins with what is happening in your life right
          now—and creates space to look deeper.
        </p>
      </div>

      <!-- Reading cards -->
      <div
        class="mt-16 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-3"
      >
        <article
          v-for="reading in readingTypes"
          :key="reading.number"
          class="group relative bg-[#0b0a14] p-8 transition duration-500 hover:bg-[#11101b]"
        >
          <!-- Card header -->
          <div class="flex items-start justify-between">
            <span class="font-mono text-xs text-amber-200/40">
              {{ reading.number }}
            </span>

            <component
              :is="reading.icon"
              class="h-6 w-6 text-amber-200/50 transition duration-500 group-hover:scale-110 group-hover:text-amber-200"
            />
          </div>

          <!-- Card content -->
          <h3 class="mt-20 font-serif text-2xl text-white">
            {{ reading.title }}
          </h3>

          <p class="mt-4 text-sm leading-7 text-white/45">
            {{ reading.description }}
          </p>

          <!-- Card link -->
          <a
            href="#"
            class="mt-7 inline-flex items-center text-xs uppercase tracking-[0.18em] text-amber-200/70 transition group-hover:text-amber-100"
          >
            Explore

            <ArrowRight
              class="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
            />
          </a>
        </article>
      </div>
    </div>
  </section>
</template>
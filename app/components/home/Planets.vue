<script setup lang="ts">
import {
  ArrowRight,
  CircleDot,
  Moon,
  Orbit,
  Sparkles,
  Zap,
} from "lucide-vue-next";

import { Button } from "@/components/ui/button";

const planetaryUpdates = [
  {
    planet: "Moon",
    position: "12° Libra",
    influence: "Emotional balance & relationships",
    icon: Moon,
  },
  {
    planet: "Mercury",
    position: "24° Leo",
    influence: "Communication & expression",
    icon: Zap,
  },
  {
    planet: "Venus",
    position: "08° Cancer",
    influence: "Connection & values",
    icon: Sparkles,
  },
  {
    planet: "Saturn",
    position: "18° Pisces",
    influence: "Lessons & responsibility",
    icon: CircleDot,
  },
];
</script>

<template>
  <section
    id="planets"
    class="border-y border-white/[0.06] bg-white/[0.015] py-28"
  >
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <!-- Section header -->
      <div
        class="flex flex-col justify-between gap-8 lg:flex-row lg:items-end"
      >
        <div class="max-w-2xl">
          <p
            class="text-[10px] uppercase tracking-[0.3em] text-amber-200/60"
          >
            Cosmic Weather
          </p>

          <h2 class="mt-5 font-serif text-4xl sm:text-5xl">
            The planets are always moving.
          </h2>

          <p class="mt-5 text-base leading-7 text-white/45">
            Stay connected to current planetary positions and astrological
            transits, and use them as a lens for reflection and awareness.
          </p>
        </div>

        <Button
          variant="outline"
          class="w-fit rounded-full border-white/15 bg-transparent text-white hover:bg-white/10"
        >
          View Full Planetary Update

          <ArrowRight class="ml-2 h-4 w-4" />
        </Button>
      </div>

      <!-- Planetary cards -->
      <div class="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article
          v-for="planet in planetaryUpdates"
          :key="planet.planet"
          class="rounded-3xl border border-white/[0.08] bg-[#0b0a14] p-6 transition duration-300 hover:border-amber-200/15 hover:bg-[#0e0d18]"
        >
          <!-- Card header -->
          <div class="flex items-center justify-between">
            <div
              class="flex h-11 w-11 items-center justify-center rounded-full border border-amber-200/10 bg-amber-100/[0.04]"
            >
              <component
                :is="planet.icon"
                class="h-5 w-5 text-amber-200/80"
              />
            </div>

            <span
              class="rounded-full border border-emerald-300/10 bg-emerald-300/[0.04] px-2.5 py-1 text-[9px] uppercase tracking-wider text-emerald-300/60"
            >
              Live
            </span>
          </div>

          <!-- Planet information -->
          <p class="mt-7 font-serif text-xl">
            {{ planet.planet }}
          </p>

          <p class="mt-1 text-sm text-amber-100/70">
            {{ planet.position }}
          </p>

          <p class="mt-5 text-xs leading-5 text-white/35">
            {{ planet.influence }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>
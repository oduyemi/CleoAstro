<script setup lang="ts">
import {
  ArrowRight,
  CircleDot,
  Compass,
  Moon,
  Orbit,
  Sparkles,
  Star,
} from "lucide-vue-next";

import { Button } from "@/components/ui/button";
</script>

<template>
  <section
    id="ancestral"
    class="relative overflow-hidden py-32"
  >
    <!-- Atmospheric glow -->
    <div
      class="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/[0.05] blur-[100px]"
    />

    <div class="relative mx-auto max-w-7xl px-6 lg:px-8">
      <div class="grid items-center gap-16 lg:grid-cols-2">
        <!-- Content -->
        <div>
          <!-- Icon -->
          <div
            class="mb-7 flex h-14 w-14 items-center justify-center rounded-full border border-amber-200/20 bg-amber-100/[0.04]"
          >
            <Compass class="h-6 w-6 text-amber-200" />
          </div>

          <p
            class="text-[10px] uppercase tracking-[0.3em] text-amber-200/60"
          >
            Ancestral & Karmic Patterns
          </p>

          <h2
            class="mt-5 font-serif text-4xl leading-tight sm:text-5xl"
          >
            What if the pattern didn't begin with you?
          </h2>

          <p class="mt-6 max-w-xl text-base leading-8 text-white/50">
            Some experiences can feel strangely familiar—patterns in
            relationships, family dynamics, fears, responsibilities, or
            choices that seem to repeat themselves.
          </p>

          <p class="mt-5 max-w-xl text-base leading-8 text-white/50">
            Exploring ancestral and karmic themes can offer another lens
            through which to understand these experiences and consider what
            you may want to consciously carry forward—and what you may be
            ready to release.
          </p>

          <Button
            class="mt-8 rounded-full bg-white text-[#090711] hover:bg-amber-100"
          >
            Explore Ancestral Patterns

            <ArrowRight class="ml-2 h-4 w-4" />
          </Button>
        </div>

        <!-- Symbolic lineage visual -->
        <div
          class="relative flex min-h-[430px] items-center justify-center"
        >
          <!-- Orbital rings -->
          <div
            class="absolute h-[360px] w-[360px] rounded-full border border-white/[0.06]"
          />

          <div
            class="absolute h-[260px] w-[260px] rounded-full border border-amber-200/[0.08]"
          />

          <div
            class="absolute h-[160px] w-[160px] rounded-full border border-amber-200/[0.12]"
          />

          <!-- Center -->
          <div
            class="relative flex h-28 w-28 items-center justify-center rounded-full border border-amber-200/30 bg-amber-100/[0.04] shadow-[0_0_80px_rgba(253,230,138,0.08)]"
          >
            <Sparkles class="h-8 w-8 text-amber-200/80" />
          </div>

          <!-- Floating symbols -->
          <div
            class="absolute left-[10%] top-[20%] flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]"
          >
            <Star class="h-4 w-4 text-white/50" />
          </div>

          <div
            class="absolute right-[10%] top-[30%] flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]"
          >
            <Moon class="h-4 w-4 text-white/50" />
          </div>

          <div
            class="absolute bottom-[18%] left-[20%] flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]"
          >
            <CircleDot class="h-4 w-4 text-white/40" />
          </div>

          <div
            class="absolute bottom-[15%] right-[20%] flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]"
          >
            <Orbit class="h-4 w-4 text-white/40" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<template>
  <footer
    class="relative isolate overflow-hidden border-t border-[#C58B92]/[0.08] bg-[#160B10] text-[#F1E8E3]"
  >
    <!-- =========================================================
         FOOTER ATMOSPHERE
         Opaque layers intentionally prevent the global bg_img
         from appearing inside the footer.
    ========================================================== -->

    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 -z-10 bg-[#160B10]"
    />

    <div
      aria-hidden="true"
      class="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-[#6B0F1A]/[0.075] blur-[120px]"
    />

    <div
      aria-hidden="true"
      class="pointer-events-none absolute -right-48 top-16 -z-10 h-[28rem] w-[28rem] rounded-full bg-[#42141F]/[0.12] blur-[130px]"
    />

    <div
      aria-hidden="true"
      class="pointer-events-none absolute -left-48 bottom-0 -z-10 h-[24rem] w-[24rem] rounded-full bg-[#7E3541]/[0.055] blur-[120px]"
    />

    <!-- Very subtle celestial ring -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute right-[7%] top-16 -z-10 hidden h-72 w-72 rounded-full border border-[#C58B92]/[0.035] lg:block"
    />

    <div
      aria-hidden="true"
      class="pointer-events-none absolute right-[10%] top-24 -z-10 hidden h-56 w-56 rounded-full border border-[#C8A77A]/[0.035] lg:block"
    />

    <span
      aria-hidden="true"
      class="pointer-events-none absolute right-[14.7%] top-[7.6rem] -z-10 hidden h-1.5 w-1.5 rounded-full bg-[#C8A77A]/40 shadow-[0_0_16px_rgba(200,167,122,.35)] lg:block"
    />

    <!-- Sparse dust -->
    <span
      aria-hidden="true"
      class="absolute left-[8%] top-[19%] h-1 w-1 rounded-full bg-[#C58B92]/20"
    />

    <span
      aria-hidden="true"
      class="absolute left-[42%] top-[13%] h-1 w-1 rounded-full bg-[#F1E8E3]/10"
    />

    <span
      aria-hidden="true"
      class="absolute right-[31%] top-[42%] h-1.5 w-1.5 rounded-full bg-[#C8A77A]/20"
    />

    <span
      aria-hidden="true"
      class="absolute left-[22%] bottom-[21%] h-1 w-1 rounded-full bg-[#C58B92]/20"
    />

    <!-- =========================================================
         TOP HORIZON
    ========================================================== -->

    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C58B92]/20 to-transparent"
    />
    
    <div class="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
      <div
        class="grid gap-14 py-16 sm:py-20 lg:grid-cols-[1.5fr_.7fr_.7fr_.9fr] lg:gap-16"
      >
        <div class="max-w-sm">

          <!-- Logo -->
          <NuxtLink
            to="/"
            aria-label="Sammy Vedic Astrology home"
            class="group relative inline-flex items-center outline-none"
          >
            <!-- Logo glow -->
            <span
              aria-hidden="true"
              class="pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C8A77A]/[0.08] opacity-0 blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-100"
            />

            <!-- Logo -->
            <span
              class="relative flex items-center justify-center overflow-visible"
            >
              <img
                src="/images/logo/logo.png"
                alt="Sammy Vedic Astrology"
                class="h-11 w-auto object-contain transition-transform duration-700 ease-out group-hover:scale-[1.035] lg:h-14"
              />
            </span>

            <!-- Celestial accent -->
            <span
              aria-hidden="true"
              class="pointer-events-none absolute -right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#C8A77A]/80 shadow-[0_0_12px_rgba(200,167,122,.7)]"
            />
          </NuxtLink>

          <!-- Brand description -->
          <p
            class="mt-6 max-w-sm text-sm leading-7 text-[#F1E8E3]/38"
          >
            Vedic astrology and intuitive guidance for deeper
            reflection, greater clarity, and a more conscious
            relationship with the patterns shaping your life.
          </p>

          <!-- Philosophy -->
          <div
            class="mt-7 border-l border-[#C8A77A]/25 pl-4"
          >
            <p
              class="font-serif text-sm italic leading-6 text-[#C8A77A]/55"
            >
              “See yourself a little more clearly.”
            </p>
          </div>

          <!-- Coordinates -->
          <div
            class="mt-8 flex items-center gap-3 text-[8px] uppercase tracking-[0.24em] text-[#F1E8E3]/15"
          >
            <span class="h-px w-7 bg-[#C58B92]/15" />
            <span>Vedic astrology</span>
            <span class="h-1 w-1 rounded-full bg-[#C8A77A]/35" />
            <span>Intuitive guidance</span>
          </div>
        </div>

        <div>
          <p
            class="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#C8A77A]/55"
          >
            Explore
          </p>

          <nav
            aria-label="Explore"
            class="mt-6 flex flex-col gap-4"
          >
            <NuxtLink
              to="/"
              class="group flex w-fit items-center gap-2 text-xs text-[#F1E8E3]/35 transition-colors duration-300 hover:text-[#F1E8E3]/80"
            >
              <span
                class="h-px w-0 bg-[#C8A77A]/60 transition-all duration-300 group-hover:w-3"
              />
              Home
            </NuxtLink>

            <NuxtLink
              to="/#about"
              class="group flex w-fit items-center gap-2 text-xs text-[#F1E8E3]/35 transition-colors duration-300 hover:text-[#F1E8E3]/80"
            >
              <span
                class="h-px w-0 bg-[#C8A77A]/60 transition-all duration-300 group-hover:w-3"
              />
              About
            </NuxtLink>

            <NuxtLink
              to="/#readings"
              class="group flex w-fit items-center gap-2 text-xs text-[#F1E8E3]/35 transition-colors duration-300 hover:text-[#F1E8E3]/80"
            >
              <span
                class="h-px w-0 bg-[#C8A77A]/60 transition-all duration-300 group-hover:w-3"
              />
              Daily Readings
            </NuxtLink>

            <NuxtLink
              to="/#readings"
              class="group flex w-fit items-center gap-2 text-xs text-[#F1E8E3]/35 transition-colors duration-300 hover:text-[#F1E8E3]/80"
            >
              <span
                class="h-px w-0 bg-[#C8A77A]/60 transition-all duration-300 group-hover:w-3"
              />
              Book a Reading
            </NuxtLink>
          </nav>
        </div>

        <div>
          <p
            class="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#C8A77A]/55"
          >
            Guidance
          </p>

          <nav
            aria-label="Guidance"
            class="mt-6 flex flex-col gap-4"
          >
            <NuxtLink
              to="/#readings"
              class="group flex w-fit items-center gap-2 text-xs text-[#F1E8E3]/35 transition-colors duration-300 hover:text-[#F1E8E3]/80"
            >
              <span
                class="h-px w-0 bg-[#C8A77A]/60 transition-all duration-300 group-hover:w-3"
              />
              Birth Chart
            </NuxtLink>

            <NuxtLink
              to="/#readings"
              class="group flex w-fit items-center gap-2 text-xs text-[#F1E8E3]/35 transition-colors duration-300 hover:text-[#F1E8E3]/80"
            >
              <span
                class="h-px w-0 bg-[#C8A77A]/60 transition-all duration-300 group-hover:w-3"
              />
              Vedic Consultation
            </NuxtLink>

            <NuxtLink
              to="/#readings"
              class="group flex w-fit items-center gap-2 text-xs text-[#F1E8E3]/35 transition-colors duration-300 hover:text-[#F1E8E3]/80"
            >
              <span
                class="h-px w-0 bg-[#C8A77A]/60 transition-all duration-300 group-hover:w-3"
              />
              Deep Dive
            </NuxtLink>

            <NuxtLink
              to="/#readings"
              class="group flex w-fit items-center gap-2 text-xs text-[#F1E8E3]/35 transition-colors duration-300 hover:text-[#F1E8E3]/80"
            >
              <span
                class="h-px w-0 bg-[#C8A77A]/60 transition-all duration-300 group-hover:w-3"
              />
              Ancestral Karma
            </NuxtLink>
          </nav>
        </div>

        <div>
          <p
            class="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#C8A77A]/55"
          >
            Stay connected
          </p>

          <p
            class="mt-6 text-xs leading-6 text-[#F1E8E3]/30"
          >
            Follow the celestial rhythms and receive occasional
            reflections from Cleo Astro.
          </p>

          <!-- Socials -->
          <div class="mt-6 flex items-center gap-2">

            <a
              href="#"
              aria-label="Instagram"
              class="group flex h-10 w-10 items-center justify-center rounded-full border border-[#C58B92]/10 bg-[#1D0C13]/50 text-[9px] font-medium tracking-wide text-[#F1E8E3]/30 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C58B92]/25 hover:bg-[#261018] hover:text-[#F1E8E3]/80"
            >
              <span class="transition-transform duration-300 group-hover:scale-105">
                IG
              </span>
            </a>

            <a
              href="#"
              aria-label="Facebook"
              class="group flex h-10 w-10 items-center justify-center rounded-full border border-[#C58B92]/10 bg-[#1D0C13]/50 text-[9px] font-medium tracking-wide text-[#F1E8E3]/30 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C58B92]/25 hover:bg-[#261018] hover:text-[#F1E8E3]/80"
            >
              <span class="transition-transform duration-300 group-hover:scale-105">
                FB
              </span>
            </a>

            <a
              href="#"
              aria-label="WhatsApp"
              class="group flex h-10 w-10 items-center justify-center rounded-full border border-[#C58B92]/10 bg-[#1D0C13]/50 text-[9px] font-medium tracking-wide text-[#F1E8E3]/30 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C58B92]/25 hover:bg-[#261018] hover:text-[#F1E8E3]/80"
            >
              <span class="transition-transform duration-300 group-hover:scale-105">
                WA
              </span>
            </a>
          </div>

          <!-- Return to top -->
          <button
            type="button"
            class="group mt-8 inline-flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#F1E8E3]/25 transition-colors duration-300 hover:text-[#C8A77A]/70"
            @click="scrollToTop"
          >
            <span
              class="flex h-7 w-7 items-center justify-center rounded-full border border-[#C58B92]/10 transition-all duration-300 group-hover:border-[#C8A77A]/25 group-hover:bg-[#42141F]/25"
            >
              <ArrowUp
                class="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5"
                stroke-width="1.4"
              />
            </span>

            Return to the sky
          </button>
        </div>
      </div>

      <div
        aria-hidden="true"
        class="relative h-px bg-gradient-to-r from-transparent via-[#C58B92]/10 to-transparent"
      >
        <span
          class="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C8A77A]/45"
        />
      </div>

      <div
        class="flex flex-col gap-5 py-7 sm:flex-row sm:items-center sm:justify-between"
      >
        <p class="text-[10px] tracking-wide text-[#F1E8E3]/20">
          © {{ new Date().getFullYear() }} Cleo Astro.
          All rights reserved.
        </p>

        <div
          class="flex flex-wrap items-center gap-x-6 gap-y-3"
        >
          <NuxtLink
            to="/privacy"
            class="text-[10px] text-[#F1E8E3]/20 transition-colors duration-300 hover:text-[#F1E8E3]/55"
          >
            Privacy
          </NuxtLink>

          <NuxtLink
            to="/terms"
            class="text-[10px] text-[#F1E8E3]/20 transition-colors duration-300 hover:text-[#F1E8E3]/55"
          >
            Terms
          </NuxtLink>

          <span
            class="hidden h-3 w-px bg-[#C58B92]/10 sm:block"
          />

          <span
            class="flex items-center gap-2 text-[10px] text-[#F1E8E3]/20"
          >
            <span
              class="h-1.5 w-1.5 rounded-full bg-[#C8A77A]/60 shadow-[0_0_8px_rgba(200,167,122,.3)]"
            />

            Vedic astrology · Intuitive guidance
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ArrowUp } from "lucide-vue-next";

const scrollToTop = () => {
  if (import.meta.client) {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
};
</script>
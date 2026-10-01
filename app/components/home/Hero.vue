<script setup lang="ts">
import { ref } from "vue";
import {
  ArrowUpRight,
  Moon,
} from "lucide-vue-next";
import {
  motion,
  useReducedMotion,
} from "motion-v";
import type { Variant } from "motion-v";

import BookAReadingDialog from "@/components/booking/BookAReadingDialog.vue";

const bookingOpen = ref(false);

const prefersReducedMotion = useReducedMotion();

const openBooking = () => {
  bookingOpen.value = true;
};

const readTheSky = () => {
  if (!import.meta.client) return;

  const target =
    document.querySelector("#personal-horoscope") ||
    document.querySelector("#planetary-updates");

  target?.scrollIntoView({
    behavior: prefersReducedMotion.value ? "auto" : "smooth",
    block: "start",
  });
};

const enterTransition = {
  duration: 0.7,
  ease: [0.22, 1, 0.36, 1],
};

const slowEnterTransition = {
  duration: 0.9,
  ease: [0.22, 1, 0.36, 1],
};

const reducedOrNormal = (value: Variant): Variant => {
  if (prefersReducedMotion.value) {
    return {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
    };
  }

  return value;
};
</script>

<template>
  <section
    class="relative isolate min-h-[100svh] overflow-hidden bg-[#160B10] text-[#F1E8E3]"
  >
    <!-- =====================================================
         STATIC BACKGROUND
    ====================================================== -->

    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0"
    >
      <!-- Main background -->
      <div
        class="absolute inset-0 bg-[linear-gradient(115deg,#160B10_0%,#1B0B12_45%,#160B10_100%)]"
      />

      <!-- Static atmospheric fields.
           No blur filters. -->
      <div
        class="absolute -right-[15%] top-[8%] h-[680px] w-[680px] rounded-full bg-[#6B0F1A]/10"
      />

      <div
        class="absolute -bottom-[30%] left-[18%] h-[560px] w-[800px] rounded-full bg-[#42141F]/10"
      />

      <!-- Subtle radial atmosphere -->
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_73%_48%,rgba(107,15,26,.18),transparent_32%)]"
      />

      <!-- Horizon -->
      <div
        class="absolute left-[7%] right-[7%] top-[59%] h-px bg-gradient-to-r from-transparent via-[#C8A77A]/10 to-transparent"
      />

      <!-- Minimal stars -->
      <span
        class="absolute left-[12%] top-[22%] h-1 w-1 rounded-full bg-[#F1E8E3]/25"
      />

      <span
        class="absolute left-[28%] top-[17%] h-1 w-1 rounded-full bg-[#C8A77A]/30"
      />

      <span
        class="absolute left-[44%] top-[27%] h-0.5 w-0.5 rounded-full bg-[#F1E8E3]/25"
      />

      <span
        class="absolute right-[22%] top-[18%] h-1 w-1 rounded-full bg-[#C58B92]/25"
      />

      <span
        class="absolute right-[9%] top-[39%] h-0.5 w-0.5 rounded-full bg-[#F1E8E3]/20"
      />

      <span
        class="absolute left-[18%] top-[65%] h-0.5 w-0.5 rounded-full bg-[#C8A77A]/20"
      />

      <span
        class="absolute right-[28%] top-[72%] h-1 w-1 rounded-full bg-[#C58B92]/15"
      />

      <span
        class="absolute left-[52%] top-[12%] h-0.5 w-0.5 rounded-full bg-[#F1E8E3]/20"
      />
    </div>

    <!-- =====================================================
         TOP STATUS
    ====================================================== -->

    <motion.div
      class="absolute right-5 top-6 z-40 sm:right-8 sm:top-8 lg:right-12 xl:right-16"
      :initial="
        reducedOrNormal({
          opacity: 0,
          y: -8,
        })
      "
      :animate="{
        opacity: 1,
        y: 0,
      }"
      :transition="enterTransition"
    >
      <div class="flex items-center gap-3">
        <div class="text-right">
          <p
            class="text-[7px] uppercase tracking-[0.34em] text-[#C58B92]/45"
          >
            Live sky
          </p>

          <p
            class="mt-1 text-[8px] uppercase tracking-[0.18em] text-[#F1E8E3]/40"
          >
            Planetary movements
          </p>
        </div>

        <span
          class="flex h-3 w-3 items-center justify-center"
        >
          <span
            class="h-1.5 w-1.5 rounded-full bg-[#C8A77A]"
          />
        </span>
      </div>
    </motion.div>

    <!-- =====================================================
         DESKTOP AXIS
    ====================================================== -->

    <div
      aria-hidden="true"
      class="pointer-events-none absolute bottom-[9%] left-1/2 top-[14%] z-[2] hidden w-px -translate-x-1/2 lg:block"
    >
      <div
        class="absolute inset-0 bg-gradient-to-b from-transparent via-[#C58B92]/10 to-transparent"
      />

      <span
        class="absolute left-1/2 top-[24%] h-1.5 w-1.5 -translate-x-1/2 rounded-full border border-[#C8A77A]/35 bg-[#160B10]"
      />

      <span
        class="absolute bottom-[24%] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#C58B92]/30"
      />
    </div>

    <!-- =====================================================
         STATIC ORBIT
    ====================================================== -->

    <div
      aria-hidden="true"
      class="pointer-events-none absolute right-[-12%] top-1/2 z-[2] aspect-square w-[min(64vw,820px)] -translate-y-1/2"
    >
      <div
        class="absolute inset-0 rounded-full border border-[#C58B92]/[0.08]"
      />

      <div
        class="absolute inset-[12%] rounded-full border border-dashed border-[#C58B92]/[0.055]"
      />

      <div
        class="absolute inset-[27%] rounded-full border border-[#C8A77A]/[0.05]"
      />

      <span
        class="absolute left-[14%] top-[12%] h-1.5 w-1.5 rounded-full border border-[#C8A77A]/40 bg-[#160B10]"
      />

      <span
        class="absolute bottom-[23%] right-[9%] h-1.5 w-1.5 rounded-full border border-[#C8A77A]/35 bg-[#160B10]"
      />

      <span
        class="absolute left-[4%] top-1/2 h-1 w-1 rounded-full bg-[#C58B92]/30"
      />
    </div>

    <!-- =====================================================
         MAIN
    ====================================================== -->

    <div
      class="relative z-20 mx-auto flex min-h-[100svh] max-w-[1680px] items-center px-5 pb-24 pt-28 sm:px-8 lg:px-12 lg:pb-16 lg:pt-20 xl:px-20"
    >
      <div class="relative w-full">
        <!-- =================================================
             COPY
        ================================================== -->

        <div
          class="relative z-30 w-full max-w-[690px] lg:ml-[3%] xl:ml-[5%]"
        >
          <!-- Eyebrow -->

          <motion.div
            class="mb-7 flex items-center gap-4"
            :initial="
              reducedOrNormal({
                opacity: 0,
                y: 12,
              })
            "
            :animate="{
              opacity: 1,
              y: 0,
            }"
            :transition="{
              ...enterTransition,
              delay: 0.05,
            }"
          >
            <span
              class="relative flex h-5 w-5 items-center justify-center"
            >
              <span
                class="absolute inset-0 rounded-full border border-[#C58B92]/20"
              />

              <Moon
                class="relative h-3 w-3 text-[#C8A77A]/75"
                stroke-width="1"
              />
            </span>

            <span
              class="h-px w-8 bg-[#C8A77A]/35"
            />

            <span
              class="text-[9px] uppercase tracking-[0.34em] text-[#C58B92]/60 sm:text-[10px]"
            >
              Vedic astrology · intuitive guidance
            </span>
          </motion.div>

          <!-- =================================================
               HEADLINE
          ================================================== -->

          <motion.h1
            class="font-serif text-[clamp(4rem,8vw,8rem)] font-medium leading-[0.84] tracking-[-0.065em] text-[#F1E8E3]"
            :initial="
              reducedOrNormal({
                opacity: 0,
                y: 20,
              })
            "
            :animate="{
              opacity: 1,
              y: 0,
            }"
            :transition="{
              ...slowEnterTransition,
              delay: 0.12,
            }"
          >
            <span class="block">
              The sky
            </span>

            <span
              class="relative ml-[clamp(.7rem,4vw,4rem)] block text-[#C58B92]"
            >
              remembers.

              <span
                aria-hidden="true"
                class="absolute -bottom-4 left-1 h-px w-[clamp(70px,10vw,130px)] bg-gradient-to-r from-[#C8A77A]/55 to-transparent"
              />
            </span>
          </motion.h1>

          <!-- =================================================
               INTRO
          ================================================== -->

          <motion.div
            class="mt-9 max-w-[550px]"
            :initial="
              reducedOrNormal({
                opacity: 0,
                y: 14,
              })
            "
            :animate="{
              opacity: 1,
              y: 0,
            }"
            :transition="{
              ...enterTransition,
              delay: 0.28,
            }"
          >
            <p
              class="text-[14px] leading-7 text-[#F1E8E3]/60 sm:text-[15px]"
            >
              Through Vedic astrology and intuitive reading,
              I help you explore the deeper patterns behind
              your relationships, purpose, and experiences
              unfolding in your life.
            </p>
          </motion.div>

          <!-- =================================================
               CTA
          ================================================== -->

          <motion.div
            class="mt-9 flex flex-col gap-3 sm:flex-row"
            :initial="
              reducedOrNormal({
                opacity: 0,
                y: 14,
              })
            "
            :animate="{
              opacity: 1,
              y: 0,
            }"
            :transition="{
              ...enterTransition,
              delay: 0.4,
            }"
          >
            <!-- Primary -->
            <motion.button
              type="button"
              class="group inline-flex h-[54px] items-center justify-center rounded-full border border-[#C8A77A]/30 bg-[#6B0F1A] px-7 text-[12px] font-medium tracking-[0.04em] text-[#F1E8E3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A77A]/50 sm:min-w-[190px]"
              :whileHover="
                prefersReducedMotion
                  ? undefined
                  : {
                      y: -2,
                    }
              "
              :whilePress="
                prefersReducedMotion
                  ? undefined
                  : {
                      scale: 0.985,
                    }
              "
              @click="openBooking"
            >
              <span>
                Begin a Reading
              </span>

              <ArrowUpRight
                class="ml-3 h-4 w-4 opacity-75"
                stroke-width="1.4"
              />
            </motion.button>

            <!-- Secondary -->
            <motion.a
              href="/#readings"
              class="group inline-flex h-[54px] items-center justify-center rounded-full border border-[#C58B92]/20 bg-[#1D0C13]/80 px-7 text-[12px] font-medium tracking-[0.04em] text-[#F1E8E3]/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C58B92]/35 sm:min-w-[170px]"
              :whileHover="
                prefersReducedMotion
                  ? undefined
                  : {
                      y: -2,
                    }
              "
              :whilePress="
                prefersReducedMotion
                  ? undefined
                  : {
                      scale: 0.985,
                    }
              "
              @click="readTheSky"
            >
              <span>
                Read the Sky
              </span>

              <ArrowUpRight
                class="ml-3 h-4 w-4 opacity-60"
                stroke-width="1.4"
              />
            </motion.a>
          </motion.div>

          <!-- =================================================
               PHILOSOPHY
          ================================================== -->

          <motion.div
            class="mt-8 max-w-[500px]"
            :initial="
              reducedOrNormal({
                opacity: 0,
                y: 10,
              })
            "
            :animate="{
              opacity: 1,
              y: 0,
            }"
            :transition="{
              ...enterTransition,
              delay: 0.5,
            }"
          >
            <p
              class="text-[10px] leading-5 text-[#C58B92]/45 sm:text-[11px]"
            >
              My intention is not to tell you how to live
              your life, but to help you pause, reflect, and
              reconnect with your own inner wisdom.
            </p>
          </motion.div>
        </div>

        <!-- =================================================
             PORTRAIT
        ================================================== -->

        <motion.div
          class="pointer-events-none absolute bottom-[-11vh] right-[-7vw] z-10 w-[min(67vw,900px)]"
          :initial="
            reducedOrNormal({
              opacity: 0,
              x: 28,
            })
          "
          :animate="{
            opacity: 1,
            x: 0,
          }"
          :transition="{
            ...slowEnterTransition,
            delay: 0.1,
          }"
        >
          <!-- Static halo -->
          <div
            class="absolute left-1/2 top-[16%] h-[52%] w-[52%] -translate-x-1/2 rounded-full bg-[#6B0F1A]/12"
          />

          <!-- Static orbit -->
          <div
            class="absolute left-1/2 top-[6%] aspect-square w-[90%] -translate-x-1/2 rounded-full border border-[#C58B92]/[0.07]"
          />

          <div
            class="absolute left-1/2 top-[13%] aspect-square w-[73%] -translate-x-1/2 rounded-full border border-dashed border-[#C58B92]/[0.05]"
          />

          <!-- Portrait -->
          <div
            class="relative mx-auto aspect-[0.82/1] w-[70%]"
          >
            <img
              src="/images/sammy.PNG"
              alt="Sammy — Vedic astrologer and intuitive reader"
              class="absolute inset-0 h-full w-full object-contain object-bottom contrast-[1.02] saturate-[0.96]"
              width="900"
              height="1098"
              loading="eager"
              fetchpriority="high"
              decoding="async"
              draggable="false"
            />

            <!-- Edge blending -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-[#160B10]/75 via-transparent to-[#160B10]/75"
            />

            <div
              class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#160B10]"
            />
          </div>

          <!-- Simple ground -->
          <div
            class="absolute bottom-[3%] left-1/2 h-5 w-[48%] -translate-x-1/2 rounded-full bg-black/25"
          />
        </motion.div>
      </div>
    </div>

    <!-- =====================================================
         DESKTOP FOOTER
    ====================================================== -->

    <motion.div
      class="absolute bottom-7 left-5 z-40 hidden sm:flex lg:left-12 xl:left-16"
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :transition="{
        duration: 0.6,
        delay: 0.65,
      }"
    >
      <div class="flex items-center gap-3">
        <span
          class="h-px w-8 bg-[#C8A77A]/20"
        />

        <div>
          <p
            class="text-[7px] uppercase tracking-[0.34em] text-[#C58B92]/40"
          >
            Observe
          </p>

          <p
            class="mt-1 text-[8px] text-[#F1E8E3]/30"
          >
            Pause before interpretation
          </p>
        </div>
      </div>
    </motion.div>

    <motion.div
      class="absolute bottom-7 right-5 z-40 hidden sm:flex lg:right-12 xl:right-16"
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :transition="{
        duration: 0.6,
        delay: 0.7,
      }"
    >
      <div class="flex items-center gap-3 text-right">
        <div>
          <p
            class="text-[7px] uppercase tracking-[0.34em] text-[#C58B92]/40"
          >
            Align
          </p>

          <p
            class="mt-1 text-[8px] text-[#F1E8E3]/30"
          >
            Patterns · purpose · perspective
          </p>
        </div>

        <span
          class="h-px w-8 bg-[#C8A77A]/20"
        />
      </div>
    </motion.div>

    <!-- =====================================================
         MOBILE FOOTER
    ====================================================== -->

    <motion.div
      class="absolute bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 sm:hidden"
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :transition="{
        duration: 0.6,
        delay: 0.7,
      }"
    >
      <span
        class="h-px w-5 bg-[#C8A77A]/20"
      />

      <span
        class="whitespace-nowrap text-[7px] uppercase tracking-[0.26em] text-[#C58B92]/40"
      >
        Read the patterns
      </span>

      <span
        class="h-px w-5 bg-[#C8A77A]/20"
      />
    </motion.div>

    <!-- =====================================================
         BOOKING
    ====================================================== -->

    <BookAReadingDialog
      v-model:open="bookingOpen"
    />
  </section>
</template>
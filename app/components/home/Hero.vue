<script setup lang="ts">
import { ref } from "vue";
import {
  ArrowRight,
  ChevronDown,
  Compass,
  Moon,
  Orbit,
  Sparkles,
  Sun,
  Zap,
} from "lucide-vue-next";
import { motion, useReducedMotion } from "motion-v";
import { Button } from "@/components/ui/button";
import BookAReadingDialog from "@/components/booking/BookAReadingDialog.vue";

const prefersReducedMotion = useReducedMotion();
const bookingOpen = ref(false);

const openBooking = () => {
  bookingOpen.value = true;
};

const handleReadingSelection = (reading: {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
}) => {
  /*
   * The selected reading is now available here.
   *
   * Later, this is where you can:
   *
   * 1. Open your booking form
   * 2. Navigate to /book/[reading]
   * 3. Launch Calendly
   * 4. Connect Paystack
   * 5. Store the selected service
   */

  console.log("Selected reading:", reading);
};

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
    influence: "Expression & communication",
    icon: Zap,
  },
  {
    planet: "Venus",
    position: "08° Cancer",
    influence: "Connection & values",
    icon: Sparkles,
  },
];

const stars = Array.from({ length: 65 }, (_, index) => ({
  id: index,
  left: `${(index * 37 + 11) % 100}%`,
  top: `${(index * 61 + 7) % 100}%`,
  delay: (index % 11) * 0.45,
  duration: 3.5 + (index % 6) * 0.7,
  size:
    index % 9 === 0
      ? "2.5px"
      : index % 3 === 0
        ? "2px"
        : "1px",
}));

const easeOut = [0.22, 1, 0.36, 1] as const;
const easeInOut = "easeInOut" as const;
const linear = "linear" as const;
const easeOutSimple = "easeOut" as const;

const heroOpacity = prefersReducedMotion.value
  ? 1
  : [0, 1];

const heroY = prefersReducedMotion.value
  ? 0
  : [24, 0];

const heroX = prefersReducedMotion.value
  ? 0
  : [20, 0];

const portraitScale = prefersReducedMotion.value
  ? 1
  : [1.045, 1];

const portraitX = prefersReducedMotion.value
  ? 0
  : [28, 0];

const portraitY = prefersReducedMotion.value
  ? 0
  : [0, -5, 0, 4, 0];

const portraitFloatingScale = prefersReducedMotion.value
  ? 1
  : [1, 1.008, 1.012, 1.006, 1];

const portraitFloatingX = prefersReducedMotion.value
  ? 0
  : [0, -2, 0, 2, 0];

const cardFloatingY = prefersReducedMotion.value
  ? 0
  : [0, -7, 0, 6, 0];

const cardFloatingRotateX = prefersReducedMotion.value
  ? 0
  : [0, 0.25, 0, -0.2, 0];

const cardFloatingRotateY = prefersReducedMotion.value
  ? 0
  : [0, 0.4, 0, -0.35, 0];
</script>

<template>
  <section
    class="relative isolate flex min-h-[700px] items-center overflow-hidden bg-[#080611] pt-16 sm:min-h-[720px] lg:min-h-[760px] lg:pt-20"
  >
    <div
      class="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <!-- Main image -->

      <motion.img
        src="/images/sammy.png"
        alt="Sammy, Vedic astrologer and intuitive reader"
        class="absolute left-1/2 top-1/2 h-[94%] w-[115%] -translate-x-[24%] -translate-y-1/2 object-contain object-right opacity-[0.92] sm:h-[96%] sm:w-[105%] sm:-translate-x-[20%] lg:left-auto lg:right-[-4%] lg:h-[104%] lg:w-[72%] lg:translate-x-0"
        :initial="{
          opacity: 0,
          scale: 1.045,
          x: 28,
        }"
        :animate="{
          opacity: 0.92,
          scale: portraitFloatingScale,
          x: portraitFloatingX,
          y: portraitY,
        }"
        :transition="{
          opacity: {
            duration: 1.4,
            delay: 0.1,
            ease: easeOut,
          },
          scale: {
            duration: 18,
            repeat: Infinity,
            ease: easeInOut,
          },
          x: {
            duration: 18,
            repeat: Infinity,
            ease: easeInOut,
          },
          y: {
            duration: 18,
            repeat: Infinity,
            ease: easeInOut,
          },
        }"
      />

      <!-- Left readability layer -->

      <div
        class="absolute inset-0 bg-gradient-to-r from-[#080611] via-[#080611]/95 via-[38%] to-[#080611]/15"
      />

      <!-- Desktop portrait veil -->

      <div
        class="absolute inset-y-0 right-0 hidden w-[65%] bg-gradient-to-r from-transparent via-[#080611]/10 to-transparent lg:block"
      />

      <!-- Mobile readability -->

      <div
        class="absolute inset-0 bg-gradient-to-t from-[#080611] via-[#080611]/40 to-[#080611]/20 lg:hidden"
      />

      <!-- Bottom fade -->

      <div
        class="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#080611] via-[#080611]/70 to-transparent"
      />

      <!-- Top fade -->

      <div
        class="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#080611]/80 to-transparent"
      />

      <motion.div
        class="absolute -left-[280px] -top-[180px] h-[620px] w-[620px] rounded-full bg-violet-800/[0.08] blur-[160px]"
        :animate="
          prefersReducedMotion
            ? {}
            : {
                x: [0, 35, 0, -25, 0],
                y: [0, 20, 0, -15, 0],
                scale: [1, 1.06, 1.1, 1.04, 1],
                opacity: [0.55, 0.7, 0.55, 0.65, 0.55],
              }
        "
        :transition="
          prefersReducedMotion
            ? {}
            : {
                duration: 24,
                repeat: Infinity,
                ease: easeInOut,
              }
        "
      />

      <motion.div
        class="absolute right-[-180px] top-[10%] h-[650px] w-[650px] rounded-full bg-amber-300/[0.045] blur-[170px]"
        :animate="
          prefersReducedMotion
            ? {}
            : {
                x: [0, -25, 0, 20, 0],
                y: [0, 25, 0, -20, 0],
                scale: [1, 1.08, 1.14, 1.06, 1],
                opacity: [0.45, 0.6, 0.5, 0.62, 0.45],
              }
        "
        :transition="
          prefersReducedMotion
            ? {}
            : {
                duration: 28,
                repeat: Infinity,
                ease: easeInOut,
              }
        "
      />

      <motion.div
        class="absolute -bottom-[280px] right-[15%] h-[600px] w-[600px] rounded-full bg-indigo-900/[0.07] blur-[160px]"
        :animate="
          prefersReducedMotion
            ? {}
            : {
                x: [0, -30, 0, 25, 0],
                scale: [1, 1.08, 1, 1.06, 1],
              }
        "
        :transition="
          prefersReducedMotion
            ? {}
            : {
                duration: 30,
                repeat: Infinity,
                ease: easeInOut,
              }
        "
      />
    </div>

    <div
      class="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <motion.span
        v-for="star in stars"
        :key="star.id"
        class="absolute rounded-full bg-white"
        :style="{
          left: star.left,
          top: star.top,
          width: star.size,
          height: star.size,
        }"
        :animate="
          prefersReducedMotion
            ? {}
            : {
                opacity: [0.08, 0.45, 0.75, 0.35, 0.08],
                scale: [0.7, 1, 1.25, 1, 0.7],
              }
        "
        :transition="
          prefersReducedMotion
            ? {}
            : {
                duration: star.duration,
                delay: star.delay,
                repeat: Infinity,
                ease: easeInOut,
              }
        "
      />
    </div>

    <div
      class="pointer-events-none absolute right-[-270px] top-1/2 hidden h-[760px] w-[760px] -translate-y-1/2 lg:block"
      aria-hidden="true"
    >
      <motion.div
        class="absolute inset-[-80px] rounded-full border border-amber-100/[0.018]"
        :animate="
          prefersReducedMotion
            ? {}
            : {
                scale: [1, 1.035, 1],
                opacity: [0.4, 0.7, 0.4],
              }
        "
        :transition="
          prefersReducedMotion
            ? {}
            : {
                duration: 9,
                repeat: Infinity,
                ease: easeInOut,
              }
        "
      />

      <motion.div
        class="absolute inset-0 rounded-full border border-amber-100/[0.045]"
        :animate="
          prefersReducedMotion
            ? {}
            : {
                rotate: 360,
              }
        "
        :transition="
          prefersReducedMotion
            ? {}
            : {
                duration: 100,
                repeat: Infinity,
                ease: linear,
              }
        "
      >
        <motion.span
          class="absolute left-[14%] top-[-3px] h-3 w-3 rounded-full bg-amber-200 shadow-[0_0_25px_rgba(253,230,138,0.9)]"
          :animate="
            prefersReducedMotion
              ? {}
              : {
                  scale: [1, 1.3, 1],
                  opacity: [0.7, 1, 0.7],
                }
          "
          :transition="
            prefersReducedMotion
              ? {}
              : {
                  duration: 4,
                  repeat: Infinity,
                  ease: easeInOut,
                }
          "
        />
      </motion.div>

      <motion.div
        class="absolute inset-[65px] rounded-full border border-amber-100/[0.055]"
        :animate="
          prefersReducedMotion
            ? {}
            : {
                rotate: -360,
              }
        "
        :transition="
          prefersReducedMotion
            ? {}
            : {
                duration: 67,
                repeat: Infinity,
                ease: linear,
              }
        "
      >
        <motion.span
          class="absolute bottom-[12%] left-[-4px] h-2.5 w-2.5 rounded-full bg-violet-200 shadow-[0_0_20px_rgba(196,181,253,0.9)]"
          :animate="
            prefersReducedMotion
              ? {}
              : {
                  scale: [1, 1.25, 1],
                  opacity: [0.5, 1, 0.5],
                }
          "
          :transition="
            prefersReducedMotion
              ? {}
              : {
                  duration: 4.5,
                  repeat: Infinity,
                  ease: easeInOut,
                }
          "
        />
      </motion.div>

      <motion.div
        class="absolute inset-[135px] rounded-full border border-violet-200/[0.05]"
        :animate="
          prefersReducedMotion
            ? {}
            : {
                rotate: 360,
              }
        "
        :transition="
          prefersReducedMotion
            ? {}
            : {
                duration: 52,
                repeat: Infinity,
                ease: linear,
              }
        "
      >
        <motion.span
          class="absolute right-[7%] top-[11%] h-2 w-2 rounded-full bg-white shadow-[0_0_18px_white]"
          :animate="
            prefersReducedMotion
              ? {}
              : {
                  scale: [0.8, 1.25, 0.8],
                }
          "
          :transition="
            prefersReducedMotion
              ? {}
              : {
                  duration: 3.5,
                  repeat: Infinity,
                  ease: easeInOut,
                }
          "
        />
      </motion.div>

      <motion.div
        class="absolute inset-[205px] rounded-full border border-white/[0.04]"
        :animate="
          prefersReducedMotion
            ? {}
            : {
                rotate: -360,
              }
        "
        :transition="
          prefersReducedMotion
            ? {}
            : {
                duration: 40,
                repeat: Infinity,
                ease: linear,
              }
        "
      >
        <motion.span
          class="absolute bottom-[5%] right-[19%] h-1.5 w-1.5 rounded-full bg-amber-100 shadow-[0_0_15px_rgba(253,230,138,0.85)]"
          :animate="
            prefersReducedMotion
              ? {}
              : {
                  opacity: [0.4, 1, 0.4],
                }
          "
          :transition="
            prefersReducedMotion
              ? {}
              : {
                  duration: 3,
                  repeat: Infinity,
                  ease: easeInOut,
                }
          "
        />
      </motion.div>

      <motion.div
        class="absolute inset-[275px] rounded-full border border-amber-100/[0.035]"
        :animate="
          prefersReducedMotion
            ? {}
            : {
                rotate: 360,
              }
        "
        :transition="
          prefersReducedMotion
            ? {}
            : {
                duration: 30,
                repeat: Infinity,
                ease: linear,
              }
        "
      >
        <motion.span
          class="absolute left-[3%] top-[25%] h-1 w-1 rounded-full bg-violet-100 shadow-[0_0_12px_rgba(221,214,254,0.8)]"
          :animate="
            prefersReducedMotion
              ? {}
              : {
                  scale: [0.7, 1.4, 0.7],
                }
          "
          :transition="
            prefersReducedMotion
              ? {}
              : {
                  duration: 3,
                  repeat: Infinity,
                  ease: easeInOut,
                }
          "
        />
      </motion.div>

      <motion.div
        class="absolute left-1/2 top-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
        :animate="
          prefersReducedMotion
            ? {}
            : {
                scale: [1, 1.045, 1, 1.035, 1],
              }
        "
        :transition="
          prefersReducedMotion
            ? {}
            : {
                duration: 8,
                repeat: Infinity,
                ease: easeInOut,
              }
        "
      >
        <motion.div
          class="absolute inset-0 rounded-full bg-amber-200/[0.035] blur-2xl"
          :animate="
            prefersReducedMotion
              ? {}
              : {
                  scale: [0.9, 1.25, 0.9],
                  opacity: [0.35, 0.7, 0.35],
                }
          "
          :transition="
            prefersReducedMotion
              ? {}
              : {
                  duration: 6,
                  repeat: Infinity,
                  ease: easeInOut,
                }
          "
        />

        <div
          class="relative flex h-16 w-16 items-center justify-center rounded-full border border-amber-200/20 bg-amber-100/[0.025] shadow-[0_0_90px_rgba(253,230,138,0.12)]"
        >
          <Sun class="h-5 w-5 text-amber-200/60" />
        </div>
      </motion.div>
    </div>

    <div
      class="pointer-events-none absolute -right-[180px] top-[15%] h-[380px] w-[380px] opacity-60 lg:hidden"
      aria-hidden="true"
    >
      <motion.div
        class="absolute inset-0 rounded-full border border-amber-100/[0.035]"
        :animate="
          prefersReducedMotion
            ? {}
            : {
                rotate: 360,
              }
        "
        :transition="
          prefersReducedMotion
            ? {}
            : {
                duration: 90,
                repeat: Infinity,
                ease: linear,
              }
        "
      />

      <motion.div
        class="absolute inset-[55px] rounded-full border border-violet-200/[0.035]"
        :animate="
          prefersReducedMotion
            ? {}
            : {
                rotate: -360,
              }
        "
        :transition="
          prefersReducedMotion
            ? {}
            : {
                duration: 55,
                repeat: Infinity,
                ease: linear,
              }
        "
      >
        <motion.span
          class="absolute left-[12%] top-[-2px] h-2 w-2 rounded-full bg-amber-200/70 shadow-[0_0_15px_rgba(253,230,138,0.8)]"
          :animate="
            prefersReducedMotion
              ? {}
              : {
                  scale: [1, 1.25, 1],
                }
          "
          :transition="
            prefersReducedMotion
              ? {}
              : {
                  duration: 3.5,
                  repeat: Infinity,
                  ease: easeInOut,
                }
          "
        />
      </motion.div>

      <div
        class="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-200/10 bg-amber-100/[0.02]"
      >
        <div
          class="absolute inset-0 rounded-full bg-amber-200/[0.035] blur-xl"
        />
      </div>
    </div>

    <div
      class="relative z-10 mx-auto flex w-full max-w-7xl items-center px-6 py-12 lg:px-8 lg:py-16"
    >
      <div
        class="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_0.72fr] xl:gap-16"
      >
        <div class="relative max-w-2xl">
          <motion.div
            class="mb-5 inline-flex items-center gap-3 rounded-full border border-amber-200/15 bg-black/20 px-3.5 py-1.5 backdrop-blur-md"
            :initial="{
              opacity: 0,
              y: 18,
            }"
            :animate="{
              opacity: heroOpacity,
              y: heroY,
            }"
            :transition="{
              duration: 0.75,
              delay: 0.15,
              ease: easeOut,
            }"
          >
            <span class="relative flex h-1.5 w-1.5">
              <motion.span
                class="absolute inline-flex h-full w-full rounded-full bg-amber-200"
                :animate="
                  prefersReducedMotion
                    ? {}
                    : {
                        scale: [1, 2, 1],
                        opacity: [0.45, 0, 0.45],
                      }
                "
                :transition="
                  prefersReducedMotion
                    ? {}
                    : {
                        duration: 2.6,
                        repeat: Infinity,
                        ease: easeOutSimple,
                      }
                "
              />

              <span
                class="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-200 shadow-[0_0_10px_rgba(253,230,138,0.7)]"
              />
            </span>

            <span
              class="text-[8px] uppercase tracking-[0.28em] text-amber-100/65"
            >
              Vedic Astrology · Intuitive Guidance
            </span>
          </motion.div>

          <motion.p
            class="font-serif text-lg italic text-amber-100/80 sm:text-xl"
            :initial="{
              opacity: 0,
              y: 20,
            }"
            :animate="{
              opacity: heroOpacity,
              y: heroY,
            }"
            :transition="{
              duration: 0.8,
              delay: 0.25,
              ease: easeOut,
            }"
          >
            I'm Sammy.
          </motion.p>

          <motion.h1
            class="mt-2 max-w-[680px] font-serif text-[3rem] leading-[0.96] tracking-[-0.045em] text-white sm:text-5xl lg:text-[62px] xl:text-[70px]"
            :initial="{
              opacity: 0,
              y: 24,
            }"
            :animate="{
              opacity: heroOpacity,
              y: heroY,
            }"
            :transition="{
              duration: 0.9,
              delay: 0.35,
              ease: easeOut,
            }"
          >
            Understand the

            <motion.span
              class="block bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-400 bg-clip-text pb-1 text-transparent"
              :animate="
                prefersReducedMotion
                  ? {}
                  : {
                      backgroundPosition: [
                        '0% 50%',
                        '100% 50%',
                        '0% 50%',
                      ],
                    }
              "
              :transition="
                prefersReducedMotion
                  ? {}
                  : {
                      duration: 9,
                      repeat: Infinity,
                      ease: linear,
                    }
              "
              style="background-size: 220% 220%"
            >
              patterns
            </motion.span>

            shaping your life.
          </motion.h1>

          <motion.p
            class="mt-5 max-w-xl text-sm leading-6 text-white/55 sm:text-base sm:leading-7"
            :initial="{
              opacity: 0,
              y: 22,
            }"
            :animate="{
              opacity: heroOpacity,
              y: heroY,
            }"
            :transition="{
              duration: 0.85,
              delay: 0.5,
              ease: easeOut,
            }"
          >
            Through Vedic astrology and intuitive reading, I help you explore
            the deeper patterns, relationships, purpose, and experiences
            unfolding in your life.
          </motion.p>

          <motion.div
            class="mt-6 flex flex-col gap-2.5 sm:flex-row"
            :initial="{
              opacity: 0,
              y: 20,
            }"
            :animate="{
              opacity: heroOpacity,
              y: heroY,
            }"
            :transition="{
              duration: 0.85,
              delay: 0.65,
              ease: easeOut,
            }"
          >
            <motion.div
              :whileHover="
                prefersReducedMotion
                  ? {}
                  : {
                      y: -3,
                      scale: 1.02,
                    }
              "
              :whileTap="
                prefersReducedMotion
                  ? {}
                  : {
                      scale: 0.98,
                    }
              "
              :transition="{
                duration: 0.25,
              }"
            >
              <Button
                size="lg"
                class="group h-11 rounded-full bg-amber-100 px-6 text-sm blu shadow-[0_0_30px_rgba(253,230,138,0.10)] hover:bg-amber-200"
                @click="openBooking"
              >
                Book a Reading

                <ArrowRight
                  class="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Button>
            </motion.div>

            <motion.div
              :whileHover="
                prefersReducedMotion
                  ? {}
                  : {
                      y: -3,
                    }
              "
              :whileTap="
                prefersReducedMotion
                  ? {}
                  : {
                      scale: 0.98,
                    }
              "
              :transition="{
                duration: 0.25,
              }"
            >
              <NuxtLink to="/#planets">
                <Button
                  size="lg"
                  variant="outline"
                  class="h-11 rounded-full border-white/15 bg-white/[0.025] px-6 text-sm text-white backdrop-blur-md hover:bg-white/10"
                >
                  Read The Sky
                </Button>
              </NuxtLink>
            </motion.div>
          </motion.div>

          <motion.div
            class="mt-7 flex max-w-lg items-start gap-3 border-t border-white/10 pt-5"
            :initial="{
              opacity: 0,
              y: 18,
            }"
            :animate="{
              opacity: heroOpacity,
              y: heroY,
            }"
            :transition="{
              duration: 0.85,
              delay: 0.8,
              ease: easeOut,
            }"
          >
            <div
              class="mt-1 h-8 w-px bg-gradient-to-b from-amber-200/30 to-transparent"
            />

            <p class="text-[11px] leading-5 text-white/35 sm:text-xs">
              My intention is not to tell you how to live your life, but to
              help you pause, reflect, and reconnect with your own inner
              wisdom.
            </p>
          </motion.div>
        </div>

        <motion.div
          class="relative mt-6 flex justify-center lg:mt-0 lg:justify-end"
          :initial="{
            opacity: 0,
            x: 35,
            scale: 0.96,
          }"
          :animate="{
            opacity: 1,
            x: 0,
            scale: 1,
          }"
          :transition="{
            duration: 1.1,
            delay: 0.45,
            ease: easeOut,
          }"
        >
          <motion.div
            class="relative w-full max-w-[360px]"
            :animate="{
              y: cardFloatingY,
              rotateX: cardFloatingRotateX,
              rotateY: cardFloatingRotateY,
            }"
            :transition="
              prefersReducedMotion
                ? {}
                : {
                    duration: 11,
                    repeat: Infinity,
                    ease: easeInOut,
                  }
            "
            style="transform-style: preserve-3d"
          >
            <motion.div
              class="absolute -inset-8 rounded-[45px] bg-amber-200/[0.02] blur-3xl"
              :animate="
                prefersReducedMotion
                  ? {}
                  : {
                      scale: [1, 1.08, 1],
                      opacity: [0.35, 0.65, 0.35],
                    }
              "
              :transition="
                prefersReducedMotion
                  ? {}
                  : {
                      duration: 8,
                      repeat: Infinity,
                      ease: easeInOut,
                    }
              "
            />

            <motion.div
              class="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#100d1a]/65 p-5 shadow-2xl backdrop-blur-xl"
              :whileHover="
                prefersReducedMotion
                  ? {}
                  : {
                      borderColor: 'rgba(253,230,138,0.18)',
                    }
              "
              :transition="{
                duration: 0.5,
              }"
            >
              <motion.div
                class="absolute right-[-20px] top-[-20px] h-40 w-40 rounded-full bg-amber-200/[0.055] blur-3xl"
                :animate="
                  prefersReducedMotion
                    ? {}
                    : {
                        x: [0, -12, 0],
                        y: [0, 12, 0],
                        scale: [1, 1.18, 1],
                      }
                "
                :transition="
                  prefersReducedMotion
                    ? {}
                    : {
                        duration: 9,
                        repeat: Infinity,
                        ease: easeInOut,
                      }
                "
              />

              <div class="relative">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <div class="flex items-center gap-2">
                      <motion.span
                        class="h-1.5 w-1.5 rounded-full bg-amber-200 shadow-[0_0_8px_rgba(253,230,138,0.7)]"
                        :animate="
                          prefersReducedMotion
                            ? {}
                            : {
                                opacity: [0.3, 1, 0.3],
                                scale: [0.8, 1.15, 0.8],
                              }
                        "
                        :transition="
                          prefersReducedMotion
                            ? {}
                            : {
                                duration: 2.8,
                                repeat: Infinity,
                                ease: easeInOut,
                              }
                        "
                      />

                      <span
                        class="text-[7px] uppercase tracking-[0.3em] text-amber-100/40"
                      >
                        Cosmic Reflection
                      </span>
                    </div>

                    <h2
                      class="mt-2 font-serif text-xl leading-tight text-white sm:text-2xl"
                    >
                      The sky is always moving.
                    </h2>

                    <p class="mt-1.5 text-[10px] leading-5 text-white/30">
                      A glimpse at the energies surrounding us now.
                    </p>
                  </div>

                  <motion.div
                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-amber-200/15 bg-amber-100/[0.035]"
                    :animate="
                      prefersReducedMotion
                        ? {}
                        : {
                            rotate: [0, 180, 360],
                          }
                    "
                    :transition="
                      prefersReducedMotion
                        ? {}
                        : {
                            duration: 20,
                            repeat: Infinity,
                            ease: linear,
                          }
                    "
                  >
                    <Orbit class="h-4 w-4 text-amber-200/65" />
                  </motion.div>
                </div>

                <div class="my-4 h-px bg-white/[0.08]" />

                <div class="space-y-2">
                  <motion.div
                    v-for="(planet, index) in planetaryUpdates"
                    :key="planet.planet"
                    class="group flex items-center justify-between rounded-xl border border-white/[0.05] bg-black/10 px-3 py-2.5"
                    :initial="{
                      opacity: 0,
                      x: 16,
                    }"
                    :animate="{
                      opacity: 1,
                      x: 0,
                    }"
                    :transition="{
                      duration: 0.6,
                      delay: 0.75 + index * 0.12,
                      ease: easeOut,
                    }"
                    :whileHover="
                      prefersReducedMotion
                        ? {}
                        : {
                            x: 4,
                            borderColor: 'rgba(253,230,138,0.12)',
                            backgroundColor: 'rgba(255,255,255,0.025)',
                          }
                    "
                  >
                    <div class="flex min-w-0 items-center gap-2.5">
                      <motion.div
                        class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100/[0.045]"
                        :animate="
                          prefersReducedMotion
                            ? {}
                            : {
                                y: [0, -2, 0, 2, 0],
                                rotate: [0, 4, 0, -4, 0],
                              }
                        "
                        :transition="
                          prefersReducedMotion
                            ? {}
                            : {
                                duration: 5 + index,
                                repeat: Infinity,
                                delay: index * 0.5,
                                ease: easeInOut,
                              }
                        "
                      >
                        <component
                          :is="planet.icon"
                          class="h-3 w-3 text-amber-200/70"
                        />
                      </motion.div>

                      <div class="min-w-0">
                        <p class="text-[11px] text-white/75">
                          {{ planet.planet }}
                        </p>

                        <p
                          class="mt-0.5 truncate text-[8px] text-white/25"
                        >
                          {{ planet.influence }}
                        </p>
                      </div>
                    </div>

                    <motion.span
                      class="ml-2 shrink-0 text-[8px] text-amber-100/50"
                      :animate="
                        prefersReducedMotion
                          ? {}
                          : {
                              opacity: [0.35, 0.7, 0.35],
                            }
                      "
                      :transition="
                        prefersReducedMotion
                          ? {}
                          : {
                              duration: 3.5 + index,
                              repeat: Infinity,
                              delay: index * 0.7,
                              ease: easeInOut,
                            }
                      "
                    >
                      {{ planet.position }}
                    </motion.span>
                  </motion.div>
                </div>

                <motion.div
                  class="mt-3 rounded-xl border border-amber-200/10 bg-amber-100/[0.025] px-3.5 py-3"
                  :whileHover="
                    prefersReducedMotion
                      ? {}
                      : {
                          borderColor: 'rgba(253,230,138,0.18)',
                          backgroundColor: 'rgba(253,230,138,0.04)',
                        }
                  "
                  :transition="{
                    duration: 0.4,
                  }"
                >
                  <div class="flex items-center gap-2.5">
                    <motion.div
                      :animate="
                        prefersReducedMotion
                          ? {}
                          : {
                              rotate: [0, 8, 0, -8, 0],
                            }
                      "
                      :transition="
                        prefersReducedMotion
                          ? {}
                          : {
                              duration: 7,
                              repeat: Infinity,
                              ease: easeInOut,
                            }
                      "
                    >
                      <Compass
                        class="h-3.5 w-3.5 shrink-0 text-amber-200/55"
                      />
                    </motion.div>

                    <div>
                      <p
                        class="text-[7px] uppercase tracking-[0.25em] text-amber-100/30"
                      >
                        The invitation
                      </p>

                      <p class="mt-0.5 font-serif text-xs text-white/65">
                        Notice what is asking for your attention.
                      </p>
                    </div>
                  </div>
                </motion.div>

                <div class="mt-3 flex items-center justify-between">
                  <span class="text-[8px] text-white/20">
                    Read the sky. Reflect within.
                  </span>

                  <motion.span
                    class="text-[8px] uppercase tracking-[0.2em] text-white/15"
                    :animate="
                      prefersReducedMotion
                        ? {}
                        : {
                            opacity: [0.4, 0.7, 0.4],
                          }
                    "
                    :transition="
                      prefersReducedMotion
                        ? {}
                        : {
                            duration: 5,
                            repeat: Infinity,
                            ease: easeInOut,
                          }
                    "
                  >
                    Sammy
                  </motion.span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>

    <div
      class="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#080611] to-transparent"
    />

    <motion.a
      href="#about"
      class="absolute bottom-4 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-1.5 text-white/20 transition-colors hover:text-white/50 md:flex"
      :animate="
        prefersReducedMotion
          ? {}
          : {
              y: [0, 4, 0],
              opacity: [0.2, 0.55, 0.2],
            }
      "
      :transition="
        prefersReducedMotion
          ? {}
          : {
              duration: 3.5,
              repeat: Infinity,
              ease: easeInOut,
            }
      "
    >
      <span class="text-[7px] uppercase tracking-[0.35em]">
        Explore
      </span>

      <ChevronDown class="h-3.5 w-3.5" />
    </motion.a>
  </section>

  <BookAReadingDialog
    v-model:open="bookingOpen"
    @select="handleReadingSelection"
  />
</template>

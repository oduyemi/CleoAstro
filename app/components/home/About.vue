<script setup lang="ts">
import { ArrowRight, Heart, Sparkles, Star } from "lucide-vue-next";
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

  console.log("Selected reading:", reading);
};
const noMotion = {};

const sectionContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const sectionItem = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const imageEntrance = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    x: -25,
  },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};
</script>

<template>
  <section
    id="about"
    class="relative isolate overflow-hidden border-t border-white/[0.06] bg-[#080611] py-24 sm:py-28 lg:py-36"
  >
    <div
      class="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <motion.div
        class="absolute -left-[260px] top-[8%] h-[600px] w-[600px] rounded-full bg-amber-300/[0.045] blur-[160px]"
        :animate="
          prefersReducedMotion
            ? noMotion
            : {
                x: [0, 25, 0, -20, 0],
                y: [0, 20, 0, -15, 0],
                scale: [1, 1.06, 1, 1.04, 1],
                opacity: [0.4, 0.58, 0.4, 0.52, 0.4],
              }
        "
        :transition="
          prefersReducedMotion
            ? {}
            : {
                duration: 26,
                repeat: Infinity,
                ease: 'easeInOut',
              }
        "
      />

      <motion.div
        class="absolute left-[38%] top-[35%] h-[380px] w-[380px] rounded-full bg-amber-100/[0.018] blur-[130px]"
        :animate="
          prefersReducedMotion
            ? noMotion
            : {
                scale: [1, 1.12, 1],
                opacity: [0.35, 0.6, 0.35],
              }
        "
        :transition="
          prefersReducedMotion
            ? {}
            : {
                duration: 14,
                repeat: Infinity,
                ease: 'easeInOut',
              }
        "
      />

      <!-- Violet counter glow -->
      <motion.div
        class="absolute -right-[280px] bottom-[-240px] h-[650px] w-[650px] rounded-full bg-violet-800/[0.045] blur-[170px]"
        :animate="
          prefersReducedMotion
            ? noMotion
            : {
                x: [0, -25, 0, 20, 0],
                y: [0, -18, 0, 15, 0],
                scale: [1, 1.08, 1, 1.05, 1],
              }
        "
        :transition="
          prefersReducedMotion
            ? {}
            : {
                duration: 32,
                repeat: Infinity,
                ease: 'easeInOut',
              }
        "
      />
    </div>

    <motion.div
      class="relative z-10 mx-auto max-w-7xl px-6 lg:px-8"
      :variants="sectionContainer"
      initial="hidden"
      whileInView="visible"
      :viewport="{ once: true, amount: 0.18 }"
    >
      <div
        class="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 xl:grid-cols-[0.9fr_1.1fr] xl:gap-28"
      >
 
        <motion.div
          class="relative mx-auto w-full max-w-[500px] lg:mx-0"
          :variants="imageEntrance"
        >
          <!-- Large ambient glow -->
          <motion.div
            class="absolute -inset-8 rounded-[50px] bg-amber-200/[0.035] blur-3xl"
            :animate="
              prefersReducedMotion
                ? noMotion
                : {
                    scale: [1, 1.06, 1],
                    opacity: [0.35, 0.6, 0.35],
                  }
            "
            :transition="
              prefersReducedMotion
                ? {}
                : {
                    duration: 10,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }
            "
          />

          <motion.div
            class="absolute -left-8 -top-8 h-[calc(100%+64px)] w-[calc(100%+64px)] rounded-[44px] border border-amber-200/[0.06]"
            :animate="
              prefersReducedMotion
                ? noMotion
                : {
                    rotate: [0, 1.5, 0, -1.5, 0],
                    scale: [1, 1.012, 1],
                  }
            "
            :transition="
              prefersReducedMotion
                ? {}
                : {
                    duration: 18,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }
            "
          />

          <div
            class="relative overflow-hidden rounded-[34px] border border-white/[0.10] bg-[#100d1a] p-2 shadow-[0_30px_100px_rgba(0,0,0,0.35)]"
          >
            <motion.div
              class="relative overflow-hidden rounded-[27px]"
              :whileHover="
                prefersReducedMotion
                  ? {}
                  : {
                      scale: 1.015,
                    }
              "
              :transition="{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }"
            >
              <img
                src="/images/astro.jpg"
                alt="Sammy during a spiritual astrology reading"
                class="aspect-[4/5] w-full object-cover"
              />

              <div
                class="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080611]/70 via-transparent to-amber-100/[0.04]"
              />

              <!-- Soft vignette -->
              <div
                class="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_rgba(8,6,17,0.28)]"
              />
            </motion.div>
          </div>

          <motion.div
            class="absolute -bottom-5 -right-3 rounded-2xl border border-amber-200/[0.12] bg-[#100d1a]/85 px-4 py-3 shadow-2xl backdrop-blur-xl sm:-right-6"
            :animate="
              prefersReducedMotion
                ? noMotion
                : {
                    y: [0, -5, 0, 4, 0],
                  }
            "
            :transition="
              prefersReducedMotion
                ? {}
                : {
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }
            "
          >
            <div class="flex items-center gap-2.5">
              <div
                class="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100/[0.06]"
              >
                <Sparkles
                  class="h-3.5 w-3.5 text-amber-200/65"
                />
              </div>

              <div>
                <p
                  class="text-[7px] uppercase tracking-[0.25em] text-amber-100/35"
                >
                  A moment to reflect
                </p>

                <p
                  class="mt-0.5 font-serif text-xs text-white/65"
                >
                  Come as you are.
                </p>
              </div>
            </div>
          </motion.div>

          <!-- Small orbiting dot -->
          <motion.div
            class="absolute -right-2 top-[18%] hidden h-2.5 w-2.5 rounded-full bg-amber-200 shadow-[0_0_18px_rgba(253,230,138,0.7)] sm:block"
            :animate="
              prefersReducedMotion
                ? noMotion
                : {
                    y: [0, 35, 0, -25, 0],
                    x: [0, -8, 0, 8, 0],
                    opacity: [0.5, 0.9, 0.5, 0.8, 0.5],
                  }
            "
            :transition="
              prefersReducedMotion
                ? {}
                : {
                    duration: 9,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }
            "
          />
        </motion.div>

        <motion.div
          class="relative max-w-3xl"
          :variants="sectionItem"
        >
          <!-- Eyebrow -->
          <div class="flex items-center gap-3">
            <span
              class="h-px w-8 bg-amber-200/40"
            />

            <span
              class="text-[9px] uppercase tracking-[0.3em] text-amber-200/55"
            >
              About Sammy
            </span>
          </div>

          <h2
            class="mt-6 max-w-2xl font-serif text-[2.75rem] leading-[1.02] tracking-[-0.035em] text-white sm:text-5xl lg:text-[56px]"
          >
            You don't have to
            <span class="text-amber-100/75">
              have it all figured out.
            </span>
          </h2>

          <p
            class="mt-7 font-serif text-xl leading-8 text-amber-100/85 sm:text-2xl sm:leading-9"
          >
            Hi, I'm Sammy.
          </p>

          <p
            class="mt-5 text-base leading-7 text-white/55 sm:text-lg sm:leading-8"
          >
            I believe there are moments in life when we simply need to
            pause. To step away from the noise, ask the questions we've
            been carrying, and make sense of what we are experiencing.
          </p>

          <p
            class="mt-6 text-base leading-7 text-white/55 sm:text-lg sm:leading-8"
          >
            Maybe you're trying to understand a relationship. Maybe you're
            standing at a crossroads. Maybe something keeps repeating in
            your life and you're beginning to wonder why.
          </p>

          <p
            class="mt-6 text-base leading-7 text-white/55 sm:text-lg sm:leading-8"
          >
            That's where my work begins. Through Vedic astrology and
            intuitive readings, we explore the patterns beneath the surface
            — including ancestral influences, karmic themes, relationships,
            purpose, and the energies surrounding you.
          </p>

          <motion.div class="relative mt-1 overflow-hidden rounded-[22px] border border-amber-200/[0.09] bg-gradient-to-br from-amber-100/[0.035] to-transparent p-6 sm:p-7"
            :whileHover="
              prefersReducedMotion
                ? {}
                : {
                    borderColor: 'rgba(253,230,138,0.16)',
                    y: -2,
                  }
            "
            :transition="{
              duration: 0.5,
            }"
          >
            <motion.div
              class="pointer-events-none absolute -right-20 -top-24 h-48 w-48 rounded-full bg-amber-200/[0.05] blur-3xl"
              :animate="
                prefersReducedMotion
                  ? noMotion
                  : {
                      x: [0, -18, 0],
                      y: [0, 15, 0],
                      scale: [1, 1.16, 1],
                    }
              "
              :transition="
                prefersReducedMotion
                  ? {}
                  : {
                      duration: 11,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
              "
            />

            <div class="relative">
              <div class="flex items-center gap-2">
                <Star class="h-3.5 w-3.5 text-amber-200/55" />

                <span
                  class="text-[8px] uppercase tracking-[0.3em] text-amber-100/35"
                >
                  My approach
                </span>
              </div>

              <p
                class="mt-4 max-w-2xl font-serif text-xl leading-8 text-white/75 sm:text-2xl sm:leading-9"
              >
                “I don't want to tell you who you are or what your life
                should become. I want to help you see yourself a little more
                clearly.”
              </p>

              <div class="mt-5 flex items-center gap-3">
                <span class="h-px w-7 bg-amber-200/25" />

                <span class="text-[9px] text-white/25">
                  Sammy
                </span>
              </div>
            </div>
          </motion.div>

          <div
            class="mt-9 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div class="flex items-start gap-3">
              <Heart
                class="mt-1 h-4 w-4 shrink-0 text-amber-200/45"
              />

              <p class="max-w-md text-sm leading-6 text-white/35">
                Bring the questions you have. You don't need to arrive with
                all the answers.
              </p>
            </div>

            <motion.div
              :whileHover="
                prefersReducedMotion
                  ? {}
                  : {
                      x: 4,
                    }
              "
              :transition="{
                duration: 0.3,
              }"
            >
              <Button
                variant="ghost"
                class="group w-fit rounded-full px-0 text-sm text-amber-100/65 hover:bg-transparent hover:text-amber-100"
                @click="openBooking"
              >
                Book a Reading

                <ArrowRight
                  class="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Button>
            </motion.div>
          </div>

          
        </motion.div>
      </div>
    </motion.div>

    <div
      class="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#080611] to-transparent"
    />
  </section>

  <BookAReadingDialog
    v-model:open="bookingOpen"
    @select="handleReadingSelection"
  />
</template>
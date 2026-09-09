<script setup lang="ts">
import { ArrowRight } from "lucide-vue-next";
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
      staggerChildren: 0.13,
      delayChildren: 0.08,
    },
  },
};

const sectionItem = {
  hidden: {
    opacity: 0,
    y: 22,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const imageEntrance = {
  hidden: {
    opacity: 0,
    scale: 0.965,
    x: -24,
  },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      duration: 1.15,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const orbitAnimation = {
  rotate: 360,
};

const dustParticles = Array.from({ length: 42 }, (_, index) => {
  const seed = (index * 9301 + 49297) % 233280;
  const random = seed / 233280;

  const seed2 = (index * 49297 + 12345) % 233280;
  const random2 = seed2 / 233280;

  return {
    id: index,
    x: random * 100,
    y: random2 * 100,
    size: random > 0.88 ? 1.4 : 0.7,
    opacity: random > 0.88 ? 0.3 : 0.12,
    duration: 18 + random * 20,
    delay: -(random2 * 20),
  };
});
</script>

<template>
  <section
    id="about"
    class="relative isolate overflow-hidden border-t border-[#C58B92]/[0.06] bg-transparent py-24 sm:py-28 lg:py-32"
  >
    <!-- =====================================================
         READABILITY FIELD
         ===================================================== -->

    <div
      class="pointer-events-none absolute inset-y-0 right-0 z-[1] w-full lg:w-[62%]"
      aria-hidden="true"
    >
      <!-- Softened echo of the global celestial artwork -->
      <div
        class="absolute inset-[-12%]"
        style="
          background-image: url('/images/bg_img.png');
          background-position: center;
          background-repeat: no-repeat;
          background-size: min(720px, 85vw) auto;
          filter: blur(24px);
          opacity: 0.13;
          transform: scale(1.08);
        "
      />

      <!-- Wine atmospheric veil -->
      <div
        class="absolute inset-0 bg-gradient-to-r
          from-[#160B10]/0
          via-[#160B10]/48
          to-[#160B10]/76"
      />

      <!-- Localized reading field -->
      <div
        class="absolute inset-[8%_4%]
          rounded-[50%]
          bg-[#261018]/28
          blur-[70px]"
      />
    </div>

    <!-- =====================================================
         ATMOSPHERE
         ===================================================== -->

    <div
      class="pointer-events-none absolute inset-0"
      aria-hidden="true"
    >
      <!-- Left burgundy atmosphere -->
      <motion.div
        class="absolute left-[8%] top-[18%] h-[420px] w-[420px] rounded-full bg-[#6B0F1A]/[0.12] blur-[150px]"
        :animate="
          prefersReducedMotion
            ? noMotion
            : {
                x: [0, 20, 0, -15, 0],
                y: [0, 18, 0, -12, 0],
                opacity: [0.3, 0.46, 0.3, 0.4, 0.3],
              }
        "
        :transition="
          prefersReducedMotion
            ? {}
            : {
                duration: 28,
                repeat: Infinity,
                ease: 'easeInOut',
              }
        "
      />

      <!-- Right soft rose atmosphere -->
      <motion.div
        class="absolute bottom-[4%] right-[4%] h-[460px] w-[460px] rounded-full bg-[#7E3541]/[0.08] blur-[170px]"
        :animate="
          prefersReducedMotion
            ? noMotion
            : {
                x: [0, -18, 0, 15, 0],
                y: [0, -15, 0, 18, 0],
                opacity: [0.18, 0.3, 0.18, 0.26, 0.18],
              }
        "
        :transition="
          prefersReducedMotion
            ? {}
            : {
                duration: 34,
                repeat: Infinity,
                ease: 'easeInOut',
              }
        "
      />

      <!-- Fine dust -->
      <div class="absolute inset-0 overflow-hidden">
        <span
          v-for="particle in dustParticles"
          :key="particle.id"
          class="absolute rounded-full bg-[#C58B92]"
          :style="{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            '--dust-duration': `${particle.duration}s`,
            '--dust-delay': `${particle.delay}s`,
          }"
          :class="
            prefersReducedMotion
              ? ''
              : 'animate-[aboutDust_var(--dust-duration)_ease-in-out_var(--dust-delay)_infinite_alternate]'
          "
        />
      </div>
    </div>

    <!-- =====================================================
         MAIN COMPOSITION
         ===================================================== -->

    <motion.div
      class="relative z-10 mx-auto max-w-7xl px-6 lg:px-8"
      :variants="sectionContainer"
      initial="hidden"
      whileInView="visible"
      :viewport="{ once: true, amount: 0.16 }"
    >
      <div
        class="grid items-center gap-16 lg:grid-cols-[0.88fr_1.12fr] lg:gap-20 xl:grid-cols-[0.9fr_1.1fr] xl:gap-24"
      >
        <!-- =================================================
             IMAGE / CELESTIAL PORTRAIT
             ================================================= -->

        <motion.div
          class="relative mx-auto w-full max-w-[510px] lg:mx-0"
          :variants="imageEntrance"
        >
          <!-- Editorial vertical label -->
          <div
            class="absolute -left-9 top-1/2 hidden -translate-y-1/2 -rotate-90 items-center gap-3 xl:flex"
          >
            <span
              class="text-[8px] font-medium uppercase tracking-[0.42em] text-[#C58B92]/45"
            >
              About Sammy
            </span>

            <span class="h-px w-12 bg-[#C58B92]/20" />
          </div>

          <!-- Outer celestial construction -->
          <div
            class="absolute -inset-8 hidden rounded-[48px] border border-[#C58B92]/[0.07] sm:block"
          />

          <div
            class="absolute -inset-5 rounded-[40px] border border-[#C58B92]/[0.09]"
          />

          <!-- Rotating orbital mark -->
          <motion.div
            class="absolute -right-8 -top-8 z-20 hidden h-20 w-20 rounded-full border border-[#C58B92]/20 sm:block"
            :animate="
              prefersReducedMotion
                ? noMotion
                : orbitAnimation
            "
            :transition="
              prefersReducedMotion
                ? {}
                : {
                    duration: 40,
                    repeat: Infinity,
                    ease: 'linear',
                  }
            "
          >
            <span
              class="absolute left-1/2 top-[-2px] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#C58B92] shadow-[0_0_12px_rgba(197,139,146,0.65)]"
            />
          </motion.div>

          <!-- Image -->
          <div
            class="relative overflow-hidden rounded-[30px] border border-[#C58B92]/[0.14] bg-[#1D0C13] p-1.5 shadow-[0_35px_100px_rgba(0,0,0,0.42)]"
          >
            <motion.div
              class="relative overflow-hidden rounded-[24px]"
              :whileHover="
                prefersReducedMotion
                  ? {}
                  : {
                      scale: 1.012,
                    }
              "
              :transition="{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }"
            >
              <img
                src="/images/reading.jpeg"
                alt="Sammy during a spiritual astrology reading"
                class="aspect-[4/5] w-full object-cover"
              />

              <!-- Subtle wine atmospheric veil -->
              <div
                class="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#160B10]/70 via-transparent to-[#42141F]/10"
              />

              <!-- Fine inner frame -->
              <div
                class="pointer-events-none absolute inset-3 rounded-[19px] border border-[#F1E8E3]/[0.07]"
              />
            </motion.div>
          </div>

          <!-- Bottom editorial annotation -->
          <motion.div
            class="absolute -bottom-7 left-5 z-20 sm:left-8"
            :animate="
              prefersReducedMotion
                ? noMotion
                : {
                    y: [0, -4, 0],
                  }
            "
            :transition="
              prefersReducedMotion
                ? {}
                : {
                    duration: 7,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }
            "
          >
            <div class="flex items-center gap-3">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-full border border-[#C58B92]/20 bg-[#1D0C13]/90 backdrop-blur-md"
              >
                <Sparkles class="h-3.5 w-3.5 text-[#C8A77A]/75" />
              </div>

              <div class="border-l border-[#C58B92]/20 pl-3">
                <p
                  class="text-[7px] uppercase tracking-[0.3em] text-[#C58B92]/45"
                >
                  The intention
                </p>

                <p
                  class="mt-1 font-serif text-xs text-[#F1E8E3]/65"
                >
                  Come as you are.
                </p>
              </div>
            </div>
          </motion.div>

          <!-- Coordinate ticks -->
          <div
            class="absolute -bottom-10 right-8 hidden items-center gap-2 sm:flex"
          >
            <span class="h-px w-5 bg-[#C58B92]/20" />

            <span
              class="font-mono text-[7px] tracking-[0.18em] text-[#C58B92]/35"
            >
              06° 18′ N
            </span>
          </div>
        </motion.div>

        <!-- =================================================
             CONTENT
             ================================================= -->

        <motion.div
          class="relative max-w-2xl"
          :variants="sectionItem"
        >
          <!-- Section index -->
          <div class="flex items-center gap-4">
            <span
              class="font-mono text-[9px] tracking-[0.28em] text-[#C58B92]/55"
            >
              01
            </span>

            <span class="h-px w-10 bg-[#C58B92]/20" />

            <span
              class="text-[8px] font-medium uppercase tracking-[0.34em] text-[#C58B92]/50"
            >
              The person behind the reading
            </span>
          </div>

          <!-- Heading -->
          <h2
            class="mt-7 max-w-2xl font-serif text-[2.8rem] font-medium leading-[1.04] tracking-[-0.04em] text-[#F1E8E3] sm:text-5xl lg:text-[57px]"
          >
            You don't have to
            <span class="text-[#C58B92]/80">
              have it all figured out.
            </span>
          </h2>

          <!-- Intro -->
          <p
            class="mt-7 font-serif text-xl leading-8 text-[#F1E8E3]/80 sm:text-[22px] sm:leading-9"
          >
            Hi, I'm Okechukwu.
          </p>

          <div
            class="mt-6 space-y-5 text-[15px] leading-7 text-[#F1E8E3]/[0.64] sm:text-base sm:leading-8"
          >
            <p>
              I believe there are moments in life when we simply need to
              pause. To step away from the noise, ask the questions we've
              been carrying, and make sense of what we are experiencing.
            </p>

            <p>
              Maybe you're trying to understand a relationship. Maybe you're
              standing at a crossroads. Maybe something keeps repeating in
              your life and you're beginning to wonder why.
            </p>

            <p>
              That's where my work begins. Through Vedic astrology and
              intuitive readings, we explore the patterns beneath the surface
              — including ancestral influences, karmic themes, relationships,
              purpose, and the energies surrounding you.
            </p>
          </div>

          <!-- =================================================
               QUOTE / PHILOSOPHY
               ================================================= -->

          <motion.div
            class="relative mt-9 border-y border-[#C58B92]/[0.13] py-6 sm:py-7"
            :whileHover="
              prefersReducedMotion
                ? {}
                : {
                    borderColor: 'rgba(197,139,146,0.22)',
                  }
            "
            :transition="{ duration: 0.5 }"
          >
            <!-- Large quotation mark -->
            <span
              class="absolute -left-1 -top-5 font-serif text-5xl font-light leading-none text-[#C58B92]/15"
              aria-hidden="true"
            >
              “
            </span>

            <p
              class="max-w-xl font-serif text-xl leading-8 text-[#F1E8E3]/72 sm:text-[21px] sm:leading-9"
            >
              I don't want to tell you who you are or what your life should
              become. I want to help you see yourself a little more clearly.
            </p>

            <div class="mt-5 flex items-center gap-3">
              <span class="h-px w-8 bg-[#C58B92]/30" />

              <span
                class="text-[8px] uppercase tracking-[0.28em] text-[#C58B92]/45"
              >
                Sammy
              </span>
            </div>
          </motion.div>

          <!-- =================================================
               FOOTER / CTA
               ================================================= -->

          <div
            class="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p
                class="text-[9px] uppercase tracking-[0.26em] text-[#C58B92]/40"
              >
                Your questions are enough
              </p>

              <p
                class="mt-2 max-w-sm text-xs leading-6 text-[#F1E8E3]/35"
              >
                You don't need to arrive with all the answers.
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
              :transition="{ duration: 0.3 }"
            >
              <Button
                variant="ghost"
                class="group inline-flex h-12 items-center justify-center rounded-full border border-[#C8A77A]/35 bg-[#6B0F1A] px-7 text-[13px] font-medium tracking-wide text-[#F1E8E3] shadow-[0_12px_36px_rgba(107,15,26,0.24)] transition-all duration-500 hover:-translate-y-0.5 hover:border-[#C8A77A]/55 hover:bg-[#7E3541] hover:shadow-[0_16px_45px_rgba(107,15,26,0.34)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A77A]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#160B10]"
                @click="openBooking"
              >
                <span>Book a Reading</span>

                <ArrowRight
                  class="ml-3 h-4 w-4 text-[#C8A77A]/75 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>

    <!-- =====================================================
         BOTTOM FADE
         ===================================================== -->

    <div
      class="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#160B10]/90 via-[#160B10]/35 to-transparent"
      aria-hidden="true"
    />
  </section>

  <BookAReadingDialog
    v-model:open="bookingOpen"
    @select="handleReadingSelection"
  />
</template>

<style scoped>
@keyframes aboutDust {
  0% {
    transform: translate3d(0, 0, 0);
  }

  50% {
    opacity: 0.2;
  }

  100% {
    transform: translate3d(3px, -4px, 0);
    opacity: 0.08;
  }
}
</style>
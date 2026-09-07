<script setup lang="ts">
import { ArrowRight, Sparkles } from "lucide-vue-next";
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
    class="bg-transparent relative isolate overflow-hidden border-t border-white/[0.06] py-28 sm:py-32 lg:py-40"
  >
    <!-- =====================================================
      READABILITY FIELD
      Softly separates the global celestial artwork from
      the editorial copy without creating a card.
      ===================================================== -->

  <div
    class="pointer-events-none absolute inset-y-0 right-0 z-[1] w-full lg:w-[62%]"
    aria-hidden="true"
  >
    <!-- Blurred version of the global celestial artwork -->
    <div
      class="absolute inset-[-12%]"
      style="
        background-image: url('/images/bg_img.png');
        background-position: center;
        background-repeat: no-repeat;
        background-size: min(720px, 85vw) auto;
        filter: blur(24px);
        opacity: 0.16;
        transform: scale(1.08);
      "
    />

    <!-- Dark atmospheric veil -->
    <div
      class="absolute inset-0 bg-gradient-to-r
        from-[#050814]/0
        via-[#050814]/55
        to-[#050814]/78"
    />

    <!-- Soft central reading field -->
    <div
      class="absolute inset-[8%_4%]
        rounded-[50%]
        bg-[#050814]/30
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
      <!-- Very restrained celestial light -->
      <motion.div
        class="absolute left-[8%] top-[18%] h-[420px] w-[420px] rounded-full bg-[#182653]/20 blur-[150px]"
        :animate="
          prefersReducedMotion
            ? noMotion
            : {
                x: [0, 20, 0, -15, 0],
                y: [0, 18, 0, -12, 0],
                opacity: [0.35, 0.5, 0.35, 0.45, 0.35],
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

      <motion.div
        class="absolute bottom-[4%] right-[4%] h-[460px] w-[460px] rounded-full bg-[#34447a]/10 blur-[170px]"
        :animate="
          prefersReducedMotion
            ? noMotion
            : {
                x: [0, -18, 0, 15, 0],
                y: [0, -15, 0, 18, 0],
                opacity: [0.22, 0.34, 0.22, 0.3, 0.22],
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
          class="absolute rounded-full bg-[#858eba]"
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
        class="grid items-center gap-20 lg:grid-cols-[0.88fr_1.12fr] lg:gap-20 xl:grid-cols-[0.9fr_1.1fr] xl:gap-28"
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
              class="text-[8px] font-medium uppercase tracking-[0.42em] text-[#858eba]/45"
            >
              About Sammy
            </span>

            <span class="h-px w-12 bg-[#858eba]/20" />
          </div>

          <!-- Outer celestial construction -->
          <div
            class="absolute -inset-8 hidden rounded-[48px] border border-[#858eba]/[0.08] sm:block"
          />

          <div
            class="absolute -inset-5 rounded-[40px] border border-[#858eba]/[0.10]"
          />

          <!-- Rotating orbital mark -->
          <motion.div
            class="absolute -right-8 -top-8 z-20 hidden h-20 w-20 rounded-full border border-[#858eba]/20 sm:block"
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
              class="absolute left-1/2 top-[-2px] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#858eba] shadow-[0_0_12px_rgba(133,142,186,0.7)]"
            />
          </motion.div>

          <!-- Image -->
          <div
            class="relative overflow-hidden rounded-[30px] border border-[#858eba]/[0.16] bg-[#080d1c] p-1.5 shadow-[0_35px_100px_rgba(0,0,0,0.42)]"
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
                src="/images/astro.jpg"
                alt="Sammy during a spiritual astrology reading"
                class="aspect-[4/5] w-full object-cover"
              />

              <!-- Very subtle blue atmospheric veil -->
              <div
                class="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050814]/65 via-transparent to-[#182653]/10"
              />

              <!-- Fine inner frame -->
              <div
                class="pointer-events-none absolute inset-3 rounded-[19px] border border-white/[0.07]"
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
                class="flex h-10 w-10 items-center justify-center rounded-full border border-[#858eba]/20 bg-[#080d1c]/90 backdrop-blur-md"
              >
                <Sparkles class="h-3.5 w-3.5 text-[#858eba]/65" />
              </div>

              <div
                class="border-l border-[#858eba]/20 pl-3"
              >
                <p
                  class="text-[7px] uppercase tracking-[0.3em] text-[#858eba]/45"
                >
                  The intention
                </p>

                <p
                  class="mt-1 font-serif text-xs text-[#e8e7e1]/65"
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
            <span class="h-px w-5 bg-[#858eba]/20" />
            <span
              class="font-mono text-[7px] tracking-[0.18em] text-[#858eba]/35"
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
              class="font-mono text-[9px] tracking-[0.28em] text-[#858eba]/55"
            >
              01
            </span>

            <span class="h-px w-10 bg-[#858eba]/20" />

            <span
              class="text-[8px] font-medium uppercase tracking-[0.34em] text-[#858eba]/50"
            >
              The person behind the reading
            </span>
          </div>

          <!-- Heading -->
          <h2
            class="mt-8 max-w-2xl font-serif text-[2.8rem] font-medium leading-[1.04] tracking-[-0.04em] text-[#e8e7e1] sm:text-5xl lg:text-[57px]"
          >
            You don't have to
            <span class="text-[#858eba]/80">
              have it all figured out.
            </span>
          </h2>

          <!-- Intro -->
          <p
            class="mt-8 font-serif text-xl leading-8 text-[#e8e7e1]/80 sm:text-[22px] sm:leading-9"
          >
            Hi, I'm Sammy.
          </p>

          <div
            class="mt-7 space-y-5 text-[15px] leading-7 text-[#e8e7e1]/52 sm:text-base sm:leading-8"
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
            class="relative mt-10 border-y border-[#858eba]/[0.13] py-7 sm:py-8"
            :whileHover="
              prefersReducedMotion
                ? {}
                : {
                    borderColor: 'rgba(133,142,186,0.22)',
                  }
            "
            :transition="{ duration: 0.5 }"
          >
            <!-- Large quotation mark -->
            <span
              class="absolute -left-1 -top-5 font-serif text-5xl font-light leading-none text-[#858eba]/15"
              aria-hidden="true"
            >
              “
            </span>

            <p
              class="max-w-xl font-serif text-xl leading-8 text-[#e8e7e1]/72 sm:text-[21px] sm:leading-9"
            >
              I don't want to tell you who you are or what your life should
              become. I want to help you see yourself a little more clearly.
            </p>

            <div class="mt-6 flex items-center gap-3">
              <span class="h-px w-8 bg-[#858eba]/30" />

              <span
                class="text-[8px] uppercase tracking-[0.28em] text-[#858eba]/45"
              >
                Sammy
              </span>
            </div>
          </motion.div>

          <!-- =================================================
               FOOTER / CTA
               ================================================= -->

          <div
            class="mt-9 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p
                class="text-[9px] uppercase tracking-[0.26em] text-[#858eba]/40"
              >
                Your questions are enough
              </p>

              <p
                class="mt-2 max-w-sm text-xs leading-6 text-[#e8e7e1]/35"
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
                class="group h-auto rounded-none border-b border-[#858eba]/25 px-0 pb-2 text-sm font-medium text-[#e8e7e1]/70 hover:bg-transparent hover:text-[#e8e7e1]"
                @click="openBooking"
              >
                <span>Book a Reading</span>

                <ArrowRight
                  class="ml-3 h-4 w-4 text-[#858eba]/70 transition-transform duration-300 group-hover:translate-x-1"
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
      class="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050814] to-transparent"
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
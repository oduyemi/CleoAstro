<script setup lang="ts">
import { ref } from "vue";
import {
  ArrowRight,
  Sparkles,
} from "lucide-vue-next";
import {
  motion,
  useReducedMotion,
} from "motion-v";

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

/*
|--------------------------------------------------------------------------
| Motion
|--------------------------------------------------------------------------
| Deliberately limited to transform + opacity.
| No continuous animation.
*/

const revealTransition = {
  duration: 0.7,
  ease: [0.22, 1, 0.36, 1],
};

const portraitTransition = {
  duration: 0.9,
  ease: [0.22, 1, 0.36, 1],
};

const getReveal = (
  values: Record<string, number>
) => {
  if (prefersReducedMotion.value) {
    return {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
    };
  }

  return {
    opacity: 0,
    ...values,
  };
};
</script>

<template>
  <section
    id="about"
    class="relative isolate overflow-hidden border-t border-[#C58B92]/[0.06] bg-transparent py-24 text-[#F1E8E3] sm:py-28 lg:py-32"
  >
    <!-- =====================================================
         STATIC ATMOSPHERE
         ====================================================== -->

    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0"
    >
      <!-- Base atmosphere -->
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_78%_42%,rgba(107,15,26,.16),transparent_31%),radial-gradient(circle_at_14%_72%,rgba(126,53,65,.07),transparent_28%)]"
      />

      <!-- Right visual field -->
      <div
        class="absolute right-[-8%] top-[12%] h-[620px] w-[620px] rounded-full bg-[#6B0F1A]/[0.06]"
      />

      <!-- Bottom atmosphere -->
      <div
        class="absolute bottom-[-20%] left-[20%] h-[500px] w-[700px] rounded-full bg-[#42141F]/[0.08]"
      />

      <!-- Editorial horizon -->
      <div
        class="absolute left-[5%] right-[5%] top-[58%] h-px bg-gradient-to-r from-transparent via-[#C8A77A]/[0.08] to-transparent"
      />

      <!-- Static stars -->
      <span
        class="absolute left-[9%] top-[18%] h-1 w-1 rounded-full bg-[#F1E8E3]/20"
      />

      <span
        class="absolute left-[25%] top-[11%] h-0.5 w-0.5 rounded-full bg-[#C8A77A]/30"
      />

      <span
        class="absolute left-[46%] top-[21%] h-1 w-1 rounded-full bg-[#F1E8E3]/15"
      />

      <span
        class="absolute right-[18%] top-[16%] h-1 w-1 rounded-full bg-[#C58B92]/20"
      />

      <span
        class="absolute right-[7%] top-[43%] h-0.5 w-0.5 rounded-full bg-[#F1E8E3]/20"
      />

      <span
        class="absolute left-[15%] bottom-[22%] h-0.5 w-0.5 rounded-full bg-[#C8A77A]/20"
      />

      <span
        class="absolute right-[31%] bottom-[16%] h-1 w-1 rounded-full bg-[#C58B92]/15"
      />
    </div>

    <!-- =====================================================
         MAIN CONTENT
         ====================================================== -->

    <div
      class="relative z-10 mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-12 xl:px-16"
    >
      <div
        class="grid items-center gap-16 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20 xl:grid-cols-[0.86fr_1.14fr] xl:gap-24"
      >
        <!-- =================================================
             PORTRAIT
             ================================================== -->

        <motion.div
          class="relative mx-auto w-full max-w-[500px] lg:mx-0"
          :initial="
            getReveal({
              x: -28,
              scale: 0.985,
            })
          "
          :whileInView="{
            opacity: 1,
            x: 0,
            scale: 1,
          }"
          :viewport="{
            once: true,
            amount: 0.2,
          }"
          :transition="portraitTransition"
        >
          <!-- Vertical editorial label -->
          <div
            class="absolute -left-10 top-1/2 hidden -translate-y-1/2 -rotate-90 items-center gap-3 xl:flex"
          >
            <span
              class="text-[8px] font-medium uppercase tracking-[0.42em] text-[#C58B92]/40"
            >
              About Sammy
            </span>

            <span
              class="h-px w-12 bg-[#C58B92]/20"
            />
          </div>

          <!-- Outer frame -->
          <div
            class="absolute -inset-6 hidden rounded-[42px] border border-[#C58B92]/[0.055] sm:block"
          />

          <div
            class="absolute -inset-3 rounded-[36px] border border-[#C58B92]/[0.08]"
          />

          <!-- Small orbital detail
               STATIC — no infinite rotation -->
          <div
            class="absolute -right-5 -top-5 z-20 hidden h-16 w-16 rounded-full border border-[#C58B92]/20 bg-[#160B10] sm:block"
          >
            <span
              class="absolute left-1/2 top-[-2px] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#C8A77A]"
            />

            <span
              class="absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#C58B92]/60"
            />
          </div>

          <!-- Image frame -->
          <div
            class="relative rounded-[30px] border border-[#C58B92]/[0.13] bg-[#1B0B12] p-1.5"
          >
            <div
              class="relative overflow-hidden rounded-[24px]"
            >
              <img
                src="/images/reading.jpeg"
                alt="Sammy during a spiritual astrology reading"
                width="800"
                height="1000"
                loading="lazy"
                decoding="async"
                draggable="false"
                class="aspect-[4/5] w-full object-cover"
              />

              <!-- Image tint -->
              <div
                class="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#160B10]/75 via-transparent to-[#42141F]/10"
              />

              <!-- Inner frame -->
              <div
                class="pointer-events-none absolute inset-3 rounded-[19px] border border-[#F1E8E3]/[0.07]"
              />

              <!-- Image corner marker -->
              <div
                class="absolute bottom-5 left-5 flex items-center gap-2"
              >
                <span
                  class="h-1.5 w-1.5 rounded-full bg-[#C8A77A]"
                />

                <span
                  class="text-[7px] uppercase tracking-[0.3em] text-[#F1E8E3]/45"
                >
                  Vedic astrology
                </span>
              </div>
            </div>
          </div>

          <!-- =================================================
               INTENTION CARD
               ================================================== -->

          <div
            class="absolute -bottom-8 left-4 z-20 sm:left-7"
          >
            <div
              class="flex items-center gap-3 rounded-2xl border border-[#C58B92]/15 bg-[#1D0C13] px-4 py-3"
            >
              <div
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#C58B92]/15"
              >
                <Sparkles
                  class="h-3.5 w-3.5 text-[#C8A77A]/70"
                  stroke-width="1.2"
                />
              </div>

              <div
                class="border-l border-[#C58B92]/15 pl-3"
              >
                <p
                  class="text-[7px] uppercase tracking-[0.28em] text-[#C58B92]/40"
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
          </div>

          <!-- Coordinates -->
          <div
            class="absolute -bottom-8 right-3 hidden items-center gap-2 sm:flex"
          >
            <span
              class="h-px w-5 bg-[#C58B92]/20"
            />

            <span
              class="font-mono text-[7px] tracking-[0.16em] text-[#C58B92]/30"
            >
              06° 18′ N
            </span>
          </div>
        </motion.div>

        <!-- =================================================
             CONTENT
             ================================================== -->

        <motion.div
          class="relative max-w-[680px]"
          :initial="
            getReveal({
              y: 24,
            })
          "
          :whileInView="{
            opacity: 1,
            y: 0,
          }"
          :viewport="{
            once: true,
            amount: 0.16,
          }"
          :transition="{
            ...revealTransition,
            delay: prefersReducedMotion ? 0 : 0.08,
          }"
        >
          <!-- Section label -->
          <div
            class="flex items-center gap-4"
          >
            <span
              class="font-mono text-[9px] tracking-[0.28em] text-[#C58B92]/50"
            >
              01
            </span>

            <span
              class="h-px w-10 bg-[#C58B92]/20"
            />

            <span
              class="text-[8px] font-medium uppercase tracking-[0.34em] text-[#C58B92]/45"
            >
              The person behind the reading
            </span>
          </div>

          <!-- Heading -->
          <h2
            class="mt-7 max-w-[650px] font-serif text-[clamp(2.7rem,5vw,4.2rem)] font-medium leading-[0.98] tracking-[-0.045em] text-[#F1E8E3]"
          >
            You don't have to
            <span class="text-[#C58B92]/80">
              have it all figured out.
            </span>
          </h2>

          <!-- Intro -->
          <p
            class="mt-7 font-serif text-xl leading-8 text-[#F1E8E3]/75 sm:text-[22px]"
          >
            Hi, I'm Okechukwu.
          </p>

          <!-- Body -->
          <div
            class="mt-6 max-w-[620px] space-y-5 text-[15px] leading-7 text-[#F1E8E3]/[0.62] sm:text-base sm:leading-8"
          >
            <p>
              I believe there are moments in life when we simply
              need to pause. To step away from the noise, ask the
              questions we've been carrying, and make sense of
              what we are experiencing.
            </p>

            <p>
              Maybe you're trying to understand a relationship.
              Maybe you're standing at a crossroads. Maybe
              something keeps repeating in your life and you're
              beginning to wonder why.
            </p>

            <p>
              That's where my work begins. Through Vedic astrology
              and intuitive readings, we explore the patterns
              beneath the surface — including ancestral influences,
              karmic themes, relationships, purpose, and the
              energies surrounding you.
            </p>
          </div>

          <!-- =================================================
               PHILOSOPHY
               ================================================== -->

          <div
            class="relative mt-9 border-y border-[#C58B92]/[0.12] py-7"
          >
            <span
              aria-hidden="true"
              class="absolute -left-1 -top-5 font-serif text-5xl font-light leading-none text-[#C58B92]/15"
            >
              “
            </span>

            <p
              class="max-w-[590px] font-serif text-lg leading-8 text-[#F1E8E3]/70 sm:text-xl sm:leading-9"
            >
              I don't want to tell you who you are or what your
              life should become. I want to help you see yourself
              a little more clearly.
            </p>

            <div
              class="mt-5 flex items-center gap-3"
            >
              <span
                class="h-px w-8 bg-[#C58B92]/30"
              />

              <span
                class="text-[8px] uppercase tracking-[0.28em] text-[#C58B92]/45"
              >
                Sammy
              </span>
            </div>
          </div>

          <!-- =================================================
               CTA AREA
               ================================================== -->

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

            <Button
              type="button"
              class="group h-12 shrink-0 rounded-full border border-[#C8A77A]/30 bg-[#6B0F1A] px-7 text-[13px] font-medium tracking-wide text-[#F1E8E3] shadow-[0_10px_30px_rgba(107,15,26,0.18)] transition-[transform,background-color,border-color] duration-300 hover:-translate-y-0.5 hover:border-[#C8A77A]/50 hover:bg-[#7E3541] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A77A]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#160B10]"
              @click="openBooking"
            >
              <span>
                Book a Reading
              </span>

              <ArrowRight
                class="ml-3 h-4 w-4 text-[#C8A77A]/75 transition-transform duration-300 group-hover:translate-x-1"
                stroke-width="1.5"
              />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>

    <!-- =====================================================
         BOTTOM TRANSITION
         ====================================================== -->

    <div
      aria-hidden="true"
      class="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#160B10] to-transparent"
    />
  </section>

  <BookAReadingDialog
    v-if="bookingOpen"
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
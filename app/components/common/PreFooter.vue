<script setup lang="ts">
import { ArrowRight, ArrowUpRight, CalendarDays, Orbit, Sparkles } from "lucide-vue-next";
import { ref } from "vue";
import BookAReadingDialog from "@/components/booking/BookAReadingDialog.vue";

const bookingOpen = ref(false);

const openBooking = () => {
  bookingOpen.value = true;
};
</script>

<template>
  <section
    class="relative isolate overflow-hidden border-t border-[#C58B92]/[0.08] bg-[#160B10] py-24 text-[#F1E8E3] sm:py-32 lg:py-40"
  >
    <!-- =========================================================
         OPAQUE CANVAS
         Intentionally prevents global bg_img.png from showing.
    ========================================================== -->

    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 -z-20 bg-[#160B10]"
    />

    <!-- =========================================================
         ATMOSPHERE
    ========================================================== -->

    <div
      aria-hidden="true"
      class="pointer-events-none absolute left-1/2 top-[48%] -z-10 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6B0F1A]/[0.13] blur-[150px]"
    />

    <div
      aria-hidden="true"
      class="pointer-events-none absolute -right-48 top-0 -z-10 h-[34rem] w-[34rem] rounded-full bg-[#42141F]/[0.16] blur-[130px]"
    />

    <div
      aria-hidden="true"
      class="pointer-events-none absolute -left-52 bottom-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-[#7E3541]/[0.06] blur-[130px]"
    />

    <!-- =========================================================
         TOP HORIZON
    ========================================================== -->

    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C58B92]/20 to-transparent"
    />

    <!-- =========================================================
         CELESTIAL LENS
    ========================================================== -->

    <div
      aria-hidden="true"
      class="pointer-events-none absolute left-1/2 top-[52%] -z-10 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 sm:h-[40rem] sm:w-[40rem] lg:left-[61%] lg:top-1/2 lg:h-[48rem] lg:w-[48rem]"
    >
      <!-- Outer orbit -->
      <div
        class="absolute inset-0 rounded-full border border-[#C58B92]/[0.055]"
      />

      <!-- Offset orbit -->
      <div
        class="absolute inset-[13%] rotate-[24deg] rounded-[50%] border border-[#C8A77A]/[0.065]"
      />

      <!-- Elliptical orbit -->
      <div
        class="absolute inset-[23%] -rotate-[38deg] rounded-[50%] border border-[#C58B92]/[0.06]"
      />

      <!-- Inner lens -->
      <div
        class="absolute inset-[34%] rounded-full border border-[#C58B92]/[0.08] bg-[#42141F]/20 shadow-[0_0_100px_rgba(107,15,26,.16)]"
      />

      <!-- Core -->
      <div
        class="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#C8A77A]/15 bg-gradient-to-br from-[#C8A77A]/[0.10] via-[#6B0F1A]/35 to-[#160B10] shadow-[0_0_80px_rgba(107,15,26,.28)] sm:h-28 sm:w-28"
      >
        <div
          class="absolute inset-3 rounded-full border border-[#C58B92]/[0.08]"
        />

        <div
          class="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C8A77A]/80 shadow-[0_0_22px_rgba(200,167,122,.7)]"
        />
      </div>

      <!-- Orbital points -->
      <span
        class="absolute left-[12%] top-[27%] h-1.5 w-1.5 rounded-full bg-[#C58B92]/55 shadow-[0_0_15px_rgba(197,139,146,.35)]"
      />

      <span
        class="absolute right-[18%] top-[16%] h-1 w-1 rounded-full bg-[#C8A77A]/65 shadow-[0_0_14px_rgba(200,167,122,.35)]"
      />

      <span
        class="absolute bottom-[20%] right-[12%] h-1.5 w-1.5 rounded-full bg-[#C58B92]/40"
      />

      <span
        class="absolute bottom-[15%] left-[28%] h-1 w-1 rounded-full bg-[#F1E8E3]/25"
      />
    </div>

    <!-- =========================================================
         MICRO LABELS
    ========================================================== -->

    <div
      aria-hidden="true"
      class="pointer-events-none absolute right-[9%] top-[23%] hidden items-center gap-3 lg:flex"
    >
      <span class="text-[8px] uppercase tracking-[0.32em] text-[#F1E8E3]/15">
        Planetary rhythm
      </span>

      <span class="h-px w-10 bg-[#C58B92]/15" />
    </div>

    <div
      aria-hidden="true"
      class="pointer-events-none absolute bottom-[23%] left-[8%] hidden items-center gap-3 lg:flex"
    >
      <span class="h-px w-10 bg-[#C8A77A]/15" />

      <span class="text-[8px] uppercase tracking-[0.32em] text-[#F1E8E3]/15">
        Inner / Outer
      </span>
    </div>

    <!-- =========================================================
         CONTENT
    ========================================================== -->

    <div class="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
      <div class="grid items-center lg:grid-cols-[1.05fr_.95fr] lg:gap-10">

        <!-- =====================================================
             COPY
        ====================================================== -->

        <div class="relative z-10 max-w-2xl">

          <!-- Eyebrow -->
          <div
            class="inline-flex items-center gap-3 rounded-full border border-[#C58B92]/[0.12] bg-[#1D0C13]/65 px-4 py-2 backdrop-blur-md"
          >
            <span class="relative flex h-1.5 w-1.5">
              <span
                class="absolute inset-0 rounded-full bg-[#C8A77A]/40 blur-[3px]"
              />

              <span
                class="relative h-1.5 w-1.5 rounded-full bg-[#C8A77A]"
              />
            </span>

            <span
              class="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#F1E8E3]/45"
            >
              A moment of clarity
            </span>

            <span class="h-3 w-px bg-[#C58B92]/15" />

            <span
              class="text-[9px] uppercase tracking-[0.18em] text-[#C8A77A]/60"
            >
              Cleo Astro
            </span>
          </div>

          <!-- Editorial marker -->
          <div class="mt-12 flex items-center gap-4">
            <span
              class="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#C8A77A]/45"
            >
              01
            </span>

            <span class="h-px w-12 bg-[#C8A77A]/20" />

            <span
              class="text-[9px] uppercase tracking-[0.22em] text-[#F1E8E3]/20"
            >
              The next chapter
            </span>
          </div>

          <!-- Heading -->
          <h2
            class="mt-6 font-serif text-5xl font-medium leading-[0.96] tracking-[-0.06em] text-[#F1E8E3] sm:text-6xl lg:text-[5.8rem]"
          >
            The sky is
            <span class="text-[#F1E8E3]/35">
              moving.
            </span>

            <br />

            <span
              class="bg-gradient-to-r from-[#C8A77A] via-[#F1E8E3] to-[#C58B92] bg-clip-text text-transparent"
            >
              So are you.
            </span>
          </h2>

          <!-- Copy -->
          <p
            class="mt-8 max-w-lg text-sm leading-7 text-[#F1E8E3]/42 sm:text-base"
          >
            Sometimes clarity begins with a question. Sometimes
            it begins with seeing the pattern from a different
            angle — and allowing yourself to listen.
          </p>

          <!-- ===================================================
               CTA
          ==================================================== -->

          <div class="mt-10 flex flex-col gap-3 sm:flex-row">

            <!-- Primary -->
            <NuxtLink
              to="/#readings"
              class="group inline-flex h-13 items-center justify-center rounded-full border border-[#C8A77A]/35 bg-[#6B0F1A] px-7 text-[12px] font-medium tracking-[0.04em] text-[#F1E8E3] shadow-[0_18px_50px_rgba(107,15,26,.28)] transition-all duration-500 hover:-translate-y-1 hover:border-[#C8A77A]/55 hover:bg-[#7E3541] hover:shadow-[0_24px_65px_rgba(107,15,26,.38)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A77A]/40"
            >
              <span>Read the sky</span>

              <ArrowUpRight
                class="ml-3 h-4 w-4 opacity-60 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                stroke-width="1.4"
              />
            </NuxtLink>

            <!-- Book a Reading -->
            <button
              type="button"
              class="group inline-flex h-13 items-center justify-center rounded-full border border-[#C58B92]/18 bg-[#1D0C13]/65 px-7 text-[12px] font-medium tracking-[0.04em] text-[#F1E8E3]/65 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-[#C58B92]/35 hover:bg-[#261018]/75 hover:text-[#F1E8E3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C58B92]/35"
              @click="openBooking"
            >
              <CalendarDays
                class="mr-3 h-4 w-4 text-[#C8A77A]/60 transition-transform duration-500 group-hover:rotate-[-6deg]"
                stroke-width="1.4"
              />

              <span>Book a Reading</span>

              <ArrowRight
                class="ml-3 h-3.5 w-3.5 opacity-30 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-70"
                stroke-width="1.4"
              />
            </button>
          </div>

          <!-- Trust / philosophy -->
          <div class="mt-12 flex items-center gap-4">
            <div
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#C58B92]/10 bg-[#1D0C13]/45"
            >
              <Sparkles
                class="h-3.5 w-3.5 text-[#C8A77A]/55"
                stroke-width="1.3"
              />
            </div>

            <p
              class="max-w-sm text-[10px] leading-5 text-[#F1E8E3]/22"
            >
              Astrology as reflection, awareness, and a way
              of meeting your own story with greater clarity.
            </p>
          </div>
        </div>

        <!-- =====================================================
             VISUAL SIDE
        ====================================================== -->

        <div
          aria-hidden="true"
          class="relative mt-16 min-h-[22rem] lg:mt-0 lg:min-h-[38rem]"
        >
          <!-- Large lens -->
          <div
            class="absolute left-1/2 top-1/2 h-[20rem] w-[20rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#C58B92]/[0.055] sm:h-[28rem] sm:w-[28rem]"
          />

          <div
            class="absolute left-1/2 top-1/2 h-[15rem] w-[15rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#C8A77A]/[0.055] sm:h-[21rem] sm:w-[21rem]"
          />

          <!-- Vertical axis -->
          <div
            class="absolute left-1/2 top-[12%] h-[76%] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#C58B92]/10 to-transparent"
          />

          <!-- Horizontal axis -->
          <div
            class="absolute left-[10%] top-1/2 h-px w-[80%] -translate-y-1/2 bg-gradient-to-r from-transparent via-[#C58B92]/10 to-transparent"
          />

          <!-- Central eclipse -->
          <div
            class="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#160B10] shadow-[0_0_100px_rgba(107,15,26,.35)] sm:h-40 sm:w-40"
          >
            <div
              class="absolute inset-0 rounded-full border border-[#C58B92]/15"
            />

            <div
              class="absolute inset-3 rounded-full border border-[#C8A77A]/10"
            />

            <div
              class="h-4 w-4 rounded-full bg-[#C8A77A]/80 shadow-[0_0_30px_rgba(200,167,122,.65)] sm:h-5 sm:w-5"
            />
          </div>

          <!-- Floating annotation -->
          <div
            class="absolute left-[7%] top-[21%] hidden sm:block"
          >
            <p
              class="text-[8px] uppercase tracking-[0.28em] text-[#C58B92]/35"
            >
              Reflection
            </p>

            <div class="mt-2 h-px w-12 bg-[#C58B92]/15" />
          </div>

          <div
            class="absolute bottom-[18%] right-[5%] hidden text-right sm:block"
          >
            <p
              class="text-[8px] uppercase tracking-[0.28em] text-[#C8A77A]/35"
            >
              Perspective
            </p>

            <div
              class="ml-auto mt-2 h-px w-12 bg-[#C8A77A]/15"
            />
          </div>

          <!-- Bottom coordinate -->
          <div
            class="absolute bottom-[5%] left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <div class="flex items-center gap-3">
              <span class="h-px w-6 bg-[#C58B92]/15" />

              <span
                class="text-[8px] uppercase tracking-[0.3em] text-[#F1E8E3]/15"
              >
                Look inward · Look upward
              </span>

              <span class="h-px w-6 bg-[#C58B92]/15" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- =========================================================
         BOOKING DIALOG
    ========================================================== -->

    <BookAReadingDialog
      v-model:open="bookingOpen"
    />
  </section>
</template>
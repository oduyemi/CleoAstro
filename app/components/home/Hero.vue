<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import {
  ArrowUpRight,
  Moon,
  Orbit,
  Sparkles,
} from "lucide-vue-next";
import BookAReadingDialog from "@/components/booking/BookAReadingDialog.vue";

const bookingOpen = ref(false);
const prefersReducedMotion = ref(false);
const isReady = ref(false);

let motionQuery: MediaQueryList | null = null;

const updateMotionPreference = () => {
  if (!import.meta.client) return;

  prefersReducedMotion.value = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
};

const handlePointerMove = (event: PointerEvent) => {
  if (prefersReducedMotion.value) return;

  const element = event.currentTarget as HTMLElement;
  const rect = element.getBoundingClientRect();

  const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
  const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

  element.style.setProperty("--pointer-x", `${x}`);
  element.style.setProperty("--pointer-y", `${y}`);
};

const handlePointerLeave = (event: PointerEvent) => {
  const element = event.currentTarget as HTMLElement;

  element.style.setProperty("--pointer-x", "0");
  element.style.setProperty("--pointer-y", "0");
};

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

onMounted(() => {
  motionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  updateMotionPreference();

  motionQuery.addEventListener("change", updateMotionPreference);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      isReady.value = true;
    });
  });
});

onBeforeUnmount(() => {
  motionQuery?.removeEventListener(
    "change",
    updateMotionPreference
  );
});
</script>

<template>
  <section
    class="cleo-hero relative isolate min-h-[100svh] overflow-hidden bg-[#160B10] text-[#F1E8E3]"
    :class="{ 'is-ready': isReady }"
    @pointermove="handlePointerMove"
    @pointerleave="handlePointerLeave"
  >
    <!-- =====================================================
         ATMOSPHERE
    ====================================================== -->

    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <!-- Deep wine base -->
      <div
        class="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_72%_42%,rgba(66,20,31,.42),transparent_68%),radial-gradient(ellipse_55%_80%_at_8%_80%,rgba(107,15,26,.16),transparent_70%),linear-gradient(180deg,#160B10_0%,#1D0C13_55%,#160B10_100%)]"
      />

      <!-- Large atmospheric bloom -->
      <div
        class="hero-bloom absolute right-[4%] top-[12%] h-[620px] w-[620px] rounded-full bg-[#6B0F1A]/[0.10] blur-[150px]"
      />

      <!-- Burgundy depth -->
      <div
        class="absolute bottom-[-20%] left-[25%] h-[500px] w-[700px] rounded-full bg-[#42141F]/[0.30] blur-[150px]"
      />

      <!-- Fine horizon -->
      <div
        class="absolute left-[5%] right-[5%] top-[57%] h-px bg-gradient-to-r from-transparent via-[#C58B92]/[0.08] to-transparent"
      />

      <!-- Sparse stars -->
      <div class="hero-stars">
        <span class="star star-1" />
        <span class="star star-2" />
        <span class="star star-3" />
        <span class="star star-4" />
        <span class="star star-5" />
        <span class="star star-6" />
        <span class="star star-7" />
        <span class="star star-8" />
        <span class="star star-9" />
        <span class="star star-10" />
        <span class="star star-11" />
        <span class="star star-12" />
      </div>

      <!-- Grain only -->
      <div class="celestial-grain absolute inset-0" />
    </div>

    <!-- =====================================================
         TOP BRAND
    ====================================================== -->

    <div
      class="absolute left-5 top-6 z-40 sm:left-8 sm:top-8 lg:left-12 xl:left-16"
    >
      <div
        class="hero-brand flex items-center gap-3"
        :class="{ 'hero-visible': isReady }"
      >
        <div class="brand-symbol relative flex h-10 w-10 items-center justify-center rounded-full border border-[#C58B92]/20 bg-[#1D0C13]/60">
          <Orbit
            class="h-[17px] w-[17px] text-[#C8A77A]/80"
            stroke-width="1"
          />

          <span
            class="absolute inset-[5px] rounded-full border border-[#C58B92]/10"
          />

          <span
            class="absolute -right-1 top-1 h-1 w-1 rounded-full bg-[#C8A77A]/70"
          />
        </div>

        <div>
          <p
            class="text-[9px] font-medium uppercase tracking-[0.34em] text-[#F1E8E3]/80"
          >
            Cleo Astro
          </p>

          <p
            class="mt-1 text-[7px] uppercase tracking-[0.25em] text-[#C58B92]/50"
          >
            Vedic Astrology
          </p>
        </div>
      </div>
    </div>

    <!-- =====================================================
         LIVE SKY INDICATOR
    ====================================================== -->

    <div
      class="absolute right-5 top-6 z-40 sm:right-8 sm:top-8 lg:right-12 xl:right-16"
    >
      <div
        class="hero-status flex items-center gap-3"
        :class="{ 'hero-visible': isReady }"
      >
        <div class="text-right">
          <p
            class="text-[7px] uppercase tracking-[0.34em] text-[#C58B92]/45"
          >
            Live sky
          </p>

          <p
            class="mt-1 text-[8px] uppercase tracking-[0.18em] text-[#F1E8E3]/55"
          >
            Planetary movements
          </p>
        </div>

        <span
          class="relative flex h-3 w-3 items-center justify-center"
        >
          <span
            class="live-pulse absolute inset-0 rounded-full bg-[#A45A65]/25"
          />

          <span
            class="relative h-1.5 w-1.5 rounded-full bg-[#C8A77A]"
          />
        </span>
      </div>
    </div>

    <!-- =====================================================
         CELESTIAL AXIS
    ====================================================== -->

    <div
      aria-hidden="true"
      class="hero-axis pointer-events-none absolute bottom-[9%] left-[50%] top-[13%] z-[3] hidden w-px -translate-x-1/2 lg:block"
    >
      <div
        class="absolute inset-0 bg-gradient-to-b from-transparent via-[#C58B92]/[0.08] to-transparent"
      />

      <span
        class="axis-node absolute left-1/2 top-[22%] h-1.5 w-1.5 -translate-x-1/2 rounded-full border border-[#C8A77A]/40 bg-[#160B10]"
      />

      <span
        class="axis-node absolute bottom-[24%] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#C58B92]/40"
      />
    </div>

    <!-- =====================================================
         ORBITAL COMPOSITION
    ====================================================== -->

    <div
      aria-hidden="true"
      class="hero-orbit-field pointer-events-none absolute z-[2]"
    >
      <!-- Outer orbit -->
      <div class="orbit orbit-outer">
        <span class="orbit-marker orbit-marker-1" />
        <span class="orbit-marker orbit-marker-2" />
      </div>

      <!-- Middle orbit -->
      <div class="orbit orbit-middle">
        <span class="orbit-marker orbit-marker-3" />
      </div>

      <!-- Inner orbit -->
      <div class="orbit orbit-inner">
        <span class="orbit-marker orbit-marker-4" />
      </div>

      <!-- Celestial point -->
      <div
        class="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#C8A77A]/50 bg-[#6B0F1A] shadow-[0_0_30px_rgba(200,167,122,.18)]"
      />
    </div>

    <!-- =====================================================
         MAIN EDITORIAL CONTENT
    ====================================================== -->

    <div
      class="relative z-20 mx-auto flex min-h-[100svh] max-w-[1700px] items-center px-5 pb-20 pt-28 sm:px-8 lg:px-12 lg:pb-16 lg:pt-24 xl:px-20"
    >
      <div class="relative w-full">
        <!-- =================================================
             LEFT COPY
        ================================================== -->

        <div
          class="hero-copy relative z-30 max-w-[680px] lg:ml-[3%] xl:ml-[5%]"
        >
          <!-- Editorial eyebrow -->
          <div
            class="hero-eyebrow mb-7 flex items-center gap-4"
            :class="{ 'hero-visible': isReady }"
          >
            <span class="relative flex h-5 w-5 items-center justify-center">
              <span
                class="absolute inset-0 rounded-full border border-[#C58B92]/20"
              />

              <Moon
                class="relative h-3 w-3 text-[#C8A77A]/75"
                stroke-width="1"
              />
            </span>

            <span
              class="h-px w-8 bg-[#C8A77A]/40"
            />

            <span
              class="text-[9px] uppercase tracking-[0.34em] text-[#C58B92]/65 sm:text-[10px]"
            >
              Vedic astrology · intuitive guidance
            </span>
          </div>

          <!-- Headline -->
          <h1
            class="hero-title font-serif font-medium tracking-[-0.065em] text-[#F1E8E3]"
            :class="{ 'hero-visible': isReady }"
          >
            <span class="hero-title-line block">
              The sky
            </span>

            <span class="hero-title-accent relative block">
              remembers.

              <span
                aria-hidden="true"
                class="hero-title-rule absolute -bottom-4 left-1 h-px w-[clamp(70px,10vw,130px)] bg-gradient-to-r from-[#C8A77A]/60 to-transparent"
              />
            </span>
          </h1>

          <!-- Intro -->
          <div
            class="hero-intro relative mt-10 max-w-[530px]"
            :class="{ 'hero-visible': isReady }"
          >
            <div
              aria-hidden="true"
              class="absolute -inset-x-7 -inset-y-6 -z-10 rounded-[2.5rem] bg-[#160B10]/35 backdrop-blur-[14px]"
            />

            <p
              class="text-[14px] leading-7 text-[#F1E8E3]/68 sm:text-[15px] sm:leading-7"
            >
              Through Vedic astrology and intuitive reading, I help you
              explore the deeper patterns behind your relationships,
              purpose, and experiences unfolding in your life.
            </p>
          </div>

          <!-- CTAs -->
          <div
            class="hero-cta mt-9 flex flex-col gap-3 sm:flex-row"
            :class="{ 'hero-visible': isReady }"
          >
            <button
              type="button"
              class="hero-primary group inline-flex h-[52px] items-center justify-center rounded-full border border-[#C8A77A]/35 bg-[#6B0F1A] px-7 text-[12px] font-medium tracking-[0.04em] text-[#F1E8E3] shadow-[0_18px_50px_rgba(107,15,26,.28)] transition-all duration-500 hover:-translate-y-1 hover:border-[#C8A77A]/55 hover:bg-[#7E3541] hover:shadow-[0_22px_60px_rgba(107,15,26,.38)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A77A]/50"
              @click="openBooking"
            >
              <span>Begin a Reading</span>

              <ArrowUpRight
                class="ml-3 h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                stroke-width="1.4"
              />
            </button>

            <a
              href="/#readings"
              class="hero-secondary group inline-flex h-[52px] items-center justify-center rounded-full border border-[#C58B92]/20 bg-[#1D0C13]/55 px-7 text-[12px] font-medium tracking-[0.04em] text-[#F1E8E3]/70 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-[#C58B92]/35 hover:bg-[#261018]/70 hover:text-[#F1E8E3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C58B92]/35"
            >
              <span>Read the Sky</span>

              <ArrowUpRight
                class="ml-3 h-4 w-4 opacity-60 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                stroke-width="1.4"
              />
            </a>
          </div>

          <!-- Philosophy -->
          <div
            class="hero-philosophy mt-8 max-w-[500px]"
            :class="{ 'hero-visible': isReady }"
          >
            <div class="flex items-start gap-4">
              <div
                class="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#C58B92]/15"
              >
                <Sparkles
                  class="h-3 w-3 text-[#C8A77A]/60"
                  stroke-width="1"
                />
              </div>

              <p
                class="text-[10px] leading-5 text-[#C58B92]/48 sm:text-[11px]"
              >
                My intention is not to tell you how to live your life,
                but to help you pause, reflect, and reconnect with your
                own inner wisdom.
              </p>
            </div>
          </div>
        </div>

        <!-- =================================================
             PORTRAIT
        ================================================== -->

        <div
          class="hero-portrait pointer-events-none absolute bottom-[-12vh] right-[-8vw] z-10 w-[min(67vw,930px)]"
        >
          <div
            class="portrait-parallax relative"
            :style="{
              transform: `translate3d(
                calc(var(--pointer-x, 0) * 7px),
                calc(var(--pointer-y, 0) * 4px),
                0
              )`,
            }"
          >
            <!-- Deep halo -->
            <div
              class="absolute left-1/2 top-[12%] h-[65%] w-[58%] -translate-x-1/2 rounded-full bg-[#6B0F1A]/20 blur-[120px]"
            />

            <!-- Fine halo -->
            <div
              class="absolute left-1/2 top-[16%] h-[48%] w-[42%] -translate-x-1/2 rounded-full bg-[#A45A65]/[0.06] blur-[80px]"
            />

            <!-- Editorial circular architecture -->
            <div
              class="portrait-architecture absolute left-1/2 top-[4%] aspect-square w-[92%] -translate-x-1/2 rounded-full border border-[#C58B92]/[0.10]"
            />

            <div
              class="portrait-architecture portrait-architecture-2 absolute left-1/2 top-[9%] aspect-square w-[78%] -translate-x-1/2 rounded-full border border-dashed border-[#C58B92]/[0.07]"
            />

            <div
              class="portrait-architecture portrait-architecture-3 absolute left-1/2 top-[17%] aspect-square w-[61%] -translate-x-1/2 rounded-full border border-[#C8A77A]/[0.06]"
            />

            <!-- Orbital markers -->
            <span class="portrait-marker marker-a" />
            <span class="portrait-marker marker-b" />
            <span class="portrait-marker marker-c" />

            <!-- Portrait -->
            <div
              class="portrait-stage relative mx-auto aspect-[0.82/1] w-[70%]"
            >
              <!-- Burgundy light behind subject -->
              <div
                class="absolute left-1/2 top-[18%] h-[48%] w-[62%] -translate-x-1/2 rounded-full bg-[#42141F]/45 blur-[90px]"
              />

              <img
                src="/images/sammy.png"
                alt="Sammy — Vedic astrologer and intuitive reader"
                class="portrait-image absolute inset-0 h-full w-full object-contain object-bottom"
                draggable="false"
              />

              <!-- Edge disappearance -->
              <div
                class="absolute inset-0 z-20 bg-[linear-gradient(90deg,#160B10_0%,transparent_12%,transparent_88%,#160B10_100%)] opacity-[0.82]"
              />

              <!-- Bottom disappearance -->
              <div
                class="absolute inset-0 z-20 bg-[linear-gradient(to_bottom,transparent_48%,rgba(22,11,16,.18)_70%,#160B10_100%)]"
              />
            </div>

            <!-- Ground shadow -->
            <div
              class="absolute bottom-[3%] left-1/2 h-16 w-[62%] -translate-x-1/2 rounded-full bg-black/45 blur-3xl"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- =====================================================
         BOTTOM EDITORIAL MARKERS
    ====================================================== -->

    <div
      class="absolute bottom-7 left-5 z-40 hidden sm:flex lg:left-12 xl:left-16"
      :class="{ 'hero-visible': isReady }"
    >
      <div class="flex items-center gap-3">
        <span
          class="h-px w-8 bg-[#C8A77A]/25"
        />

        <div>
          <p
            class="text-[7px] uppercase tracking-[0.34em] text-[#C58B92]/45"
          >
            Observe
          </p>

          <p
            class="mt-1 text-[8px] text-[#F1E8E3]/35"
          >
            Pause before interpretation
          </p>
        </div>
      </div>
    </div>

    <div
      class="absolute bottom-7 right-5 z-40 hidden sm:flex lg:right-12 xl:right-16"
      :class="{ 'hero-visible': isReady }"
    >
      <div class="flex items-center gap-3 text-right">
        <div>
          <p
            class="text-[7px] uppercase tracking-[0.34em] text-[#C58B92]/45"
          >
            Align
          </p>

          <p
            class="mt-1 text-[8px] text-[#F1E8E3]/35"
          >
            Patterns · purpose · perspective
          </p>
        </div>

        <span
          class="h-px w-8 bg-[#C8A77A]/25"
        />
      </div>
    </div>

    <!-- Mobile marker -->
    <div
      class="absolute bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 sm:hidden"
      :class="{ 'hero-visible': isReady }"
    >
      <span class="h-px w-5 bg-[#C8A77A]/25" />

      <span
        class="whitespace-nowrap text-[7px] uppercase tracking-[0.26em] text-[#C58B92]/45"
      >
        Read the patterns
      </span>

      <span class="h-px w-5 bg-[#C8A77A]/25" />
    </div>

    <!-- Booking -->
    <BookAReadingDialog v-model:open="bookingOpen" />
  </section>
</template>

<style scoped>
/* ============================================================
   CORE
============================================================ */

.cleo-hero {
  --pointer-x: 0;
  --pointer-y: 0;
  isolation: isolate;
}

/* ============================================================
   NO GRID — intentionally removed
============================================================ */

/* ============================================================
   STARS
============================================================ */

.hero-stars {
  position: absolute;
  inset: 0;
}

.star {
  position: absolute;
  display: block;
  width: 1px;
  height: 1px;
  border-radius: 999px;
  background: rgba(241, 232, 227, 0.55);
  opacity: 0;
  animation: starPulse 7s ease-in-out infinite;
}

.star-1 {
  left: 12%;
  top: 23%;
  animation-delay: 0.4s;
}

.star-2 {
  left: 21%;
  top: 69%;
  animation-delay: 2.2s;
}

.star-3 {
  left: 33%;
  top: 17%;
  animation-delay: 4s;
}

.star-4 {
  left: 42%;
  top: 73%;
  animation-delay: 1.2s;
}

.star-5 {
  left: 55%;
  top: 13%;
  animation-delay: 3.2s;
}

.star-6 {
  left: 64%;
  top: 62%;
  animation-delay: 5s;
}

.star-7 {
  left: 76%;
  top: 22%;
  animation-delay: 1.7s;
}

.star-8 {
  left: 88%;
  top: 36%;
  animation-delay: 3.8s;
}

.star-9 {
  left: 92%;
  top: 76%;
  animation-delay: 0.8s;
}

.star-10 {
  left: 71%;
  top: 81%;
  animation-delay: 4.7s;
}

.star-11 {
  left: 28%;
  top: 42%;
  animation-delay: 5.5s;
}

.star-12 {
  left: 49%;
  top: 31%;
  animation-delay: 2.8s;
}

/* ============================================================
   GRAIN
============================================================ */

.celestial-grain {
  opacity: 0.018;

  background-image:
    url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.4'/%3E%3C/svg%3E");

  mix-blend-mode: soft-light;
}

/* ============================================================
   BRAND
============================================================ */

.brand-symbol {
  transition:
    border-color 0.6s ease,
    transform 0.6s ease;
}

.brand-symbol:hover {
  border-color: rgba(197, 139, 146, 0.32);
  transform: rotate(8deg);
}

/* ============================================================
   ORBITS
============================================================ */

.hero-orbit-field {
  width: min(62vw, 850px);
  height: min(62vw, 850px);
  right: -2%;
  top: 51%;
  transform: translateY(-50%);
}

.orbit {
  position: absolute;
  left: 50%;
  top: 50%;
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  border-radius: 999px;
}

.orbit-outer {
  width: 100%;
  border: 1px solid rgba(164, 90, 101, 0.08);
  animation: orbitRotate 55s linear infinite;
}

.orbit-middle {
  width: 76%;
  border: 1px dashed rgba(197, 139, 146, 0.06);
  animation: orbitRotateReverse 42s linear infinite;
}

.orbit-inner {
  width: 53%;
  border: 1px solid rgba(200, 167, 122, 0.055);
  animation: orbitRotate 32s linear infinite;
}

.orbit-marker {
  position: absolute;
  display: block;
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: #160B10;
  border: 1px solid rgba(200, 167, 122, 0.45);
}

.orbit-marker-1 {
  left: 15%;
  top: 12%;
}

.orbit-marker-2 {
  right: 9%;
  bottom: 24%;
}

.orbit-marker-3 {
  left: 4%;
  top: 53%;
}

.orbit-marker-4 {
  right: 12%;
  top: 17%;
}

/* ============================================================
   AXIS
============================================================ */

.hero-axis {
  opacity: 0.7;
}

/* ============================================================
   REVEALS
============================================================ */

.hero-brand,
.hero-status,
.hero-eyebrow,
.hero-title,
.hero-intro,
.hero-cta,
.hero-philosophy,
.hero-portrait {
  opacity: 0;
}

.hero-brand,
.hero-status,
.hero-eyebrow,
.hero-title,
.hero-intro,
.hero-cta,
.hero-philosophy {
  transform: translateY(18px);
}

.hero-portrait {
  transform: translate3d(25px, 25px, 0) scale(0.985);
}

.is-ready .hero-visible {
  opacity: 1;
  transform: translateY(0);
}

.is-ready .hero-portrait {
  opacity: 1;
  transform: translate3d(0, 0, 0) scale(1);
}

.hero-brand {
  transition:
    opacity 0.9s ease,
    transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
}

.hero-status {
  transition:
    opacity 0.9s ease 0.08s,
    transform 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.08s;
}

.hero-eyebrow {
  transition:
    opacity 0.9s ease 0.16s,
    transform 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.16s;
}

.hero-title {
  transition:
    opacity 1.2s ease 0.28s,
    transform 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.28s;
}

.hero-intro {
  transition:
    opacity 1s ease 0.52s,
    transform 1s cubic-bezier(0.22, 1, 0.36, 1) 0.52s;
}

.hero-cta {
  transition:
    opacity 0.95s ease 0.7s,
    transform 0.95s cubic-bezier(0.22, 1, 0.36, 1) 0.7s;
}

.hero-philosophy {
  transition:
    opacity 0.95s ease 0.88s,
    transform 0.95s cubic-bezier(0.22, 1, 0.36, 1) 0.88s;
}

.hero-portrait {
  transition:
    opacity 1.4s ease 0.2s,
    transform 1.5s cubic-bezier(0.22, 1, 0.36, 1) 0.2s;
}

/* ============================================================
   TITLE
============================================================ */

.hero-title {
  font-size: clamp(4.4rem, 8vw, 8.2rem);
  line-height: 0.83;
}

.hero-title-accent {
  color: #c58b92;
  margin-left: clamp(1rem, 4vw, 4rem);
}

/* ============================================================
   PORTRAIT
============================================================ */

.hero-portrait {
  animation: portraitFloat 10s ease-in-out infinite;
}

.portrait-parallax {
  transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1);
}

.portrait-stage {
  animation: portraitBreath 9s ease-in-out infinite;
}

.portrait-image {
  filter:
    contrast(1.03)
    saturate(0.96)
    drop-shadow(0 35px 75px rgba(0, 0, 0, 0.38));
}

.portrait-architecture {
  animation: architectureRotate 50s linear infinite;
}

.portrait-architecture-2 {
  animation-duration: 68s;
  animation-direction: reverse;
}

.portrait-architecture-3 {
  animation-duration: 38s;
}

.portrait-marker {
  position: absolute;
  z-index: 10;
  display: block;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  border: 1px solid rgba(200, 167, 122, 0.5);
  background: #160B10;
}

.marker-a {
  left: 17%;
  top: 25%;
}

.marker-b {
  right: 12%;
  top: 42%;
}

.marker-c {
  left: 28%;
  bottom: 18%;
}

/* ============================================================
   LIVE PULSE
============================================================ */

.live-pulse {
  animation: livePulse 2.8s ease-in-out infinite;
}

/* ============================================================
   ANIMATIONS
============================================================ */

@keyframes portraitFloat {
  0%,
  100% {
    margin-bottom: 0;
  }

  50% {
    margin-bottom: -5px;
  }
}

@keyframes portraitBreath {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5px);
  }
}

@keyframes architectureRotate {
  from {
    transform: translateX(-50%) rotate(0deg);
  }

  to {
    transform: translateX(-50%) rotate(360deg);
  }
}

@keyframes orbitRotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }

  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes orbitRotateReverse {
  from {
    transform: translate(-50%, -50%) rotate(360deg);
  }

  to {
    transform: translate(-50%, -50%) rotate(0deg);
  }
}

@keyframes starPulse {
  0%,
  100% {
    opacity: 0.08;
    transform: scale(0.8);
  }

  50% {
    opacity: 0.55;
    transform: scale(1.5);
  }
}

@keyframes livePulse {
  0%,
  100% {
    opacity: 0.15;
    transform: scale(0.8);
  }

  50% {
    opacity: 0.7;
    transform: scale(1.8);
  }
}

/* ============================================================
   TABLET
============================================================ */

@media (max-width: 1023px) {
  .hero-orbit-field {
    width: 86vw;
    height: 86vw;
    right: -15%;
    top: 52%;
    opacity: 0.7;
  }

  .hero-portrait {
    width: min(78vw, 760px);
    right: -10vw;
    bottom: -8vh;
  }

  .hero-copy {
    max-width: 590px;
  }

  .hero-title {
    font-size: clamp(4rem, 10vw, 6.5rem);
  }
}

/* ============================================================
   MOBILE
============================================================ */

@media (max-width: 640px) {
  .cleo-hero {
    min-height: 100svh;
  }

  .hero-orbit-field {
    width: 125vw;
    height: 125vw;
    right: -34%;
    top: 61%;
    opacity: 0.48;
  }

  .hero-portrait {
    width: 125vw;
    right: -28vw;
    bottom: -10vh;
    opacity: 0.78;
  }

  .hero-copy {
    max-width: 100%;
  }

  .hero-title {
    font-size: clamp(4rem, 19vw, 5.8rem);
  }

  .hero-title-accent {
    margin-left: 0.7rem;
  }

  .hero-intro {
    max-width: 94%;
    margin-top: 2rem;
  }

  .hero-cta {
    width: 100%;
  }

  .hero-cta button {
    width: 100%;
  }

  .hero-philosophy {
    max-width: 92%;
  }
}

/* ============================================================
   SMALL MOBILE
============================================================ */

@media (max-width: 380px) {
  .hero-title {
    font-size: 3.65rem;
  }

  .hero-portrait {
    width: 138vw;
    right: -37vw;
  }

  .hero-intro {
    font-size: 13px;
    line-height: 1.7;
  }
}

/* ============================================================
   REDUCED MOTION
============================================================ */

@media (prefers-reduced-motion: reduce) {
  .cleo-hero *,
  .cleo-hero *::before,
  .cleo-hero *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .hero-brand,
  .hero-status,
  .hero-eyebrow,
  .hero-title,
  .hero-intro,
  .hero-cta,
  .hero-philosophy,
  .hero-portrait {
    opacity: 1;
    transform: none;
  }

  .portrait-parallax {
    transform: none !important;
  }
}
</style>
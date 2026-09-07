<script setup lang="ts">
import {
  onBeforeUnmount,
  onMounted,
  ref,
} from "vue";
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
    "(prefers-reduced-motion: reduce)",
  ).matches;
};

const handlePointerMove = (event: PointerEvent) => {
  if (prefersReducedMotion.value) return;

  const element = event.currentTarget as HTMLElement;
  const rect = element.getBoundingClientRect();

  const x =
    ((event.clientX - rect.left) / rect.width - 0.5) * 2;

  const y =
    ((event.clientY - rect.top) / rect.height - 0.5) * 2;

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

const handleReadingSelection = (reading: unknown) => {
  console.log("Selected reading:", reading);
};

onMounted(() => {
  motionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );

  updateMotionPreference();

  motionQuery.addEventListener(
    "change",
    updateMotionPreference,
  );

  /*
   * Allow the browser to paint the initial state before
   * triggering the entrance animation.
   */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      isReady.value = true;
    });
  });
});

onBeforeUnmount(() => {
  motionQuery?.removeEventListener(
    "change",
    updateMotionPreference,
  );
});
</script>

<template>
  <section
    class="astral-stage relative min-h-[100svh] overflow-hidden bg-[#050814] text-[#E8E7E1]"
    :class="{ 'is-ready': isReady }"
    @pointermove="handlePointerMove"
    @pointerleave="handlePointerLeave"
  >
    <!-- =========================================================
         ATMOSPHERE
    ========================================================== -->

    <div
      class="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <!-- Base -->
      <div class="absolute inset-0 bg-[#050814]" />

      <!-- Horizon -->
      <div
        class="atmosphere-horizon absolute bottom-[-30%] left-1/2 h-[75%] w-[90%] -translate-x-1/2 rounded-[50%] bg-[#182653]/20 blur-[140px]"
      />

      <!-- Upper atmospheric layer -->
      <div
        class="atmosphere-left absolute left-[-10%] top-[8%] h-[55%] w-[55%] rounded-full bg-[#101A35]/30 blur-[150px]"
      />

      <div
        class="atmosphere-right absolute right-[-8%] top-[18%] h-[42%] w-[42%] rounded-full bg-[#34447A]/10 blur-[140px]"
      />

      <!-- Horizon line -->
      <div
        class="absolute left-0 right-0 top-[62%] h-px bg-[#858EBA]/[0.07]"
      />

      <!-- Architectural framing -->
      <div
        class="absolute bottom-0 left-[6%] top-0 hidden w-px bg-[#858EBA]/[0.045] lg:block"
      />

      <div
        class="absolute bottom-0 right-[6%] top-0 hidden w-px bg-[#858EBA]/[0.045] lg:block"
      />

      <!-- Technical grid -->
      <div
        class="absolute inset-0 opacity-[0.018]"
        style="
          background-image:
            linear-gradient(rgba(133,142,186,.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(133,142,186,.8) 1px, transparent 1px);
          background-size: 110px 110px;
        "
      />

      <!-- Atmospheric particles -->
      <span
        v-for="particle in 20"
        :key="particle"
        class="celestial-particle absolute h-px w-px rounded-full bg-[#858EBA]"
        :style="{
          left: `${(particle * 43.7) % 100}%`,
          top: `${(particle * 67.3) % 100}%`,
          opacity: 0.08 + ((particle * 17) % 22) / 100,
          animationDelay: `${(particle % 7) * 1.2}s`,
        }"
      />
    </div>

    <!-- =========================================================
         BRAND
    ========================================================== -->

    <div
      class="brand-mark absolute left-5 top-6 z-50 flex items-center gap-3 sm:left-8 sm:top-8 lg:left-10"
    >
      <div
        class="brand-icon flex h-8 w-8 items-center justify-center border border-[#858EBA]/20"
      >
        <Orbit
          class="h-4 w-4 text-[#858EBA]/70"
          :stroke-width="1"
        />
      </div>

      <div>
        <div
          class="text-[9px] uppercase tracking-[0.42em] text-[#E8E7E1]/90"
        >
          Cleo Astro
        </div>

        <div
          class="mt-1 text-[6px] uppercase tracking-[0.34em] text-[#858EBA]/40"
        >
          Vedic astrology
        </div>
      </div>
    </div>

    <!-- =========================================================
         LIVE SKY
    ========================================================== -->

    <div
      class="live-sky absolute right-5 top-7 z-50 flex items-center gap-3 sm:right-8 lg:right-10"
    >
      <div class="hidden text-right sm:block">
        <div
          class="text-[6px] uppercase tracking-[0.35em] text-[#858EBA]/35"
        >
          Current sky
        </div>

        <div
          class="mt-1 font-mono text-[7px] tracking-[0.18em] text-[#E8E7E1]/45"
        >
          07.09.26
        </div>
      </div>

      <span
        class="h-px w-5 bg-[#858EBA]/15"
      />

      <div class="flex items-center gap-2">
        <span
          class="live-dot relative h-1.5 w-1.5 rounded-full bg-[#858EBA]/75"
        >
          <span
            class="absolute inset-[-3px] rounded-full border border-[#858EBA]/20"
          />
        </span>

        <span
          class="text-[7px] uppercase tracking-[0.3em] text-[#858EBA]/45"
        >
          Live sky
        </span>
      </div>
    </div>

    <!-- =========================================================
         ORBITAL FIELD
    ========================================================== -->

    <div
      class="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div
        class="orbital-field absolute left-1/2 top-[54%] h-[min(82vw,980px)] w-[min(118vw,1450px)]"
      >
        <!-- Outer orbit -->
        <div
          class="orbit-primary absolute left-1/2 top-1/2 h-[52%] w-[91%] -translate-x-1/2 -translate-y-1/2 rotate-[-10deg] rounded-[50%] border border-[#858EBA]/[0.14]"
        />

        <!-- Secondary orbit -->
        <div
          class="orbit-secondary absolute left-1/2 top-1/2 h-[39%] w-[73%] -translate-x-1/2 -translate-y-1/2 rotate-[14deg] rounded-[50%] border border-[#858EBA]/[0.075]"
        />

        <!-- Inner orbit -->
        <div
          class="celestial-orbit absolute left-1/2 top-1/2 h-[25%] w-[55%] -translate-x-1/2 -translate-y-1/2 rotate-[-22deg] rounded-[50%] border border-dashed border-[#858EBA]/[0.07]"
          :class="{
            'motion-safe:animate-[celestialSpin_120s_linear_infinite]':
              !prefersReducedMotion,
          }"
        />

        <!-- Central coordinate -->
        <div
          class="absolute left-1/2 top-1/2 h-[18%] w-[18%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#858EBA]/[0.065]"
        />

        <div
          class="absolute left-1/2 top-1/2 h-[8%] w-[8%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#858EBA]/[0.11]"
        />

        <!-- Axes -->
        <div
          class="absolute bottom-[12%] left-1/2 top-[12%] w-px -translate-x-1/2 bg-[#858EBA]/[0.045]"
        />

        <div
          class="absolute left-[9%] right-[9%] top-1/2 h-px -translate-y-1/2 bg-[#858EBA]/[0.045]"
        />

        <!-- Degree ticks -->
        <div
          v-for="tick in 24"
          :key="tick"
          class="absolute left-1/2 top-1/2 h-full w-px -translate-x-1/2 -translate-y-1/2"
          :style="{
            transform: `translate(-50%, -50%) rotate(${tick * 15}deg)`,
          }"
        >
          <span
            class="mx-auto mt-[8%] block w-px bg-[#858EBA]/10"
            :class="
              tick % 3 === 0
                ? 'h-3 bg-[#858EBA]/20'
                : 'h-1.5'
            "
          />
        </div>

        <!-- Centre -->
        <div
          class="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E8E7E1]/60"
        />

        <!-- Coordinates -->
        <span
          class="absolute left-[9%] top-[49%] font-mono text-[5px] tracking-[0.2em] text-[#858EBA]/20"
        >
          000°
        </span>

        <span
          class="absolute right-[9%] top-[49%] font-mono text-[5px] tracking-[0.2em] text-[#858EBA]/20"
        >
          180°
        </span>

        <span
          class="absolute left-[49%] top-[7%] font-mono text-[5px] tracking-[0.2em] text-[#858EBA]/20"
        >
          090°
        </span>

        <span
          class="absolute bottom-[7%] left-[48%] font-mono text-[5px] tracking-[0.2em] text-[#858EBA]/20"
        >
          270°
        </span>
      </div>
    </div>

    <!-- =========================================================
         HERO COPY
    ========================================================== -->

    <div
      class="hero-copy absolute left-5 top-[17%] z-40 sm:left-[10%] sm:top-[19%] lg:top-[18%]"
    >
      <div class="hero-eyebrow mb-6 flex items-center gap-3 sm:mb-8">
        <span
          class="h-px w-8 bg-[#858EBA]/45 sm:w-10"
        />

        <span
          class="text-[7px] uppercase tracking-[0.38em] text-[#858EBA]/50"
        >
          Vedic astrology · intuitive guidance
        </span>
      </div>

      <h1
        class="hero-title font-serif text-[clamp(4.4rem,10.5vw,10.5rem)] font-normal leading-[0.78] tracking-[-0.075em] text-[#E8E7E1]"
      >
        <span class="hero-line block">
          The sky
        </span>

        <span
          class="hero-line hero-line-second ml-[clamp(2rem,8vw,9rem)] block italic text-[#858EBA]"
        >
          remembers.
        </span>
      </h1>

      <div
        class="hero-description mt-7 ml-[clamp(2rem,8vw,9rem)] max-w-[300px] sm:mt-9 sm:max-w-[360px]"
      >
        <p
          class="text-[11px] font-light leading-[1.7] text-[#E8E7E1]/50 sm:text-xs"
        >
          Read the deeper patterns behind your relationships,
          purpose, and the experiences shaping your life.
        </p>
      </div>
    </div>

    <!-- =========================================================
         SAMMY
    ========================================================== -->

    <div
      class="portrait-wrap pointer-events-none absolute bottom-[-2%] left-1/2 z-20 w-[min(112vw,900px)] sm:w-[min(92vw,900px)] lg:w-[min(66vw,900px)]"
    >
      <!-- Halo -->
      <div
        class="portrait-halo absolute left-1/2 top-[17%] h-[52%] w-[60%] -translate-x-1/2 rounded-full bg-[#34447A]/[0.10] blur-[100px]"
      />

      <!-- Portrait orbit -->
      <div
        class="portrait-orbit absolute left-1/2 top-[8%] h-[54%] w-[47%] -translate-x-1/2 rotate-[7deg] rounded-[50%] border border-[#858EBA]/[0.075]"
      />

      <div
        class="portrait-orbit-secondary absolute left-1/2 top-[14%] h-[46%] w-[40%] -translate-x-1/2 -rotate-[9deg] rounded-[50%] border border-dashed border-[#858EBA]/[0.055]"
      />

      <!-- ORIGINAL IMAGE -->
      <img
        src="/images/sammy.png"
        alt="Sammy, Vedic astrologer and intuitive reader"
        draggable="false"
        class="portrait-image relative z-10 mx-auto block h-auto w-full select-none object-contain sm:w-[92%] lg:w-[88%]"
      />

      <!-- Grounding -->
      <div
        class="portrait-ground absolute bottom-[1%] left-1/2 h-7 w-[55%] -translate-x-1/2 rounded-[50%] bg-[#34447A]/10 blur-2xl"
      />
    </div>

    <!-- =========================================================
         MOON NOTE
    ========================================================== -->

    <div
      class="planet-note absolute left-[10%] top-[48%] z-40 hidden lg:block"
    >
      <div class="flex items-center gap-3">
        <div
          class="planet-icon flex h-7 w-7 items-center justify-center rounded-full border border-[#858EBA]/20"
        >
          <Moon
            class="h-3 w-3 text-[#858EBA]/70"
            :stroke-width="1"
          />
        </div>

        <div>
          <div
            class="text-[6px] uppercase tracking-[0.32em] text-[#858EBA]/45"
          >
            Moon
          </div>

          <div
            class="mt-1 font-mono text-[9px] tracking-[0.12em] text-[#E8E7E1]/55"
          >
            12° Libra
          </div>
        </div>
      </div>

      <div
        class="ml-3 mt-3 h-10 w-px bg-[#858EBA]/10"
      />

      <div
        class="ml-3 mt-2 text-[5px] uppercase tracking-[0.28em] text-[#858EBA]/30"
      >
        Emotional balance
      </div>
    </div>

    <!-- =========================================================
         MERCURY NOTE
    ========================================================== -->

    <div
      class="planet-note-secondary absolute right-[10%] top-[37%] z-40 hidden lg:block"
    >
      <div class="flex items-center gap-3">
        <div class="text-right">
          <div
            class="text-[6px] uppercase tracking-[0.32em] text-[#858EBA]/45"
          >
            Mercury
          </div>

          <div
            class="mt-1 font-mono text-[9px] tracking-[0.12em] text-[#E8E7E1]/55"
          >
            24° Leo
          </div>
        </div>

        <div
          class="planet-icon flex h-7 w-7 items-center justify-center rounded-full border border-[#858EBA]/20"
        >
          <Sparkles
            class="h-3 w-3 text-[#858EBA]/65"
            :stroke-width="1"
          />
        </div>
      </div>

      <div
        class="mr-3 mt-3 ml-auto h-8 w-px bg-[#858EBA]/10"
      />

      <div
        class="mr-3 mt-2 text-right text-[5px] uppercase tracking-[0.28em] text-[#858EBA]/30"
      >
        Expression
      </div>
    </div>

    <!-- =========================================================
         DESKTOP INDEX
    ========================================================== -->

    <div
      class="absolute bottom-9 left-[10%] z-40 hidden items-center gap-4 sm:flex"
    >
      <span
        class="font-mono text-[6px] tracking-[0.3em] text-[#858EBA]/30"
      >
        01
      </span>

      <span
        class="h-px w-8 bg-[#858EBA]/15"
      />

      <span
        class="text-[6px] uppercase tracking-[0.4em] text-[#858EBA]/25"
      >
        Astral portrait
      </span>
    </div>

    <!-- =========================================================
         CTA
    ========================================================== -->

    <button
      type="button"
      class="hero-cta group absolute bottom-7 right-5 z-50 flex items-center gap-4 sm:right-[8%]"
      @click="openBooking"
    >
      <span
        class="text-[7px] uppercase tracking-[0.4em] text-[#E8E7E1]/55 transition-colors duration-500 group-hover:text-[#E8E7E1]"
      >
        Begin a reading
      </span>

      <span
        class="cta-circle relative flex h-11 w-11 items-center justify-center rounded-full border border-[#858EBA]/25 transition-all duration-700 group-hover:border-[#858EBA]/65 group-hover:bg-[#182653]/25"
      >
        <ArrowUpRight
          class="h-4 w-4 text-[#858EBA]/80 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
          :stroke-width="1"
        />

        <span
          class="absolute inset-[-5px] rounded-full border border-[#858EBA]/[0.055] transition-transform duration-700 group-hover:scale-110"
        />
      </span>
    </button>

    <!-- =========================================================
         MOBILE SUPPORTING COPY
    ========================================================== -->

    <div
      class="mobile-copy absolute bottom-[16%] left-5 right-5 z-40 lg:hidden"
    >
      <div class="mb-3 flex items-center gap-3">
        <span
          class="h-px w-6 bg-[#858EBA]/35"
        />

        <span
          class="text-[6px] uppercase tracking-[0.35em] text-[#858EBA]/40"
        >
          Read what is unfolding
        </span>
      </div>

      <p
        class="max-w-[290px] text-[10px] font-light leading-[1.7] text-[#E8E7E1]/45"
      >
        Vedic astrology and intuitive guidance for seeing
        the patterns beneath the surface.
      </p>
    </div>

    <!-- =========================================================
         BOOKING
    ========================================================== -->

    <BookAReadingDialog
      v-model:open="bookingOpen"
      @select-reading="handleReadingSelection"
    />
  </section>
</template>

<style scoped>
.font-serif {
  font-family:
    "Cormorant Garamond",
    "Times New Roman",
    serif;
}

.astral-stage {
  --pointer-x: 0;
  --pointer-y: 0;
  isolation: isolate;
}

/* ============================================================
   ENTRANCE SYSTEM
============================================================ */

.hero-copy,
.brand-mark,
.live-sky,
.hero-cta,
.planet-note,
.planet-note-secondary,
.mobile-copy {
  opacity: 0;
  transform: translateY(18px);
}

.portrait-wrap {
  opacity: 0;
  transform:
    translate3d(
      calc(-50% + (var(--pointer-x) * 4px)),
      calc(24px + (var(--pointer-y) * 3px)),
      0
    );
}

.orbital-field {
  opacity: 0;
  transform:
    translate3d(
      calc(-50% + (var(--pointer-x) * 7px)),
      calc(-50% + (var(--pointer-y) * 5px)),
      0
    )
    scale(0.96);
}

.astral-stage.is-ready .brand-mark,
.astral-stage.is-ready .live-sky {
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 900ms ease,
    transform 900ms cubic-bezier(0.16, 1, 0.3, 1);
}

.astral-stage.is-ready .brand-mark {
  transition-delay: 100ms;
}

.astral-stage.is-ready .live-sky {
  transition-delay: 180ms;
}

.astral-stage.is-ready .orbital-field {
  opacity: 1;
  transform:
    translate3d(
      calc(-50% + (var(--pointer-x) * 7px)),
      calc(-50% + (var(--pointer-y) * 5px)),
      0
    )
    scale(1);
  transition:
    opacity 1800ms ease,
    transform 2200ms cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: 250ms;
}

.astral-stage.is-ready .hero-copy {
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 1000ms ease,
    transform 1100ms cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: 500ms;
}

.astral-stage.is-ready .hero-line {
  animation: editorialReveal 1100ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.astral-stage.is-ready .hero-line-second {
  animation-delay: 160ms;
}

.astral-stage.is-ready .hero-description {
  animation: fadeRise 1000ms cubic-bezier(0.16, 1, 0.3, 1) 850ms both;
}

.astral-stage.is-ready .portrait-wrap {
  opacity: 1;
  transform:
    translate3d(
      calc(-50% + (var(--pointer-x) * 4px)),
      calc(var(--pointer-y) * 3px),
      0
    );
  transition:
    opacity 1600ms ease,
    transform 1800ms cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: 700ms;
}

.astral-stage.is-ready .planet-note {
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 900ms ease,
    transform 900ms cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: 1300ms;
}

.astral-stage.is-ready .planet-note-secondary {
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 900ms ease,
    transform 900ms cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: 1450ms;
}

.astral-stage.is-ready .hero-cta,
.astral-stage.is-ready .mobile-copy {
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 900ms ease,
    transform 900ms cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: 1600ms;
}

/* ============================================================
   ATMOSPHERIC MOTION
============================================================ */

.atmosphere-horizon {
  animation:
    atmosphereBreath 12s ease-in-out infinite alternate;
}

.atmosphere-left {
  animation:
    atmosphereDrift 18s ease-in-out infinite alternate;
}

.atmosphere-right {
  animation:
    atmosphereDriftReverse 22s ease-in-out infinite alternate;
}

.portrait-halo {
  animation:
    haloBreath 9s ease-in-out infinite alternate;
}

.orbit-primary {
  animation:
    orbitBreath 14s ease-in-out infinite alternate;
}

.orbit-secondary {
  animation:
    orbitBreathReverse 18s ease-in-out infinite alternate;
}

.portrait-orbit {
  animation:
    portraitOrbit 20s ease-in-out infinite alternate;
}

.portrait-orbit-secondary {
  animation:
    portraitOrbitReverse 25s ease-in-out infinite alternate;
}

.celestial-particle {
  animation:
    particlePulse 5s ease-in-out infinite alternate;
}

.live-dot {
  animation:
    livePulse 3s ease-in-out infinite;
}

.planet-icon {
  transition:
    border-color 600ms ease,
    transform 600ms cubic-bezier(0.16, 1, 0.3, 1);
}

.planet-note:hover .planet-icon,
.planet-note-secondary:hover .planet-icon {
  border-color: rgba(133, 142, 186, 0.5);
  transform: scale(1.08);
}

/* ============================================================
   CTA
============================================================ */

.hero-cta {
  transition:
    opacity 900ms ease,
    transform 900ms cubic-bezier(0.16, 1, 0.3, 1);
}

.cta-circle {
  transition:
    border-color 700ms ease,
    background-color 700ms ease,
    transform 700ms cubic-bezier(0.16, 1, 0.3, 1);
}

.hero-cta:hover .cta-circle {
  transform: translateY(-2px);
}

/* ============================================================
   KEYFRAMES
============================================================ */

@keyframes editorialReveal {
  from {
    opacity: 0;
    transform:
      translateY(35px)
      skewY(2deg);
  }

  to {
    opacity: 1;
    transform:
      translateY(0)
      skewY(0);
  }
}

@keyframes fadeRise {
  from {
    opacity: 0;
    transform: translateY(14px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes atmosphereBreath {
  from {
    transform:
      translateX(-50%)
      scale(0.96);
    opacity: 0.65;
  }

  to {
    transform:
      translateX(-50%)
      scale(1.04);
    opacity: 1;
  }
}

@keyframes atmosphereDrift {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(35px, 18px, 0);
  }
}

@keyframes atmosphereDriftReverse {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(-28px, 24px, 0);
  }
}

@keyframes haloBreath {
  from {
    transform:
      translateX(-50%)
      scale(0.92);
    opacity: 0.55;
  }

  to {
    transform:
      translateX(-50%)
      scale(1.08);
    opacity: 1;
  }
}

@keyframes orbitBreath {
  from {
    opacity: 0.45;
    transform:
      translate(-50%, -50%)
      rotate(-10deg)
      scale(0.98);
  }

  to {
    opacity: 0.9;
    transform:
      translate(-50%, -50%)
      rotate(-10deg)
      scale(1.015);
  }
}

@keyframes orbitBreathReverse {
  from {
    opacity: 0.3;
    transform:
      translate(-50%, -50%)
      rotate(14deg)
      scale(1.02);
  }

  to {
    opacity: 0.65;
    transform:
      translate(-50%, -50%)
      rotate(14deg)
      scale(0.98);
  }
}

@keyframes portraitOrbit {
  from {
    transform:
      translateX(-50%)
      rotate(7deg)
      scale(0.98);
  }

  to {
    transform:
      translateX(-50%)
      rotate(7deg)
      scale(1.02);
  }
}

@keyframes portraitOrbitReverse {
  from {
    transform:
      translateX(-50%)
      rotate(-9deg)
      scale(1.02);
  }

  to {
    transform:
      translateX(-50%)
      rotate(-9deg)
      scale(0.98);
  }
}

@keyframes particlePulse {
  from {
    opacity: 0.08;
    transform: scale(0.8);
  }

  to {
    opacity: 0.32;
    transform: scale(1.4);
  }
}

@keyframes livePulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(133, 142, 186, 0.08);
  }

  50% {
    box-shadow: 0 0 0 5px rgba(133, 142, 186, 0);
  }
}

@keyframes celestialSpin {
  from {
    transform:
      translate(-50%, -50%)
      rotate(0deg);
  }

  to {
    transform:
      translate(-50%, -50%)
      rotate(360deg);
  }
}

/* ============================================================
   MOBILE
============================================================ */

@media (max-width: 768px) {
  .orbital-field {
    top: 53%;
    width: 125vw;
    height: 78vw;
  }

  .portrait-wrap {
    bottom: 4%;
    width: 112vw;
  }

  .atmosphere-horizon {
    animation-duration: 15s;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: clamp(4rem, 18vw, 5.8rem);
  }

  .orbital-field {
    top: 55%;
    width: 145vw;
    height: 95vw;
  }

  .portrait-wrap {
    bottom: 7%;
    width: 120vw;
  }
}

/* ============================================================
   ACCESSIBILITY
============================================================ */

@media (prefers-reduced-motion: reduce) {
  .astral-stage *,
  .astral-stage *::before,
  .astral-stage *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }

  .hero-copy,
  .brand-mark,
  .live-sky,
  .hero-cta,
  .planet-note,
  .planet-note-secondary,
  .mobile-copy,
  .portrait-wrap,
  .orbital-field {
    opacity: 1 !important;
    transform: none !important;
  }
}
</style>
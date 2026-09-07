<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import {
  ArrowUpRight,
  Moon,
  Orbit,
  Sparkles,
  Zap,
} from "lucide-vue-next";
import BookAReadingDialog from "@/components/booking/BookAReadingDialog.vue";

type Planet = {
  name: string;
  degree: string;
  sign: string;
  meaning: string;
  icon: typeof Moon;
};

const bookingOpen = ref(false);
const isHovering = ref(false);
const prefersReducedMotion = ref(false);

const pointerX = ref(0);
const pointerY = ref(0);

const planets: Planet[] = [
  {
    name: "Moon",
    degree: "12°",
    sign: "Libra",
    meaning: "Emotional balance",
    icon: Moon,
  },
  {
    name: "Mercury",
    degree: "24°",
    sign: "Leo",
    meaning: "Expression",
    icon: Zap,
  },
  {
    name: "Venus",
    degree: "08°",
    sign: "Cancer",
    meaning: "Connection",
    icon: Sparkles,
  },
];

const chartStyle = computed(() => {
  if (prefersReducedMotion.value || !isHovering.value) {
    return {
      transform: "translate3d(-50%, -50%, 0)",
    };
  }

  return {
    transform: `
      translate3d(
        calc(-50% + ${pointerX.value * 0.006}px),
        calc(-50% + ${pointerY.value * 0.006}px),
        0
      )
    `,
  };
});

const portraitStyle = computed(() => {
  if (prefersReducedMotion.value || !isHovering.value) {
    return {
      transform: "translateX(-50%)",
    };
  }

  return {
    transform: `
      translateX(calc(-50% + ${pointerX.value * 0.012}px))
      translateY(${pointerY.value * 0.008}px)
    `,
  };
});

const handlePointerMove = (event: PointerEvent) => {
  if (prefersReducedMotion.value) return;

  const element = event.currentTarget as HTMLElement;
  const rect = element.getBoundingClientRect();

  pointerX.value = event.clientX - (rect.left + rect.width / 2);
  pointerY.value = event.clientY - (rect.top + rect.height / 2);
};

const handlePointerEnter = () => {
  isHovering.value = true;
};

const handlePointerLeave = () => {
  isHovering.value = false;
  pointerX.value = 0;
  pointerY.value = 0;
};

const openBooking = () => {
  bookingOpen.value = true;
};

const handleReadingSelection = (reading: unknown) => {
  console.log("Selected reading:", reading);
};

let motionQuery: MediaQueryList | null = null;

const updateMotionPreference = () => {
  if (typeof window === "undefined") return;

  prefersReducedMotion.value = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
};

onMounted(() => {
  motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  updateMotionPreference();

  motionQuery.addEventListener(
    "change",
    updateMotionPreference,
  );
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
    class="astral-stage relative min-h-[100svh] overflow-hidden text-white"
    @pointermove="handlePointerMove"
    @pointerenter="handlePointerEnter"
    @pointerleave="handlePointerLeave"
  >
    <!-- =========================================================
         CELESTIAL BACKGROUND
    ========================================================== -->

    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <!-- Base midnight -->
      <div class="absolute inset-0 bg-[#050814]" />

      <!-- Atmospheric blue horizon -->
      <div
        class="absolute bottom-[-25%] left-1/2 h-[75%] w-[90%] -translate-x-1/2 rounded-[50%] bg-[#182653]/20 blur-[120px]"
      />

      <!-- Indigo atmospheric layer -->
      <div
        class="absolute left-[12%] top-[18%] h-[45%] w-[38%] rounded-full bg-[#101A35]/45 blur-[130px]"
      />

      <!-- Very restrained lunar illumination -->
      <div
        class="absolute right-[15%] top-[10%] h-[260px] w-[260px] rounded-full bg-[#34447A]/10 blur-[110px]"
      />

      <!-- Technical horizon -->
      <div
        class="absolute left-0 right-0 top-[61%] h-px bg-[#858EBA]/10"
      />

      <!-- Fine architectural lines -->
      <div
        class="absolute bottom-0 left-[7%] top-0 hidden w-px bg-[#858EBA]/[0.055] lg:block"
      />

      <div
        class="absolute bottom-0 right-[7%] top-0 hidden w-px bg-[#858EBA]/[0.055] lg:block"
      />

      <!-- Fine atmospheric grid -->
      <div
        class="absolute inset-0 opacity-[0.025]"
        style="
          background-image:
            linear-gradient(rgba(133,142,186,.7) 1px, transparent 1px),
            linear-gradient(90deg, rgba(133,142,186,.7) 1px, transparent 1px);
          background-size: 90px 90px;
        "
      />

      <!-- Sparse celestial points -->
      <span
        v-for="star in 26"
        :key="star"
        class="absolute h-[2px] w-[2px] rounded-full bg-[#858EBA]"
        :style="{
          left: `${(star * 47.3) % 100}%`,
          top: `${(star * 71.7) % 100}%`,
          opacity: 0.08 + ((star * 19) % 35) / 100,
        }"
      />
    </div>

    <!-- =========================================================
         BRAND MARK
    ========================================================== -->

    <div
      class="absolute left-5 top-7 z-50 flex items-center gap-3 sm:left-8 lg:left-10"
    >
      <div
        class="flex h-8 w-8 items-center justify-center border border-[#858EBA]/25"
      >
        <Orbit
          class="h-4 w-4 text-[#858EBA]/75"
          :stroke-width="1"
        />
      </div>

      <div>
        <div
          class="text-[9px] uppercase tracking-[0.42em] text-[#E8E7E1]"
        >
          Cleo Astro
        </div>

        <div
          class="mt-1 text-[6px] uppercase tracking-[0.36em] text-[#858EBA]/40"
        >
          Vedic astrology
        </div>
      </div>
    </div>

    <!-- =========================================================
         LIVE SKY
    ========================================================== -->

    <div
      class="absolute right-5 top-7 z-50 flex items-center gap-4 sm:right-8 lg:right-10"
    >
      <div class="hidden text-right sm:block">
        <div
          class="text-[6px] uppercase tracking-[0.35em] text-[#858EBA]/40"
        >
          Current sky
        </div>

        <div
          class="mt-1 font-mono text-[7px] tracking-[0.2em] text-[#E8E7E1]/55"
        >
          07.09.26
        </div>
      </div>

      <span class="h-px w-6 bg-[#858EBA]/20" />

      <div class="flex items-center gap-2">
        <span
          class="relative h-1.5 w-1.5 rounded-full bg-[#858EBA]"
        />

        <span
          class="text-[7px] uppercase tracking-[0.32em] text-[#858EBA]/55"
        >
          Live sky
        </span>
      </div>
    </div>

    <!-- =========================================================
         ASTRONOMICAL FIELD
    ========================================================== -->

    <div
      class="pointer-events-none absolute inset-0"
      style="perspective: 1600px"
    >
      <div
        class="absolute left-1/2 top-[54%] z-10 h-[min(78vw,1000px)] w-[min(112vw,1400px)] transition-transform duration-[1400ms] ease-out"
        :style="chartStyle"
      >
        <!-- Primary ellipse -->
        <div
          class="absolute left-1/2 top-1/2 h-[53%] w-[92%] -translate-x-1/2 -translate-y-1/2 rotate-[-11deg] rounded-[50%] border border-[#858EBA]/20"
        />

        <!-- Secondary ellipse -->
        <div
          class="absolute left-1/2 top-1/2 h-[38%] w-[77%] -translate-x-1/2 -translate-y-1/2 rotate-[15deg] rounded-[50%] border border-[#858EBA]/10"
        />

        <!-- Inner orbit -->
        <div
          class="absolute left-1/2 top-1/2 h-[23%] w-[58%] -translate-x-1/2 -translate-y-1/2 rotate-[-24deg] rounded-[50%] border border-dashed border-[#858EBA]/10"
        />

        <!-- Vertical axis -->
        <div
          class="absolute bottom-[8%] left-1/2 top-[8%] w-px -translate-x-1/2 bg-[#858EBA]/[0.07]"
        />

        <!-- Horizontal axis -->
        <div
          class="absolute left-[7%] right-[7%] top-1/2 h-px -translate-y-1/2 bg-[#858EBA]/[0.07]"
        />

        <!-- Rotating inner celestial line -->
        <div
          class="absolute left-1/2 top-1/2 h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#858EBA]/[0.055]"
          :class="{
            'animate-[spin_110s_linear_infinite]':
              !prefersReducedMotion,
          }"
        />

        <!-- Degree ticks -->
        <div
          v-for="tick in 36"
          :key="tick"
          class="absolute left-1/2 top-1/2 h-full w-px -translate-x-1/2 -translate-y-1/2"
          :style="{
            transform: `translate(-50%, -50%) rotate(${tick * 10}deg)`,
          }"
        >
          <span
            class="mx-auto mt-[8%] block h-2 w-px bg-[#858EBA]/15"
            :class="{
              'h-4 bg-[#858EBA]/30': tick % 3 === 0,
            }"
          />
        </div>

        <!-- Central coordinate -->
        <div
          class="absolute left-1/2 top-1/2 h-[17%] w-[17%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#858EBA]/10"
        />

        <div
          class="absolute left-1/2 top-1/2 h-[8%] w-[8%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#858EBA]/15"
        />

        <!-- Centre point -->
        <div
          class="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E8E7E1]/70"
        />

        <!-- Coordinate numbers -->
        <span
          class="absolute left-[7%] top-[49%] font-mono text-[6px] tracking-[0.2em] text-[#858EBA]/30"
        >
          000°
        </span>

        <span
          class="absolute right-[7%] top-[49%] font-mono text-[6px] tracking-[0.2em] text-[#858EBA]/30"
        >
          180°
        </span>

        <span
          class="absolute left-[49%] top-[5%] font-mono text-[6px] tracking-[0.2em] text-[#858EBA]/30"
        >
          090°
        </span>

        <span
          class="absolute bottom-[5%] left-[48%] font-mono text-[6px] tracking-[0.2em] text-[#858EBA]/30"
        >
          270°
        </span>
      </div>
    </div>

    <!-- =========================================================
         HERO TYPOGRAPHY
    ========================================================== -->

    <div
      class="absolute left-5 top-[17%] z-40 sm:left-[10%] lg:top-[18%]"
    >
      <div
        class="mb-5 flex items-center gap-3"
      >
        <span
          class="h-px w-9 bg-[#858EBA]/60"
        />

        <span
          class="text-[7px] uppercase tracking-[0.42em] text-[#858EBA]/60"
        >
          Vedic astrology · intuitive guidance
        </span>
      </div>

      <h1
        class="font-serif text-[clamp(4.4rem,10vw,10.5rem)] font-normal leading-[0.75] tracking-[-0.075em] text-[#E8E7E1]"
      >
        <span class="block">
          The sky
        </span>

        <span
          class="ml-[10vw] block italic text-[#858EBA]"
        >
          remembers.
        </span>
      </h1>

      <div
        class="mt-7 ml-[10vw] flex items-center gap-3"
      >
        <span
          class="h-px w-8 bg-[#858EBA]/30"
        />

        <span
          class="text-[7px] uppercase tracking-[0.3em] text-[#858EBA]/45"
        >
          Read the patterns
        </span>
      </div>
    </div>

    <!-- =========================================================
         SAMMY
         IMPORTANT: ORIGINAL COLOUR IS PRESERVED
    ========================================================== -->

    <div
      class="pointer-events-none absolute bottom-[-1%] left-1/2 z-20 w-[min(108vw,880px)] sm:w-[min(88vw,880px)] lg:w-[min(62vw,880px)]"
      :style="portraitStyle"
    >
      <!-- Cool atmospheric halo behind him -->
      <div
        class="absolute left-1/2 top-[16%] h-[50%] w-[55%] -translate-x-1/2 rounded-full bg-[#34447A]/12 blur-[90px]"
      />

      <!-- Fine celestial ellipse behind portrait -->
      <div
        class="absolute left-1/2 top-[8%] h-[53%] w-[46%] -translate-x-1/2 rotate-[7deg] rounded-[50%] border border-[#858EBA]/10"
      />

      <div
        class="absolute left-1/2 top-[13%] h-[45%] w-[39%] -translate-x-1/2 -rotate-[10deg] rounded-[50%] border border-dashed border-[#858EBA]/[0.07]"
      />

      <!-- ORIGINAL ARTWORK — NO GRAYSCALE -->
      <img
        src="/images/sammy.png"
        alt="Sammy, Vedic astrologer and intuitive reader"
        draggable="false"
        class="relative z-10 block h-auto md:w-5/6 sm:w-full select-none object-contain"
      />

      <!-- Subtle floor reflection / grounding -->
      <div
        class="absolute bottom-[1%] left-1/2 h-8 w-[58%] -translate-x-1/2 rounded-[50%] bg-[#34447A]/15 blur-2xl"
      />
    </div>

    <!-- =========================================================
         PLANETARY ANNOTATIONS
    ========================================================== -->

    <div
      class="absolute left-[12%] top-[47%] z-40 hidden lg:block"
    >
      <div class="flex items-center gap-4">
        <div
          class="flex h-7 w-7 items-center justify-center rounded-full border border-[#858EBA]/25 bg-[#080D1C]"
        >
          <Moon
            class="h-3 w-3 text-[#858EBA]"
            :stroke-width="1"
          />
        </div>

        <div>
          <div
            class="text-[7px] uppercase tracking-[0.3em] text-[#858EBA]/55"
          >
            Moon
          </div>

          <div
            class="mt-1 font-mono text-[10px] text-[#E8E7E1]/65"
          >
            12° Libra
          </div>
        </div>
      </div>

      <div
        class="ml-3 mt-3 h-16 w-px bg-[#858EBA]/15"
      />

      <div
        class="ml-3 mt-2 text-[6px] uppercase tracking-[0.25em] text-[#858EBA]/35"
      >
        Emotional balance
      </div>
    </div>

    <div
      class="absolute right-[10%] top-[34%] z-40 hidden lg:block"
    >
      <div class="flex items-center gap-4">
        <div>
          <div
            class="text-right text-[7px] uppercase tracking-[0.3em] text-[#858EBA]/55"
          >
            Mercury
          </div>

          <div
            class="mt-1 text-right font-mono text-[10px] text-[#E8E7E1]/65"
          >
            24° Leo
          </div>
        </div>

        <div
          class="flex h-7 w-7 items-center justify-center rounded-full border border-[#858EBA]/25 bg-[#080D1C]"
        >
          <Zap
            class="h-3 w-3 text-[#858EBA]"
            :stroke-width="1"
          />
        </div>
      </div>

      <div
        class="ml-auto mr-3 mt-3 h-12 w-px bg-[#858EBA]/15"
      />

      <div
        class="mr-3 mt-2 text-right text-[6px] uppercase tracking-[0.25em] text-[#858EBA]/35"
      >
        Expression
      </div>
    </div>

    <div
      class="absolute bottom-[28%] right-[12%] z-40 hidden lg:block"
    >
      <div class="flex items-center gap-4">
        <div
          class="flex h-7 w-7 items-center justify-center rounded-full border border-[#858EBA]/25 bg-[#080D1C]"
        >
          <Sparkles
            class="h-3 w-3 text-[#858EBA]"
            :stroke-width="1"
          />
        </div>

        <div>
          <div
            class="text-[7px] uppercase tracking-[0.3em] text-[#858EBA]/55"
          >
            Venus
          </div>

          <div
            class="mt-1 font-mono text-[10px] text-[#E8E7E1]/65"
          >
            08° Cancer
          </div>
        </div>
      </div>

      <div
        class="ml-3 mt-3 h-10 w-px bg-[#858EBA]/15"
      />

      <div
        class="ml-3 mt-2 text-[6px] uppercase tracking-[0.25em] text-[#858EBA]/35"
      >
        Connection
      </div>
    </div>

    <!-- =========================================================
         INTRO COPY
    ========================================================== -->

    <div
      class="absolute bottom-[13%] left-5 z-40 max-w-[230px] sm:left-[10%] lg:bottom-[15%]"
    >
      <div
        class="mb-4 text-[7px] uppercase tracking-[0.4em] text-[#858EBA]/40"
      >
        A different way of seeing
      </div>

      <p
        class="text-[11px] font-light leading-5 text-[#E8E7E1]/45"
      >
        Explore the deeper patterns behind your relationships,
        purpose and the experiences shaping your life.
      </p>
    </div>

    <!-- =========================================================
         SKY INDEX
    ========================================================== -->

    <div
      class="absolute bottom-[15%] right-[8%] z-40 hidden w-[210px] lg:block"
    >
      <div
        class="mb-4 flex items-center justify-between border-b border-[#858EBA]/10 pb-3"
      >
        <span
          class="text-[7px] uppercase tracking-[0.35em] text-[#858EBA]/45"
        >
          Current sky
        </span>

        <span
          class="font-mono text-[6px] tracking-[0.2em] text-[#858EBA]/25"
        >
          03 / 03
        </span>
      </div>

      <div
        v-for="planet in planets"
        :key="planet.name"
        class="flex items-center justify-between border-b border-[#858EBA]/[0.06] py-2.5"
      >
        <div class="flex items-center gap-3">
          <component
            :is="planet.icon"
            class="h-3 w-3 text-[#858EBA]/55"
            :stroke-width="1"
          />

          <span
            class="text-[7px] uppercase tracking-[0.24em] text-[#E8E7E1]/45"
          >
            {{ planet.name }}
          </span>
        </div>

        <span
          class="font-mono text-[8px] text-[#858EBA]/65"
        >
          {{ planet.degree }} {{ planet.sign }}
        </span>
      </div>
    </div>

    <!-- =========================================================
         BOTTOM INDEX
    ========================================================== -->

    <div
      class="absolute bottom-8 left-5 z-50 hidden items-center gap-4 sm:left-[10%] sm:flex"
    >
      <span
        class="font-mono text-[7px] tracking-[0.3em] text-[#858EBA]/35"
      >
        01
      </span>

      <span
        class="h-px w-8 bg-[#858EBA]/20"
      />

      <span
        class="text-[7px] uppercase tracking-[0.38em] text-[#858EBA]/30"
      >
        Astral portrait
      </span>
    </div>

    <!-- =========================================================
         CTA
    ========================================================== -->

    <button
      type="button"
      class="group absolute bottom-7 right-5 z-50 flex items-center gap-5 sm:right-[8%]"
      @click="openBooking"
    >
      <span
        class="text-[8px] uppercase tracking-[0.38em] text-[#E8E7E1]/60 transition-colors duration-500 group-hover:text-[#E8E7E1]"
      >
        Begin a reading
      </span>

      <span
        class="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#858EBA]/25 transition-all duration-500 group-hover:border-[#858EBA]/70 group-hover:bg-[#182653]/30"
      >
        <ArrowUpRight
          class="h-4 w-4 text-[#858EBA] transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
          :stroke-width="1"
        />

        <span
          class="absolute inset-[-5px] rounded-full border border-[#858EBA]/[0.06] transition-transform duration-700 group-hover:scale-110"
        />
      </span>
    </button>

    <!-- =========================================================
         MOBILE PLANET STRIP
    ========================================================== -->

    <div
      class="absolute bottom-[14%] left-5 right-5 z-40 grid grid-cols-3 border-y border-[#858EBA]/10 py-3 lg:hidden"
    >
      <div
        v-for="(planet, index) in planets"
        :key="planet.name"
        class="flex items-center gap-2"
        :class="{
          'justify-center border-x border-[#858EBA]/10':
            index === 1,
          'justify-end': index === 2,
        }"
      >
        <component
          :is="planet.icon"
          class="h-3 w-3 text-[#858EBA]/55"
          :stroke-width="1"
        />

        <div>
          <div
            class="text-[6px] uppercase tracking-[0.2em] text-[#858EBA]/35"
          >
            {{ planet.name }}
          </div>

          <div
            class="mt-1 font-mono text-[7px] text-[#E8E7E1]/50"
          >
            {{ planet.degree }} {{ planet.sign }}
          </div>
        </div>
      </div>
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
  isolation: isolate;
}

@keyframes celestialSpin {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }

  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
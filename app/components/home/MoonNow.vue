<script setup lang="ts">
import {
  ArrowUpRight,
  ChevronRight,
  Moon,
  Orbit,
  Sunrise,
} from "lucide-vue-next";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion-v";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

interface MoonPhase {
  name: string;
  phase_angle_deg: number;
  illumination: number;
  age_days: number;
  distance_km: number;
  is_waxing: boolean;
}

interface MoonZodiac {
  sign: string;
  sign_id: string;
  degree: number;
  zodiac_type: string;
}

interface MoonNextPhases {
  new_moon?: string;
  first_quarter?: string;
  full_moon?: string;
  last_quarter?: string;
}

interface MoonData {
  phase: MoonPhase;
  zodiac?: MoonZodiac;
  next_phases?: MoonNextPhases;
}

interface MoonApiResponse {
  success: boolean;
  location: {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  moon: MoonData;
}

type FetchStatus = "idle" | "pending" | "success" | "error";

const shouldReduceMotion = useReducedMotion();

const moonSection = ref<HTMLElement | null>(null);
const moonData = ref<MoonApiResponse | null>(null);

const fetchStatus = ref<FetchStatus>("idle");
const showLunarCycle = ref(false);

let observer: IntersectionObserver | null = null;
let hasFetched = false;

/* ============================================================
   API
============================================================ */

const retryAvailableAt = ref(0);

const fetchMoonData = async () => {
  if (
    hasFetched &&
    fetchStatus.value === "success"
  ) {
    return;
  }

  if (fetchStatus.value === "pending") {
    return;
  }

  if (Date.now() < retryAvailableAt.value) {
    return;
  }

  fetchStatus.value = "pending";

  try {
    const response =
      await $fetch<MoonApiResponse>(
        "/api/moon/phase",
      );

    moonData.value = response;
    fetchStatus.value = "success";
    hasFetched = true;
  } catch (err) {
    console.error(
      "Moon data error:",
      err,
    );

    hasFetched = false;
    fetchStatus.value = "error";

    /*
     * Don't immediately hammer the API again.
     */
    retryAvailableAt.value =
      Date.now() + 30_000;
  }
};

/* ============================================================
   VIEWPORT FETCH
============================================================ */

onMounted(() => {
  if (!moonSection.value) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    void fetchMoonData();
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];

      if (!entry?.isIntersecting) {
        return;
      }

      void fetchMoonData();

      observer?.disconnect();
      observer = null;
    },
    {
      rootMargin: "500px 0px",
      threshold: 0,
    }
  );

  observer.observe(moonSection.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  observer = null;
});

/* ============================================================
   HELPERS
============================================================ */

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatVedicDegree(decimal: number) {
  const degrees = Math.floor(decimal);

  const rawMinutes = (decimal - degrees) * 60;
  const minutes = Math.floor(rawMinutes);

  let seconds = Math.round((rawMinutes - minutes) * 60);

  let finalDegrees = degrees;
  let finalMinutes = minutes;

  if (seconds === 60) {
    seconds = 0;
    finalMinutes += 1;
  }

  if (finalMinutes === 60) {
    finalMinutes = 0;
    finalDegrees += 1;
  }

  return `${finalDegrees}° ${finalMinutes}′ ${seconds}″`;
}

function getNextMajorPhase(phases?: MoonNextPhases) {
  if (!phases) {
    return {
      label: "—",
      date: "—",
    };
  }

  const candidates = [
    {
      label: "New Moon",
      value: phases.new_moon,
    },
    {
      label: "First Quarter",
      value: phases.first_quarter,
    },
    {
      label: "Full Moon",
      value: phases.full_moon,
    },
    {
      label: "Last Quarter",
      value: phases.last_quarter,
    },
  ]
    .filter(
      (
        item
      ): item is {
        label: string;
        value: string;
      } => Boolean(item.value)
    )
    .map((item) => ({
      ...item,
      timestamp: new Date(item.value).getTime(),
    }))
    .filter(
      (item) =>
        Number.isFinite(item.timestamp) &&
        item.timestamp > Date.now()
    )
    .sort((a, b) => a.timestamp - b.timestamp);

  const next = candidates[0];

  if (!next) {
    return {
      label: "—",
      date: "—",
    };
  }

  return {
    label: next.label,
    date: formatDate(next.value),
  };
}

/* ============================================================
   COMPUTED DATA
============================================================ */

const moon = computed(() => {
  const data = moonData.value?.moon;

  if (!data) {
    return {
      sign: "—",
      degree: "—",
      phase: "Lunar data unavailable",
      illumination: 0,
      age: "—",
      distance: "—",
      nextPhase: "—",
      nextPhaseDate: "—",
      zodiacType: "—",
      movement: "The current lunar position is temporarily unavailable.",
    };
  }

  const zodiac = data.zodiac;
  const nextPhase = getNextMajorPhase(data.next_phases);

  return {
    sign: zodiac?.sign ?? "—",
    degree: zodiac
      ? formatVedicDegree(zodiac.degree)
      : "—",
    phase: data.phase.name,
    illumination: Math.round(data.phase.illumination * 100),
    age: `${data.phase.age_days.toFixed(1)} days`,
    distance: `${Math.round(
      data.phase.distance_km
    ).toLocaleString()} km`,
    nextPhase: nextPhase.label,
    nextPhaseDate: nextPhase.date,
    zodiacType: zodiac?.zodiac_type ?? "—",
    movement: zodiac
      ? `The Moon is moving through ${zodiac.sign}`
      : "The Moon is currently moving through the sky.",
  };
});

const lunarMessage = computed(() => {
  switch (moon.value.phase) {
    case "New Moon":
      return "A quiet beginning. A time to turn inward, set intentions, and make space for what is ready to emerge.";

    case "Waxing Crescent":
      return "Something is beginning to take shape. Notice what is growing, even if it is still small.";

    case "First Quarter":
      return "Momentum is building. This is a useful moment to notice where action, courage, and commitment are being called for.";

    case "Waxing Gibbous":
      return "A time for refinement, preparation, and paying attention to what is becoming clearer within you.";

    case "Full Moon":
      return "Something may be ready to be seen clearly. Notice what has reached fullness, illumination, or completion.";

    case "Waning Gibbous":
      return "A moment for reflection, gratitude, and understanding what the recent cycle has revealed.";

    case "Last Quarter":
      return "Release what no longer needs to be carried. Reflection can create room for a different way forward.";

    case "Waning Crescent":
      return "The sky invites rest, reflection, and gentle closure before the next cycle begins.";

    default:
      return "A moment to return inward, listen closely, and notice what your inner world is asking you to tend.";
  }
});

const lunarPhases = computed(() => {
  const phases = moonData.value?.moon.next_phases;

  if (!phases) {
    return [];
  }

  return [
    {
      label: "New Moon",
      value: phases.new_moon,
    },
    {
      label: "First Quarter",
      value: phases.first_quarter,
    },
    {
      label: "Full Moon",
      value: phases.full_moon,
    },
    {
      label: "Last Quarter",
      value: phases.last_quarter,
    },
  ]
    .filter(
      (
        phase
      ): phase is {
        label: string;
        value: string;
      } => Boolean(phase.value)
    )
    .map((phase) => ({
      ...phase,
      date: formatDate(phase.value),
    }))
    .sort(
      (a, b) =>
        new Date(a.value).getTime() -
        new Date(b.value).getTime()
    );
});

const moonStats = computed(() => [
  {
    label: "Illumination",
    value: `${moon.value.illumination}%`,
  },
  {
    label: "Lunar age",
    value: moon.value.age,
  },
  {
    label: "Distance",
    value: moon.value.distance,
  },
]);

/* ============================================================
   UI
============================================================ */

const openLunarCycle = () => {
  showLunarCycle.value = true;
};

const closeLunarCycle = () => {
  showLunarCycle.value = false;
};

const isLoading = computed(
  () => fetchStatus.value === "pending"
);

const hasError = computed(
  () => fetchStatus.value === "error"
);

const locationName = computed(
  () =>
    moonData.value?.location?.name?.toUpperCase() ??
    "CURRENT LOCATION"
);
</script>

<template>
  <section
    id="moon"
    ref="moonSection"
    class="relative overflow-hidden bg-[#160B10] py-24 text-[#F1E8E3] sm:py-32 lg:py-40"
  >
    <!-- ======================================================
         LIGHTWEIGHT BACKGROUND
    ======================================================= -->

    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0"
    >
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(107,15,26,0.14),transparent_38%),linear-gradient(180deg,#160B10_0%,#1A0B11_50%,#160B10_100%)]"
      />

      <div
        class="absolute left-0 right-0 top-[18%] h-px bg-gradient-to-r from-transparent via-[#C58B92]/10 to-transparent"
      />

      <div
        class="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#160B10] to-transparent"
      />
    </div>

    <!-- ======================================================
         CONTENT
    ======================================================= -->

    <div
      class="relative mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-12 xl:px-16"
    >
      <!-- ====================================================
           HEADER
      ===================================================== -->

      <motion.div
        class="mb-14 flex flex-col gap-8 lg:mb-20 lg:flex-row lg:items-end lg:justify-between"
        :initial="{
          opacity: 0,
          y: shouldReduceMotion ? 0 : 20,
        }"
        :whileInView="{
          opacity: 1,
          y: 0,
        }"
        :inViewOptions="{ once: true, amount: 0.15 }"
        :transition="{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }"
      >
        <div>
          <div class="mb-5 flex items-center gap-4">
            <span
              class="h-px w-10 bg-[#C58B92]/30"
            />

            <span
              class="text-[9px] uppercase tracking-[0.35em] text-[#F1E8E3]/35"
            >
              The Moon Now
            </span>
          </div>

          <h2
            class="max-w-4xl font-serif text-5xl leading-[0.94] tracking-[-0.045em] sm:text-6xl lg:text-7xl"
          >
            The sky is
            <br />

            <span class="text-[#F1E8E3]/30">
              always moving.
            </span>
          </h2>
        </div>

        <div class="max-w-sm lg:pb-1">
          <div class="flex items-center gap-2">
            <span
              class="h-1.5 w-1.5 rounded-full bg-[#C8A77A]"
            />

            <span
              class="text-[9px] uppercase tracking-[0.3em] text-[#C8A77A]/65"
            >
              {{
                isLoading
                  ? "Reading the sky"
                  : hasError
                    ? "Lunar data unavailable"
                    : "Live lunar position"
              }}
            </span>
          </div>

          <p
            class="mt-4 text-sm leading-7 text-[#F1E8E3]/40"
          >
            A quiet snapshot of where the Moon is moving
            through the sky right now.
          </p>
        </div>
      </motion.div>

      <!-- ====================================================
           MAIN CARD
      ===================================================== -->

      <motion.div
        class="relative overflow-hidden rounded-[1.75rem] border border-[#C58B92]/10 bg-[#1D0C13]"
        :initial="{
          opacity: 0,
          y: shouldReduceMotion ? 0 : 24,
        }"
        :whileInView="{
          opacity: 1,
          y: 0,
        }"
        :inViewOptions="{ once: true, amount: 0.08 }"
        :transition="{
          duration: 0.8,
          delay: 0.08,
          ease: [0.22, 1, 0.36, 1],
        }"
      >
        <!-- ==================================================
             CARD HEADER
        =================================================== -->

        <div
          class="flex flex-col gap-4 border-b border-[#C58B92]/[0.08] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8"
        >
          <div class="flex items-center gap-3">
            <Orbit
              class="h-4 w-4 text-[#C8A77A]/55"
              :stroke-width="1.2"
            />

            <span
              class="text-[9px] uppercase tracking-[0.3em] text-[#F1E8E3]/30"
            >
              Current lunar observation
            </span>
          </div>

          <span
            class="font-mono text-[9px] tracking-[0.18em] text-[#F1E8E3]/20"
          >
            {{ locationName }}
          </span>
        </div>

        <!-- ==================================================
             CARD BODY
        =================================================== -->

        <div
          class="grid lg:grid-cols-[0.95fr_1.05fr]"
        >
          <!-- =================================================
               MOON VISUAL
          ================================================== -->

          <div
            class="relative flex min-h-[430px] items-center justify-center overflow-hidden border-b border-[#C58B92]/[0.08] px-5 py-12 sm:min-h-[500px] lg:min-h-[620px] lg:border-b-0 lg:border-r"
          >
            <!-- Very cheap atmospheric shape -->
            <div
              aria-hidden="true"
              class="absolute h-[300px] w-[300px] rounded-full bg-[#6B0F1A]/10"
            />

            <!-- Outer ring -->
            <div
              aria-hidden="true"
              class="absolute h-[360px] w-[360px] rounded-full border border-[#C58B92]/[0.08] sm:h-[430px] sm:w-[430px]"
            />

            <!-- Inner ring -->
            <div
              aria-hidden="true"
              class="absolute h-[270px] w-[270px] rounded-full border border-dashed border-[#C8A77A]/10 sm:h-[330px] sm:w-[330px]"
            />

            <!-- Small orbital point -->
            <div
              aria-hidden="true"
              class="absolute left-[calc(50%+175px)] top-1/2 h-1.5 w-1.5 rounded-full bg-[#C8A77A]/70 sm:left-[calc(50%+210px)]"
            />

            <!-- Moon -->
            <motion.div
              class="relative h-[190px] w-[190px] overflow-hidden rounded-full border border-[#F1E8E3]/10 bg-[radial-gradient(circle_at_32%_28%,rgba(241,232,227,0.34),rgba(197,139,146,0.16)_38%,rgba(29,12,19,0.98)_76%)] sm:h-[225px] sm:w-[225px]"
              :initial="{
                scale: shouldReduceMotion ? 1 : 0.94,
                opacity: 0,
              }"
              :whileInView="{
                scale: 1,
                opacity: 1,
              }"
              :inViewOptions="{ once: true }"
              :transition="{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }"
            >
              <!-- Static lunar surface -->
              <div
                aria-hidden="true"
                class="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_27%_34%,rgba(255,255,255,.14)_0_3%,transparent_3.5%),radial-gradient(circle_at_68%_25%,rgba(255,255,255,.09)_0_5%,transparent_5.5%),radial-gradient(circle_at_54%_66%,rgba(255,255,255,.07)_0_4%,transparent_4.5%),radial-gradient(circle_at_28%_72%,rgba(255,255,255,.06)_0_6%,transparent_6.5%),radial-gradient(circle_at_78%_68%,rgba(0,0,0,.2)_0_6%,transparent_6.5%)]"
              />

              <!-- Phase shadow -->
              <div
                aria-hidden="true"
                class="absolute -right-10 top-0 h-full w-[48%] rounded-full bg-[#160B10]/55"
              />

              <div
                aria-hidden="true"
                class="absolute left-[25%] top-[18%] h-9 w-9 rounded-full bg-[#F1E8E3]/10"
              />
            </motion.div>

            <!-- Visual footer -->
            <div
              class="absolute bottom-7 left-6 right-6 flex items-end justify-between sm:left-8 sm:right-8"
            >
              <div>
                <p
                  class="text-[8px] uppercase tracking-[0.3em] text-[#F1E8E3]/25"
                >
                  Lunar phase
                </p>

                <p
                  class="mt-2 font-serif text-xl text-[#F1E8E3]/80"
                >
                  {{ moon.phase }}
                </p>
              </div>

              <div class="text-right">
                <p
                  class="text-[8px] uppercase tracking-[0.3em] text-[#F1E8E3]/25"
                >
                  Illumination
                </p>

                <p
                  class="mt-2 font-mono text-sm text-[#C8A77A]/70"
                >
                  {{ moon.illumination }}%
                </p>
              </div>
            </div>
          </div>

          <!-- =================================================
               INFORMATION
          ================================================== -->

          <div
            class="flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-14"
          >
            <div>
              <!-- Status -->
              <div
                class="flex items-center justify-between"
              >
                <div class="flex items-center gap-2">
                  <span
                    class="h-1.5 w-1.5 rounded-full bg-[#C8A77A]"
                  />

                  <span
                    class="text-[8px] uppercase tracking-[0.28em] text-[#F1E8E3]/30"
                  >
                    Observing now
                  </span>
                </div>

                <Moon
                  class="h-4 w-4 text-[#C58B92]/25"
                  :stroke-width="1.2"
                />
              </div>

              <!-- Loading state -->
              <div
                v-if="isLoading"
                class="mt-16"
              >
                <div
                  class="h-2 w-28 rounded-full bg-[#F1E8E3]/10"
                />

                <div
                  class="mt-5 h-16 w-56 rounded-lg bg-[#F1E8E3]/[0.04]"
                />

                <div
                  class="mt-6 h-3 w-full max-w-md rounded-full bg-[#F1E8E3]/[0.04]"
                />

                <div
                  class="mt-3 h-3 w-4/5 max-w-sm rounded-full bg-[#F1E8E3]/[0.04]"
                />
              </div>

              <!-- Error -->
              <div
                v-else-if="hasError"
                class="mt-16 max-w-md"
              >
                <p
                  class="text-[9px] uppercase tracking-[0.3em] text-[#C8A77A]/60"
                >
                  Lunar observation
                </p>

                <h3
                  class="mt-4 font-serif text-4xl leading-tight text-[#F1E8E3]/80"
                >
                  The sky is temporarily quiet.
                </h3>

                <p
                  class="mt-5 text-sm leading-7 text-[#F1E8E3]/35"
                >
                  We couldn't retrieve the latest lunar
                  position. Please try again shortly.
                </p>

                <button
                  type="button"
                  class="mt-7 inline-flex items-center gap-2 rounded-full border border-[#C58B92]/15 px-5 py-3 text-[9px] uppercase tracking-[0.2em] text-[#C8A77A]/70 transition hover:border-[#C58B92]/30 hover:text-[#C8A77A]"
                  @click="fetchMoonData"
                >
                  Try again

                  <ArrowUpRight
                    class="h-3.5 w-3.5"
                    :stroke-width="1.3"
                  />
                </button>
              </div>

              <!-- Data -->
              <motion.div
                v-else
                :initial="{
                  opacity: 0,
                  y: shouldReduceMotion ? 0 : 12,
                }"
                :animate="{
                  opacity: 1,
                  y: 0,
                }"
                :transition="{
                  duration: 0.5,
                }"
              >
                <!-- Sign -->
                <div class="mt-12 sm:mt-14">
                  <p
                    class="text-[9px] uppercase tracking-[0.32em] text-[#C8A77A]/65"
                  >
                    Moon in {{ moon.sign }}
                  </p>

                  <div
                    class="mt-4 flex flex-wrap items-end gap-4"
                  >
                    <h3
                      class="font-serif text-5xl leading-none tracking-[-0.045em] text-[#F1E8E3] sm:text-6xl"
                    >
                      {{ moon.sign }}
                    </h3>

                    <span
                      class="pb-1 font-mono text-xs tracking-[0.15em] text-[#F1E8E3]/30"
                    >
                      {{ moon.degree }}
                    </span>
                  </div>

                  <p
                    class="mt-6 max-w-md text-sm leading-7 text-[#F1E8E3]/40"
                  >
                    {{ moon.movement }}.
                  </p>
                </div>

                <!-- Interpretation -->
                <div
                  class="mt-10 border-l border-[#C8A77A]/20 pl-5 sm:mt-12 sm:pl-6"
                >
                  <p
                    class="text-[8px] uppercase tracking-[0.3em] text-[#F1E8E3]/25"
                  >
                    A moment to notice
                  </p>

                  <p
                    class="mt-4 max-w-md font-serif text-lg leading-8 text-[#F1E8E3]/65 sm:text-xl"
                  >
                    {{ lunarMessage }}
                  </p>
                </div>
              </motion.div>
            </div>

            <!-- =================================================
                 STATS
            ================================================== -->

            <div
              v-if="!isLoading && !hasError"
              class="mt-12"
            >
              <div
                class="grid grid-cols-3 border-y border-[#C58B92]/[0.08]"
              >
                <div
                  v-for="(stat, index) in moonStats"
                  :key="stat.label"
                  class="py-5"
                  :class="
                    index !== 0
                      ? 'border-l border-[#C58B92]/[0.08] pl-4 sm:pl-5'
                      : ''
                  "
                >
                  <p
                    class="text-[7px] uppercase tracking-[0.22em] text-[#F1E8E3]/20 sm:text-[8px]"
                  >
                    {{ stat.label }}
                  </p>

                  <p
                    class="mt-3 font-mono text-[10px] tracking-wide text-[#F1E8E3]/60 sm:text-xs"
                  >
                    {{ stat.value }}
                  </p>
                </div>
              </div>

              <!-- Next phase -->
              <div
                class="mt-6 flex items-center justify-between gap-5"
              >
                <div
                  class="flex min-w-0 items-center gap-3"
                >
                  <div
                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#C58B92]/10 bg-[#261018]"
                  >
                    <Moon
                      class="h-3.5 w-3.5 text-[#C8A77A]/60"
                      :stroke-width="1.2"
                    />
                  </div>

                  <div class="min-w-0">
                    <p
                      class="text-[7px] uppercase tracking-[0.24em] text-[#F1E8E3]/20"
                    >
                      Next major phase
                    </p>

                    <p
                      class="mt-1 truncate text-xs text-[#F1E8E3]/60 sm:text-sm"
                    >
                      {{ moon.nextPhase }}
                    </p>
                  </div>
                </div>

                <p
                  class="shrink-0 text-right font-mono text-[8px] tracking-[0.12em] text-[#C8A77A]/50 sm:text-[9px]"
                >
                  {{ moon.nextPhaseDate }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- ==================================================
             CARD FOOTER
        =================================================== -->

        <div
          class="flex flex-col gap-5 border-t border-[#C58B92]/[0.08] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8"
        >
          <div class="flex items-center gap-3">
            <Sunrise
              class="h-4 w-4 shrink-0 text-[#C58B92]/25"
              :stroke-width="1.2"
            />

            <p
              class="text-[8px] uppercase tracking-[0.25em] text-[#F1E8E3]/25"
            >
              Lunar data updates with the moving sky
            </p>
          </div>

          <motion.button
            type="button"
            class="group flex items-center gap-2 text-left text-[9px] uppercase tracking-[0.22em] text-[#C8A77A]/60"
            :whileHover="
              shouldReduceMotion
                ? {}
                : { x: 3 }
            "
            :whilePress="
              shouldReduceMotion
                ? {}
                : { scale: 0.98 }
            "
            @click="openLunarCycle"
          >
            Explore the lunar cycle

            <ChevronRight
              class="h-3.5 w-3.5"
              :stroke-width="1.3"
            />
          </motion.button>
        </div>
      </motion.div>

      <!-- ====================================================
           FOOTNOTE
      ===================================================== -->

      <motion.div
        class="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        :initial="{
          opacity: 0,
        }"
        :whileInView="{
          opacity: 1,
        }"
        :inViewOptions="{ once: true, amount: 0.2 }"
        :transition="{
          duration: 0.6,
          delay: 0.15,
        }"
      >
        <p
          class="max-w-xl text-[8px] uppercase leading-5 tracking-[0.2em] text-[#F1E8E3]/30"
        >
          The Moon's position is continuously changing.
          The information displayed here is calculated from
          the current observation location and time.
        </p>

        <div
          class="flex shrink-0 items-center gap-3 text-[#F1E8E3]/40"
        >
          <span
            class="font-mono text-[9px] tracking-[0.18em]"
          >
            MOON / 01
          </span>

          <ArrowUpRight
            class="h-3 w-3"
            :stroke-width="1.2"
          />
        </div>
      </motion.div>
    </div>

    <!-- ======================================================
         LUNAR CYCLE MODAL
    ======================================================= -->

    <AnimatePresence>
      <motion.div
        v-if="showLunarCycle"
        class="fixed inset-0 z-[100] flex items-end justify-center bg-[#090508]/85 p-3 sm:items-center sm:p-6"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        :transition="{ duration: 0.2 }"
        @click.self="closeLunarCycle"
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="lunar-cycle-title"
          class="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-[1.5rem] border border-[#C58B92]/15 bg-[#1D0C13] shadow-[0_30px_80px_rgba(0,0,0,0.4)]"
          :initial="{
            opacity: 0,
            y: shouldReduceMotion ? 0 : 24,
            scale: shouldReduceMotion ? 1 : 0.98,
          }"
          :animate="{
            opacity: 1,
            y: 0,
            scale: 1,
          }"
          :exit="{
            opacity: 0,
            y: shouldReduceMotion ? 0 : 18,
            scale: shouldReduceMotion ? 1 : 0.98,
          }"
          :transition="{
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }"
        >
          <!-- Header -->
          <div
            class="flex items-start justify-between border-b border-[#C58B92]/[0.08] px-5 py-5 sm:px-7 sm:py-6"
          >
            <div>
              <div class="flex items-center gap-3">
                <Moon
                  class="h-4 w-4 text-[#C8A77A]/60"
                  :stroke-width="1.2"
                />

                <span
                  class="text-[8px] uppercase tracking-[0.3em] text-[#C8A77A]/60"
                >
                  Lunar cycle
                </span>
              </div>

              <h3
                id="lunar-cycle-title"
                class="mt-3 font-serif text-3xl tracking-[-0.03em] text-[#F1E8E3] sm:text-4xl"
              >
                The Moon's journey
              </h3>

              <p
                class="mt-3 max-w-lg text-sm leading-6 text-[#F1E8E3]/40"
              >
                Follow the major phases unfolding through
                the current lunar cycle.
              </p>
            </div>

            <motion.button
              type="button"
              aria-label="Close lunar cycle"
              class="ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#C58B92]/10 text-[#F1E8E3]/40"
              :whileHover="
                shouldReduceMotion
                  ? {}
                  : {
                      scale: 1.05,
                      borderColor:
                        'rgba(197,139,146,0.25)',
                    }
              "
              :whilePress="
                shouldReduceMotion
                  ? {}
                  : { scale: 0.95 }
              "
              @click="closeLunarCycle"
            >
              <span
                class="text-lg leading-none"
              >
                ×
              </span>
            </motion.button>
          </div>

          <!-- Content -->
          <div
            class="max-h-[58vh] overflow-y-auto px-5 py-6 sm:px-7 sm:py-8"
          >
            <!-- Current -->
            <div
              class="rounded-2xl border border-[#C58B92]/10 bg-[#261018]/40 p-5 sm:p-6"
            >
              <div class="flex items-center gap-3">
                <span
                  class="h-1.5 w-1.5 rounded-full bg-[#C8A77A]"
                />

                <span
                  class="text-[8px] uppercase tracking-[0.28em] text-[#C8A77A]/60"
                >
                  Moon now
                </span>
              </div>

              <div
                class="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
              >
                <div>
                  <p
                    class="font-serif text-3xl text-[#F1E8E3]/85"
                  >
                    {{ moon.phase }}
                  </p>

                  <p
                    class="mt-2 text-sm text-[#F1E8E3]/35"
                  >
                    {{ moon.sign }}

                    <span
                      class="mx-2 text-[#C58B92]/30"
                    >
                      ·
                    </span>

                    {{ moon.degree }}
                  </p>
                </div>

                <div
                  class="text-left sm:text-right"
                >
                  <p
                    class="text-[8px] uppercase tracking-[0.25em] text-[#F1E8E3]/20"
                  >
                    Illumination
                  </p>

                  <p
                    class="mt-2 font-mono text-sm text-[#C8A77A]/70"
                  >
                    {{ moon.illumination }}%
                  </p>
                </div>
              </div>
            </div>

            <!-- Major phases -->
            <div class="mt-8">
              <div
                class="mb-4 flex items-center gap-4"
              >
                <span
                  class="text-[8px] uppercase tracking-[0.3em] text-[#F1E8E3]/25"
                >
                  Major phases
                </span>

                <div
                  class="h-px flex-1 bg-[#C58B92]/[0.08]"
                />
              </div>

              <div
                v-if="lunarPhases.length"
                class="divide-y divide-[#C58B92]/[0.08]"
              >
                <motion.div
                  v-for="(
                    phase, index
                  ) in lunarPhases"
                  :key="phase.label"
                  class="flex items-center gap-4 py-5"
                  :initial="{
                    opacity: 0,
                    y: shouldReduceMotion ? 0 : 8,
                  }"
                  :animate="{
                    opacity: 1,
                    y: 0,
                  }"
                  :transition="{
                    duration: 0.3,
                    delay: shouldReduceMotion
                      ? 0
                      : index * 0.05,
                  }"
                >
                  <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#C58B92]/10 bg-[#261018]"
                  >
                    <Moon
                      class="h-4 w-4 text-[#C8A77A]/50"
                      :stroke-width="1.2"
                    />
                  </div>

                  <div class="min-w-0 flex-1">
                    <p
                      class="text-sm text-[#F1E8E3]/65"
                    >
                      {{ phase.label }}
                    </p>

                    <p
                      class="mt-1 text-[8px] uppercase tracking-[0.24em] text-[#F1E8E3]/20"
                    >
                      Major lunar phase
                    </p>
                  </div>

                  <p
                    class="shrink-0 text-right font-mono text-[9px] tracking-[0.1em] text-[#C8A77A]/55"
                  >
                    {{ phase.date }}
                  </p>
                </motion.div>
              </div>

              <div
                v-else
                class="rounded-2xl border border-[#C58B92]/10 bg-[#261018]/40 p-6"
              >
                <p
                  class="text-sm text-[#F1E8E3]/40"
                >
                  Lunar phase information is temporarily
                  unavailable.
                </p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div
            class="flex flex-col gap-4 border-t border-[#C58B92]/[0.08] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7"
          >
            <div class="flex items-center gap-3">
              <Orbit
                class="h-3.5 w-3.5 text-[#C58B92]/30"
                :stroke-width="1.2"
              />

              <span
                class="text-[8px] uppercase tracking-[0.22em] text-[#F1E8E3]/20"
              >
                {{ moon.zodiacType }} lunar observation
              </span>
            </div>

            <button
              type="button"
              class="text-[8px] uppercase tracking-[0.25em] text-[#C8A77A]/55 transition-colors hover:text-[#C8A77A]"
              @click="closeLunarCycle"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  </section>
</template>

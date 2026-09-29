<script setup lang="ts">
import {
  ArrowUpRight,
  ChevronRight,
  Moon,
  Orbit,
  Sunrise,
} from "lucide-vue-next";
import { computed, ref } from "vue";

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

const loading = ref(true);
const error = ref<string | null>(null);
const moonData = ref<MoonApiResponse | null>(null);
const showLunarCycle = ref(false);
const lunarCycleLoading = ref(false);
const lunarCycleError = ref<string | null>(null);


const fetchMoonData = async () => {
  loading.value = true;
  error.value = null;

  try {
    moonData.value = await $fetch<MoonApiResponse>("/api/moon/phase");
  } catch (err) {
    console.error("Moon data error:", err);

    error.value = "Unable to retrieve the current lunar position.";
  } finally {
    loading.value = false;
  }
};

await fetchMoonData();

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

const openLunarCycle = async () => {
  showLunarCycle.value = true;

  // For now, the current API data already contains
  // the major upcoming lunar phases.
  // The monthly endpoint will replace this with
  // the complete lunar calendar later.
  lunarCycleLoading.value = false;
  lunarCycleError.value = null;
};

const closeLunarCycle = () => {
  showLunarCycle.value = false;
};

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
    distance: `${Math.round(data.phase.distance_km).toLocaleString()} km`,
    nextPhase: nextPhase.label,
    nextPhaseDate: nextPhase.date,
    zodiacType: zodiac?.zodiac_type ?? "—",
    movement: zodiac
      ? `The Moon is moving through ${zodiac.sign}`
      : "The Moon is currently moving through the sky.",
  };
});

const lunarMessage = computed(() => {
  const phase = moon.value.phase;

  switch (phase) {
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

  // TypeScript knows that array[0] can be undefined.
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatVedicDegree(decimal: number) {
  const degrees = Math.floor(decimal);
  const minutes = Math.floor(
    (decimal - degrees) * 60
  );

  const seconds = Math.round(
    (((decimal - degrees) * 60) - minutes) * 60
  );

  if (seconds === 60) {
    return `${degrees}° ${minutes + 1}′`;
  }

  return `${degrees}° ${minutes}′ ${seconds}″`;
}
</script>

<template>
  <section
    id="moon"
    class="relative overflow-hidden bg-transparent py-28 text-[#F1E8E3] sm:py-36 lg:py-44"
  >
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <!-- Central wine atmosphere -->
      <div
        class="absolute left-[58%] top-[38%] h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6B0F1A]/[0.10] blur-[170px]"
      />

      <!-- Soft burgundy atmosphere -->
      <div
        class="absolute -right-48 top-[8%] h-[500px] w-[500px] rounded-full bg-[#42141F]/[0.18] blur-[160px]"
      />

      <!-- Rose horizon -->
      <div
        class="absolute left-0 right-0 top-[18%] h-px bg-gradient-to-r from-transparent via-[#C58B92]/10 to-transparent"
      />

      <!-- Lower atmospheric fade -->
      <div
        class="absolute bottom-0 left-0 right-0 h-72 bg-gradient-to-t from-[#160B10] to-transparent"
      />
    </div>

    <!-- Grain -->

    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 opacity-[0.018]"
      style="
        background-image: url(&quot;data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.6'/%3E%3C/svg%3E&quot;);
      "
    />

    <div class="relative mx-auto max-w-[1400px] px-6 lg:px-10">
      <div
        class="mb-16 flex flex-col gap-8 lg:mb-24 lg:flex-row lg:items-end lg:justify-between"
      >
        <div>
          <div class="mb-6 flex items-center gap-4">
            <div class="h-px w-10 bg-[#C58B92]/25" />
            <span
              class="text-[9px] uppercase tracking-[0.35em] text-[#F1E8E3]/30"
            >
              The Moon Now
            </span>
          </div>

          <h2
            class="max-w-4xl font-serif text-5xl leading-[0.94] tracking-[-0.04em] text-[#F1E8E3] sm:text-6xl lg:text-7xl"
          >
            The sky is <br />
            <span class="text-[#F1E8E3]/30">
              always moving.
            </span>
          </h2>
        </div>

        <div class="max-w-sm lg:pb-2">
          <div class="flex items-center gap-2">
            <span
                class="h-1.5 w-1.5 rounded-full bg-[#C8A77A] shadow-[0_0_14px_rgba(200,167,122,0.45)]"
                :class="{ 'animate-pulse': loading }"
                />

                <span
                class="text-[9px] uppercase tracking-[0.3em] text-[#C8A77A]/65"
                >
                {{ loading ? "Reading the sky" : "Live lunar position" }}
            </span>
          </div>

          <p class="mt-4 text-sm leading-7 text-[#F1E8E3]/40">
            A snapshot of where the Moon is moving through the sky right now.
          </p>
        </div>
      </div>

      <div
        class="relative overflow-hidden rounded-[2rem] border border-[#C58B92]/[0.10] bg-[#1D0C13]/80 shadow-[0_40px_120px_rgba(0,0,0,0.28)]"
      >
        <!-- Top metadata -->

        <div
          class="flex flex-col gap-4 border-b border-[#C58B92]/[0.08] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8"
        >
          <div class="flex items-center gap-3">
            <Orbit class="h-4 w-4 text-[#C8A77A]/55" />

            <span
              class="text-[9px] uppercase tracking-[0.3em] text-[#F1E8E3]/30"
            >
              Current lunar observation
            </span>
          </div>

          <span
            class="font-mono text-[9px] tracking-[0.2em] text-[#F1E8E3]/20"
          >
            {{ moonData?.location.name?.toUpperCase() ?? "LAGOS" }}
          </span>
        </div>

        <div class="grid lg:grid-cols-[1.05fr_0.95fr]">
          <div
            class="relative flex min-h-[560px] items-center justify-center overflow-hidden border-b border-[#C58B92]/[0.08] lg:min-h-[680px] lg:border-b-0 lg:border-r"
          >
            <!-- Atmospheric moon halo -->

            <div
              aria-hidden="true"
              class="absolute h-[390px] w-[390px] rounded-full bg-[#6B0F1A]/[0.10] blur-[100px]"
            />

            <!-- Outer celestial ring -->

            <div
              aria-hidden="true"
              class="absolute h-[440px] w-[440px] rounded-full border border-[#C58B92]/[0.08] sm:h-[500px] sm:w-[500px]"
            />

            <!-- Broken orbital ring -->

            <div
              aria-hidden="true"
              class="absolute h-[360px] w-[360px] rounded-full border border-dashed border-[#C8A77A]/[0.12] sm:h-[420px] sm:w-[420px]"
            />

            <!-- Inner ring -->

            <div
              aria-hidden="true"
              class="absolute h-[270px] w-[270px] rounded-full border border-[#C58B92]/[0.07]"
            />

            <!-- Orbital marker -->

            <div
              aria-hidden="true"
              class="absolute left-[calc(50%+205px)] top-[calc(50%-10px)] h-2 w-2 rounded-full bg-[#C8A77A]/65 shadow-[0_0_22px_rgba(200,167,122,0.45)]"
            />

            <!-- Moon glow -->

            <div
              aria-hidden="true"
              class="absolute h-[310px] w-[310px] rounded-full bg-[#C8A77A]/[0.035] blur-[70px]"
            />

            <!-- Moon -->

            <div
              class="relative flex h-[235px] w-[235px] items-center justify-center overflow-hidden rounded-full border border-[#F1E8E3]/10 bg-[radial-gradient(circle_at_34%_28%,rgba(241,232,227,0.30),rgba(197,139,146,0.12)_40%,rgba(29,12,19,0.98)_74%)] shadow-[0_0_100px_rgba(197,139,146,0.06)]"
            >
              <!-- Moon surface -->

              <div
                aria-hidden="true"
                class="absolute inset-0 opacity-40"
                style="
                  background-image:
                    radial-gradient(circle at 30% 35%, rgba(255,255,255,.14) 0 2%, transparent 3%),
                    radial-gradient(circle at 68% 25%, rgba(255,255,255,.09) 0 4%, transparent 5%),
                    radial-gradient(circle at 55% 65%, rgba(255,255,255,.08) 0 3%, transparent 4%),
                    radial-gradient(circle at 28% 72%, rgba(255,255,255,.06) 0 5%, transparent 6%),
                    radial-gradient(circle at 78% 68%, rgba(0,0,0,.18) 0 5%, transparent 6%);
                "
              />

              <!-- Waxing shadow -->

              <div
                aria-hidden="true"
                class="absolute -right-8 top-0 h-full w-[48%] rounded-full bg-[#160B10]/55 blur-[4px]"
              />

              <!-- Highlight -->

              <div
                aria-hidden="true"
                class="absolute left-[28%] top-[20%] h-10 w-10 rounded-full bg-[#F1E8E3]/10 blur-xl"
              />
            </div>

            <!-- Moon label -->

            <div
              class="absolute bottom-8 left-8 right-8 flex items-end justify-between"
            >
              <div>
                <p
                  class="text-[8px] uppercase tracking-[0.3em] text-[#F1E8E3]/25"
                >
                  Lunar phase
                </p>

                <p class="mt-2 font-serif text-xl text-[#F1E8E3]/80">
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

          <div
            class="flex flex-col justify-between p-8 sm:p-12 lg:p-14 xl:p-16"
          >
            <div>
              <!-- Live indicator -->

              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span
                    class="h-1.5 w-1.5 rounded-full bg-[#C8A77A] shadow-[0_0_12px_rgba(200,167,122,0.45)]"
                  />

                  <span
                    class="text-[8px] uppercase tracking-[0.28em] text-[#F1E8E3]/30"
                  >
                    Observing now
                  </span>
                </div>

                <Moon
                  class="h-4 w-4 text-[#C58B92]/25"
                />
              </div>

              <!-- Sign -->

              <div class="mt-14">
                <p
                  class="text-[9px] uppercase tracking-[0.32em] text-[#C8A77A]/65"
                >
                  Moon in {{ moon.sign }}
                </p>

                <div class="mt-4 flex flex-wrap items-end gap-5">
                  <h3
                    class="font-serif text-6xl leading-none tracking-[-0.04em] text-[#F1E8E3] sm:text-7xl"
                  >
                    {{ moon.sign }}
                  </h3>

                  <span
                    class="pb-1 font-mono text-xs tracking-[0.18em] text-[#F1E8E3]/30"
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
                class="relative mt-12 border-l border-[#C8A77A]/20 pl-6"
              >
                <p
                  class="text-[8px] uppercase tracking-[0.3em] text-[#F1E8E3]/25"
                >
                  A moment to notice
                </p>

                <p
                  class="mt-4 max-w-md font-serif text-xl leading-8 text-[#F1E8E3]/70"
                >
                  {{ lunarMessage }}
                </p>
              </div>
            </div>

            <!-- Stats -->

            <div class="mt-14">
              <div
                class="grid grid-cols-3 border-y border-[#C58B92]/[0.08]"
              >
                <div
                  v-for="(stat, index) in moonStats"
                  :key="stat.label"
                  class="py-6"
                  :class="
                    index !== 0
                      ? 'border-l border-[#C58B92]/[0.08] pl-5'
                      : ''
                  "
                >
                  <p
                    class="text-[8px] uppercase tracking-[0.25em] text-[#F1E8E3]/20"
                  >
                    {{ stat.label }}
                  </p>

                  <p
                    class="mt-3 font-mono text-xs tracking-wide text-[#F1E8E3]/60"
                  >
                    {{ stat.value }}
                  </p>
                </div>
              </div>

              <!-- Next phase -->

              <div
                class="mt-7 flex items-center justify-between gap-6"
              >
                <div class="flex items-center gap-4">
                  <div
                    class="flex h-10 w-10 items-center justify-center rounded-full border border-[#C58B92]/[0.10] bg-[#261018]/50"
                  >
                    <Moon
                      class="h-4 w-4 text-[#C8A77A]/60"
                    />
                  </div>

                  <div>
                    <p
                      class="text-[8px] uppercase tracking-[0.25em] text-[#F1E8E3]/20"
                    >
                      Next major phase
                    </p>

                    <p class="mt-1 text-sm text-[#F1E8E3]/60">
                      {{ moon.nextPhase }}
                    </p>
                  </div>
                </div>

                <p
                  class="text-right font-mono text-[9px] tracking-[0.15em] text-[#F1E8E3]/25"
                >
                  {{ moon.nextPhaseDate }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          class="flex flex-col gap-5 border-t border-[#C58B92]/[0.08] px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8"
        >
          <div class="flex items-center gap-4">
            <Sunrise class="h-4 w-4 text-[#C58B92]/25" />

            <p
              class="text-[8px] uppercase tracking-[0.28em] text-[#F1E8E3]/25"
            >
              Lunar data updates with the moving sky
            </p>
          </div>

            <button
                type="button"
                class="group flex items-center gap-2 text-[9px] uppercase tracking-[0.25em] text-[#C8A77A]/60 transition hover:text-[#C8A77A]"
                @click="openLunarCycle"
                >
                Explore the lunar cycle

                <ChevronRight
                    class="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                />
            </button>
        </div>
      </div>

      <div
        class="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <p
          class="max-w-xl text-[9px] uppercase leading-5 tracking-[0.22em] text-[#F1E8E3]/50"
        >
          The Moon's position is continuously changing. The information
          displayed here will be calculated from the current observation
          location and time.
        </p>

        <div class="flex items-center gap-3 text-[#F1E8E3]/60">
          <span
            class="font-mono text-[9px] tracking-[0.2em]"
          >
            MOON / 01
          </span>

          <ArrowUpRight class="h-3 w-3" />
        </div>
      </div>
    </div>

    <!-- Lunar Cycle Panel -->
    <Transition name="lunar-panel">
    <div
        v-if="showLunarCycle"
        class="fixed inset-0 z-[100] flex items-end justify-center bg-[#090508]/80 p-4 backdrop-blur-md sm:items-center sm:p-6"
        @click.self="closeLunarCycle"
    >
        <div
        class="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-[2rem] border border-[#C58B92]/15 bg-[#1D0C13] shadow-[0_40px_120px_rgba(0,0,0,0.5)]"
        >
        <!-- Atmospheric background -->
        <div
            aria-hidden="true"
            class="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#6B0F1A]/20 blur-[100px]"
        />

        <div
            aria-hidden="true"
            class="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[#42141F]/20 blur-[100px]"
        />

        <!-- Header -->
        <div
            class="relative flex items-start justify-between border-b border-[#C58B92]/[0.08] px-6 py-6 sm:px-8"
        >
            <div>
            <div class="flex items-center gap-3">
                <Moon class="h-4 w-4 text-[#C8A77A]/60" />

                <span
                class="text-[9px] uppercase tracking-[0.3em] text-[#C8A77A]/60"
                >
                Lunar cycle
                </span>
            </div>

            <h3
                class="mt-4 font-serif text-3xl tracking-[-0.03em] text-[#F1E8E3] sm:text-4xl"
            >
                The Moon's journey
            </h3>

            <p
                class="mt-3 max-w-lg text-sm leading-7 text-[#F1E8E3]/40"
            >
                Follow the major phases unfolding through the current lunar
                cycle.
            </p>
            </div>

            <button
            type="button"
            aria-label="Close lunar cycle"
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#C58B92]/10 text-[#F1E8E3]/40 transition hover:border-[#C58B92]/20 hover:text-[#F1E8E3]"
            @click="closeLunarCycle"
            >
            <span class="text-lg leading-none">×</span>
            </button>
        </div>

        <!-- Content -->
        <div class="relative max-h-[60vh] overflow-y-auto px-6 py-8 sm:px-8">
            <div
            v-if="lunarCycleLoading"
            class="flex min-h-48 items-center justify-center"
            >
            <div class="flex items-center gap-3">
                <span
                class="h-2 w-2 animate-pulse rounded-full bg-[#C8A77A]"
                />

                <span
                class="text-[9px] uppercase tracking-[0.3em] text-[#F1E8E3]/30"
                >
                Reading the lunar cycle
                </span>
            </div>
            </div>

            <div
            v-else-if="lunarCycleError"
            class="rounded-2xl border border-[#C58B92]/10 bg-[#261018]/50 p-6"
            >
            <p class="text-sm text-[#F1E8E3]/50">
                {{ lunarCycleError }}
            </p>
            </div>

            <div v-else>
            <!-- Current position -->
            <div
                class="mb-8 rounded-2xl border border-[#C58B92]/10 bg-[#261018]/40 p-5 sm:p-6"
            >
                <div class="flex items-center gap-3">
                <span
                    class="h-1.5 w-1.5 rounded-full bg-[#C8A77A] shadow-[0_0_12px_rgba(200,167,122,0.45)]"
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
                    <span class="mx-2 text-[#C58B92]/30">·</span>
                    {{ moon.degree }}
                    </p>
                </div>

                <div class="text-left sm:text-right">
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

            <!-- Upcoming phases -->
            <div>
                <div class="mb-5 flex items-center gap-4">
                <span
                    class="text-[8px] uppercase tracking-[0.3em] text-[#F1E8E3]/25"
                >
                    Major phases
                </span>

                <div class="h-px flex-1 bg-[#C58B92]/[0.08]" />
                </div>

                <div
                v-if="lunarPhases.length"
                class="divide-y divide-[#C58B92]/[0.08]"
                >
                <div
                    v-for="(phase, index) in lunarPhases"
                    :key="phase.label"
                    class="group flex items-center gap-5 py-5"
                >
                    <!-- Phase marker -->
                    <div
                    class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#C58B92]/10 bg-[#261018]/50"
                    >
                    <Moon
                        class="h-4 w-4 text-[#C8A77A]/50"
                        :class="
                        index % 2 === 0
                            ? 'fill-[#C8A77A]/10'
                            : ''
                        "
                    />
                    </div>

                    <!-- Phase information -->
                    <div class="min-w-0 flex-1">
                    <p
                        class="text-sm text-[#F1E8E3]/65"
                    >
                        {{ phase.label }}
                    </p>

                    <p
                        class="mt-1 text-[8px] uppercase tracking-[0.25em] text-[#F1E8E3]/20"
                    >
                        Major lunar phase
                    </p>
                    </div>

                    <div class="shrink-0 text-right">
                    <p
                        class="font-mono text-[10px] tracking-[0.12em] text-[#C8A77A]/55"
                    >
                        {{ phase.date }}
                    </p>
                    </div>
                </div>
                </div>

                <div
                v-else
                class="rounded-2xl border border-[#C58B92]/10 bg-[#261018]/40 p-6"
                >
                <p class="text-sm text-[#F1E8E3]/40">
                    Lunar phase information is temporarily unavailable.
                </p>
                </div>
            </div>
            </div>
        </div>

        <!-- Footer -->
        <div
            class="relative flex flex-col gap-4 border-t border-[#C58B92]/[0.08] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8"
        >
            <div class="flex items-center gap-3">
            <Orbit class="h-3.5 w-3.5 text-[#C58B92]/30" />

            <span
                class="text-[8px] uppercase tracking-[0.25em] text-[#F1E8E3]/20"
            >
                {{ moon.zodiacType }} lunar observation
            </span>
            </div>

            <button
            type="button"
            class="text-[8px] uppercase tracking-[0.25em] text-[#C8A77A]/55 transition hover:text-[#C8A77A]"
            @click="closeLunarCycle"
            >
            Close
            </button>
        </div>
        </div>
    </div>
    </Transition>
  </section>
</template>

<style scoped>
.lunar-panel-enter-active,
.lunar-panel-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.lunar-panel-enter-from,
.lunar-panel-leave-to {
  opacity: 0;
}

.lunar-panel-enter-from > div,
.lunar-panel-leave-to > div {
  transform: translateY(24px) scale(0.98);
}

.lunar-panel-enter-active > div,
.lunar-panel-leave-active > div {
  transition: transform 0.35s ease;
}
</style>
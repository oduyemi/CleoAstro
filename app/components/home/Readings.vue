<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Moon,
  Orbit,
  Sparkles,
  Sun,
} from "lucide-vue-next";
import { motion, useReducedMotion } from "motion-v";

import { Button } from "@/components/ui/button";
import BookAReadingDialog from "@/components/booking/BookAReadingDialog.vue";

const prefersReducedMotion = useReducedMotion();

const noMotion = {};

type RashiKey =
  | "mesha"
  | "vrishabha"
  | "mithuna"
  | "karka"
  | "simha"
  | "kanya"
  | "tula"
  | "vrishchika"
  | "dhanu"
  | "makara"
  | "kumbha"
  | "meena";

interface Rashi {
  key: RashiKey;
  name: string;
  western: string;
  symbol: string;
  element: string;
  quality: string;
}

interface Horoscope {
  general: string;
  relationships: string;
  purpose: string;
  innerLife: string;
}

interface Panchang {
  tithi?: string;
  nakshatra?: string;
  yoga?: string;
  karana?: string;
  sunSign?: string;
  moonSign?: string;
  sunrise?: string;
  sunset?: string;
  rahuKalam?: string;
}

interface ForecastMeta {
  source?: string;
  location?: string;
  timezone?: string;
  generatedFor?: string;
}

interface ForecastData {
  period: "daily";
  label: string;
  theme: string;
  summary: string;
  sections: {
    relationships: string;
    purpose: string;
    innerLife: string;
  };
  guidance?: string;
  panchang?: Panchang;
  meta?: ForecastMeta;
}

interface ForecastApiResponse {
  success?: boolean;
  provider?: string;
  period?: string;
  location?: {
    country?: string;
    city?: string;
    timezone?: string;
    latitude?: number;
    longitude?: number;
  };
  date?: string;
  data?: ForecastData;
}

/*
|--------------------------------------------------------------------------
| RASHIS
|--------------------------------------------------------------------------
*/

const rashis: Rashi[] = [
  {
    key: "mesha",
    name: "Mesha",
    western: "Aries",
    symbol: "♈",
    element: "Fire",
    quality: "Initiative",
  },
  {
    key: "vrishabha",
    name: "Vrishabha",
    western: "Taurus",
    symbol: "♉",
    element: "Earth",
    quality: "Stability",
  },
  {
    key: "mithuna",
    name: "Mithuna",
    western: "Gemini",
    symbol: "♊",
    element: "Air",
    quality: "Curiosity",
  },
  {
    key: "karka",
    name: "Karka",
    western: "Cancer",
    symbol: "♋",
    element: "Water",
    quality: "Sensitivity",
  },
  {
    key: "simha",
    name: "Simha",
    western: "Leo",
    symbol: "♌",
    element: "Fire",
    quality: "Expression",
  },
  {
    key: "kanya",
    name: "Kanya",
    western: "Virgo",
    symbol: "♍",
    element: "Earth",
    quality: "Discernment",
  },
  {
    key: "tula",
    name: "Tula",
    western: "Libra",
    symbol: "♎",
    element: "Air",
    quality: "Balance",
  },
  {
    key: "vrishchika",
    name: "Vrishchika",
    western: "Scorpio",
    symbol: "♏",
    element: "Water",
    quality: "Depth",
  },
  {
    key: "dhanu",
    name: "Dhanu",
    western: "Sagittarius",
    symbol: "♐",
    element: "Fire",
    quality: "Expansion",
  },
  {
    key: "makara",
    name: "Makara",
    western: "Capricorn",
    symbol: "♑",
    element: "Earth",
    quality: "Discipline",
  },
  {
    key: "kumbha",
    name: "Kumbha",
    western: "Aquarius",
    symbol: "♒",
    element: "Air",
    quality: "Vision",
  },
  {
    key: "meena",
    name: "Meena",
    western: "Pisces",
    symbol: "♓",
    element: "Water",
    quality: "Intuition",
  },
];

/*
|--------------------------------------------------------------------------
| DAILY RASHI HOROSCOPES
|--------------------------------------------------------------------------
*/

const horoscopes: Record<RashiKey, Horoscope> = {
  mesha: {
    general:
      "Today asks you to move with intention rather than urgency. A situation that has felt uncertain may become clearer once you stop trying to force the outcome.",
    relationships:
      "Give others room to express what they really mean. A patient conversation can reveal more than a quick reaction.",
    purpose:
      "Choose one meaningful priority and give it your full attention. Progress comes through focused action.",
    innerLife:
      "Your instinct may be strong today, but allow intuition and patience to work together.",
  },

  vrishabha: {
    general:
      "A steadier rhythm serves you today. Instead of chasing what is changing around you, notice what remains worthy of your energy.",
    relationships:
      "Reliability speaks loudly. Showing up consistently may matter more than finding the perfect words.",
    purpose:
      "Build rather than rush. Small practical decisions can create a stronger foundation for what comes next.",
    innerLife:
      "Give yourself permission to slow down. Stillness may reveal something that constant activity has been hiding.",
  },

  mithuna: {
    general:
      "Your mind may be especially active today. Let curiosity guide you, but remember that not every question needs an immediate answer.",
    relationships:
      "A meaningful exchange can shift your perspective. Listen for what is being said beneath the surface.",
    purpose:
      "Follow the idea that keeps returning to you. It may deserve more attention than the distractions competing for it.",
    innerLife:
      "Create a little quiet around yourself. Your clearest insight may arrive when the mental noise settles.",
  },

  karka: {
    general:
      "Today invites you to honour your emotional instincts without allowing them to decide everything for you. There is wisdom in feeling deeply and responding gently.",
    relationships:
      "Family and close relationships may ask for greater tenderness. Speak honestly without needing to protect everyone from the truth.",
    purpose:
      "Let meaningful work matter more than external recognition. What feels aligned may be more valuable than what simply looks successful.",
    innerLife:
      "Your intuition is heightened. Notice recurring feelings, memories, or inner nudges without rushing to interpret them.",
  },

  simha: {
    general:
      "Your presence carries weight today. Use it to encourage, create, and illuminate rather than to prove yourself.",
    relationships:
      "Warmth opens doors. A generous gesture can soften a distance that words alone have not been able to cross.",
    purpose:
      "Take ownership of what genuinely matters to you. Confidence grows when your actions reflect your deeper values.",
    innerLife:
      "Ask yourself where you are seeking approval when what you really need is self-trust.",
  },

  kanya: {
    general:
      "Today favours discernment. You may notice details others overlook, but remember that perfection is not always the same as progress.",
    relationships:
      "Be careful not to solve what someone is simply asking you to understand. Presence can be more helpful than correction.",
    purpose:
      "Organise what feels scattered, but leave space for flexibility. A useful adjustment could improve your plans.",
    innerLife:
      "Release the need to have everything figured out. Some clarity arrives only after you begin.",
  },

  tula: {
    general:
      "Balance is not always about keeping everyone happy. Today may ask you to recognise what feels fair and honour it.",
    relationships:
      "A relationship benefits from honest boundaries. Harmony becomes stronger when it is built on truth rather than avoidance.",
    purpose:
      "Consider where your energy is divided. Choosing what deserves your attention can restore momentum.",
    innerLife:
      "Notice where you compromise your own peace. Inner balance begins with listening to yourself.",
  },

  vrishchika: {
    general:
      "Something beneath the surface may be asking for your attention. Trust your ability to recognise what is real without becoming consumed by it.",
    relationships:
      "Depth matters more than appearances. A sincere conversation may transform the tone of an important connection.",
    purpose:
      "Protect your focus. Your strongest progress today may come from working quietly rather than explaining every move.",
    innerLife:
      "Let an old emotional pattern be seen without judging yourself for having carried it.",
  },

  dhanu: {
    general:
      "Your attention may naturally turn toward what is possible next. Let optimism inspire you, while keeping one foot grounded in the present.",
    relationships:
      "Shared laughter and honest conversation can bring lightness to a relationship that has felt too serious.",
    purpose:
      "Follow growth, but distinguish expansion from distraction. The right opportunity should deepen your direction, not scatter it.",
    innerLife:
      "Ask what experience is trying to teach you rather than only asking what it is trying to give you.",
  },

  makara: {
    general:
      "Today rewards patience and deliberate movement. Something you are building may be developing more quietly than you expected.",
    relationships:
      "Let people see the softer side of you. Strength does not require carrying everything alone.",
    purpose:
      "Stay close to the long-term picture. A small disciplined action today can have greater meaning than a dramatic decision.",
    innerLife:
      "Notice the pressure you place on yourself. You are allowed to value progress without constantly measuring it.",
  },

  kumbha: {
    general:
      "A new perspective may change how you understand an old situation. Give yourself permission to think differently.",
    relationships:
      "Authenticity matters. You do not have to become smaller simply to maintain connection.",
    purpose:
      "An unusual idea may contain something useful. Explore it before deciding whether it belongs in your future.",
    innerLife:
      "Spend time with your own thoughts without immediately turning them into plans.",
  },

  meena: {
    general:
      "Your sensitivity can be a strength today. Pay attention to what your intuition notices, while keeping your feet connected to practical reality.",
    relationships:
      "Compassion can bring healing, but remember that understanding someone does not require carrying their emotions for them.",
    purpose:
      "Let imagination inform your direction. Something meaningful may begin as an idea before it becomes a clear plan.",
    innerLife:
      "Protect moments of quiet. Your inner world may have more to tell you when you stop trying to interpret everything.",
  },
};

/*
|--------------------------------------------------------------------------
| STATE
|--------------------------------------------------------------------------
*/

const selectedRashi = ref<RashiKey>("karka");

const loading = ref(true);
const error = ref("");

const forecast = ref<ForecastData | null>(null);

const bookingOpen = ref(false);

const openBooking = () => {
  bookingOpen.value = true;
};

const handleReadingSelection = (_selection: unknown) => {
  // Reserved for future booking-service selection.
};

/*
|--------------------------------------------------------------------------
| COMPUTED
|--------------------------------------------------------------------------
*/

const DEFAULT_RASHI: RashiKey = "karka";

const selectedRashiDetails = computed<Rashi>(() => {
  return (
    rashis.find((rashi) => rashi.key === selectedRashi.value) ??
    rashis.find((rashi) => rashi.key === DEFAULT_RASHI)!
  );
});

const selectedHoroscope = computed<Horoscope>(() => {
  return horoscopes[selectedRashi.value];
});

const panchang = computed<Panchang>(() => {
  return forecast.value?.panchang ?? {};
});

const meta = computed<ForecastMeta>(() => {
  return forecast.value?.meta ?? {};
});

const moonSign = computed(() => {
  return panchang.value.moonSign || "—";
});

const sunSign = computed(() => {
  return panchang.value.sunSign || "—";
});

const nakshatra = computed(() => {
  return panchang.value.nakshatra || "—";
});

const tithi = computed(() => {
  return panchang.value.tithi || "—";
});

const formattedToday = computed(() => {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Lagos",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
});

/*
|--------------------------------------------------------------------------
| API
|--------------------------------------------------------------------------
*/

const fetchForecast = async () => {
  loading.value = true;
  error.value = "";

  try {
    const response = await $fetch<ForecastApiResponse>(
      "/api/vedic/forecast",
      {
        query: {
          period: "daily",
        },
      },
    );

    if (!response.data) {
      throw new Error("No daily Vedic forecast was returned.");
    }

    forecast.value = response.data;
  } catch (err: unknown) {
    console.error("[Readings] Vedic forecast error:", err);

    error.value =
      err instanceof Error
        ? err.message
        : "Unable to load today's Vedic sky.";
  } finally {
    loading.value = false;
  }
};

const selectRashi = (rashi: RashiKey) => {
  selectedRashi.value = rashi;
};

onMounted(() => {
  void fetchForecast();
});
</script>

<template>
  <section
    id="readings"
    class="relative isolate overflow-hidden bg-transparent py-24 text-[#F1E8E3] sm:py-28 lg:py-36"
  >
    <!-- =========================================================
         ATMOSPHERE
    ========================================================== -->

    <div
      aria-hidden="true"
      class="pointer-events-none absolute -left-56 top-0 h-[34rem] w-[34rem] rounded-full bg-[#6B0F1A]/[0.10] blur-[150px]"
    />

    <div
      aria-hidden="true"
      class="pointer-events-none absolute -right-56 top-[18%] h-[38rem] w-[38rem] rounded-full bg-[#7E3541]/[0.07] blur-[170px]"
    />

    <div
      aria-hidden="true"
      class="pointer-events-none absolute bottom-0 left-[35%] h-[30rem] w-[30rem] rounded-full bg-[#42141F]/[0.12] blur-[160px]"
    />

    <!-- Sparse celestial dust -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <span
        class="absolute left-[7%] top-[16%] h-1 w-1 rounded-full bg-[#C58B92]/30"
      />

      <span
        class="absolute left-[17%] top-[72%] h-1.5 w-1.5 rounded-full bg-[#C8A77A]/20"
      />

      <span
        class="absolute left-[31%] top-[11%] h-1 w-1 rounded-full bg-[#F1E8E3]/20"
      />

      <span
        class="absolute left-[54%] top-[28%] h-1 w-1 rounded-full bg-[#C58B92]/25"
      />

      <span
        class="absolute left-[72%] top-[13%] h-1.5 w-1.5 rounded-full bg-[#F1E8E3]/20"
      />

      <span
        class="absolute left-[89%] top-[32%] h-1 w-1 rounded-full bg-[#C8A77A]/25"
      />

      <span
        class="absolute left-[83%] top-[81%] h-1 w-1 rounded-full bg-[#C58B92]/25"
      />
    </div>

    <!-- Top horizon -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C58B92]/15 to-transparent"
    />

    <!-- =========================================================
         CONTENT
    ========================================================== -->

    <div class="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
      <!-- Localized readability layer -->
      <div
        aria-hidden="true"
        class="pointer-events-none absolute -inset-x-8 -inset-y-10 -z-10 rounded-[4rem] bg-[#160B10]/25 backdrop-blur-[18px]"
      />

      <!-- =======================================================
           INTRO
      ======================================================== -->

      <div class="mx-auto max-w-3xl text-center">
        <!-- Status pill -->
        <div
          class="mb-7 inline-flex items-center gap-3 rounded-full border border-[#C58B92]/[0.12] bg-[#1D0C13]/50 px-4 py-2 backdrop-blur-md"
        >
          <span class="relative flex h-2 w-2">
            <span
              v-if="!prefersReducedMotion"
              class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C8A77A] opacity-30"
            />

            <span
              class="relative inline-flex h-2 w-2 rounded-full bg-[#C8A77A]"
            />
          </span>

          <span
            class="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#F1E8E3]/55"
          >
            Daily Vedic Horoscope
          </span>

          <span class="h-3 w-px bg-[#C58B92]/15" />

          <span
            class="text-[10px] uppercase tracking-[0.16em] text-[#C8A77A]/70"
          >
            {{ formattedToday }}
          </span>
        </div>

        <!-- Main heading -->
        <h2
          class="font-serif text-4xl font-medium leading-[1.05] tracking-[-0.05em] text-[#F1E8E3] sm:text-5xl lg:text-7xl"
        >
          Read the
          <span
            class="bg-gradient-to-r from-[#C8A77A] via-[#F1E8E3] to-[#C58B92] bg-clip-text text-transparent"
          >
            current sky.
          </span>
        </h2>

        <p
          class="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#F1E8E3]/50 sm:text-base"
        >
          A daily reflection for your Rashi, inspired by the rhythms
          of Vedic astrology and the movement of the sky.
        </p>

        <div
          class="mt-6 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.16em] text-[#F1E8E3]/25"
        >
          <Sparkles class="h-3.5 w-3.5 text-[#C8A77A]/60" />

          <span>Choose your Rashi to begin</span>
        </div>
      </div>

      <!-- =======================================================
           RASHI SELECTOR
      ======================================================== -->

      <div class="mx-auto mt-14 max-w-6xl">
        <div
          class="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div class="flex items-center gap-2">
              <span
                class="h-1.5 w-1.5 rounded-full bg-[#C8A77A]"
              />

              <p
                class="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#C58B92]/70"
              >
                Choose your Rashi
              </p>
            </div>

            <p class="mt-2 text-xs leading-5 text-[#F1E8E3]/30">
              Select your Moon sign to reveal today's reflection.
            </p>
          </div>

          <div
            class="hidden items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#F1E8E3]/20 sm:flex"
          >
            <Moon class="h-3.5 w-3.5 text-[#C58B92]/55" />
            Sidereal zodiac
          </div>
        </div>

        <!-- Mobile: horizontal selector -->
        <div
          class="-mx-5 flex gap-2 overflow-x-auto px-5 pb-3 scrollbar-none sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0 lg:grid-cols-6"
        >
          <button
            v-for="rashi in rashis"
            :key="rashi.key"
            type="button"
            :aria-pressed="selectedRashi === rashi.key"
            :aria-label="`View ${rashi.name} (${rashi.western}) horoscope`"
            @click="selectRashi(rashi.key)"
            class="group relative min-w-[116px] shrink-0 overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A77A]/40 sm:min-w-0 sm:p-5"
            :class="
              selectedRashi === rashi.key
                ? 'border-[#C58B92]/35 bg-[#42141F]/55 shadow-[0_18px_50px_rgba(107,15,26,.16)]'
                : 'border-[#C58B92]/[0.08] bg-[#1D0C13]/35 hover:-translate-y-0.5 hover:border-[#C58B92]/20 hover:bg-[#261018]/55'
            "
          >
            <!-- Active line -->
            <div
              v-if="selectedRashi === rashi.key"
              class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C8A77A] to-transparent"
            />

            <!-- Hover glow -->
            <div
              aria-hidden="true"
              class="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[#6B0F1A]/10 blur-2xl transition-opacity duration-300"
              :class="
                selectedRashi === rashi.key
                  ? 'opacity-100'
                  : 'opacity-0 group-hover:opacity-100'
              "
            />

            <div class="relative flex items-center justify-between">
              <span
                class="text-2xl transition-all duration-300"
                :class="
                  selectedRashi === rashi.key
                    ? 'scale-110 text-[#F1E8E3]'
                    : 'text-[#C58B92]/40 group-hover:text-[#C58B92]/70'
                "
              >
                {{ rashi.symbol }}
              </span>

              <span
                class="text-[9px] font-medium uppercase tracking-[0.14em]"
                :class="
                  selectedRashi === rashi.key
                    ? 'text-[#C8A77A]/70'
                    : 'text-[#F1E8E3]/15'
                "
              >
                {{ rashi.key.slice(0, 3) }}
              </span>
            </div>

            <p
              class="relative mt-4 text-xs font-medium"
              :class="
                selectedRashi === rashi.key
                  ? 'text-[#F1E8E3]'
                  : 'text-[#F1E8E3]/55'
              "
            >
              {{ rashi.name }}
            </p>

            <p class="relative mt-1 text-[10px] text-[#F1E8E3]/25">
              {{ rashi.western }}
            </p>
          </button>
        </div>
      </div>

      <!-- =======================================================
           FEATURED READING
      ======================================================== -->

      <div class="mt-7">
        <div
          class="relative overflow-hidden rounded-[2.5rem] border border-[#C58B92]/[0.14] bg-[#1D0C13]/55 shadow-[0_35px_120px_rgba(0,0,0,.30)] backdrop-blur-[10px]"
        >
          <!-- Inner atmosphere -->
          <div
            aria-hidden="true"
            class="pointer-events-none absolute -right-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-[#6B0F1A]/[0.12] blur-[120px]"
          />

          <div
            aria-hidden="true"
            class="pointer-events-none absolute -bottom-48 -left-20 h-[30rem] w-[30rem] rounded-full bg-[#42141F]/[0.14] blur-[130px]"
          />

          <!-- Fine top highlight -->
          <div
            aria-hidden="true"
            class="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[#C8A77A]/30 to-transparent"
          />

          <div class="relative grid lg:grid-cols-[1.3fr_.7fr]">
            <!-- =================================================
                 MAIN READING
            ================================================== -->

            <div class="p-7 sm:p-10 lg:p-14">
              <div
                class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <!-- Rashi identity -->
                <div class="flex items-center gap-4">
                  <div
                    class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#C58B92]/20 bg-[#42141F]/35 text-2xl shadow-[0_0_35px_rgba(107,15,26,.10)]"
                  >
                    {{ selectedRashiDetails.symbol }}
                  </div>

                  <div>
                    <p
                      class="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#C8A77A]/65"
                    >
                      Today's reading
                    </p>

                    <h3
                      class="mt-1 text-xl font-medium text-[#F1E8E3]"
                    >
                      {{ selectedRashiDetails.name }}

                      <span class="text-[#F1E8E3]/30">
                        · {{ selectedRashiDetails.western }}
                      </span>
                    </h3>
                  </div>
                </div>

                <!-- Reading status -->
                <div
                  class="flex w-fit items-center gap-2 rounded-full border border-[#C58B92]/10 bg-[#160B10]/30 px-3 py-1.5"
                >
                  <span
                    class="h-1.5 w-1.5 rounded-full bg-[#C8A77A]"
                  />

                  <span
                    class="text-[9px] uppercase tracking-[0.18em] text-[#F1E8E3]/30"
                  >
                    Daily guidance
                  </span>
                </div>
              </div>

              <!-- Main insight -->
              <div class="mt-10">
                <div class="mb-5 flex items-center gap-3">
                  <span
                    class="h-px w-8 bg-gradient-to-r from-[#C8A77A]/60 to-transparent"
                  />

                  <span
                    class="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#C8A77A]/55"
                  >
                    Your daily reflection
                  </span>
                </div>

                <p
                  class="max-w-3xl font-serif text-2xl font-medium leading-[1.45] tracking-[-0.025em] text-[#F1E8E3] sm:text-3xl lg:text-[2.1rem]"
                >
                  {{ selectedHoroscope.general }}
                </p>
              </div>

              <!-- Attributes -->
              <div class="mt-8 flex flex-wrap gap-2">
                <span
                  class="rounded-full border border-[#C58B92]/10 bg-[#F1E8E3]/[0.025] px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-[#F1E8E3]/35"
                >
                  {{ selectedRashiDetails.element }}
                </span>

                <span
                  class="rounded-full border border-[#C58B92]/10 bg-[#F1E8E3]/[0.025] px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-[#F1E8E3]/35"
                >
                  {{ selectedRashiDetails.quality }}
                </span>

                <span
                  class="rounded-full border border-[#C8A77A]/10 bg-[#C8A77A]/[0.025] px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-[#C8A77A]/50"
                >
                  Moon sign
                </span>
              </div>

              <!-- Guidance -->
              <div
                v-if="forecast?.guidance"
                class="mt-9 max-w-2xl border-l border-[#C58B92]/25 pl-5"
              >
                <p
                  class="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#C8A77A]/60"
                >
                  Today's invitation
                </p>

                <p
                  class="mt-3 text-sm leading-7 text-[#F1E8E3]/50"
                >
                  {{ forecast.guidance }}
                </p>
              </div>
            </div>

            <!-- =================================================
                 CELESTIAL VISUALIZATION
            ================================================== -->

            <div
              class="relative flex min-h-[390px] items-center justify-center overflow-hidden border-t border-[#C58B92]/[0.08] bg-[#160B10]/15 p-8 lg:border-l lg:border-t-0"
            >
              <!-- Outer orbit -->
              <motion.div
                aria-hidden="true"
                class="absolute h-72 w-72 rounded-full border border-[#C58B92]/[0.06]"
                :animate="
                  prefersReducedMotion
                    ? noMotion
                    : { rotate: 360 }
                "
                :transition="
                  prefersReducedMotion
                    ? {}
                    : {
                        duration: 55,
                        repeat: Infinity,
                        ease: 'linear',
                      }
                "
              >
                <span
                  class="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C58B92]/60"
                />
              </motion.div>

              <!-- Inner orbit -->
              <motion.div
                aria-hidden="true"
                class="absolute h-52 w-52 rounded-full border border-[#C8A77A]/[0.07]"
                :animate="
                  prefersReducedMotion
                    ? noMotion
                    : { rotate: -360 }
                "
                :transition="
                  prefersReducedMotion
                    ? {}
                    : {
                        duration: 42,
                        repeat: Infinity,
                        ease: 'linear',
                      }
                "
              >
                <span
                  class="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#C8A77A]/50"
                />
              </motion.div>

              <!-- Core ring -->
              <div
                aria-hidden="true"
                class="absolute h-32 w-32 rounded-full border border-[#6B0F1A]/20"
              />

              <!-- Central moon -->
              <div
                class="relative flex h-28 w-28 items-center justify-center rounded-full border border-[#C58B92]/15 bg-gradient-to-br from-[#C8A77A]/[0.08] via-[#42141F]/45 to-[#160B10]/60 shadow-[0_0_100px_rgba(107,15,26,.16)]"
              >
                <Moon class="h-9 w-9 text-[#C8A77A]/70" />

                <span
                  class="absolute -right-1 top-5 h-2 w-2 rounded-full bg-[#C8A77A] shadow-[0_0_20px_rgba(200,167,122,.65)]"
                />
              </div>

              <!-- Small orbit markers -->
              <span
                aria-hidden="true"
                class="absolute left-[22%] top-[29%] h-1 w-1 rounded-full bg-[#C58B92]/45"
              />

              <span
                aria-hidden="true"
                class="absolute right-[22%] top-[41%] h-1.5 w-1.5 rounded-full bg-[#C8A77A]/40"
              />

              <!-- Bottom information -->
              <div
                class="absolute bottom-8 left-6 right-6 text-center"
              >
                <p
                  class="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#C58B92]/45"
                >
                  Your Rashi
                </p>

                <p
                  class="mt-2 text-lg font-medium text-[#F1E8E3]"
                >
                  {{ selectedRashiDetails.name }}
                </p>

                <p class="mt-1 text-xs text-[#F1E8E3]/30">
                  {{ selectedRashiDetails.western }}
                  ·
                  {{ selectedRashiDetails.element }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- =======================================================
           AREAS OF REFLECTION
      ======================================================== -->

      <div class="mt-5">
        <div class="mb-5">
          <p
            class="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C58B92]/55"
          >
            Areas of reflection
          </p>

          <p class="mt-1 text-xs text-[#F1E8E3]/25">
            Three ways to work with today's energy
          </p>
        </div>

        <div class="grid gap-3 lg:grid-cols-3">
          <!-- Relationships -->
          <article
            class="group relative overflow-hidden rounded-[1.75rem] border border-[#C58B92]/[0.08] bg-[#1D0C13]/35 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-[#C58B92]/20 hover:bg-[#261018]/50"
          >
            <div
              aria-hidden="true"
              class="absolute right-0 top-0 h-24 w-24 rounded-full bg-[#6B0F1A]/[0.08] blur-[45px]"
            />

            <div class="relative">
              <div class="flex items-center justify-between">
                <span
                  class="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C58B92]/55"
                >
                  01
                </span>

                <span class="h-px w-8 bg-[#C58B92]/20" />
              </div>

              <h4
                class="mt-5 font-serif text-xl text-[#F1E8E3]"
              >
                Relationships
              </h4>

              <p
                class="mt-4 text-sm leading-7 text-[#F1E8E3]/45"
              >
                {{ selectedHoroscope.relationships }}
              </p>

              <div class="mt-7 flex items-center justify-between">
                <div
                  class="h-px w-10 bg-gradient-to-r from-[#C58B92]/60 to-transparent transition-all duration-500 group-hover:w-16"
                />

                <ArrowRight
                  class="h-4 w-4 text-[#C58B92]/20 transition-all duration-500 group-hover:translate-x-1 group-hover:text-[#C58B92]/60"
                />
              </div>
            </div>
          </article>

          <!-- Purpose -->
          <article
            class="group relative overflow-hidden rounded-[1.75rem] border border-[#C58B92]/[0.08] bg-[#1D0C13]/35 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-[#C8A77A]/20 hover:bg-[#261018]/50"
          >
            <div
              aria-hidden="true"
              class="absolute right-0 top-0 h-24 w-24 rounded-full bg-[#C8A77A]/[0.035] blur-[45px]"
            />

            <div class="relative">
              <div class="flex items-center justify-between">
                <span
                  class="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C8A77A]/60"
                >
                  02
                </span>

                <span class="h-px w-8 bg-[#C8A77A]/20" />
              </div>

              <h4
                class="mt-5 font-serif text-xl text-[#F1E8E3]"
              >
                Purpose
              </h4>

              <p
                class="mt-4 text-sm leading-7 text-[#F1E8E3]/45"
              >
                {{ selectedHoroscope.purpose }}
              </p>

              <div class="mt-7 flex items-center justify-between">
                <div
                  class="h-px w-10 bg-gradient-to-r from-[#C8A77A]/60 to-transparent transition-all duration-500 group-hover:w-16"
                />

                <ArrowRight
                  class="h-4 w-4 text-[#C8A77A]/20 transition-all duration-500 group-hover:translate-x-1 group-hover:text-[#C8A77A]/60"
                />
              </div>
            </div>
          </article>

          <!-- Inner life -->
          <article
            class="group relative overflow-hidden rounded-[1.75rem] border border-[#C58B92]/[0.08] bg-[#1D0C13]/35 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-[#C58B92]/20 hover:bg-[#261018]/50"
          >
            <div
              aria-hidden="true"
              class="absolute right-0 top-0 h-24 w-24 rounded-full bg-[#A45A65]/[0.06] blur-[45px]"
            />

            <div class="relative">
              <div class="flex items-center justify-between">
                <span
                  class="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#A45A65]/65"
                >
                  03
                </span>

                <span class="h-px w-8 bg-[#A45A65]/20" />
              </div>

              <h4
                class="mt-5 font-serif text-xl text-[#F1E8E3]"
              >
                Inner life
              </h4>

              <p
                class="mt-4 text-sm leading-7 text-[#F1E8E3]/45"
              >
                {{ selectedHoroscope.innerLife }}
              </p>

              <div class="mt-7 flex items-center justify-between">
                <div
                  class="h-px w-10 bg-gradient-to-r from-[#A45A65]/60 to-transparent transition-all duration-500 group-hover:w-16"
                />

                <ArrowRight
                  class="h-4 w-4 text-[#A45A65]/20 transition-all duration-500 group-hover:translate-x-1 group-hover:text-[#A45A65]/60"
                />
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- =======================================================
           PANCHANG
      ======================================================== -->

      <div class="mt-5">
        <div
          class="relative overflow-hidden rounded-[2rem] border border-[#C58B92]/[0.08] bg-[#1D0C13]/30 p-7 sm:p-9"
        >
          <div
            aria-hidden="true"
            class="absolute -right-28 -top-28 h-72 w-72 rounded-full bg-[#6B0F1A]/[0.08] blur-[100px]"
          />

          <div
            class="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
          >
            <div>
              <div class="flex items-center gap-3">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-full border border-[#C58B92]/10 bg-[#42141F]/25"
                >
                  <Orbit class="h-4 w-4 text-[#C58B92]/65" />
                </div>

                <div>
                  <p
                    class="text-[10px] font-semibold uppercase tracking-[0.27em] text-[#C8A77A]/55"
                  >
                    The sky behind today
                  </p>

                  <h3
                    class="mt-1 text-lg font-medium text-[#F1E8E3]"
                  >
                    Today's Panchang
                  </h3>
                </div>
              </div>

              <p
                class="mt-4 max-w-xl text-sm leading-7 text-[#F1E8E3]/35"
              >
                The Panchang gives you a quick look at the celestial
                details shaping today's Vedic context.
              </p>
            </div>

            <!-- Location -->
            <div
              class="flex w-fit items-center gap-2 rounded-full border border-[#C58B92]/[0.08] bg-[#160B10]/25 px-3 py-2 text-xs text-[#F1E8E3]/30"
            >
              <CalendarDays
                class="h-3.5 w-3.5 text-[#C58B92]/55"
              />

              {{ meta.location || "Lagos, Nigeria" }}
            </div>
          </div>

          <!-- Error -->
          <div
            v-if="error"
            class="relative mt-8 flex flex-col gap-4 rounded-2xl border border-[#A45A65]/20 bg-[#42141F]/20 p-5 sm:flex-row sm:items-center sm:justify-between"
            role="alert"
          >
            <div>
              <p class="text-sm font-medium text-[#F1E8E3]/75">
                Today's sky couldn't be loaded.
              </p>

              <p class="mt-1 text-xs leading-5 text-[#F1E8E3]/30">
                You can try again in a moment.
              </p>
            </div>

            <button
              type="button"
              class="inline-flex h-10 shrink-0 items-center justify-center rounded-full border border-[#C58B92]/20 bg-[#1D0C13]/60 px-5 text-[11px] font-medium text-[#F1E8E3]/70 transition hover:border-[#C58B92]/35 hover:bg-[#261018] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A77A]/40"
              @click="fetchForecast"
            >
              Try again
            </button>
          </div>

          <!-- Loading -->
          <div
            v-else-if="loading"
            class="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
            aria-label="Loading today's Panchang"
          >
            <div
              v-for="index in 4"
              :key="index"
              class="relative h-28 overflow-hidden rounded-2xl border border-[#C58B92]/[0.05] bg-[#F1E8E3]/[0.02]"
            >
              <div
                class="absolute inset-y-0 -left-1/2 w-1/2 animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-[#F1E8E3]/[0.04] to-transparent"
              />
            </div>
          </div>

          <!-- Panchang data -->
          <div
            v-else
            class="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            <!-- Moon -->
            <div
              class="group rounded-2xl border border-[#C58B92]/[0.07] bg-[#160B10]/35 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C58B92]/15 hover:bg-[#160B10]/50"
            >
              <Moon class="h-4 w-4 text-[#C58B92]/65" />

              <p
                class="mt-5 text-[9px] uppercase tracking-[0.2em] text-[#F1E8E3]/25"
              >
                Moon
              </p>

              <p
                class="mt-2 text-sm font-medium text-[#F1E8E3]/70"
              >
                {{ moonSign }}
              </p>
            </div>

            <!-- Sun -->
            <div
              class="group rounded-2xl border border-[#C58B92]/[0.07] bg-[#160B10]/35 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C8A77A]/15 hover:bg-[#160B10]/50"
            >
              <Sun class="h-4 w-4 text-[#C8A77A]/65" />

              <p
                class="mt-5 text-[9px] uppercase tracking-[0.2em] text-[#F1E8E3]/25"
              >
                Sun
              </p>

              <p
                class="mt-2 text-sm font-medium text-[#F1E8E3]/70"
              >
                {{ sunSign }}
              </p>
            </div>

            <!-- Nakshatra -->
            <div
              class="group rounded-2xl border border-[#C58B92]/[0.07] bg-[#160B10]/35 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C58B92]/15 hover:bg-[#160B10]/50"
            >
              <Sparkles class="h-4 w-4 text-[#C58B92]/65" />

              <p
                class="mt-5 text-[9px] uppercase tracking-[0.2em] text-[#F1E8E3]/25"
              >
                Nakshatra
              </p>

              <p
                class="mt-2 text-sm font-medium text-[#F1E8E3]/70"
              >
                {{ nakshatra }}
              </p>
            </div>

            <!-- Tithi -->
            <div
              class="group rounded-2xl border border-[#C58B92]/[0.07] bg-[#160B10]/35 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C8A77A]/15 hover:bg-[#160B10]/50"
            >
              <CalendarDays
                class="h-4 w-4 text-[#C8A77A]/65"
              />

              <p
                class="mt-5 text-[9px] uppercase tracking-[0.2em] text-[#F1E8E3]/25"
              >
                Tithi
              </p>

              <p
                class="mt-2 text-sm font-medium text-[#F1E8E3]/70"
              >
                {{ tithi }}
              </p>
            </div>
          </div>

          <!-- Closing thought -->
          <div
            class="mt-8 border-t border-[#C58B92]/[0.06] pt-7 text-center"
          >
            <p
              class="font-serif text-lg font-medium tracking-[-0.02em] text-[#F1E8E3]/75"
            >
              The sky is always moving.
            </p>

            <p
              class="mx-auto mt-2 max-w-xl text-xs leading-6 text-[#F1E8E3]/25"
            >
              Notice what is shifting around you — and within you.
            </p>
          </div>
        </div>
      </div>


      <div
        class="relative mt-5 overflow-hidden rounded-[2.25rem] border border-[#C58B92]/[0.12] bg-gradient-to-br from-[#42141F]/40 via-[#1D0C13]/45 to-[#6B0F1A]/25 p-8 sm:p-10 lg:p-12"
      >
        <!-- Decorative orbits -->
        <div
          aria-hidden="true"
          class="absolute -right-28 -top-28 h-80 w-80 rounded-full border border-[#C58B92]/[0.06]"
        />

        <div
          aria-hidden="true"
          class="absolute -right-5 -top-10 h-44 w-44 rounded-full border border-[#C8A77A]/[0.07]"
        />

        <div
          aria-hidden="true"
          class="absolute right-20 top-16 h-2 w-2 rounded-full bg-[#C8A77A]/60 shadow-[0_0_20px_rgba(200,167,122,.4)]"
        />

        <div
          aria-hidden="true"
          class="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-[#6B0F1A]/10 blur-[70px]"
        />

        <div
          class="relative flex flex-col gap-9 lg:flex-row lg:items-center lg:justify-between"
        >
          <div class="max-w-2xl">
            <div class="flex items-center gap-3">
              <Sparkles class="h-4 w-4 text-[#C8A77A]/70" />

              <span
                class="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#C8A77A]/60"
              >
                Go deeper
              </span>
            </div>

            <h3
              class="mt-4 font-serif text-2xl font-medium leading-[1.15] tracking-[-0.035em] text-[#F1E8E3] sm:text-3xl lg:text-4xl"
            >
              The daily sky gives you a moment.

              <span class="text-[#F1E8E3]/40">
                Your birth chart gives you context.
              </span>
            </h3>

            <p
              class="mt-4 max-w-xl text-sm leading-7 text-[#F1E8E3]/40 sm:text-base"
            >
              Explore your birth chart through a personal reading
              focused on the patterns, questions, and themes most
              relevant to you.
            </p>
          </div>

          <Button
            type="button"
            class="group inline-flex h-12 shrink-0 items-center justify-center rounded-full border border-[#C8A77A]/35 bg-[#6B0F1A] px-7 text-[13px] font-medium tracking-wide text-[#F1E8E3] shadow-[0_12px_36px_rgba(107,15,26,0.24)] transition-all duration-500 hover:-translate-y-0.5 hover:border-[#C8A77A]/55 hover:bg-[#7E3541] hover:shadow-[0_16px_45px_rgba(107,15,26,0.34)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A77A]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#160B10]"
            @click="openBooking"
          >
            Explore my birth chart

            <ArrowRight
              class="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </Button>
        </div>
      </div>

      <!-- Disclaimer -->
      <p
        class="mx-auto mt-7 max-w-2xl text-center text-[14px] leading-6 text-[#F1E8E3]/15"
      >
        Vedic astrology is presented as a tool for reflection,
        awareness, and personal exploration. It should not be used
        as a substitute for professional medical, legal, financial,
        or mental-health advice.
      </p>
    </div>


    <BookAReadingDialog
      v-model:open="bookingOpen"
      @select="handleReadingSelection"
    />
  </section>
</template>

<style scoped>
@keyframes shimmer {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(400%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .animate-ping,
  .animate-\[shimmer_1\.8s_infinite\] {
    animation: none !important;
  }
}
</style>
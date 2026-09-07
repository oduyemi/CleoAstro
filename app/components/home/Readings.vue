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
|
| These are intentionally short and human-readable.
|
| They are NOT presented as raw FreeAstroAPI output.
| The Panchang below provides the current Vedic sky context.
|
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
    class="relative isolate overflow-hidden bg-transparent py-24 text-white sm:py-32"
  >
    <!-- =========================================================
         ATMOSPHERE
    ========================================================== -->

    <div
      aria-hidden="true"
      class="pointer-events-none absolute -left-48 top-0 h-[34rem] w-[34rem] rounded-full bg-violet-700/10 blur-[140px]"
    />

    <div
      aria-hidden="true"
      class="pointer-events-none absolute -right-48 top-[20%] h-[36rem] w-[36rem] rounded-full bg-amber-400/10 blur-[150px]"
    />

    <div
      aria-hidden="true"
      class="pointer-events-none absolute bottom-0 left-1/3 h-[28rem] w-[28rem] rounded-full bg-indigo-600/10 blur-[140px]"
    />

    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 opacity-[0.025]"
      style="
        background-image:
          linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px);
        background-size: 72px 72px;
      "
    />

    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0"
    >
      <span class="absolute left-[8%] top-[18%] h-1 w-1 rounded-full bg-white/50" />
      <span class="absolute left-[18%] top-[67%] h-1.5 w-1.5 rounded-full bg-amber-200/40" />
      <span class="absolute left-[32%] top-[12%] h-1 w-1 rounded-full bg-white/40" />
      <span class="absolute left-[48%] top-[32%] h-1 w-1 rounded-full bg-violet-200/50" />
      <span class="absolute left-[64%] top-[17%] h-1.5 w-1.5 rounded-full bg-white/40" />
      <span class="absolute left-[78%] top-[42%] h-1 w-1 rounded-full bg-amber-200/50" />
      <span class="absolute left-[91%] top-[22%] h-1 w-1 rounded-full bg-white/40" />
      <span class="absolute left-[85%] top-[78%] h-1.5 w-1.5 rounded-full bg-violet-200/40" />
      <span class="absolute left-[13%] top-[86%] h-1 w-1 rounded-full bg-white/30" />
    </div>

    <div
      aria-hidden="true"
      class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
    />

    <!-- =========================================================
         CONTENT
    ========================================================== -->

    <div class="relative mx-auto max-w-7xl px-6 lg:px-8">

      <!-- =======================================================
           INTRO
      ======================================================== -->

      <div class="mx-auto max-w-3xl text-center">

        <div
          class="mb-7 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 backdrop-blur-xl"
        >
          <span class="relative flex h-2 w-2">
            <span
              class="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-40"
            />
            <span
              class="relative inline-flex h-2 w-2 rounded-full bg-amber-300"
            />
          </span>

          <span
            class="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/50"
          >
            Daily Vedic Horoscope
          </span>

          <span class="h-3 w-px bg-white/10" />

          <span
            class="text-[10px] uppercase tracking-[0.18em] text-amber-200/70"
          >
            {{ formattedToday }}
          </span>
        </div>

        <h2
          class="text-4xl font-medium tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl"
        >
          Read the
          <span
            class="bg-gradient-to-r from-amber-200 via-amber-100 to-white bg-clip-text text-transparent"
          >
            current sky.
          </span>
        </h2>

        <p
          class="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/50 sm:text-lg"
        >
          A short daily reflection for your Rashi, inspired by the
          rhythms of Vedic astrology.
        </p>

        <div
          class="mt-6 flex items-center justify-center gap-2 text-xs text-white/30"
        >
          <Sparkles class="h-3.5 w-3.5 text-amber-200/60" />
          <span>
            Choose your Moon sign to begin.
          </span>
        </div>
      </div>

      <!-- =======================================================
           RASHI SELECTOR
      ======================================================== -->

      <div class="mx-auto mt-14 max-w-5xl">

        <div
          class="mb-5 flex items-center justify-between"
        >
          <div>
            <p
              class="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/30"
            >
              Choose your Rashi
            </p>

            <p class="mt-1 text-xs text-white/20">
              Moon sign · Sidereal zodiac
            </p>
          </div>

          <div
            class="hidden items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/20 sm:flex"
          >
            <Moon class="h-3.5 w-3.5" />
            Vedic Moon Sign
          </div>
        </div>

        <div
          class="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6"
        >
          <button
            v-for="rashi in rashis"
            :key="rashi.key"
            type="button"
            @click="selectRashi(rashi.key)"
            class="group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 sm:p-5"
            :class="
              selectedRashi === rashi.key
                ? 'border-amber-200/30 bg-amber-200/[0.08] shadow-[0_0_35px_rgba(251,191,36,.06)]'
                : 'border-white/8 bg-white/[0.025] hover:border-white/15 hover:bg-white/[0.05]'
            "
          >
            <div
              v-if="selectedRashi === rashi.key"
              class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/70 to-transparent"
            />

            <div class="flex items-center justify-between">
              <span
                class="text-xl transition-transform duration-300 group-hover:scale-110"
                :class="
                  selectedRashi === rashi.key
                    ? 'text-amber-100'
                    : 'text-white/45'
                "
              >
                {{ rashi.symbol }}
              </span>

              <ChevronRight
                class="h-3.5 w-3.5 transition-all duration-300"
                :class="
                  selectedRashi === rashi.key
                    ? 'translate-x-0 text-amber-200/60'
                    : '-translate-x-1 text-white/10 group-hover:translate-x-0 group-hover:text-white/30'
                "
              />
            </div>

            <p
              class="mt-4 text-xs font-medium"
              :class="
                selectedRashi === rashi.key
                  ? 'text-white'
                  : 'text-white/55'
              "
            >
              {{ rashi.name }}
            </p>

            <p class="mt-1 text-[10px] text-white/25">
              {{ rashi.western }}
            </p>
          </button>
        </div>
      </div>

      <!-- =======================================================
           SELECTED HOROSCOPE
      ======================================================== -->

      <div class="mt-8">

        <div
          class="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-[0_30px_100px_rgba(0,0,0,.3)] backdrop-blur-2xl"
        >
          <!-- Ambient glow -->
          <div
            aria-hidden="true"
            class="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-amber-300/10 blur-[100px]"
          />

          <div
            aria-hidden="true"
            class="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-violet-500/10 blur-[120px]"
          />

          <div
            class="relative grid lg:grid-cols-[1.15fr_.85fr]"
          >

            <!-- Horoscope -->
            <div class="p-7 sm:p-10 lg:p-14">

              <div class="flex items-center gap-4">

                <div
                  class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-amber-200/15 bg-amber-200/5 text-2xl"
                >
                  {{ selectedRashiDetails.symbol }}
                </div>

                <div>
                  <p
                    class="text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-200/60"
                  >
                    Today's reading
                  </p>

                  <h3 class="mt-1 text-xl font-medium text-white">
                    {{ selectedRashiDetails.name }}
                    <span class="text-white/35">
                      · {{ selectedRashiDetails.western }}
                    </span>
                  </h3>
                </div>
              </div>

              <div class="mt-10">
                <p
                  class="max-w-3xl text-2xl font-medium leading-[1.45] tracking-[-0.025em] text-white sm:text-3xl"
                >
                  {{ selectedHoroscope.general }}
                </p>
              </div>

              <!-- Attribute pills -->
              <div class="mt-8 flex flex-wrap gap-2">
                <span
                  class="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-white/30"
                >
                  {{ selectedRashiDetails.element }}
                </span>

                <span
                  class="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-white/30"
                >
                  {{ selectedRashiDetails.quality }}
                </span>

                <span
                  class="rounded-full border border-amber-200/10 bg-amber-200/[0.03] px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-amber-200/45"
                >
                  Moon sign
                </span>
              </div>

              <!-- Guidance -->
              <div
                v-if="forecast?.guidance"
                class="mt-10 border-l border-amber-200/25 pl-5"
              >
                <p
                  class="text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-200/50"
                >
                  Today's invitation
                </p>

                <p
                  class="mt-3 max-w-2xl text-sm leading-7 text-white/50"
                >
                  {{ forecast.guidance }}
                </p>
              </div>
            </div>

            <!-- Cosmic side -->
            <div
              class="relative flex min-h-[360px] items-center justify-center overflow-hidden border-t border-white/8 p-8 lg:border-l lg:border-t-0"
            >

              <div
                aria-hidden="true"
                class="absolute h-72 w-72 rounded-full border border-white/[0.045]"
              />

              <div
                aria-hidden="true"
                class="absolute h-52 w-52 rounded-full border border-amber-200/[0.06]"
              />

              <div
                aria-hidden="true"
                class="absolute h-32 w-32 rounded-full border border-violet-200/[0.08]"
              />

              <div
                class="relative flex h-28 w-28 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-amber-100/10 via-violet-300/10 to-transparent shadow-[0_0_90px_rgba(245,211,120,.08)]"
              >
                <Moon class="h-9 w-9 text-amber-100/70" />

                <span
                  class="absolute -right-1 top-5 h-2 w-2 rounded-full bg-amber-200 shadow-[0_0_20px_rgba(253,230,138,.8)]"
                />
              </div>

              <div
                class="absolute bottom-9 left-6 right-6 text-center"
              >
                <p
                  class="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/25"
                >
                  Your Rashi
                </p>

                <p
                  class="mt-2 text-lg font-medium text-white"
                >
                  {{ selectedRashiDetails.name }}
                </p>

                <p class="mt-1 text-xs text-white/30">
                  {{ selectedRashiDetails.western }} ·
                  {{ selectedRashiDetails.element }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- =======================================================
           REFLECTION AREAS
      ======================================================== -->

      <div class="mt-6 grid gap-4 md:grid-cols-3">

        <article
          class="group rounded-[1.75rem] border border-white/8 bg-white/[0.025] p-7 transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.045]"
        >
          <span
            class="text-[10px] font-semibold uppercase tracking-[0.25em] text-rose-200/45"
          >
            01 · Relationships
          </span>

          <p
            class="mt-5 text-sm leading-7 text-white/45"
          >
            {{ selectedHoroscope.relationships }}
          </p>

          <div
            class="mt-7 h-px w-10 bg-gradient-to-r from-rose-200/50 to-transparent"
          />
        </article>

        <article
          class="group rounded-[1.75rem] border border-white/8 bg-white/[0.025] p-7 transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.045]"
        >
          <span
            class="text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-200/45"
          >
            02 · Purpose
          </span>

          <p
            class="mt-5 text-sm leading-7 text-white/45"
          >
            {{ selectedHoroscope.purpose }}
          </p>

          <div
            class="mt-7 h-px w-10 bg-gradient-to-r from-amber-200/50 to-transparent"
          />
        </article>

        <article
          class="group rounded-[1.75rem] border border-white/8 bg-white/[0.025] p-7 transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.045]"
        >
          <span
            class="text-[10px] font-semibold uppercase tracking-[0.25em] text-violet-200/45"
          >
            03 · Inner Life
          </span>

          <p
            class="mt-5 text-sm leading-7 text-white/45"
          >
            {{ selectedHoroscope.innerLife }}
          </p>

          <div
            class="mt-7 h-px w-10 bg-gradient-to-r from-violet-200/50 to-transparent"
          />
        </article>

      </div>

      <!-- =======================================================
           PANCHANG / CURRENT SKY
      ======================================================== -->

      <div class="mt-6">

        <div
          class="relative overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.025] p-7 backdrop-blur-xl sm:p-9"
        >

          <div
            aria-hidden="true"
            class="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-500/5 blur-[90px]"
          />

          <div
            class="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end"
          >
            <div>
              <div class="flex items-center gap-3">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-white/[0.03]"
                >
                  <Orbit class="h-4 w-4 text-amber-200/60" />
                </div>

                <div>
                  <p
                    class="text-[10px] font-semibold uppercase tracking-[0.27em] text-amber-200/50"
                  >
                    Today's Vedic Sky
                  </p>

                  <h3 class="mt-1 text-lg font-medium text-white">
                    The Panchang at a glance
                  </h3>
                </div>
              </div>

              <p
                class="mt-5 max-w-xl text-sm leading-7 text-white/35"
              >
                The horoscope offers reflection; the Panchang shows
                the Vedic sky behind today's atmosphere.
              </p>
            </div>

            <div
              class="flex items-center gap-2 text-xs text-white/25"
            >
              <CalendarDays class="h-3.5 w-3.5" />
              {{ meta.location || "Lagos, Nigeria" }}
            </div>
          </div>

          <div
            v-if="loading"
            class="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            <div
              v-for="index in 4"
              :key="index"
              class="h-24 animate-pulse rounded-2xl border border-white/5 bg-white/[0.02]"
            />
          </div>

          <div
            v-else
            class="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            <div
              class="rounded-2xl border border-white/8 bg-black/10 p-5"
            >
              <div class="flex items-center gap-2">
                <Moon class="h-3.5 w-3.5 text-indigo-200/60" />

                <span
                  class="text-[9px] uppercase tracking-[0.2em] text-white/25"
                >
                  Moon
                </span>
              </div>

              <p class="mt-4 text-sm font-medium text-white/70">
                {{ moonSign }}
              </p>
            </div>

            <div
              class="rounded-2xl border border-white/8 bg-black/10 p-5"
            >
              <div class="flex items-center gap-2">
                <Sun class="h-3.5 w-3.5 text-amber-200/60" />

                <span
                  class="text-[9px] uppercase tracking-[0.2em] text-white/25"
                >
                  Sun
                </span>
              </div>

              <p class="mt-4 text-sm font-medium text-white/70">
                {{ sunSign }}
              </p>
            </div>

            <div
              class="rounded-2xl border border-white/8 bg-black/10 p-5"
            >
              <div class="flex items-center gap-2">
                <Sparkles class="h-3.5 w-3.5 text-violet-200/60" />

                <span
                  class="text-[9px] uppercase tracking-[0.2em] text-white/25"
                >
                  Nakshatra
                </span>
              </div>

              <p class="mt-4 text-sm font-medium text-white/70">
                {{ nakshatra }}
              </p>
            </div>

            <div
              class="rounded-2xl border border-white/8 bg-black/10 p-5"
            >
              <div class="flex items-center gap-2">
                <CalendarDays class="h-3.5 w-3.5 text-amber-200/60" />

                <span
                  class="text-[9px] uppercase tracking-[0.2em] text-white/25"
                >
                  Tithi
                </span>
              </div>

              <p class="mt-4 text-sm font-medium text-white/70">
                {{ tithi }}
              </p>
            </div>
          </div>

          <!-- Cosmic statement -->
          <div
            class="mt-8 border-t border-white/5 pt-7 text-center"
          >
            <p
              class="text-lg font-medium tracking-[-0.02em] text-white/75"
            >
              The sky is always moving.
            </p>

            <p
              class="mx-auto mt-2 max-w-xl text-xs leading-6 text-white/25"
            >
              Notice what is shifting around you — and within you.
            </p>
          </div>
        </div>
      </div>

      <!-- =======================================================
           PERSONAL HOROSCOPE CTA
      ======================================================== -->

      <div
        class="relative mt-6 overflow-hidden rounded-[2rem] border border-amber-200/10 bg-gradient-to-r from-amber-200/[0.06] via-white/[0.025] to-violet-300/[0.05] p-8 sm:p-10 lg:p-12"
      >
        <div
          aria-hidden="true"
          class="absolute -right-20 -top-28 h-72 w-72 rounded-full border border-white/[0.04]"
        />

        <div
          aria-hidden="true"
          class="absolute -right-4 -top-12 h-40 w-40 rounded-full border border-amber-200/[0.05]"
        />

        <div
          class="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between"
        >
          <div class="max-w-2xl">

            <div class="flex items-center gap-3">
              <Sparkles class="h-4 w-4 text-amber-200/70" />

              <span
                class="text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-200/50"
              >
                Go deeper
              </span>
            </div>

            <h3
              class="mt-5 text-2xl font-medium tracking-tight text-white sm:text-3xl"
            >
              Your Rashi gives you the sky.
              <span class="text-white/40">
                Your birth chart gives you your story.
              </span>
            </h3>

            <p
              class="mt-4 max-w-xl text-sm leading-7 text-white/40 sm:text-base"
            >
              Enter your birth details to explore a more personal
              daily horoscope calculated from your own Vedic chart.
            </p>
          </div>

          <Button
            type="button"
            class="group shrink-0 rounded-full bg-white px-7 py-6 text-sm font-medium text-[#0b0913] shadow-xl transition-all hover:bg-amber-100"
            @click="openBooking"
          >
            Explore your personal sky

            <ArrowRight
              class="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </Button>
        </div>
      </div>

      <!-- =======================================================
           DISCLAIMER
      ======================================================== -->

      <p
        class="mx-auto mt-8 max-w-2xl text-center text-[10px] leading-6 text-white/15"
      >
        Vedic astrology is presented as a tool for reflection,
        awareness, and personal exploration. It should not be used
        as a substitute for professional medical, legal, financial,
        or mental-health advice.
      </p>
    </div>

    <!-- Booking dialog -->
    <BookAReadingDialog
      v-model:open="bookingOpen"
      @select="handleReadingSelection"
    />
  </section>
</template>
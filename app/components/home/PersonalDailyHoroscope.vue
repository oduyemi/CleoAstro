<script setup lang="ts">
import { computed, ref } from "vue";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Clock3,
  Heart,
  LoaderCircle,
  Star,
  Sun,
  Target,
  UserRound,
  WandSparkles,
} from "lucide-vue-next";

import { Button } from "@/components/ui/button";

interface PersonalForm {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
  city: string;
}

interface PersonalProfile {
  lagna?: {
    sign?: string;
    sign_id?: number;
    degree?: number;
  };
  moon?: {
    sign?: string;
    sign_id?: number;
    degree?: number;
  };
  moon_sign?: {
    sign?: string;
    sign_id?: number;
    degree?: number;
  };
  nakshatra?: {
    name?: string;
    pada?: number;
    lord?: string;
  };
  moon_nakshatra?: {
    name?: string;
    pada?: number;
    lord?: string;
  };
  active_dasha?: unknown;
}

interface PersonalTheme {
  headline?: string;
  title?: string;
  primary_influence?: string;
  dominant_dasha?: string;
  panchang_mood?: string;
}

interface Narrative {
  summary?: string;
  concise_summary?: string;
  opportunity?: string;
  caution?: string;
  best_use?: string;
}

interface HoroscopeSection {
  key?: string;
  name?: string;
  title?: string;
  reading?: string;
  advice?: string;
  summary?: string;
  score?: number;
  band?: string;
}

interface PersonalPanchang {
  weekday?: string;
  lunar_month?: string;
  tithi?: {
    name?: string;
    paksha?: string;
  };
  nakshatra?: {
    name?: string;
    pada?: number;
  };
  yoga?: {
    name?: string;
  };
  karana?: {
    name?: string;
  };
  sunrise?: string;
  sunset?: string;
}

interface TimingPeriod {
  label?: string;
  start?: string;
  end?: string;
  quality?: string;
}

interface PersonalTiming {
  favorable_periods?: TimingPeriod[];
  caution_periods?: TimingPeriod[];
  rahu_kalam?: {
    start?: string;
    end?: string;
  };
}

interface PersonalDasha {
  dominant_period?: string;
  current?: string;
  active?: string;
  moon_nakshatra_basis?: string;
}

interface PersonalRemedy {
  focus?: string;
  simple_action?: string;
  reflection?: string;
  avoid?: string;
}

interface PersonalMeta {
  target_date?: string;
  timezone?: string;
  generated_at?: string;
  endpoint_version?: string;
}

interface PersonalHoroscope {
  meta?: PersonalMeta;
  profile?: PersonalProfile;
  theme?: PersonalTheme;
  narrative?: Narrative;
  sections?: HoroscopeSection[];
  panchang?: PersonalPanchang;
  timing?: PersonalTiming;
  dasha?: PersonalDasha;
  remedy?: PersonalRemedy;
}

interface PersonalApiResponse {
  success?: boolean;
  data?: PersonalHoroscope;
  horoscope?: PersonalHoroscope;
  error?: string;
  message?: string;
}

const form = ref<PersonalForm>({
  year: "",
  month: "",
  day: "",
  hour: "",
  minute: "",
  city: "",
});

const loading = ref(false);
const error = ref("");
const result = ref<PersonalHoroscope | null>(null);

const showResults = computed(() => {
  return Boolean(result.value);
});

const hasBirthDate = computed(() => {
  return Boolean(
    form.value.year &&
      form.value.month &&
      form.value.day,
  );
});

const formattedBirthDate = computed(() => {
  if (!hasBirthDate.value) return "";

  const date = new Date(
    Number(form.value.year),
    Number(form.value.month) - 1,
    Number(form.value.day),
  );

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
});

const formattedTargetDate = computed(() => {
  const targetDate = result.value?.meta?.target_date;

  if (!targetDate) {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date());
  }

  const parsed = new Date(`${targetDate}T12:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return targetDate;
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
});

const profile = computed(() => result.value?.profile ?? {});
const theme = computed(() => result.value?.theme ?? {});
const narrative = computed(() => result.value?.narrative ?? {});
const panchang = computed(() => result.value?.panchang ?? {});
const timing = computed(() => result.value?.timing ?? {});
const dasha = computed(() => result.value?.dasha ?? {});
const remedy = computed(() => result.value?.remedy ?? {});

const moonSign = computed(() => {
  return (
    profile.value.moon_sign?.sign ||
    profile.value.moon?.sign ||
    "—"
  );
});

const moonNakshatra = computed(() => {
  return (
    profile.value.moon_nakshatra?.name ||
    profile.value.nakshatra?.name ||
    "—"
  );
});

const lagna = computed(() => {
  return profile.value.lagna?.sign || "—";
});

const sections = computed(() => {
  return result.value?.sections ?? [];
});

const relationshipsSection = computed(() => {
  return sections.value.find((section) => {
    const key = `${section.key ?? ""} ${section.name ?? ""} ${section.title ?? ""}`.toLowerCase();

    return (
      key.includes("relationship") ||
      key.includes("love")
    );
  });
});

const careerSection = computed(() => {
  return sections.value.find((section) => {
    const key = `${section.key ?? ""} ${section.name ?? ""} ${section.title ?? ""}`.toLowerCase();

    return (
      key.includes("career") ||
      key.includes("work")
    );
  });
});

const mindSection = computed(() => {
  return sections.value.find((section) => {
    const key = `${section.key ?? ""} ${section.name ?? ""} ${section.title ?? ""}`.toLowerCase();

    return (
      key.includes("mind") ||
      key.includes("spiritual") ||
      key.includes("health")
    );
  });
});

const getSectionText = (
  section: HoroscopeSection | undefined,
) => {
  if (!section) return "";

  return (
    section.reading ||
    section.summary ||
    section.advice ||
    ""
  );
};

const resetReading = () => {
  result.value = null;
  error.value = "";
};

const validateForm = () => {
  const year = Number(form.value.year);
  const month = Number(form.value.month);
  const day = Number(form.value.day);
  const hour = Number(form.value.hour);
  const minute = Number(form.value.minute);

  if (!form.value.year || !Number.isInteger(year)) {
    return "Please enter your year of birth.";
  }

  if (year < 1900 || year > new Date().getFullYear()) {
    return "Please enter a valid year of birth.";
  }

  if (!form.value.month || !Number.isInteger(month) || month < 1 || month > 12) {
    return "Please select a valid birth month.";
  }

  if (!form.value.day || !Number.isInteger(day) || day < 1 || day > 31) {
    return "Please enter a valid birth day.";
  }

  const birthDate = new Date(year, month - 1, day);

  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day
  ) {
    return "That birth date does not appear to be valid.";
  }

  if (
    form.value.hour === "" ||
    !Number.isInteger(hour) ||
    hour < 0 ||
    hour > 23
  ) {
    return "Please enter your birth hour.";
  }

  if (
    form.value.minute === "" ||
    !Number.isInteger(minute) ||
    minute < 0 ||
    minute > 59
  ) {
    return "Please enter your birth minutes.";
  }

  if (!form.value.city.trim()) {
    return "Please enter your birth city.";
  }

  return "";
};

const getTodayIsoDate = () => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values: Record<string, string> = {};

  for (const part of parts) {
    if (part.type !== "literal") {
      values[part.type] = part.value;
    }
  }

  return `${values.year}-${values.month}-${values.day}`;
};

const fetchPersonalHoroscope = async () => {
  error.value = "";

  const validationError = validateForm();

  if (validationError) {
    error.value = validationError;
    return;
  }

  loading.value = true;
  result.value = null;

  try {
    const response = await $fetch<PersonalApiResponse>(
      "/api/vedic/personal-daily",
      {
        method: "POST",
        body: {
          year: Number(form.value.year),
          month: Number(form.value.month),
          day: Number(form.value.day),
          hour: Number(form.value.hour),
          minute: Number(form.value.minute),
          city: form.value.city.trim(),
          target_date: getTodayIsoDate(),
        },
      },
    );

    const nextResult =
      response.data ??
      response.horoscope ??
      null;

    if (!nextResult) {
      throw new Error(
        response.message ||
          response.error ||
          "No personal horoscope was returned.",
      );
    }

    result.value = nextResult;

    await nextTickScrollToResults();
  } catch (err: unknown) {
    console.error(
      "[PersonalDailyHoroscope] Error:",
      err,
    );

    error.value =
      err instanceof Error
        ? err.message
        : "We couldn't calculate your personal horoscope right now.";
  } finally {
    loading.value = false;
  }
};

const nextTickScrollToResults = async () => {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });

  document
    .getElementById("personal-horoscope-result")
    ?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
};

const scrollToForm = () => {
  document
    .getElementById("personal-horoscope-form")
    ?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
};
</script>

<template>
  <section
  id="personal-daily-horoscope"
  class="relative isolate overflow-hidden bg-transparent py-24 text-[#F1E8E3] sm:py-32"
>
  <!-- =========================================================
       COSMIC BACKGROUND
  ========================================================== -->

  <div
    aria-hidden="true"
    class="pointer-events-none absolute -left-56 top-16 h-[36rem] w-[36rem] rounded-full bg-[#6B0F1A]/20 blur-[160px]"
  />

  <div
    aria-hidden="true"
    class="pointer-events-none absolute -right-56 top-1/3 h-[40rem] w-[40rem] rounded-full bg-[#42141F]/25 blur-[170px]"
  />

  <div
    aria-hidden="true"
    class="pointer-events-none absolute bottom-0 left-1/3 h-[30rem] w-[30rem] rounded-full bg-[#7E3541]/10 blur-[150px]"
  />

  <!-- Subtle atmospheric glow — NO GRID -->
  <div
    aria-hidden="true"
    class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(197,139,146,0.07),transparent_42%)]"
  />

  <!-- Sparse celestial dust -->
  <div
    aria-hidden="true"
    class="pointer-events-none absolute inset-0"
  >
    <span class="absolute left-[7%] top-[18%] h-1 w-1 rounded-full bg-[#F1E8E3]/40" />
    <span class="absolute left-[17%] top-[71%] h-1.5 w-1.5 rounded-full bg-[#C8A77A]/35" />
    <span class="absolute left-[29%] top-[13%] h-1 w-1 rounded-full bg-[#F1E8E3]/25" />
    <span class="absolute left-[48%] top-[28%] h-1 w-1 rounded-full bg-[#C58B92]/35" />
    <span class="absolute left-[63%] top-[16%] h-1.5 w-1.5 rounded-full bg-[#F1E8E3]/30" />
    <span class="absolute left-[81%] top-[38%] h-1 w-1 rounded-full bg-[#C8A77A]/40" />
    <span class="absolute left-[93%] top-[19%] h-1 w-1 rounded-full bg-[#F1E8E3]/25" />
    <span class="absolute left-[88%] top-[79%] h-1.5 w-1.5 rounded-full bg-[#C58B92]/30" />
  </div>

    <div class="relative mx-auto max-w-7xl px-6 lg:px-8">

      <!-- =======================================================
           INTRO
      ======================================================== -->

      <div
        v-if="!showResults && !loading"
        class="relative mx-auto max-w-4xl text-center"
      >
        <!-- localized readability layer -->
        <div
          aria-hidden="true"
          class="pointer-events-none absolute -inset-x-12 -inset-y-12 -z-10 rounded-[4rem] bg-[#160B10]/20 backdrop-blur-[18px]"
        />

        <div
          class="mb-7 inline-flex items-center gap-3 rounded-full border border-[#C58B92]/15 bg-[#160B10]/35 px-4 py-2 backdrop-blur-xl"
        >
          <span class="relative flex h-2 w-2">
            <span
              class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C8A77A] opacity-30"
            />
            <span
              class="relative inline-flex h-2 w-2 rounded-full bg-[#C8A77A]"
            />
          </span>

          <span
            class="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#C58B92]/65"
          >
            Personal Vedic Horoscope
          </span>
        </div>

        <h2
          class="text-4xl font-medium tracking-[-0.05em] text-[#F1E8E3] sm:text-5xl lg:text-6xl"
        >
          Discover your
          <span
            class="bg-gradient-to-r from-[#C8A77A] via-[#C58B92] to-[#F1E8E3] bg-clip-text text-transparent"
          >
            personal sky.
          </span>
        </h2>

        <p
          class="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#F1E8E3]/55 sm:text-lg"
        >
          Your daily horoscope becomes more personal when we calculate
          the current Vedic sky against your own birth chart.
        </p>

        <div
          class="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-[10px] uppercase tracking-[0.18em] text-[#F1E8E3]/30"
        >
          <span class="inline-flex items-center gap-2">
            Sidereal astrology
          </span>

          <span class="hidden h-3 w-px bg-[#C58B92]/15 sm:block" />

          <span class="inline-flex items-center gap-2">
            Moon sign
          </span>

          <span class="hidden h-3 w-px bg-[#C58B92]/15 sm:block" />

          <span class="inline-flex items-center gap-2">
            Daily transits
          </span>
        </div>
      </div>

      <!-- =======================================================
           FORM
      ======================================================== -->

      <div
        v-if="!showResults && !loading"
        id="personal-horoscope-form"
        class="mx-auto mt-14 max-w-4xl"
      >
        <form
          class="relative overflow-hidden rounded-[2.25rem] border border-[#C58B92]/15 bg-[#160B10]/45 shadow-[0_40px_120px_rgba(0,0,0,.38)] backdrop-blur-[22px]"
          @submit.prevent="fetchPersonalHoroscope"
        >
          <div
            aria-hidden="true"
            class="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#6B0F1A]/20 blur-[120px]"
          />

          <div
            class="relative border-b border-white/8 px-7 py-7 sm:px-10 sm:py-8"
          >
            <div class="flex items-start gap-4">
              <div
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#C8A77A]/15 bg-[#6B0F1A]/15"
              >
                <UserRound class="h-5 w-5 text-[#C8A77A]/75" />
              </div>

              <div>
                <p
                  class="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C8A77A]/65"
                >
                  Your birth details
                </p>

                <h3 class="mt-2 text-xl font-medium text-white">
                  Tell us when and where you entered the world.
                </h3>

                <p class="mt-2 text-sm leading-6 text-[#F1E8E3]/40">
                  These details are used to calculate your personal
                  Vedic chart and today's planetary influences.
                </p>
              </div>
            </div>
          </div>

          <div class="relative space-y-8 p-7 sm:p-10">

            <!-- Birth date -->
            <div>
              <label
                class="mb-3 block text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35"
              >
                Date of birth
              </label>

              <div class="grid grid-cols-3 gap-3">

                <div class="relative">
                  <select
                    v-model="form.month"
                    class="h-14 w-full appearance-none rounded-xl border border-white/10 bg-black/20 px-4 pr-10 text-sm text-white outline-none transition focus:border-amber-200/30 focus:bg-white/[0.04]"
                  >
                    <option value="" disabled>
                      Month
                    </option>

                    <option value="1" class="text-black">January</option>
                    <option value="2" class="text-black">February</option>
                    <option value="3" class="text-black">March</option>
                    <option value="4" class="text-black">April</option>
                    <option value="5" class="text-black">May</option>
                    <option value="6" class="text-black">June</option>
                    <option value="7" class="text-black">July</option>
                    <option value="8" class="text-black">August</option>
                    <option value="9" class="text-black">September</option>
                    <option value="10" class="text-black">October</option>
                    <option value="11" class="text-black">November</option>
                    <option value="12" class="text-black">December</option>
                  </select>

                  <ChevronDown
                    class="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25"
                  />
                </div>

                <div class="relative">
                  <select
                    v-model="form.day"
                    class="h-14 w-full appearance-none rounded-xl border border-white/10 bg-black/20 px-4 pr-10 text-sm text-white outline-none transition focus:border-amber-200/30 focus:bg-white/[0.04]"
                  >
                    <option value="" disabled>
                      Day
                    </option>

                    <option
                      v-for="day in 31"
                      :key="day"
                      :value="String(day)"
                      class="text-black"
                    >
                      {{ day }}
                    </option>
                  </select>

                  <ChevronDown
                    class="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25"
                  />
                </div>

                <input
                  v-model="form.year"
                  type="number"
                  min="1900"
                  :max="new Date().getFullYear()"
                  placeholder="Year"
                  autocomplete="bday-year"
                  class="h-14 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white placeholder:text-white/20 outline-none transition focus:border-amber-200/30 focus:bg-white/[0.04]"
                />
              </div>
            </div>

            <!-- Birth time -->
            <div>
              <div class="mb-3 flex items-center justify-between">
                <label
                  class="block text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35"
                >
                  Time of birth
                </label>

                <span class="text-[10px] text-white/20">
                  Local time
                </span>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="relative">
                  <select
                    v-model="form.hour"
                    class="h-14 w-full appearance-none rounded-xl border border-white/10 bg-black/20 px-4 pr-10 text-sm text-white outline-none transition focus:border-amber-200/30 focus:bg-white/[0.04]"
                  >
                    <option value="" disabled>
                      Hour
                    </option>

                    <option
                      v-for="hour in 24"
                      :key="hour - 1"
                      :value="String(hour - 1)"
                      class="text-black"
                    >
                      {{ String(hour - 1).padStart(2, "0") }}
                    </option>
                  </select>

                  <ChevronDown
                    class="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25"
                  />
                </div>

                <div class="relative">
                  <select
                    v-model="form.minute"
                    class="h-14 w-full appearance-none rounded-xl border border-white/10 bg-black/20 px-4 pr-10 text-sm text-white outline-none transition focus:border-amber-200/30 focus:bg-white/[0.04]"
                  >
                    <option value="" disabled>
                      Minute
                    </option>

                    <option
                      v-for="minute in 60"
                      :key="minute - 1"
                      :value="String(minute - 1)"
                      class="text-black"
                    >
                      {{ String(minute - 1).padStart(2, "0") }}
                    </option>
                  </select>

                  <ChevronDown
                    class="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25"
                  />
                </div>
              </div>

              <p class="mt-3 text-[11px] leading-5 text-white/20">
                An accurate birth time helps produce a more precise
                ascendant and chart calculation.
              </p>
            </div>

            <!-- Birth place -->
            <div>
              <label
                class="mb-3 block text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35"
              >
                Place of birth
              </label>

              <div class="relative">
                <input
                  v-model="form.city"
                  type="text"
                  autocomplete="birth-place"
                  placeholder="e.g. Lagos, Nigeria"
                  class="h-14 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white placeholder:text-white/20 outline-none transition focus:border-amber-200/30 focus:bg-white/[0.04]"
                />

                <Orbit
                  class="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20"
                />
              </div>

              <p class="mt-3 text-[11px] leading-5 text-white/20">
                Enter your city and country. The astrology service
                will resolve the location and timezone.
              </p>
            </div>

            <!-- Error -->
            <div
              v-if="error"
              class="rounded-2xl border border-red-300/10 bg-red-300/[0.035] px-5 py-4"
            >
              <p class="text-sm leading-6 text-red-100/70">
                {{ error }}
              </p>
            </div>

            <!-- Submit -->
            <div
              class="flex flex-col gap-4 border-t border-white/6 pt-7 sm:flex-row sm:items-center sm:justify-between"
            >
              <div class="flex items-start gap-3">
                <p class="max-w-md text-[11px] leading-5 text-white/25">
                  Your birth details are used only to calculate your
                  horoscope for this request.
                </p>
              </div>

              <Button
                type="submit"
                :disabled="loading"
                class="group inline-flex h-12 items-center justify-center rounded-full border border-[#C8A77A]/35 bg-[#6B0F1A] px-7 text-[13px] font-medium tracking-wide text-[#F1E8E3] shadow-[0_12px_36px_rgba(107,15,26,0.24)] transition-all duration-500 hover:-translate-y-0.5 hover:border-[#C8A77A]/55 hover:bg-[#7E3541] hover:shadow-[0_16px_45px_rgba(107,15,26,0.34)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A77A]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#160B10]"
              >
                <LoaderCircle
                  v-if="loading"
                  class="mr-2 h-4 w-4 animate-spin"
                />

                {{
                  loading
                    ? "Reading your chart..."
                    : "Reveal my horoscope"
                }}

                <ArrowRight
                  v-if="!loading"
                  class="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Button>
            </div>
          </div>
        </form>

        <!-- Privacy / philosophy -->
        <div class="mt-8 flex justify-center">
          <p
            class="max-w-xl text-center text-[14px] leading-6 text-white/15"
          >
            The sky is shared. Your chart is personal. This experience
            uses your birth information to calculate a Vedic daily
            horoscope and does not replace a personal consultation.
          </p>
        </div>
      </div>

      <!-- =======================================================
           LOADING STATE
      ======================================================== -->

      <div
        v-else-if="loading"
        class="mx-auto mt-14 max-w-5xl"
      >
        <div
          class="flex min-h-[500px] flex-col items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.035] text-center backdrop-blur-2xl"
        >
          <div
            class="relative flex h-24 w-24 items-center justify-center rounded-full border border-amber-200/15"
          >
            <div
              class="absolute inset-2 animate-spin rounded-full border border-transparent border-t-amber-200/80"
            />

            <Moon class="h-8 w-8 text-amber-100/70" />
          </div>

          <p class="mt-8 text-lg font-medium text-white">
            Reading your personal sky...
          </p>

          <p class="mt-2 text-sm text-white/30">
            Calculating your Vedic chart, transits and daily influences.
          </p>
        </div>
      </div>

      <!-- =======================================================
           RESULTS
      ======================================================== -->

      <div
        v-if="showResults"
        id="personal-horoscope-result"
        class="mx-auto max-w-6xl"
      >

        <!-- Result header -->
        <div class="text-center">

          <div
            class="mb-6 inline-flex items-center gap-3 rounded-full border border-amber-200/10 bg-amber-200/[0.04] px-4 py-2"
          >
            <span
              class="text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-200/55"
            >
              Your personal daily horoscope
            </span>
          </div>

          <p
            class="text-xs uppercase tracking-[0.2em] text-white/25"
          >
            {{ formattedTargetDate }}
          </p>

          <h2
            class="mx-auto mt-5 max-w-4xl text-3xl font-medium tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl"
          >
            {{
              theme.headline ||
              theme.title ||
              "Your personal sky is speaking."
            }}
          </h2>

          <p
            v-if="narrative.summary || narrative.concise_summary"
            class="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/45"
          >
            {{ narrative.summary || narrative.concise_summary }}
          </p>

          <button
            type="button"
            class="mt-7 inline-flex items-center gap-2 text-xs text-white/25 transition-colors hover:text-amber-200/70"
            @click="resetReading"
          >
            <ArrowRight class="h-3.5 w-3.5 rotate-180" />
            Recalculate with different details
          </button>
        </div>

        <!-- Profile -->
        <div
          class="mt-12 grid gap-4 sm:grid-cols-3"
        >

          <div
            class="rounded-[1.5rem] border border-white/8 bg-white/[0.025] p-6"
          >
            <div class="flex items-center gap-3">
              <Moon class="h-4 w-4 text-indigo-200/60" />

              <span
                class="text-[10px] uppercase tracking-[0.2em] text-white/25"
              >
                Moon sign
              </span>
            </div>

            <p class="mt-4 text-xl font-medium text-white">
              {{ moonSign }}
            </p>

            <p class="mt-1 text-xs text-white/25">
              Your Vedic Rashi
            </p>
          </div>

          <div
            class="rounded-[1.5rem] border border-white/8 bg-white/[0.025] p-6"
          >
            <div class="flex items-center gap-3">
              <Orbit class="h-4 w-4 text-violet-200/60" />

              <span
                class="text-[10px] uppercase tracking-[0.2em] text-white/25"
              >
                Ascendant
              </span>
            </div>

            <p class="mt-4 text-xl font-medium text-white">
              {{ lagna }}
            </p>

            <p class="mt-1 text-xs text-white/25">
              Your rising sign
            </p>
          </div>

          <div
            class="rounded-[1.5rem] border border-white/8 bg-white/[0.025] p-6"
          >
            <div class="flex items-center gap-3">
              <span
                class="text-[10px] uppercase tracking-[0.2em] text-white/25"
              >
                Nakshatra
              </span>
            </div>

            <p class="mt-4 text-xl font-medium text-white">
              {{ moonNakshatra }}
            </p>

            <p class="mt-1 text-xs text-white/25">
              Lunar mansion
            </p>
          </div>
        </div>

        <!-- Main narrative -->
        <div
          class="relative mt-6 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-[0_30px_100px_rgba(0,0,0,.3)] backdrop-blur-2xl"
        >
          <div
            aria-hidden="true"
            class="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-amber-300/8 blur-[110px]"
          />

          <div
            class="relative p-7 sm:p-10 lg:p-14"
          >

            <div class="flex items-center gap-3">
              <div
                class="flex h-11 w-11 items-center justify-center rounded-full border border-amber-200/15 bg-amber-200/5"
              >
                <Sparkles class="h-5 w-5 text-amber-200/70" />
              </div>

              <div>
                <p
                  class="text-[10px] font-semibold uppercase tracking-[0.26em] text-amber-200/50"
                >
                  Today's theme
                </p>

                <p
                  v-if="theme.primary_influence"
                  class="mt-1 text-xs text-white/25"
                >
                  {{ theme.primary_influence }}
                </p>
              </div>
            </div>

            <p
              v-if="narrative.summary || narrative.concise_summary"
              class="mt-9 max-w-4xl text-2xl font-medium leading-[1.5] tracking-[-0.025em] text-white sm:text-3xl"
            >
              {{ narrative.summary || narrative.concise_summary }}
            </p>

            <div
              class="mt-10 grid gap-4 md:grid-cols-2"
            >
              <div
                v-if="narrative.opportunity"
                class="rounded-2xl border border-emerald-200/10 bg-emerald-200/[0.025] p-6"
              >
                <p
                  class="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-200/50"
                >
                  Opportunity
                </p>

                <p
                  class="mt-3 text-sm leading-7 text-white/50"
                >
                  {{ narrative.opportunity }}
                </p>
              </div>

              <div
                v-if="narrative.caution"
                class="rounded-2xl border border-amber-200/10 bg-amber-200/[0.025] p-6"
              >
                <p
                  class="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-200/50"
                >
                  Awareness
                </p>

                <p
                  class="mt-3 text-sm leading-7 text-white/50"
                >
                  {{ narrative.caution }}
                </p>
              </div>
            </div>

            <div
              v-if="narrative.best_use"
              class="mt-6 border-l border-violet-200/20 pl-5"
            >
              <p
                class="text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-200/45"
              >
                Best use of the day
              </p>

              <p
                class="mt-3 text-sm leading-7 text-white/45"
              >
                {{ narrative.best_use }}
              </p>
            </div>
          </div>
        </div>

        <!-- Life areas -->
        <div class="mt-6">

          <div class="mb-7">
            <p
              class="text-[10px] font-semibold uppercase tracking-[0.27em] text-amber-200/50"
            >
              Your day in focus
            </p>

            <h3 class="mt-3 text-2xl font-medium text-white">
              Areas of your life
            </h3>
          </div>

          <div class="grid gap-4 md:grid-cols-3">

            <!-- Relationships -->
            <article
              class="rounded-[1.75rem] border border-white/8 bg-white/[0.025] p-7"
            >
              <div
                class="flex h-11 w-11 items-center justify-center rounded-full border border-rose-200/10 bg-rose-200/[0.03]"
              >
                <Heart class="h-4 w-4 text-rose-200/60" />
              </div>

              <p
                class="mt-6 text-[10px] font-semibold uppercase tracking-[0.23em] text-rose-200/45"
              >
                Relationships
              </p>

              <p
                class="mt-4 text-sm leading-7 text-white/45"
              >
                {{
                  getSectionText(relationshipsSection) ||
                  "Your personal relationship themes will appear here."
                }}
              </p>
            </article>

            <!-- Career -->
            <article
              class="rounded-[1.75rem] border border-white/8 bg-white/[0.025] p-7"
            >
              <div
                class="flex h-11 w-11 items-center justify-center rounded-full border border-amber-200/10 bg-amber-200/[0.03]"
              >
                <Target class="h-4 w-4 text-amber-200/60" />
              </div>

              <p
                class="mt-6 text-[10px] font-semibold uppercase tracking-[0.23em] text-amber-200/45"
              >
                Career & purpose
              </p>

              <p
                class="mt-4 text-sm leading-7 text-white/45"
              >
                {{
                  getSectionText(careerSection) ||
                  "Your career and purpose themes will appear here."
                }}
              </p>
            </article>

            <!-- Mind -->
            <article
              class="rounded-[1.75rem] border border-white/8 bg-white/[0.025] p-7"
            >
              <div
                class="flex h-11 w-11 items-center justify-center rounded-full border border-violet-200/10 bg-violet-200/[0.03]"
              >
                <Sparkles class="h-4 w-4 text-violet-200/60" />
              </div>

              <p
                class="mt-6 text-[10px] font-semibold uppercase tracking-[0.23em] text-violet-200/45"
              >
                Inner life
              </p>

              <p
                class="mt-4 text-sm leading-7 text-white/45"
              >
                {{
                  getSectionText(mindSection) ||
                  "Your inner-life themes will appear here."
                }}
              </p>
            </article>
          </div>
        </div>

        <!-- Dasha -->
        <div
          v-if="
            dasha.dominant_period ||
            dasha.current ||
            dasha.active
          "
          class="mt-6 rounded-[2rem] border border-violet-200/10 bg-violet-200/[0.025] p-7 sm:p-9"
        >
          <div class="flex items-start gap-4">
            <div
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-violet-200/10 bg-violet-200/[0.04]"
            >
              <Orbit class="h-5 w-5 text-violet-200/60" />
            </div>

            <div>
              <p
                class="text-[10px] font-semibold uppercase tracking-[0.26em] text-violet-200/50"
              >
                Active Vimshottari Dasha
              </p>

              <h3 class="mt-3 text-xl font-medium text-white">
                {{
                  dasha.dominant_period ||
                  dasha.current ||
                  dasha.active
                }}
              </h3>

              <p
                v-if="dasha.moon_nakshatra_basis"
                class="mt-2 text-xs leading-6 text-white/30"
              >
                Moon Nakshatra basis:
                {{ dasha.moon_nakshatra_basis }}
              </p>
            </div>
          </div>
        </div>

        <!-- Panchang -->
        <div class="mt-6">

          <div
            class="relative overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.025] p-7 sm:p-9"
          >

            <div
              class="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
            >
              <div>
                <p
                  class="text-[10px] font-semibold uppercase tracking-[0.27em] text-amber-200/50"
                >
                  Today's Vedic sky
                </p>

                <h3 class="mt-3 text-xl font-medium text-white">
                  Your horoscope in context
                </h3>
              </div>

              <p
                v-if="result?.meta?.timezone"
                class="text-[10px] uppercase tracking-[0.18em] text-white/20"
              >
                {{ result.meta.timezone }}
              </p>
            </div>

            <div
              class="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
            >
              <div
                class="rounded-2xl border border-white/8 bg-black/10 p-5"
              >
                <Moon class="h-4 w-4 text-indigo-200/60" />

                <p class="mt-4 text-[9px] uppercase tracking-[0.18em] text-white/25">
                  Moon
                </p>

                <p class="mt-2 text-sm font-medium text-white/70">
                  {{ moonSign }}
                </p>
              </div>

              <div
                class="rounded-2xl border border-white/8 bg-black/10 p-5"
              >
                <Sparkles class="h-4 w-4 text-violet-200/60" />

                <p class="mt-4 text-[9px] uppercase tracking-[0.18em] text-white/25">
                  Nakshatra
                </p>

                <p class="mt-2 text-sm font-medium text-white/70">
                  {{
                    panchang.nakshatra?.name ||
                    moonNakshatra
                  }}
                </p>
              </div>

              <div
                class="rounded-2xl border border-white/8 bg-black/10 p-5"
              >
                <CalendarDays class="h-4 w-4 text-amber-200/60" />

                <p class="mt-4 text-[9px] uppercase tracking-[0.18em] text-white/25">
                  Tithi
                </p>

                <p class="mt-2 text-sm font-medium text-white/70">
                  {{ panchang.tithi?.name || "—" }}
                </p>
              </div>

              <div
                class="rounded-2xl border border-white/8 bg-black/10 p-5"
              >
                <Sun class="h-4 w-4 text-amber-200/60" />

                <p class="mt-4 text-[9px] uppercase tracking-[0.18em] text-white/25">
                  Yoga
                </p>

                <p class="mt-2 text-sm font-medium text-white/70">
                  {{ panchang.yoga?.name || "—" }}
                </p>
              </div>
            </div>

            <div
              class="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4"
            >
              <div
                class="rounded-2xl border border-white/6 bg-white/[0.015] p-4"
              >
                <p class="text-[9px] uppercase tracking-[0.18em] text-white/20">
                  Sunrise
                </p>

                <p class="mt-2 text-xs text-white/50">
                  {{ panchang.sunrise || "—" }}
                </p>
              </div>

              <div
                class="rounded-2xl border border-white/6 bg-white/[0.015] p-4"
              >
                <p class="text-[9px] uppercase tracking-[0.18em] text-white/20">
                  Sunset
                </p>

                <p class="mt-2 text-xs text-white/50">
                  {{ panchang.sunset || "—" }}
                </p>
              </div>

              <div
                class="rounded-2xl border border-white/6 bg-white/[0.015] p-4"
              >
                <p class="text-[9px] uppercase tracking-[0.18em] text-white/20">
                  Karana
                </p>

                <p class="mt-2 text-xs text-white/50">
                  {{ panchang.karana?.name || "—" }}
                </p>
              </div>

              <div
                class="rounded-2xl border border-white/6 bg-white/[0.015] p-4"
              >
                <p class="text-[9px] uppercase tracking-[0.18em] text-white/20">
                  Lunar month
                </p>

                <p class="mt-2 text-xs text-white/50">
                  {{ panchang.lunar_month || "—" }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Timing -->
        <div
          v-if="
            timing.favorable_periods?.length ||
            timing.caution_periods?.length ||
            timing.rahu_kalam
          "
          class="mt-6 grid gap-4 lg:grid-cols-2"
        >

          <!-- Favorable -->
          <div
            v-if="timing.favorable_periods?.length"
            class="rounded-[2rem] border border-emerald-200/10 bg-emerald-200/[0.025] p-7 sm:p-9"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-200/10 bg-emerald-200/[0.03]"
              >
                <Clock3 class="h-4 w-4 text-emerald-200/60" />
              </div>

              <div>
                <p
                  class="text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-200/50"
                >
                  Supportive timing
                </p>

                <h3 class="mt-1 text-lg font-medium text-white">
                  Moments to work with
                </h3>
              </div>
            </div>

            <div class="mt-6 space-y-2">
              <div
                v-for="period in timing.favorable_periods.slice(0, 3)"
                :key="`${period.label}-${period.start}`"
                class="flex items-center justify-between rounded-xl border border-white/6 bg-white/[0.02] px-4 py-3"
              >
                <span class="text-xs text-white/45">
                  {{ period.label || "Favourable period" }}
                </span>

                <span class="text-xs text-emerald-200/60">
                  {{ period.start }} – {{ period.end }}
                </span>
              </div>
            </div>
          </div>

          <!-- Caution -->
          <div
            v-if="
              timing.caution_periods?.length ||
              timing.rahu_kalam
            "
            class="rounded-[2rem] border border-amber-200/10 bg-amber-200/[0.025] p-7 sm:p-9"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-full border border-amber-200/10 bg-amber-200/[0.03]"
              >
                <Clock3 class="h-4 w-4 text-amber-200/60" />
              </div>

              <div>
                <p
                  class="text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-200/50"
                >
                  Awareness windows
                </p>

                <h3 class="mt-1 text-lg font-medium text-white">
                  Move with greater awareness
                </h3>
              </div>
            </div>

            <div class="mt-6 space-y-2">

              <div
                v-if="timing.rahu_kalam"
                class="flex items-center justify-between rounded-xl border border-white/6 bg-white/[0.02] px-4 py-3"
              >
                <span class="text-xs text-white/45">
                  Rahu Kalam
                </span>

                <span class="text-xs text-amber-200/60">
                  {{ timing.rahu_kalam.start }} –
                  {{ timing.rahu_kalam.end }}
                </span>
              </div>

              <div
                v-for="period in (timing.caution_periods || []).slice(0, 2)"
                :key="`${period.label}-${period.start}`"
                class="flex items-center justify-between rounded-xl border border-white/6 bg-white/[0.02] px-4 py-3"
              >
                <span class="text-xs text-white/45">
                  {{ period.label || "Caution period" }}
                </span>

                <span class="text-xs text-amber-200/60">
                  {{ period.start }} – {{ period.end }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Remedy / reflection -->
        <div
          v-if="
            remedy.focus ||
            remedy.simple_action ||
            remedy.reflection ||
            remedy.avoid
          "
          class="mt-6 rounded-[2rem] border border-violet-200/10 bg-gradient-to-br from-violet-200/[0.04] via-white/[0.02] to-transparent p-7 sm:p-10"
        >
          <div
            class="grid gap-8 lg:grid-cols-[.7fr_1.3fr]"
          >
            <div>
              <div
                class="flex h-11 w-11 items-center justify-center rounded-full border border-violet-200/10 bg-violet-200/[0.04]"
              >
                <WandSparkles class="h-5 w-5 text-violet-200/60" />
              </div>

              <p
                class="mt-6 text-[10px] font-semibold uppercase tracking-[0.26em] text-violet-200/50"
              >
                Gentle guidance
              </p>

              <h3 class="mt-3 text-2xl font-medium text-white">
                A way to work with today's energy
              </h3>
            </div>

            <div class="grid gap-3 sm:grid-cols-2">

              <div
                v-if="remedy.focus"
                class="rounded-2xl border border-white/7 bg-white/[0.025] p-5"
              >
                <p class="text-[9px] uppercase tracking-[0.2em] text-white/20">
                  Focus
                </p>

                <p class="mt-3 text-sm leading-6 text-white/45">
                  {{ remedy.focus }}
                </p>
              </div>

              <div
                v-if="remedy.simple_action"
                class="rounded-2xl border border-white/7 bg-white/[0.025] p-5"
              >
                <p class="text-[9px] uppercase tracking-[0.2em] text-white/20">
                  Simple action
                </p>

                <p class="mt-3 text-sm leading-6 text-white/45">
                  {{ remedy.simple_action }}
                </p>
              </div>

              <div
                v-if="remedy.reflection"
                class="rounded-2xl border border-white/7 bg-white/[0.025] p-5"
              >
                <p class="text-[9px] uppercase tracking-[0.2em] text-white/20">
                  Reflection
                </p>

                <p class="mt-3 text-sm leading-6 text-white/45">
                  {{ remedy.reflection }}
                </p>
              </div>

              <div
                v-if="remedy.avoid"
                class="rounded-2xl border border-white/7 bg-white/[0.025] p-5"
              >
                <p class="text-[9px] uppercase tracking-[0.2em] text-white/20">
                  Be mindful of
                </p>

                <p class="mt-3 text-sm leading-6 text-white/45">
                  {{ remedy.avoid }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- =====================================================
             FINAL CTA
        ====================================================== -->

        <div
          class="relative mt-8 overflow-hidden rounded-[2rem] border border-amber-200/10 bg-gradient-to-r from-amber-200/[0.07] via-white/[0.025] to-violet-300/[0.06] p-8 sm:p-10 lg:p-12"
        >
          <div
            aria-hidden="true"
            class="absolute -right-20 -top-28 h-72 w-72 rounded-full border border-white/[0.04]"
          />

          <div
            class="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between"
          >
            <div class="max-w-2xl">

              <div class="flex items-center gap-3">
                <span
                  class="text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-200/50"
                >
                  Go deeper
                </span>
              </div>

              <h3
                class="mt-5 text-2xl font-medium tracking-tight text-white sm:text-3xl"
              >
                Your chart opens the door.
                <span class="text-white/40">
                  A conversation can take you further.
                </span>
              </h3>

              <p
                class="mt-4 max-w-xl text-sm leading-7 text-white/40"
              >
                This daily horoscope offers a moment of reflection.
                If you want to explore the deeper patterns in your
                chart, you can book a personal reading with Sammy.
              </p>
            </div>

            <Button
              type="button"
              class="group shrink-0 rounded-full bg-white px-7 py-6 text-sm font-medium text-[#0b0913] shadow-xl transition-all hover:bg-amber-100"
            >
              Book a personal reading

              <ArrowRight
                class="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Button>
          </div>
        </div>

        <!-- Disclaimer -->
        <p
          class="mx-auto mt-8 max-w-2xl text-center text-[14px] leading-6 text-white/15"
        >
          Vedic astrology is presented as a tool for reflection,
          awareness, and personal exploration. It is not a substitute
          for professional medical, legal, financial, or mental-health
          advice.
        </p>
      </div>
    </div>
  </section>
</template>
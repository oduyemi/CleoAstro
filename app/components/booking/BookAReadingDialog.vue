<script setup lang="ts">
import { computed, ref } from "vue";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Compass,
  Info,
  X,
} from "lucide-vue-next";

import { Button } from "@/components/ui/button";

type Reading = {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  featured?: boolean;
  idealFor: string[];
};

const props = withDefaults(
  defineProps<{
    open?: boolean;
  }>(),
  {
    open: false,
  },
);

const emit = defineEmits<{
  "update:open": [value: boolean];
  select: [reading: Reading];
}>();

const selectedReading = ref<string | null>(null);

const readings: Reading[] = [
  {
    id: "birth-chart",
    name: "Birth Chart Reading",
    description:
      "A focused introduction to your Vedic birth chart. Explore a specific question or area of life and gain a deeper understanding of the patterns reflected in your chart.",
    duration: "30 minutes",
    price: 30000,
    idealFor: [
      "A specific question",
      "Understanding your birth chart",
      "Relationships or career",
      "First-time astrology consultations",
    ],
  },
  {
    id: "vedic-consultation",
    name: "Vedic Astrology Consultation",
    description:
      "A deeper consultation exploring the patterns, relationships, decisions, and life circumstances currently asking for your attention.",
    duration: "45 minutes",
    price: 50000,
    featured: true,
    idealFor: [
      "Life direction",
      "Relationships",
      "Important decisions",
      "Understanding current circumstances",
    ],
  },
  {
    id: "deep-dive",
    name: "Deep-Dive Vedic Reading",
    description:
      "A comprehensive session with room to explore multiple areas of your life, your planetary periods, current cycles, and the deeper themes reflected in your chart.",
    duration: "60 minutes",
    price: 80000,
    idealFor: [
      "Multiple questions",
      "Major life transitions",
      "Deeper chart exploration",
      "Planetary periods and cycles",
    ],
  },
  {
    id: "ancestral-karmic",
    name: "Karmic & Ancestral Patterns",
    description:
      "Explore recurring themes and ancestral influences reflected through your chart, creating space to understand what may be repeating and what you may consciously choose to release.",
    duration: "75 minutes",
    price: 95000,
    idealFor: [
      "Recurring family patterns",
      "Ancestral themes",
      "Relationship patterns",
      "Deeper spiritual exploration",
    ],
  },
];

const formatPrice = (price: number) => {
  return `₦${price.toLocaleString("en-NG")}`;
};

const close = () => {
  selectedReading.value = null;
  emit("update:open", false);
};

const bookReading = (reading: Reading) => {
  selectedReading.value = reading.id;

  emit("select", reading);

  /*
   * Later you can replace this with:
   *
   * navigateTo(`/book/${reading.id}`)
   *
   * or open a booking form:
   *
   * emit("select", reading)
   *
   * The parent component can then launch Calendly,
   * your own booking form, Stripe, etc.
   */
};

const selected = computed(() =>
  readings.find((reading) => reading.id === selectedReading.value),
);
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div
        v-if="open"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-dialog-title"
      >
        <!-- Backdrop -->

        <div
          class="absolute inset-0 bg-black/75 backdrop-blur-md"
          @click="close"
        />

        <!-- Dialog -->

        <div
          class="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#0c0a14] shadow-[0_30px_100px_rgba(0,0,0,0.6)]"
        >
          <!-- Ambient glow -->

          <div
            class="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-amber-300/[0.06] blur-[90px]"
          />

          <div
            class="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-violet-500/[0.05] blur-[90px]"
          />

          <!-- Header -->

          <div
            class="relative flex items-start justify-between border-b border-white/[0.07] px-6 py-6 sm:px-8"
          >
            <div class="max-w-2xl">
              <div class="flex items-center gap-2">
                <span
                  class="text-[10px] uppercase tracking-[0.3em] text-amber-200/60"
                >
                  Begin your consultation
                </span>
              </div>

              <h2
                id="booking-dialog-title"
                class="mt-3 font-serif text-3xl text-white sm:text-4xl"
              >
                Choose your reading
              </h2>

              <p class="mt-3 text-sm leading-6 text-white/45">
                Each session offers a different depth of exploration. Choose
                the one that best reflects what you are looking for right now.
              </p>
            </div>

            <button
              type="button"
              class="ml-4 flex whi h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/50 transition hover:bg-white/10 hover:text-white"
              aria-label="Close booking dialog"
              @click="close"
            >
              <X class="h-4 w-4" />
            </button>
          </div>

          <!-- Content -->

          <div class="relative overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
            <div class="grid gap-4 lg:grid-cols-2">
              <!-- Reading card -->

              <article
                v-for="reading in readings"
                :key="reading.id"
                :class="[
                  'group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 sm:p-6',
                  reading.featured
                    ? 'border-amber-200/25 bg-amber-100/[0.045]'
                    : 'border-white/[0.08] bg-white/[0.025] hover:border-white/15 hover:bg-white/[0.04]',
                  selectedReading === reading.id
                    ? 'ring-1 ring-amber-200/50'
                    : '',
                ]"
              >
                <!-- Featured label -->

                <div
                  v-if="reading.featured"
                  class="absolute right-4 top-4 rounded-full border border-amber-200/15 bg-amber-200/[0.06] px-3 py-1 text-[9px] uppercase tracking-[0.2em] text-amber-100/70"
                >
                  Recommended
                </div>

                <!-- Title -->

                <h3
                  class="mt-5 pr-20 font-serif text-2xl leading-tight text-white"
                >
                  {{ reading.name }}
                </h3>

                <!-- Duration / Price -->

                <div class="mt-4 flex flex-wrap items-center gap-3">
                  <span
                    class="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-black/10 px-3 py-1.5 text-xs text-white/55"
                  >
                    <Clock3 class="h-3.5 w-3.5 text-amber-200/60" />
                    {{ reading.duration }}
                  </span>

                  <span
                    class="font-medium text-sm text-amber-100/80"
                  >
                    {{ formatPrice(reading.price) }}
                  </span>
                </div>

                <!-- Description -->

                <p class="mt-5 text-sm leading-6 text-white/45">
                  {{ reading.description }}
                </p>

                <!-- Ideal for -->

                <div class="mt-5">
                  <p
                    class="text-[9px] uppercase tracking-[0.25em] text-white/30"
                  >
                    This may be right for you if...
                  </p>

                  <ul class="mt-3 space-y-2">
                    <li
                      v-for="item in reading.idealFor"
                      :key="item"
                      class="flex items-start gap-2 text-xs text-white/50"
                    >
                      <Check
                        class="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-200/60"
                      />

                      <span>{{ item }}</span>
                    </li>
                  </ul>
                </div>

                <!-- CTA -->

                <Button
                  class="mt-6 w-full rounded-full"
                  :class="
                    reading.featured
                      ? 'bg-amber-100 text-[#0c0a14] hover:bg-amber-200'
                      : 'border border-white/10 bg-white/[0.05] whi hover:bg-white/10'
                  "
                  @click="bookReading(reading)"
                >
                  <span v-if="selectedReading === reading.id">
                    Selected
                  </span>

                  <span v-else>
                    Book this reading
                  </span>

                  <ArrowRight
                    v-if="selectedReading !== reading.id"
                    class="ml-2 h-4 w-4"
                  />

                  <Check
                    v-else
                    class="ml-2 h-4 w-4"
                  />
                </Button>
              </article>
            </div>

            <!-- Helpful information -->

            <div
              class="mt-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-6"
            >
              <div class="flex gap-4">
                <div
                  class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100/[0.05]"
                >
                  <Info class="h-4 w-4 text-amber-200/70" />
                </div>

                <div>
                  <h4 class="text-sm font-medium text-white">
                    Before your reading
                  </h4>

                  <div
                    class="mt-3 grid gap-x-8 gap-y-2 text-xs leading-5 text-white/40 sm:grid-cols-2"
                  >
                    <p>
                      <span class="text-white/60">Come with a question.</span>
                      You don't need to have everything figured out.
                    </p>

                    <p>
                      <span class="text-white/60">Birth details matter.</span>
                      Your date, exact time, and place of birth are helpful for
                      a Vedic astrology reading.
                    </p>

                    <p>
                      <span class="text-white/60">Bring an open mind.</span>
                      The reading is a space for reflection and exploration,
                      not a fixed prediction of your future.
                    </p>

                    <p>
                      <span class="text-white/60">Your agency remains yours.</span>
                      The intention is to offer perspective, not make
                      decisions for you.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->

          <div
            class="relative flex flex-col gap-3 border-t border-white/[0.07] bg-black/10 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8"
          >
            <div class="flex items-center gap-2 text-xs text-white/30">
              <CalendarDays class="h-4 w-4 text-amber-200/50" />

              <span>
                Select a reading to continue to booking.
              </span>
            </div>

            <div
              v-if="selected"
              class="text-xs text-amber-100/60"
            >
              {{ selected.name }} · {{ selected.duration }} ·
              {{ formatPrice(selected.price) }}
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.dialog-enter-active,
.dialog-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.dialog-enter-from > div:last-child {
  transform: translateY(20px) scale(0.98);
}

.dialog-leave-to > div:last-child {
  transform: translateY(20px) scale(0.98);
}
</style>
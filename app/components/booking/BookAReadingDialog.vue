<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Compass,
  Info,
  LoaderCircle,
  Sparkles,
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

type BookingStep =
  | "readings"
  | "details"
  | "payment"
  | "confirmed";

interface BookingDetails {
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  question: string;
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


const step = ref<BookingStep>("readings");
const selectedReadingId = ref<string | null>(null);
const loading = ref(false);
const errorMessage = ref("");
const paymentReference = ref("");


const bookingDetails = ref<BookingDetails>({
  fullName: "",
  email: "",
  phone: "",
  birthDate: "",
  birthTime: "",
  birthPlace: "",
  question: "",
});

/* -------------------------------------------------------------------------- */
/* Readings                                                                   */
/* -------------------------------------------------------------------------- */

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
      "A comprehensive session with room to explore multiple areas of your life, planetary periods, current cycles, and deeper themes reflected in your chart.",
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

/* -------------------------------------------------------------------------- */
/* Computed                                                                   */
/* -------------------------------------------------------------------------- */

const selectedReading = computed(() =>
  readings.find(
    (reading) => reading.id === selectedReadingId.value,
  ),
);

const currentStepIndex = computed(() => {
  const steps: BookingStep[] = [
    "readings",
    "details",
    "payment",
    "confirmed",
  ];

  return steps.indexOf(step.value);
});

const canContinueToDetails = computed(
  () => Boolean(selectedReading.value),
);

const detailsValid = computed(() => {
  const details = bookingDetails.value;

  return (
    details.fullName.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email) &&
    details.phone.trim().length >= 7 &&
    Boolean(details.birthDate) &&
    details.birthTime.trim().length > 0 &&
    details.birthPlace.trim().length >= 2
  );
});

const formatPrice = (price: number) =>
  `₦${price.toLocaleString("en-NG")}`;

/* -------------------------------------------------------------------------- */
/* Selection                                                                  */
/* -------------------------------------------------------------------------- */

const selectReading = (reading: Reading) => {
  selectedReadingId.value = reading.id;
  errorMessage.value = "";

  emit("select", reading);
};

const continueToDetails = () => {
  if (!selectedReading.value) return;

  errorMessage.value = "";
  step.value = "details";
};

const continueToPayment = () => {
  if (!detailsValid.value) {
    errorMessage.value =
      "Please complete all required fields before continuing.";

    return;
  }

  errorMessage.value = "";
  step.value = "payment";
};

/* -------------------------------------------------------------------------- */
/* Payment                                                                    */
/* -------------------------------------------------------------------------- */

const initializePayment = async () => {
  if (!import.meta.client) {
    return;
  }

  if (!detailsValid.value || !selectedReading.value) {
    errorMessage.value =
      "Please complete your details before continuing.";

    return;
  }

  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await $fetch<{
      accessCode: string;
      authorizationUrl?: string;
      reference: string;
    }>("/api/paystack/initialize", {
      method: "POST",
      body: {
        readingId: selectedReading.value.id,
        ...bookingDetails.value,
      },
    });

    paymentReference.value = response.reference;

    // Load Paystack only in the browser.
    const { default: PaystackPop } =
      await import("@paystack/inline-js");

    const paystack = new PaystackPop();

    paystack.resumeTransaction(response.accessCode);

    loading.value = false;
  } catch (err) {
    console.error("Paystack initialization failed:", err);

    errorMessage.value =
      err instanceof Error
        ? err.message
        : "Unable to initialize payment. Please try again.";

    loading.value = false;
  }
};


/* -------------------------------------------------------------------------- */
/* Navigation                                                                 */
/* -------------------------------------------------------------------------- */

const goBack = () => {
  errorMessage.value = "";

  if (step.value === "details") {
    step.value = "readings";
    return;
  }

  if (step.value === "payment") {
    step.value = "details";
  }
};

const close = () => {
  if (loading.value) return;

  emit("update:open", false);
};

const reset = () => {
  step.value = "readings";
  selectedReadingId.value = null;
  paymentReference.value = "";
  errorMessage.value = "";

  bookingDetails.value = {
    fullName: "",
    email: "",
    phone: "",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
    question: "",
  };
};

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen && step.value !== "confirmed") {
      reset();
    }
  },
);
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div
        v-if="open"
        class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-dialog-title"
      >
        <!-- Backdrop -->

        <div
          class="absolute inset-0 bg-[#02040a]/80 backdrop-blur-[10px]"
          @click="close"
        />

        <!-- Dialog -->

        <div
          class="relative flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-[30px] border border-[#858eba]/[0.14] bg-[#080d1c] shadow-[0_35px_120px_rgba(0,0,0,0.72)]"
        >
          <!-- Atmosphere -->

          <div
            class="pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden="true"
          >
            <div
              class="absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-[#34447A]/[0.13] blur-[120px]"
            />

            <div
              class="absolute -bottom-40 -left-40 h-[26rem] w-[26rem] rounded-full bg-[#182653]/[0.15] blur-[110px]"
            />

            <div
              class="absolute left-1/2 top-0 h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#858eba]/20 to-transparent"
            />
          </div>

          <!-- Header -->

          <div
            class="relative z-10 shrink-0 border-b border-[#858eba]/[0.10] px-5 py-5 sm:px-8 sm:py-6"
          >
            <div class="flex items-start justify-between">
              <div>
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-8 w-8 items-center justify-center rounded-full border border-[#858eba]/15 bg-[#858eba]/[0.05]"
                  >
                    <Compass
                      class="h-3.5 w-3.5 text-[#858eba]/70"
                    />
                  </div>

                  <span
                    class="text-[9px] uppercase tracking-[0.32em] text-[#858eba]/60"
                  >
                    Your consultation
                  </span>
                </div>

                <h2
                  id="booking-dialog-title"
                  class="mt-4 font-serif text-3xl font-medium text-[#E8E7E1] sm:text-4xl"
                >
                  <span v-if="step === 'readings'">
                    Choose your reading
                  </span>

                  <span v-else-if="step === 'details'">
                    A little about you
                  </span>

                  <span v-else-if="step === 'payment'">
                    Review & payment
                  </span>

                  <span v-else>
                    You're booked
                  </span>
                </h2>

                <p
                  class="mt-2 max-w-xl text-sm leading-6 text-[#858EBA]/65"
                >
                  <span v-if="step === 'readings'">
                    Choose the depth of exploration that feels right
                    for you.
                  </span>

                  <span v-else-if="step === 'details'">
                    These details help prepare your Vedic reading.
                  </span>

                  <span v-else-if="step === 'payment'">
                    Review your consultation details before completing
                    payment.
                  </span>

                  <span v-else>
                    Your payment has been confirmed and your reading
                    request has been received.
                  </span>
                </p>
              </div>

              <button
                type="button"
                class="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#858eba]/10 bg-[#858eba]/[0.04] text-[#858eba]/60 transition hover:border-[#858eba]/25 hover:bg-[#858eba]/[0.09] hover:text-[#E8E7E1]"
                aria-label="Close booking dialog"
                :disabled="loading"
                @click="close"
              >
                <X class="h-4 w-4" />
              </button>
            </div>

            <!-- Progress -->

            <div
              v-if="step !== 'confirmed'"
              class="mt-6 flex items-center gap-2"
            >
              <template
                v-for="(label, index) in [
                  'Reading',
                  'Details',
                  'Payment',
                ]"
                :key="label"
              >
                <div
                  class="flex items-center gap-2"
                  :class="
                    index <= currentStepIndex
                      ? 'text-[#E8E7E1]/75'
                      : 'text-[#858eba]/25'
                  "
                >
                  <span
                    class="flex h-5 w-5 items-center justify-center rounded-full border text-[8px]"
                    :class="
                      index <= currentStepIndex
                        ? 'border-[#858eba]/35 bg-[#858eba]/10'
                        : 'border-[#858eba]/10'
                    "
                  >
                    <Check
                      v-if="index < currentStepIndex"
                      class="h-2.5 w-2.5"
                    />

                    <span v-else>{{ index + 1 }}</span>
                  </span>

                  <span
                    class="hidden text-[8px] uppercase tracking-[0.2em] sm:inline"
                  >
                    {{ label }}
                  </span>
                </div>

                <span
                  v-if="index < 2"
                  class="h-px w-8 bg-[#858eba]/10 sm:w-14"
                />
              </template>
            </div>
          </div>

          <!-- Scrollable content -->

          <div
            class="relative z-10 min-h-0 overflow-y-auto px-4 py-5 sm:px-6 sm:py-7"
          >
            <!-- ========================================================== -->
            <!-- STEP 1: READINGS                                           -->
            <!-- ========================================================== -->

            <div v-if="step === 'readings'">
              <div class="grid gap-4 lg:grid-cols-2">
                <article
                  v-for="(reading, index) in readings"
                  :key="reading.id"
                  class="group relative flex cursor-pointer flex-col overflow-hidden rounded-[22px] border p-5 transition-all duration-300 sm:p-6"
                  :class="
                    selectedReadingId === reading.id
                      ? 'border-[#858eba]/45 bg-[#182653]/20 ring-1 ring-[#858eba]/20'
                      : reading.featured
                        ? 'border-[#858eba]/20 bg-[#182653]/[0.14] hover:border-[#858eba]/30'
                        : 'border-[#858eba]/[0.09] bg-[#858eba]/[0.025] hover:border-[#858eba]/20 hover:bg-[#858eba]/[0.045]'
                  "
                  @click="selectReading(reading)"
                >
                  <div class="flex items-center justify-between">
                    <span
                      class="font-mono text-[9px] tracking-[0.2em] text-[#858eba]/30"
                    >
                      {{ String(index + 1).padStart(2, "0") }}
                    </span>

                    <span
                      v-if="reading.featured"
                      class="flex items-center gap-1.5 rounded-full border border-[#858eba]/15 bg-[#858eba]/[0.06] px-3 py-1.5 text-[8px] uppercase tracking-[0.2em] text-[#E8E7E1]/65"
                    >
                      <Sparkles class="h-3 w-3" />
                      Recommended
                    </span>

                    <span
                      v-if="selectedReadingId === reading.id"
                      class="flex items-center gap-1.5 text-[8px] uppercase tracking-[0.18em] text-[#858eba]/80"
                    >
                      <Check class="h-3 w-3" />
                      Selected
                    </span>
                  </div>

                  <h3
                    class="mt-5 pr-16 font-serif text-2xl leading-tight text-[#E8E7E1]"
                  >
                    {{ reading.name }}
                  </h3>

                  <div class="mt-4 flex items-center gap-3">
                    <span
                      class="inline-flex items-center gap-1.5 rounded-full border border-[#858eba]/10 bg-[#858eba]/[0.035] px-3 py-1.5 text-[11px] text-[#858eba]/65"
                    >
                      <Clock3 class="h-3.5 w-3.5" />
                      {{ reading.duration }}
                    </span>

                    <span
                      class="text-sm font-medium text-[#E8E7E1]/80"
                    >
                      {{ formatPrice(reading.price) }}
                    </span>
                  </div>

                  <div
                    class="my-5 h-px bg-gradient-to-r from-[#858eba]/15 via-[#858eba]/[0.06] to-transparent"
                  />

                  <p
                    class="text-[13px] leading-6 text-[#858eba]/65"
                  >
                    {{ reading.description }}
                  </p>

                  <div class="mt-6">
                    <p
                      class="text-[8px] uppercase tracking-[0.28em] text-[#858eba]/35"
                    >
                      This may be right for you if...
                    </p>

                    <ul class="mt-3 space-y-2">
                      <li
                        v-for="item in reading.idealFor"
                        :key="item"
                        class="flex gap-2 text-[11px] text-[#E8E7E1]/50"
                      >
                        <Check
                          class="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#858eba]/65"
                        />

                        <span>{{ item }}</span>
                      </li>
                    </ul>
                  </div>

                  <Button
                    type="button"
                    class="mt-7 h-11 w-full rounded-full text-xs"
                    :class="
                      selectedReadingId === reading.id
                        ? 'bg-[#E8E7E1] text-[#080D1C]'
                        : 'border border-[#858eba]/15 bg-[#858eba]/[0.04] text-[#E8E7E1]/75 hover:bg-[#858eba]/[0.09]'
                    "
                    @click.stop="selectReading(reading)"
                  >
                    {{
                      selectedReadingId === reading.id
                        ? "Selected"
                        : "Choose this reading"
                    }}

                    <Check
                      v-if="selectedReadingId === reading.id"
                      class="ml-2 h-3.5 w-3.5"
                    />

                    <ArrowRight
                      v-else
                      class="ml-2 h-3.5 w-3.5"
                    />
                  </Button>
                </article>
              </div>
            </div>

            <!-- ========================================================== -->
            <!-- STEP 2: DETAILS                                            -->
            <!-- ========================================================== -->

            <div v-else-if="step === 'details'" class="mx-auto max-w-3xl">
              <div
                class="mb-6 rounded-2xl border border-[#858eba]/10 bg-[#858eba]/[0.025] p-4"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p
                      class="text-[8px] uppercase tracking-[0.25em] text-[#858eba]/35"
                    >
                      Selected reading
                    </p>

                    <p
                      class="mt-1 font-serif text-lg text-[#E8E7E1]"
                    >
                      {{ selectedReading?.name }}
                    </p>
                  </div>

                  <div class="text-right">
                    <p class="text-sm text-[#E8E7E1]/70">
                      {{ selectedReading?.duration }}
                    </p>

                    <p class="mt-1 text-xs text-[#858eba]/60">
                      {{ formatPrice(selectedReading?.price ?? 0) }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="grid gap-5 sm:grid-cols-2">
                <label class="space-y-2">
                  <span class="field-label">Full name</span>

                  <input
                    v-model="bookingDetails.fullName"
                    type="text"
                    autocomplete="name"
                    placeholder="Your full name"
                    class="field-input"
                  />
                </label>

                <label class="space-y-2">
                  <span class="field-label">Email address</span>

                  <input
                    v-model="bookingDetails.email"
                    type="email"
                    autocomplete="email"
                    placeholder="you@example.com"
                    class="field-input"
                  />
                </label>

                <label class="space-y-2 sm:col-span-2">
                  <span class="field-label">Phone number</span>

                  <input
                    v-model="bookingDetails.phone"
                    type="tel"
                    autocomplete="tel"
                    placeholder="+234..."
                    class="field-input"
                  />
                </label>
              </div>

              <div
                class="my-8 flex items-center gap-3"
              >
                <span
                  class="h-px flex-1 bg-[#858eba]/10"
                />

                <span
                  class="text-[8px] uppercase tracking-[0.28em] text-[#858eba]/35"
                >
                  Birth details
                </span>

                <span
                  class="h-px flex-1 bg-[#858eba]/10"
                />
              </div>

              <div class="grid gap-5 sm:grid-cols-2">
                <label class="space-y-2">
                  <span class="field-label">
                    Date of birth
                  </span>

                  <input
                    v-model="bookingDetails.birthDate"
                    type="date"
                    class="field-input"
                  />
                </label>

                <label class="space-y-2">
                  <span class="field-label">
                    Time of birth
                  </span>

                  <input
                    v-model="bookingDetails.birthTime"
                    type="time"
                    class="field-input"
                  />
                </label>

                <label class="space-y-2 sm:col-span-2">
                  <span class="field-label">
                    Place of birth
                  </span>

                  <input
                    v-model="bookingDetails.birthPlace"
                    type="text"
                    placeholder="City, country"
                    class="field-input"
                  />
                </label>

                <label class="space-y-2 sm:col-span-2">
                  <span class="field-label">
                    What would you like to explore?
                    <span class="text-[#858eba]/30">
                      Optional
                    </span>
                  </span>

                  <textarea
                    v-model="bookingDetails.question"
                    rows="4"
                    placeholder="Share a question, situation, or area of life you'd like to explore..."
                    class="field-input resize-none"
                  />
                </label>
              </div>

              <div
                class="mt-6 flex gap-3 rounded-2xl border border-[#858eba]/10 bg-[#858eba]/[0.025] p-4"
              >
                <Info
                  class="mt-0.5 h-4 w-4 shrink-0 text-[#858eba]/60"
                />

                <p
                  class="text-[11px] leading-5 text-[#858eba]/50"
                >
                  Your birth details help prepare the Vedic chart for
                  your consultation. If you don't know your exact birth
                  time, you can mention that in your question.
                </p>
              </div>
            </div>

            <!-- ========================================================== -->
            <!-- STEP 3: PAYMENT                                            -->
            <!-- ========================================================== -->

            <div
              v-else-if="step === 'payment'"
              class="mx-auto max-w-2xl"
            >
              <div
                class="overflow-hidden rounded-[24px] border border-[#858eba]/10 bg-[#858eba]/[0.025]"
              >
                <div class="p-5 sm:p-7">
                  <p
                    class="text-[8px] uppercase tracking-[0.28em] text-[#858eba]/35"
                  >
                    Your consultation
                  </p>

                  <div
                    class="mt-5 flex items-start justify-between gap-6"
                  >
                    <div>
                      <h3
                        class="font-serif text-2xl text-[#E8E7E1]"
                      >
                        {{ selectedReading?.name }}
                      </h3>

                      <div
                        class="mt-3 flex items-center gap-3 text-xs text-[#858eba]/55"
                      >
                        <span>
                          {{ selectedReading?.duration }}
                        </span>

                        <span class="text-[#858eba]/20">·</span>

                        <span>
                          {{ bookingDetails.fullName }}
                        </span>
                      </div>
                    </div>

                    <p
                      class="shrink-0 text-lg font-medium text-[#E8E7E1]/80"
                    >
                      {{ formatPrice(selectedReading?.price ?? 0) }}
                    </p>
                  </div>

                  <div
                    class="my-6 h-px bg-[#858eba]/10"
                  />

                  <div class="space-y-3 text-xs">
                    <div class="flex justify-between">
                      <span class="text-[#858eba]/45">
                        Consultation
                      </span>

                      <span class="text-[#E8E7E1]/65">
                        {{ formatPrice(selectedReading?.price ?? 0) }}
                      </span>
                    </div>

                    <div
                      class="flex justify-between border-t border-[#858eba]/10 pt-4"
                    >
                      <span class="font-medium text-[#E8E7E1]/70">
                        Total
                      </span>

                      <span
                        class="font-medium text-[#E8E7E1]"
                      >
                        {{ formatPrice(selectedReading?.price ?? 0) }}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  class="border-t border-[#858eba]/10 bg-[#050814]/30 p-5 sm:p-7"
                >
                  <div class="flex gap-3">
                    <Info
                      class="mt-0.5 h-4 w-4 shrink-0 text-[#858eba]/60"
                    />

                    <p
                      class="text-[11px] leading-5 text-[#858eba]/50"
                    >
                      You'll be securely redirected to Paystack's
                      checkout to complete your payment. Your card or
                      banking details are handled by Paystack and are
                      never stored by this website.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- ========================================================== -->
            <!-- STEP 4: CONFIRMED                                          -->
            <!-- ========================================================== -->

            <div
              v-else
              class="mx-auto max-w-xl py-8 text-center sm:py-12"
            >
              <div
                class="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#858eba]/20 bg-[#858eba]/[0.06]"
              >
                <CheckCircle2
                  class="h-9 w-9 text-[#858eba]/80"
                />
              </div>

              <p
                class="mt-7 text-[9px] uppercase tracking-[0.3em] text-[#858eba]/50"
              >
                Payment confirmed
              </p>

              <h3
                class="mt-3 font-serif text-3xl text-[#E8E7E1]"
              >
                Your reading is booked.
              </h3>

              <p
                class="mx-auto mt-4 max-w-md text-sm leading-7 text-[#858eba]/65"
              >
                Thank you, {{ bookingDetails.fullName }}. Your
                consultation request has been received. We'll use the
                details you provided to prepare for your reading.
              </p>

              <div
                class="mx-auto mt-7 max-w-sm rounded-2xl border border-[#858eba]/10 bg-[#858eba]/[0.025] p-5 text-left"
              >
                <div class="flex justify-between gap-4">
                  <span class="text-xs text-[#858eba]/45">
                    Reading
                  </span>

                  <span
                    class="text-right text-xs text-[#E8E7E1]/70"
                  >
                    {{ selectedReading?.name }}
                  </span>
                </div>

                <div class="mt-3 flex justify-between gap-4">
                  <span class="text-xs text-[#858eba]/45">
                    Reference
                  </span>

                  <span
                    class="max-w-[180px] truncate text-right font-mono text-[10px] text-[#858eba]/60"
                  >
                    {{ paymentReference }}
                  </span>
                </div>
              </div>

              <Button
                class="mt-8 rounded-full bg-[#E8E7E1] px-7 text-[#080D1C] hover:bg-white"
                @click="close"
              >
                Done
              </Button>
            </div>

            <!-- Error -->

            <div
              v-if="errorMessage"
              class="mx-auto mt-5 flex max-w-2xl gap-3 rounded-2xl border border-red-300/10 bg-red-300/[0.04] p-4"
            >
              <Info
                class="mt-0.5 h-4 w-4 shrink-0 text-red-200/60"
              />

              <p class="text-xs leading-5 text-red-100/60">
                {{ errorMessage }}
              </p>
            </div>
          </div>

          <!-- Footer -->

          <div
            v-if="step !== 'confirmed'"
            class="relative z-10 flex shrink-0 flex-col-reverse gap-3 border-t border-[#858eba]/10 bg-[#050814]/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8"
          >
            <Button
              v-if="step !== 'readings'"
              type="button"
              variant="ghost"
              class="rounded-full text-xs text-[#858eba]/55 hover:bg-[#858eba]/[0.05] hover:text-[#E8E7E1]"
              :disabled="loading"
              @click="goBack"
            >
              <ArrowLeft class="mr-2 h-3.5 w-3.5" />
              Back
            </Button>

            <div
              v-else
              class="flex items-center gap-2 text-[9px] uppercase tracking-[0.15em] text-[#858eba]/35"
            >
              <CalendarDays class="h-3.5 w-3.5" />
              Choose a reading to continue
            </div>

            <Button
              v-if="step === 'readings'"
              type="button"
              class="rounded-full bg-[#E8E7E1] px-6 text-xs text-[#080D1C] hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
              :disabled="!canContinueToDetails"
              @click="continueToDetails"
            >
              Continue
              <ArrowRight class="ml-2 h-3.5 w-3.5" />
            </Button>

            <Button
              v-else-if="step === 'details'"
              type="button"
              class="rounded-full bg-[#E8E7E1] px-6 text-xs text-[#080D1C] hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
              :disabled="!detailsValid"
              @click="continueToPayment"
            >
              Review payment
              <ArrowRight class="ml-2 h-3.5 w-3.5" />
            </Button>

            <Button
              v-else-if="step === 'payment'"
              type="button"
              class="rounded-full bg-[#E8E7E1] px-6 text-xs text-[#080D1C] hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="loading"
              @click="initializePayment"
            >
              <LoaderCircle
                v-if="loading"
                class="mr-2 h-3.5 w-3.5 animate-spin"
              />

              <span v-if="loading">
                Connecting to Paystack...
              </span>

              <span v-else>
                Pay
                {{ formatPrice(selectedReading?.price ?? 0) }}
              </span>

              <ArrowRight
                v-if="!loading"
                class="ml-2 h-3.5 w-3.5"
              />
            </Button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.field-label {
  display: block;
  color: rgba(232, 231, 225, 0.58);
  font-size: 0.7rem;
}

.field-input {
  width: 100%;
  border-radius: 0.9rem;
  border: 1px solid rgba(133, 142, 186, 0.1);
  background: rgba(133, 142, 186, 0.035);
  padding: 0.8rem 0.95rem;
  color: #e8e7e1;
  outline: none;
  font-size: 0.8rem;
  transition:
    border-color 0.2s ease,
    background 0.2s ease;
}

.field-input::placeholder {
  color: rgba(133, 142, 186, 0.32);
}

.field-input:focus {
  border-color: rgba(133, 142, 186, 0.35);
  background: rgba(133, 142, 186, 0.055);
}

.field-input[type="date"],
.field-input[type="time"] {
  color-scheme: dark;
}

.dialog-enter-active,
.dialog-leave-active {
  transition:
    opacity 0.28s ease,
    transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.dialog-enter-from > div:last-child,
.dialog-leave-to > div:last-child {
  transform: translateY(18px) scale(0.985);
}

div::-webkit-scrollbar {
  width: 5px;
}

div::-webkit-scrollbar-track {
  background: transparent;
}

div::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(133, 142, 186, 0.16);
}
</style>
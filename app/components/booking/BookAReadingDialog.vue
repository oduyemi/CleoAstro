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
  Copy,
  Info,
  Landmark,
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
}

/* -------------------------------------------------------------------------- */
/* Bank transfer details                                                      */
/* -------------------------------------------------------------------------- */

const BANK_DETAILS = {
  bankName: "PalmPay",
  accountName: "CLEOASTRO(Samuel)",
  accountNumber: "8995618317",
};

/* -------------------------------------------------------------------------- */
/* Props / Emits                                                              */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* State                                                                      */
/* -------------------------------------------------------------------------- */

const step = ref<BookingStep>("readings");
const selectedReadingId = ref<string | null>(null);

const loading = ref(false);
const errorMessage = ref("");
const paymentReference = ref("");
const copiedField = ref<"account" | "reference" | null>(null);

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
/* Booking reference                                                          */
/* -------------------------------------------------------------------------- */

const createBookingReference = () => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random()
    .toString(36)
    .substring(2, 6)
    .toUpperCase();

  return `CLEO-${timestamp}-${random}`;
};

/* -------------------------------------------------------------------------- */
/* Clipboard                                                                   */
/* -------------------------------------------------------------------------- */

const copyToClipboard = async (
  value: string,
  field: "account" | "reference",
) => {
  if (!import.meta.client) return;

  try {
    await navigator.clipboard.writeText(value);

    copiedField.value = field;

    window.setTimeout(() => {
      if (copiedField.value === field) {
        copiedField.value = null;
      }
    }, 1800);
  } catch (error) {
    console.error("Unable to copy value:", error);
  }
};

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

  /*
   * Generate the booking reference before the user reaches
   * the transfer instructions.
   */
  paymentReference.value = createBookingReference();

  step.value = "payment";
};

/* -------------------------------------------------------------------------- */
/* Payment / transfer confirmation                                            */
/* -------------------------------------------------------------------------- */

const confirmTransfer = async () => {
  if (!selectedReading.value || !detailsValid.value) {
    errorMessage.value =
      "Please complete your booking details before continuing.";

    return;
  }

  if (!paymentReference.value) {
    paymentReference.value = createBookingReference();
  }

  loading.value = true;
  errorMessage.value = "";

  try {
    await $fetch("/api/bookings", {
      method: "POST",
      body: {
        reference: paymentReference.value,

        readingId: selectedReading.value.id,
        readingName: selectedReading.value.name,
        amount: selectedReading.value.price,

        ...bookingDetails.value,

        paymentMethod: "bank-transfer",
        paymentStatus: "pending",
      },
    });

    step.value = "confirmed";
  } catch (err) {
    console.error("Booking submission failed:", err);

    errorMessage.value =
      err instanceof Error
        ? err.message
        : "We couldn't submit your booking confirmation. Please try again.";
  } finally {
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
  copiedField.value = null;
  loading.value = false;

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
        <!-- ============================================================
             BACKDROP
        ============================================================= -->

        <div
          class="absolute inset-0 bg-[#0D070A]/88 backdrop-blur-[12px]"
          @click="close"
        />

        <!-- ============================================================
             DIALOG
        ============================================================= -->

        <div
          class="relative flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-[#C58B92]/[0.13] bg-[#1D0C13] shadow-[0_35px_120px_rgba(0,0,0,0.72)]"
        >
          <!-- ==========================================================
               ATMOSPHERE
          =========================================================== -->

          <div
            class="pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden="true"
          >
            <div
              class="absolute -right-48 -top-48 h-[34rem] w-[34rem] rounded-full bg-[#6B0F1A]/[0.12] blur-[130px]"
            />

            <div
              class="absolute -bottom-48 -left-48 h-[30rem] w-[30rem] rounded-full bg-[#42141F]/[0.18] blur-[120px]"
            />

            <div
              class="absolute left-1/2 top-0 h-[18rem] w-[32rem] -translate-x-1/2 rounded-full bg-[#A45A65]/[0.025] blur-[100px]"
            />

            <div
              class="absolute left-1/2 top-0 h-px w-[72%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#C8A77A]/25 to-transparent"
            />

            <div
              class="absolute left-1/2 top-[45%] h-[20rem] w-[20rem] -translate-x-1/2 rounded-full bg-[#7E3541]/[0.025] blur-[100px]"
            />
          </div>

          <!-- ==========================================================
               HEADER
          =========================================================== -->

          <div
            class="relative z-10 shrink-0 border-b border-[#C58B92]/[0.09] px-5 py-5 sm:px-8 sm:py-6"
          >
            <div class="flex items-start justify-between">
              <div>
                <div class="flex items-center gap-3">
                  <div
                    class="relative flex h-8 w-8 items-center justify-center rounded-full border border-[#C8A77A]/20 bg-[#6B0F1A]/[0.12]"
                  >
                    <Compass
                      class="h-3.5 w-3.5 text-[#C8A77A]/75"
                      stroke-width="1.2"
                    />

                    <span
                      class="absolute inset-[5px] rounded-full border border-[#C58B92]/10"
                    />
                  </div>

                  <span
                    class="text-[9px] uppercase tracking-[0.32em] text-[#C58B92]/60"
                  >
                    Your consultation
                  </span>
                </div>

                <h2
                  id="booking-dialog-title"
                  class="mt-4 font-serif text-3xl font-medium tracking-[-0.025em] text-[#F1E8E3] sm:text-4xl"
                >
                  <span v-if="step === 'readings'">
                    Choose your reading
                  </span>

                  <span v-else-if="step === 'details'">
                    A little about you
                  </span>

                  <span v-else-if="step === 'payment'">
                    Complete your booking
                  </span>

                  <span v-else>
                    Thank you for booking
                  </span>
                </h2>

                <p
                  class="mt-2 max-w-xl text-sm leading-6 text-[#C58B92]/60"
                >
                  <span v-if="step === 'readings'">
                    Choose the depth of exploration that feels right
                    for you.
                  </span>

                  <span v-else-if="step === 'details'">
                    These details help prepare your Vedic reading.
                  </span>

                  <span v-else-if="step === 'payment'">
                    Make your transfer using the details below, then
                    let me know once it has been completed.
                  </span>

                  <span v-else>
                    Your booking request has been received. I'll contact
                    you as soon as your payment is received and confirmed.
                  </span>
                </p>
              </div>

              <button
                type="button"
                class="group ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#C58B92]/10 bg-[#261018]/45 text-[#C58B92]/55 transition-all duration-300 hover:border-[#C58B92]/25 hover:bg-[#42141F]/30 hover:text-[#F1E8E3]"
                aria-label="Close booking dialog"
                :disabled="loading"
                @click="close"
              >
                <X
                  class="h-4 w-4 transition-transform duration-300 group-hover:rotate-90"
                />
              </button>
            </div>

            <!-- ========================================================
                 PROGRESS
            ========================================================= -->

            <div
              v-if="step !== 'confirmed'"
              class="mt-6 flex items-center gap-2"
            >
              <template
                v-for="(label, index) in [
                  'Reading',
                  'Details',
                  'Transfer',
                ]"
                :key="label"
              >
                <div
                  class="flex items-center gap-2"
                  :class="
                    index <= currentStepIndex
                      ? 'text-[#F1E8E3]/75'
                      : 'text-[#C58B92]/25'
                  "
                >
                  <span
                    class="flex h-5 w-5 items-center justify-center rounded-full border text-[8px] transition-all duration-300"
                    :class="
                      index < currentStepIndex
                        ? 'border-[#C8A77A]/30 bg-[#6B0F1A]/25 text-[#C8A77A]'
                        : index === currentStepIndex
                          ? 'border-[#C8A77A]/40 bg-[#6B0F1A]/20 text-[#F1E8E3]'
                          : 'border-[#C58B92]/10'
                    "
                  >
                    <Check
                      v-if="index < currentStepIndex"
                      class="h-2.5 w-2.5"
                    />

                    <span v-else>
                      {{ index + 1 }}
                    </span>
                  </span>

                  <span
                    class="hidden text-[8px] uppercase tracking-[0.2em] sm:inline"
                  >
                    {{ label }}
                  </span>
                </div>

                <span
                  v-if="index < 2"
                  class="h-px w-8 bg-[#C58B92]/10 sm:w-14"
                />
              </template>
            </div>
          </div>

          <!-- ============================================================
               CONTENT
          ============================================================= -->

          <div
            class="relative z-10 min-h-0 overflow-y-auto px-4 py-5 sm:px-6 sm:py-7"
          >
            <!-- ========================================================
                 STEP 1 — READINGS
            ========================================================= -->

            <div v-if="step === 'readings'">
              <div class="grid gap-4 lg:grid-cols-2">
                <article
                  v-for="(reading, index) in readings"
                  :key="reading.id"
                  class="group relative flex cursor-pointer flex-col overflow-hidden rounded-[22px] border p-5 transition-all duration-400 sm:p-6"
                  :class="
                    selectedReadingId === reading.id
                      ? 'border-[#C8A77A]/35 bg-[#42141F]/25 shadow-[0_12px_40px_rgba(107,15,26,0.12)] ring-1 ring-[#C8A77A]/10'
                      : reading.featured
                        ? 'border-[#A45A65]/20 bg-[#261018]/60 hover:border-[#A45A65]/35 hover:bg-[#42141F]/20'
                        : 'border-[#C58B92]/[0.085] bg-[#261018]/35 hover:border-[#C58B92]/20 hover:bg-[#261018]/60'
                  "
                  @click="selectReading(reading)"
                >
                  <div
                    v-if="selectedReadingId === reading.id"
                    class="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-[#6B0F1A]/20 blur-[45px]"
                  />

                  <div
                    class="relative z-10 flex items-center justify-between"
                  >
                    <span
                      class="font-mono text-[9px] tracking-[0.2em] text-[#C58B92]/30"
                    >
                      {{ String(index + 1).padStart(2, "0") }}
                    </span>

                    <span
                      v-if="reading.featured"
                      class="flex items-center gap-1.5 rounded-full border border-[#C8A77A]/20 bg-[#6B0F1A]/15 px-3 py-1.5 text-[8px] uppercase tracking-[0.2em] text-[#C8A77A]/75"
                    >
                      <Sparkles class="h-3 w-3" />
                      Recommended
                    </span>

                    <span
                      v-if="selectedReadingId === reading.id"
                      class="flex items-center gap-1.5 text-[8px] uppercase tracking-[0.18em] text-[#C8A77A]/80"
                    >
                      <Check class="h-3 w-3" />
                      Selected
                    </span>
                  </div>

                  <h3
                    class="relative z-10 mt-5 pr-16 font-serif text-2xl leading-tight tracking-[-0.015em] text-[#F1E8E3]"
                  >
                    {{ reading.name }}
                  </h3>

                  <div
                    class="relative z-10 mt-4 flex items-center gap-3"
                  >
                    <span
                      class="inline-flex items-center gap-1.5 rounded-full border border-[#C58B92]/10 bg-[#1D0C13]/50 px-3 py-1.5 text-[11px] text-[#C58B92]/65"
                    >
                      <Clock3 class="h-3.5 w-3.5" />
                      {{ reading.duration }}
                    </span>

                    <span
                      class="text-sm font-medium text-[#F1E8E3]/80"
                    >
                      {{ formatPrice(reading.price) }}
                    </span>
                  </div>

                  <div
                    class="relative z-10 my-5 h-px bg-gradient-to-r from-[#C8A77A]/15 via-[#C58B92]/[0.06] to-transparent"
                  />

                  <p
                    class="relative z-10 text-[13px] leading-6 text-[#C58B92]/65"
                  >
                    {{ reading.description }}
                  </p>

                  <div class="relative z-10 mt-6">
                    <p
                      class="text-[8px] uppercase tracking-[0.28em] text-[#C58B92]/35"
                    >
                      This may be right for you if...
                    </p>

                    <ul class="mt-3 space-y-2">
                      <li
                        v-for="item in reading.idealFor"
                        :key="item"
                        class="flex gap-2 text-[11px] text-[#F1E8E3]/50"
                      >
                        <Check
                          class="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#A45A65]/75"
                        />

                        <span>{{ item }}</span>
                      </li>
                    </ul>
                  </div>

                  <Button
                    type="button"
                    class="relative z-10 mt-7 h-11 w-full rounded-full text-xs transition-all duration-300"
                    :class="
                      selectedReadingId === reading.id
                        ? 'bg-[#F1E8E3] text-[#1D0C13] hover:bg-white'
                        : 'border border-[#C58B92]/15 bg-[#261018]/45 text-[#F1E8E3]/75 hover:border-[#C58B92]/25 hover:bg-[#42141F]/35 hover:text-[#F1E8E3]'
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

            <!-- ========================================================
                 STEP 2 — DETAILS
            ========================================================= -->

            <div
              v-else-if="step === 'details'"
              class="mx-auto max-w-3xl"
            >
              <div
                class="relative mb-6 overflow-hidden rounded-2xl border border-[#C8A77A]/15 bg-[#42141F]/15 p-4"
              >
                <div
                  class="absolute right-0 top-0 h-24 w-24 rounded-full bg-[#6B0F1A]/15 blur-[40px]"
                />

                <div
                  class="relative z-10 flex items-center justify-between"
                >
                  <div>
                    <p
                      class="text-[8px] uppercase tracking-[0.25em] text-[#C58B92]/35"
                    >
                      Selected reading
                    </p>

                    <p
                      class="mt-1 font-serif text-lg text-[#F1E8E3]"
                    >
                      {{ selectedReading?.name }}
                    </p>
                  </div>

                  <div class="text-right">
                    <p class="text-sm text-[#F1E8E3]/70">
                      {{ selectedReading?.duration }}
                    </p>

                    <p
                      class="mt-1 text-xs text-[#C8A77A]/70"
                    >
                      {{ formatPrice(selectedReading?.price ?? 0) }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="grid gap-5 sm:grid-cols-2">
                <label class="space-y-2">
                  <span class="field-label">
                    Full name
                  </span>

                  <input
                    v-model="bookingDetails.fullName"
                    type="text"
                    autocomplete="name"
                    placeholder="Your full name"
                    class="field-input"
                  />
                </label>

                <label class="space-y-2">
                  <span class="field-label">
                    Email address
                  </span>

                  <input
                    v-model="bookingDetails.email"
                    type="email"
                    autocomplete="email"
                    placeholder="you@example.com"
                    class="field-input"
                  />
                </label>

                <label class="space-y-2 sm:col-span-2">
                  <span class="field-label">
                    Phone number
                  </span>

                  <input
                    v-model="bookingDetails.phone"
                    type="tel"
                    autocomplete="tel"
                    placeholder="+234..."
                    class="field-input"
                  />
                </label>
              </div>

              <div class="my-8 flex items-center gap-3">
                <span class="h-px flex-1 bg-[#C58B92]/10" />

                <span
                  class="text-[8px] uppercase tracking-[0.28em] text-[#C8A77A]/45"
                >
                  Birth details
                </span>

                <span class="h-px flex-1 bg-[#C58B92]/10" />
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
                    <span class="text-[#C58B92]/30">
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
                class="mt-6 flex gap-3 rounded-2xl border border-[#C58B92]/10 bg-[#261018]/35 p-4"
              >
                <Info
                  class="mt-0.5 h-4 w-4 shrink-0 text-[#C8A77A]/60"
                />

                <p
                  class="text-[11px] leading-5 text-[#C58B92]/50"
                >
                  Your birth details help prepare the Vedic chart for
                  your consultation. If you don't know your exact birth
                  time, you can mention that in your question.
                </p>
              </div>
            </div>

            <!-- ========================================================
                 STEP 3 — BANK TRANSFER
            ========================================================= -->

            <div
              v-else-if="step === 'payment'"
              class="mx-auto max-w-2xl"
            >
              <!-- Booking summary -->

              <div
                class="overflow-hidden rounded-[24px] border border-[#C58B92]/10 bg-[#261018]/40"
              >
                <div class="relative p-5 sm:p-7">
                  <div
                    class="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-[#6B0F1A]/10 blur-[65px]"
                  />

                  <p
                    class="relative z-10 text-[8px] uppercase tracking-[0.28em] text-[#C58B92]/35"
                  >
                    Booking summary
                  </p>

                  <div
                    class="relative z-10 mt-5 flex items-start justify-between gap-6"
                  >
                    <div>
                      <h3
                        class="font-serif text-2xl text-[#F1E8E3]"
                      >
                        {{ selectedReading?.name }}
                      </h3>

                      <div
                        class="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#C58B92]/55"
                      >
                        <span>
                          {{ selectedReading?.duration }}
                        </span>

                        <span class="text-[#C58B92]/20">
                          ·
                        </span>

                        <span>
                          {{ bookingDetails.fullName }}
                        </span>
                      </div>
                    </div>

                    <p
                      class="shrink-0 text-lg font-medium text-[#C8A77A]/85"
                    >
                      {{ formatPrice(selectedReading?.price ?? 0) }}
                    </p>
                  </div>

                  <div
                    class="relative z-10 my-6 h-px bg-[#C58B92]/10"
                  />

                  <div class="space-y-3 text-xs">
                    <div class="flex justify-between">
                      <span class="text-[#C58B92]/45">
                        Consultation
                      </span>

                      <span class="text-[#F1E8E3]/65">
                        {{ formatPrice(selectedReading?.price ?? 0) }}
                      </span>
                    </div>

                    <div
                      class="flex justify-between border-t border-[#C58B92]/10 pt-4"
                    >
                      <span
                        class="font-medium text-[#F1E8E3]/70"
                      >
                        Total
                      </span>

                      <span
                        class="font-medium text-[#C8A77A]/90"
                      >
                        {{ formatPrice(selectedReading?.price ?? 0) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Transfer instructions -->

              <div
                class="relative mt-5 overflow-hidden rounded-[24px] border border-[#C8A77A]/20 bg-[#42141F]/15"
              >
                <div
                  class="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#6B0F1A]/15 blur-[55px]"
                />

                <div class="relative z-10 p-5 sm:p-7">
                  <div class="flex items-start gap-4">
                    <div
                      class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#C8A77A]/20 bg-[#6B0F1A]/15"
                    >
                      <Landmark
                        class="h-5 w-5 text-[#C8A77A]/75"
                        stroke-width="1.3"
                      />
                    </div>

                    <div>
                      <p
                        class="text-[8px] uppercase tracking-[0.3em] text-[#C8A77A]/55"
                      >
                        Bank transfer
                      </p>

                      <h3
                        class="mt-2 font-serif text-xl text-[#F1E8E3]"
                      >
                        Transfer the consultation fee
                      </h3>

                      <p
                        class="mt-2 text-xs leading-5 text-[#C58B92]/55"
                      >
                        Please make your transfer using the account
                        details below. Use your booking reference as
                        the transfer narration where possible.
                      </p>
                    </div>
                  </div>

                  <!-- Account details -->

                  <div class="mt-7 space-y-3">
                    <div
                      class="flex items-center justify-between gap-4 rounded-xl border border-[#C58B92]/10 bg-[#1D0C13]/55 px-4 py-4"
                    >
                      <div>
                        <p
                          class="text-[8px] uppercase tracking-[0.24em] text-[#C58B92]/35"
                        >
                          Bank
                        </p>

                        <p
                          class="mt-1 text-sm text-[#F1E8E3]/80"
                        >
                          {{ BANK_DETAILS.bankName }}
                        </p>
                      </div>
                    </div>

                    <div
                      class="flex items-center justify-between gap-4 rounded-xl border border-[#C58B92]/10 bg-[#1D0C13]/55 px-4 py-4"
                    >
                      <div>
                        <p
                          class="text-[8px] uppercase tracking-[0.24em] text-[#C58B92]/35"
                        >
                          Account name
                        </p>

                        <p
                          class="mt-1 text-sm text-[#F1E8E3]/80"
                        >
                          {{ BANK_DETAILS.accountName }}
                        </p>
                      </div>
                    </div>

                    <div
                      class="flex items-center justify-between gap-4 rounded-xl border border-[#C8A77A]/20 bg-[#1D0C13]/65 px-4 py-4"
                    >
                      <div class="min-w-0">
                        <p
                          class="text-[8px] uppercase tracking-[0.24em] text-[#C58B92]/35"
                        >
                          Account number
                        </p>

                        <p
                          class="mt-1 truncate font-mono text-sm tracking-[0.08em] text-[#F1E8E3]"
                        >
                          {{ BANK_DETAILS.accountNumber }}
                        </p>
                      </div>

                      <button
                        type="button"
                        class="flex h-9 shrink-0 items-center gap-2 rounded-full border border-[#C8A77A]/15 bg-[#6B0F1A]/15 px-3 text-[9px] uppercase tracking-[0.16em] text-[#C8A77A]/70 transition-all duration-300 hover:border-[#C8A77A]/30 hover:bg-[#6B0F1A]/25 hover:text-[#F1E8E3]"
                        @click="
                          copyToClipboard(
                            BANK_DETAILS.accountNumber,
                            'account',
                          )
                        "
                      >
                        <Check
                          v-if="copiedField === 'account'"
                          class="h-3.5 w-3.5"
                        />

                        <Copy
                          v-else
                          class="h-3.5 w-3.5"
                        />

                        {{
                          copiedField === "account"
                            ? "Copied"
                            : "Copy"
                        }}
                      </button>
                    </div>

                    <!-- Amount -->

                    <div
                      class="mt-4 flex items-center justify-between rounded-xl border border-[#C8A77A]/15 bg-[#6B0F1A]/10 px-4 py-4"
                    >
                      <div>
                        <p
                          class="text-[8px] uppercase tracking-[0.24em] text-[#C58B92]/35"
                        >
                          Amount to transfer
                        </p>

                        <p
                          class="mt-1 text-lg font-medium text-[#C8A77A]/90"
                        >
                          {{ formatPrice(selectedReading?.price ?? 0) }}
                        </p>
                      </div>

                      <CalendarDays
                        class="h-5 w-5 text-[#C8A77A]/35"
                        stroke-width="1.2"
                      />
                    </div>

                    <!-- Reference -->

                    <div
                      class="rounded-xl border border-[#C58B92]/10 bg-[#1D0C13]/45 px-4 py-4"
                    >
                      <div class="flex items-center justify-between gap-4">
                        <div class="min-w-0">
                          <p
                            class="text-[8px] uppercase tracking-[0.24em] text-[#C58B92]/35"
                          >
                            Booking reference
                          </p>

                          <p
                            class="mt-1 truncate font-mono text-sm tracking-[0.08em] text-[#F1E8E3]/75"
                          >
                            {{ paymentReference }}
                          </p>
                        </div>

                        <button
                          type="button"
                          class="flex h-9 shrink-0 items-center gap-2 rounded-full border border-[#C58B92]/10 bg-[#261018]/60 px-3 text-[9px] uppercase tracking-[0.16em] text-[#C58B92]/60 transition-all duration-300 hover:border-[#C58B92]/25 hover:text-[#F1E8E3]"
                          @click="
                            copyToClipboard(
                              paymentReference,
                              'reference',
                            )
                          "
                        >
                          <Check
                            v-if="copiedField === 'reference'"
                            class="h-3.5 w-3.5"
                          />

                          <Copy
                            v-else
                            class="h-3.5 w-3.5"
                          />

                          {{
                            copiedField === "reference"
                              ? "Copied"
                              : "Copy"
                          }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Important note -->

              <div
                class="mt-5 flex gap-3 rounded-2xl border border-[#C58B92]/10 bg-[#261018]/35 p-4"
              >
                <Info
                  class="mt-0.5 h-4 w-4 shrink-0 text-[#C8A77A]/60"
                />

                <p
                  class="text-[11px] leading-5 text-[#C58B92]/55"
                >
                  After making the transfer, click
                  <span class="text-[#F1E8E3]/70">
                    "I've made the transfer"
                  </span>
                  below. This tells me to look out for your payment;
                  your booking becomes confirmed once the transfer is
                  received and checked.
                </p>
              </div>
            </div>

            <!-- ========================================================
                 STEP 4 — CONFIRMED
            ========================================================= -->

            <div
              v-else
              class="mx-auto max-w-xl py-8 text-center sm:py-12"
            >
              <div
                class="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#C8A77A]/25 bg-[#6B0F1A]/15"
              >
                <div
                  class="absolute inset-[-8px] rounded-full border border-[#C58B92]/[0.06]"
                />

                <div
                  class="absolute inset-[-16px] rounded-full border border-[#C8A77A]/[0.035]"
                />

                <CheckCircle2
                  class="h-9 w-9 text-[#C8A77A]/80"
                  stroke-width="1.4"
                />
              </div>

              <p
                class="mt-7 text-[9px] uppercase tracking-[0.3em] text-[#C8A77A]/55"
              >
                Booking received
              </p>

              <h3
                class="mt-3 font-serif text-3xl tracking-[-0.02em] text-[#F1E8E3]"
              >
                Thank you for booking.
              </h3>

              <p
                class="mx-auto mt-4 max-w-md text-sm leading-7 text-[#C58B92]/65"
              >
                Thank you,
                {{ bookingDetails.fullName }}. Your booking request
                has been received. I'll contact you as soon as your
                payment is received and confirmed.
              </p>

              <!-- Status -->

              <div
                class="mx-auto mt-7 max-w-sm overflow-hidden rounded-2xl border border-[#C58B92]/10 bg-[#261018]/35 text-left"
              >
                <div class="p-5">
                  <div class="flex items-center gap-3">
                    <span
                      class="flex h-8 w-8 items-center justify-center rounded-full bg-[#C8A77A]/10"
                    >
                      <LoaderCircle
                        class="h-4 w-4 animate-spin text-[#C8A77A]/70"
                      />
                    </span>

                    <div>
                      <p
                        class="text-[8px] uppercase tracking-[0.25em] text-[#C8A77A]/50"
                      >
                        Payment status
                      </p>

                      <p
                        class="mt-1 text-xs text-[#F1E8E3]/65"
                      >
                        Awaiting payment confirmation
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  class="border-t border-[#C58B92]/10 px-5 py-4"
                >
                  <div class="flex justify-between gap-4">
                    <span class="text-xs text-[#C58B92]/45">
                      Reading
                    </span>

                    <span
                      class="text-right text-xs text-[#F1E8E3]/70"
                    >
                      {{ selectedReading?.name }}
                    </span>
                  </div>

                  <div class="mt-3 flex justify-between gap-4">
                    <span class="text-xs text-[#C58B92]/45">
                      Amount
                    </span>

                    <span
                      class="text-right text-xs text-[#C8A77A]/75"
                    >
                      {{ formatPrice(selectedReading?.price ?? 0) }}
                    </span>
                  </div>

                  <div class="mt-3 flex justify-between gap-4">
                    <span class="text-xs text-[#C58B92]/45">
                      Reference
                    </span>

                    <span
                      class="max-w-[180px] truncate text-right font-mono text-[10px] text-[#C58B92]/60"
                    >
                      {{ paymentReference }}
                    </span>
                  </div>
                </div>
              </div>

              <p
                class="mx-auto mt-6 max-w-sm text-[10px] leading-5 text-[#C58B92]/35"
              >
                Please keep your transfer receipt until your payment
                has been confirmed.
              </p>

              <Button
                class="mt-8 rounded-full bg-[#F1E8E3] px-7 text-[#1D0C13] transition hover:bg-white"
                @click="close"
              >
                Done
              </Button>
            </div>

            <!-- ========================================================
                 ERROR
            ========================================================= -->

            <div
              v-if="errorMessage"
              class="mx-auto mt-5 flex max-w-2xl gap-3 rounded-2xl border border-[#A45A65]/20 bg-[#6B0F1A]/10 p-4"
            >
              <Info
                class="mt-0.5 h-4 w-4 shrink-0 text-[#C58B92]/65"
              />

              <p
                class="text-xs leading-5 text-[#F1E8E3]/60"
              >
                {{ errorMessage }}
              </p>
            </div>
          </div>

          <!-- ============================================================
               FOOTER
          ============================================================= -->

          <div
            v-if="step !== 'confirmed'"
            class="relative z-10 flex shrink-0 flex-col-reverse gap-3 border-t border-[#C58B92]/10 bg-[#160B10]/65 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8"
          >
            <!-- Back / helper -->

            <Button
              v-if="step !== 'readings'"
              type="button"
              variant="ghost"
              class="rounded-full text-xs text-[#C58B92]/55 hover:bg-[#42141F]/20 hover:text-[#F1E8E3]"
              :disabled="loading"
              @click="goBack"
            >
              <ArrowLeft class="mr-2 h-3.5 w-3.5" />
              Back
            </Button>

            <div
              v-else
              class="flex items-center gap-2 text-[9px] uppercase tracking-[0.15em] text-[#C58B92]/35"
            >
              <CalendarDays class="h-3.5 w-3.5" />
              Choose a reading to continue
            </div>

            <!-- Continue -->

            <Button
              v-if="step === 'readings'"
              type="button"
              class="rounded-full bg-[#F1E8E3] px-6 text-xs text-[#1D0C13] shadow-[0_8px_25px_rgba(200,167,122,0.08)] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
              :disabled="!canContinueToDetails"
              @click="continueToDetails"
            >
              Continue

              <ArrowRight class="ml-2 h-3.5 w-3.5" />
            </Button>

            <!-- Review -->

            <Button
              v-else-if="step === 'details'"
              type="button"
              class="rounded-full bg-[#F1E8E3] px-6 text-xs text-[#1D0C13] shadow-[0_8px_25px_rgba(200,167,122,0.08)] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
              :disabled="!detailsValid"
              @click="continueToPayment"
            >
              Review transfer

              <ArrowRight class="ml-2 h-3.5 w-3.5" />
            </Button>

            <!-- Confirm transfer -->

            <Button
              v-else-if="step === 'payment'"
              type="button"
              class="rounded-full bg-[#6B0F1A] px-6 text-xs text-[#F1E8E3] shadow-[0_10px_30px_rgba(107,15,26,0.25)] transition hover:bg-[#7E3541] hover:shadow-[0_14px_35px_rgba(107,15,26,0.35)] disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="loading"
              @click="confirmTransfer"
            >
              <LoaderCircle
                v-if="loading"
                class="mr-2 h-3.5 w-3.5 animate-spin"
              />

              <span v-if="loading">
                Sending booking...
              </span>

              <span v-else>
                I've made the transfer
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
/* ================================================================
   FORM LABELS
================================================================ */

.field-label {
  display: block;
  color: rgba(241, 232, 227, 0.58);
  font-size: 0.7rem;
}

/* ================================================================
   FORM INPUTS
================================================================ */

.field-input {
  width: 100%;
  border-radius: 0.9rem;
  border: 1px solid rgba(197, 139, 146, 0.1);
  background: rgba(38, 16, 24, 0.42);
  padding: 0.8rem 0.95rem;
  color: #f1e8e3;
  outline: none;
  font-size: 0.8rem;
  transition:
    border-color 0.25s ease,
    background 0.25s ease,
    box-shadow 0.25s ease;
}

.field-input::placeholder {
  color: rgba(197, 139, 146, 0.3);
}

.field-input:hover {
  border-color: rgba(197, 139, 146, 0.16);
}

.field-input:focus {
  border-color: rgba(200, 167, 122, 0.38);
  background: rgba(66, 20, 31, 0.24);
  box-shadow:
    0 0 0 3px rgba(107, 15, 26, 0.08),
    0 8px 30px rgba(107, 15, 26, 0.06);
}

.field-input[type="date"],
.field-input[type="time"] {
  color-scheme: dark;
}

/* ================================================================
   DIALOG ANIMATION
================================================================ */

.dialog-enter-active,
.dialog-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.dialog-enter-from > div:last-child,
.dialog-leave-to > div:last-child {
  transform: translateY(18px) scale(0.985);
}

/* ================================================================
   SCROLLBAR
================================================================ */

div::-webkit-scrollbar {
  width: 5px;
}

div::-webkit-scrollbar-track {
  background: transparent;
}

div::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(197, 139, 146, 0.14);
}

div::-webkit-scrollbar-thumb:hover {
  background: rgba(197, 139, 146, 0.24);
}

/* ================================================================
   MOBILE
================================================================ */

@media (max-width: 640px) {
  .dialog-enter-from > div:last-child,
  .dialog-leave-to > div:last-child {
    transform: translateY(12px) scale(0.99);
  }

  .field-input {
    font-size: 0.78rem;
  }
}
</style>
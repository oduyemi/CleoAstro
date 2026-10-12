<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  Info,
  MessageCircle,
  Sparkles,
  X,
} from "lucide-vue-next";
import { Button } from "@/components/ui/button";

type PackageId =
  | "basic"
  | "standard"
  | "premium"
  | "vip-coaching"
  | "master-class";

type PaymentPlan = "full" | "stage";

type Package = {
  id: PackageId;
  name: string;
  description: string;
  duration: string;
  price: number | null;
  featured?: boolean;
  category: "consultation" | "coaching" | "course";
  idealFor: string[];
};

type BookingStep = "readings" | "details" | "payment" | "confirmed";

interface BookingDetails {
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  question: string;
}

const bankDetails = {
  bankName: "PalmPay",
  accountName: "CLEOASTRO(Samuel)",
  accountNumber: "8995618317",
};

const bankAccountRows = [
  { key: "bankName", label: "Bank name", value: bankDetails.bankName },
  { key: "accountName", label: "Account name", value: bankDetails.accountName },
  { key: "accountNumber", label: "Account number", value: bankDetails.accountNumber },
] as const;

const copiedBankField = ref("");
const copiedAmount = ref(false);

const copyBankDetail = async (
  field: "bankName" | "accountName" | "accountNumber",
) => {
  if (!import.meta.client) return;

  try {
    await navigator.clipboard.writeText(bankDetails[field]);
    copiedBankField.value = field;

    window.setTimeout(() => {
      if (copiedBankField.value === field) {
        copiedBankField.value = "";
      }
    }, 1800);
  } catch (error: unknown) {
    console.error("Unable to copy bank detail:", error);
    errorMessage.value =
      "Unable to copy automatically. Please select and copy the account detail manually.";
  }
};

const copyPaymentAmount = async () => {
  if (!import.meta.client) return;

  try {
    await navigator.clipboard.writeText(String(amount.value));
    copiedAmount.value = true;
    window.setTimeout(() => {
      copiedAmount.value = false;
    }, 1800);
  } catch (error: unknown) {
    console.error("Unable to copy payment amount:", error);
    errorMessage.value =
      "Unable to copy the amount automatically. Please copy it manually.";
  }
};

const props = withDefaults(defineProps<{ open?: boolean }>(), {
  open: false,
});

const emit = defineEmits<{
  "update:open": [value: boolean];
  select: [reading: Package];
}>();

const packages: Package[] = [
  {
    id: "basic",
    name: "Basic",
    description:
      "Basic Package / Student. Personalized birth chart analysis with an overview of your Sun, Moon and Rising signs.",
    duration: "3 days delivery",
    price: 50000,
    category: "consultation",
    idealFor: [
      "Personalized birth chart analysis",
      "Sun, Moon and Rising signs",
      "One specific question answered",
      "Birth chart / time rectification",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    description:
      "Everything in Basic, plus an in-depth transit forecast and a 30-minute voice or video consultation.",
    duration: "3 days delivery",
    price: 150000,
    featured: true,
    category: "consultation",
    idealFor: [
      "Everything in Basic",
      "In-depth transit forecast",
      "30-minute voice / video consultation",
      "Key planetary aspects",
      "Family karma patterns",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    description:
      "Family Package with a 12-month transit and progression forecast, Solar Return reading, and Astro-Cartography and Vastu overview.",
    duration: "3 days delivery",
    price: 500000,
    category: "consultation",
    idealFor: [
      "Everything in Standard",
      "12-month transit and progression forecast",
      "Solar Return chart reading",
      "Astro-Cartography and Vastu overview",
      "60-minute in-depth consultation",
    ],
  },
  {
    id: "vip-coaching",
    name: "VIP Coaching",
    description:
      "Exclusive Corporate Package offering personalized spiritual and astrological life mapping, ongoing guidance, and priority access.",
    duration: "6-month coaching",
    price: null,
    category: "coaching",
    idealFor: [
      "Full spiritual and astrological life mapping",
      "Monthly check-ins for 6 months",
      "Emergency astrological guidance on demand",
      "Compatibility analysis for up to 3 partners",
      "Dedicated astrologer and priority booking",
    ],
  },
  {
    id: "master-class",
    name: "Master Class",
    description:
      "Novice to Pro: a structured five-week astrology training programme covering chart fundamentals, predictions, practical reading, and mentorship.",
    duration: "5 weeks",
    price: 500000,
    category: "course",
    idealFor: [
      "Two weeks: charts, planetary aspects and houses",
      "Three weeks: transits, synastry and predictions",
      "Practical chart reading and mentorship",
      "Certificate upon completion",
      "Full payment or staged payments",
    ],
  },
];

const step = ref<BookingStep>("readings");
const selectedReadingId = ref<PackageId | null>(null);
const paymentPlan = ref<PaymentPlan>("full");
const transferReference = ref("");
const loading = ref(false);
const errorMessage = ref("");
const copied = ref(false);
const bookingReference = ref("");

const bookingDetails = ref<BookingDetails>({
  fullName: "",
  email: "",
  phone: "",
  birthDate: "",
  birthTime: "",
  birthPlace: "",
  question: "",
});

const bookingResult = ref<{
  reference: string;
  paymentStatus: string;
  status: string;
} | null>(null);

const selectedReading = computed(() =>
  packages.find((item) => item.id === selectedReadingId.value),
);

const isVip = computed(
  () => selectedReadingId.value === "vip-coaching",
);

const isMasterClass = computed(
  () => selectedReadingId.value === "master-class",
);

const isConfirmed = computed(() => step.value === "confirmed");

const amount = computed(() => {
  if (!selectedReading.value) return 0;
  if (isVip.value) return 0;
  if (isMasterClass.value && paymentPlan.value === "stage") {
    return 300000;
  }
  return selectedReading.value.price ?? 0;
});

const currentStepIndex = computed(() =>
  ["readings", "details", "payment", "confirmed"].indexOf(step.value),
);

const detailsValid = computed(() => {
  const d = bookingDetails.value;

  return (
    d.fullName.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email) &&
    d.phone.trim().length >= 7 &&
    (isVip.value ||
      (Boolean(d.birthDate) &&
        Boolean(d.birthTime) &&
        d.birthPlace.trim().length >= 2))
  );
});

const transferValid = computed(
  () =>
    isVip.value ||
    (transferReference.value.trim().length > 0 &&
      transferReference.value.trim().length <= 100),
);

const formatPrice = (price: number) =>
  `₦${price.toLocaleString("en-NG")}`;

const formatPackagePrice = (item: Package) =>
  item.price === null ? "On request" : formatPrice(item.price);

const selectReading = (item: Package) => {
  selectedReadingId.value = item.id;
  errorMessage.value = "";
  paymentPlan.value = "full";
  transferReference.value = "";
  emit("select", item);
};

const continueToDetails = () => {
  if (!selectedReading.value) return;
  errorMessage.value = "";
  step.value = "details";
};

const continueToPayment = () => {
  if (!detailsValid.value) {
    errorMessage.value =
      "Please complete the required fields before continuing.";
    return;
  }

  errorMessage.value = "";
  step.value = "payment";
};



const copyReference = async () => {
  if (!import.meta.client || !bookingReference.value) return;

  try {
    await navigator.clipboard.writeText(bookingReference.value);
    copied.value = true;
    window.setTimeout(() => (copied.value = false), 1800);
  } catch (error) {
    console.error("Unable to copy booking reference:", error);
    errorMessage.value =
      "Unable to copy the reference. Please select and copy it manually.";
  }
};

const submitBooking = async () => {
  if (!selectedReading.value || !detailsValid.value) {
    errorMessage.value = "Please check your package and booking details.";
    return;
  }

  if (!transferValid.value) {
    errorMessage.value =
      "Enter the transfer reference shown on your payment receipt.";
    return;
  }

  loading.value = true;
  errorMessage.value = "";

  try {
    const result = await $fetch<{
      success: boolean;
      message: string;
      booking: {
        reference: string;
        paymentStatus: string;
        status: string;
      };
    }>("/api/bookings", {
      method: "POST",
      body: {
        readingId: selectedReading.value.id,
        fullName: bookingDetails.value.fullName,
        email: bookingDetails.value.email,
        phone: bookingDetails.value.phone,
        birthDate: bookingDetails.value.birthDate,
        birthTime: bookingDetails.value.birthTime,
        birthPlace: bookingDetails.value.birthPlace,
        question: bookingDetails.value.question,
        ...(isMasterClass.value
          ? { paymentPlan: paymentPlan.value }
          : {}),
        ...(!isVip.value
          ? { transferReference: transferReference.value.trim() }
          : {}),
      },
    });

    bookingReference.value = result.booking.reference;
    bookingResult.value = {
      reference: result.booking.reference,
      paymentStatus: result.booking.paymentStatus,
      status: result.booking.status,
    };
    step.value = "confirmed";
  } catch (error: unknown) {
    console.error("Booking submission failed:", error);

    const apiError = error as {
      data?: { statusMessage?: string; message?: string };
      statusMessage?: string;
      message?: string;
    };

    errorMessage.value =
      apiError.data?.statusMessage ??
      apiError.data?.message ??
      apiError.statusMessage ??
      apiError.message ??
      "We couldn't submit your booking. Please try again.";
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  errorMessage.value = "";

  if (step.value === "details") step.value = "readings";
  else if (step.value === "payment") step.value = "details";
};

const reset = () => {
  step.value = "readings";
  selectedReadingId.value = null;
  paymentPlan.value = "full";
  transferReference.value = "";
  bookingReference.value = "";
  bookingResult.value = null;
  errorMessage.value = "";
  loading.value = false;
  copied.value = false;
  copiedBankField.value = "";
  copiedAmount.value = false;

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

const close = () => {
  if (loading.value) return;
  emit("update:open", false);
};

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) reset();
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
        <div
          class="absolute inset-0 bg-[#0D070A]/90 backdrop-blur-[12px]"
          @click="close"
        />

        <section
          class="relative flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-[#C58B92]/15 bg-[#1D0C13] text-[#F1E8E3] shadow-[0_35px_120px_rgba(0,0,0,0.72)]"
        >
          <div
            class="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[#6B0F1A]/20 blur-[100px]"
          />

          <header
            class="relative z-10 shrink-0 border-b border-[#C58B92]/10 px-5 py-5 sm:px-8 sm:py-6"
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <p
                  class="flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-[#C8A77A]/70"
                >
                  <Sparkles class="h-4 w-4" />
                  CleoAstro Consultation
                </p>

                <h2
                  id="booking-dialog-title"
                  class="mt-4 font-serif text-3xl sm:text-4xl"
                >
                  <template v-if="step === 'readings'">
                    Packages & Academy
                  </template>
                  <template v-else-if="step === 'details'">
                    Your details
                  </template>
                  <template v-else-if="step === 'payment'">
                    Complete your booking
                  </template>
                  <template v-else>
                    Thank you for booking
                  </template>
                </h2>

                <p
                  class="mt-2 max-w-xl text-sm leading-6 text-[#C58B92]/70"
                >
                  <template v-if="step === 'readings'">
                    Choose the package that suits your needs.
                  </template>
                  <template v-else-if="step === 'details'">
                    Share your details so your booking can be prepared.
                  </template>
                  <template v-else-if="step === 'payment'">
                    Verify the payment instructions before transferring money.
                  </template>
                  <template v-else>
                    Your request has been submitted successfully.
                  </template>
                </p>
              </div>

              <button
                type="button"
                aria-label="Close booking dialog"
                :disabled="loading"
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#C58B92]/15 text-[#C58B92]/70 transition hover:bg-[#42141F]"
                @click="close"
              >
                <X class="h-4 w-4" />
              </button>
            </div>

            <div
              v-if="!isConfirmed"
              class="mt-6 flex flex-wrap items-center gap-2"
            >
              <template
                v-for="(label, index) in ['Package', 'Details', 'Payment']"
                :key="label"
              >
                <div
                  class="flex items-center gap-2 text-[9px] uppercase tracking-[0.18em]"
                  :class="index <= currentStepIndex ? 'text-[#C8A77A]' : 'text-[#C58B92]/35'"
                >
                  <span
                    class="flex h-6 w-6 items-center justify-center rounded-full border"
                    :class="index < currentStepIndex ? 'border-[#C8A77A]/50 bg-[#6B0F1A]/30' : 'border-[#C58B92]/20'"
                  >
                    <Check v-if="index < currentStepIndex" class="h-3 w-3" />
                    <span v-else>{{ index + 1 }}</span>
                  </span>
                  {{ label }}
                </div>
                <span
                  v-if="index < 2"
                  class="h-px w-7 bg-[#C58B92]/15 sm:w-12"
                />
              </template>
            </div>
          </header>

          <main
            class="relative z-10 min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-7"
          >
            <!-- PACKAGE SELECTION -->
            <div
              v-if="step === 'readings'"
              class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              <article
                v-for="(item, index) in packages"
                :key="item.id"
                class="flex flex-col rounded-[20px] border p-5 transition duration-300"
                :class="selectedReadingId === item.id
                  ? 'border-[#C8A77A]/60 bg-[#42141F]/45 ring-1 ring-[#C8A77A]/20'
                  : item.featured
                    ? 'border-[#C8A77A]/25 bg-[#261018]/65 hover:border-[#C8A77A]/45'
                    : 'border-[#C58B92]/15 bg-[#261018]/40 hover:border-[#C58B92]/35'"
              >
                <div class="flex items-center justify-between">
                  <span class="font-mono text-[10px] tracking-widest text-[#C58B92]/50">
                    {{ String(index + 1).padStart(2, "0") }}
                  </span>
                  <span
                    v-if="item.featured"
                    class="rounded-full border border-[#C8A77A]/30 px-2 py-1 text-[8px] uppercase tracking-widest text-[#C8A77A]"
                  >
                    Popular
                  </span>
                  <span
                    v-else-if="item.category === 'course'"
                    class="rounded-full border border-[#C58B92]/20 px-2 py-1 text-[8px] uppercase tracking-widest text-[#C58B92]"
                  >
                    Academy
                  </span>
                </div>

                <h3 class="mt-5 font-serif text-2xl">
                  {{ item.name }}
                </h3>

                <p class="mt-2 text-xs text-[#C58B92]/65">
                  {{ item.category === "coaching"
                    ? "Corporate package"
                    : item.category === "course"
                      ? "Novice to Pro"
                      : item.id === "basic"
                        ? "Package / Student"
                        : item.id === "premium"
                          ? "Family package"
                          : "Package" }}
                </p>

                <p class="mt-4 text-xl font-medium text-[#C8A77A]">
                  {{ formatPackagePrice(item) }}
                </p>

                <div class="mt-3 flex items-center gap-2 text-[10px] text-[#C58B92]/65">
                  <Clock3 class="h-3.5 w-3.5" />
                  {{ item.duration }}
                </div>

                <div class="my-5 h-px bg-gradient-to-r from-[#C8A77A]/30 to-transparent" />

                <p class="text-xs leading-6 text-[#C58B92]/75">
                  {{ item.description }}
                </p>

                <ul class="mt-5 flex-1 space-y-3">
                  <li
                    v-for="feature in item.idealFor"
                    :key="feature"
                    class="flex gap-2 text-[11px] leading-5 text-[#F1E8E3]/70"
                  >
                    <Check class="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C8A77A]" />
                    {{ feature }}
                  </li>
                </ul>

                <Button
                  type="button"
                  class="mt-6 w-full rounded-full"
                  :class="selectedReadingId === item.id
                    ? 'bg-[#F1E8E3] text-[#1D0C13] hover:bg-white'
                    : 'border border-[#C58B92]/20 bg-transparent text-[#F1E8E3] hover:bg-[#42141F]'"
                  @click="selectReading(item)"
                >
                  {{ selectedReadingId === item.id
                    ? "Selected"
                    : item.category === "coaching"
                      ? "Request coaching"
                      : item.category === "course"
                        ? "Choose Master Class"
                        : "Choose package" }}
                  <Check
                    v-if="selectedReadingId === item.id"
                    class="ml-2 h-4 w-4"
                  />
                  <ArrowRight v-else class="ml-2 h-4 w-4" />
                </Button>
              </article>
            </div>

            <!-- CUSTOMER DETAILS -->
            <div
              v-else-if="step === 'details'"
              class="mx-auto max-w-3xl"
            >
              <div
                class="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-[#C8A77A]/20 bg-[#42141F]/25 p-4"
              >
                <div>
                  <p class="text-[9px] uppercase tracking-widest text-[#C58B92]/55">
                    Selected package
                  </p>
                  <p class="mt-1 font-serif text-xl">
                    {{ selectedReading?.name }}
                  </p>
                </div>
                <p class="text-right text-sm font-medium text-[#C8A77A]">
                  {{ formatPackagePrice(selectedReading!) }}
                </p>
              </div>

              <div class="grid gap-5 sm:grid-cols-2">
                <label class="space-y-2">
                  <span class="field-label">Full name *</span>
                  <input
                    v-model="bookingDetails.fullName"
                    class="field-input"
                    autocomplete="name"
                    placeholder="Your full name"
                    required
                  />
                </label>

                <label class="space-y-2">
                  <span class="field-label">Email address *</span>
                  <input
                    v-model="bookingDetails.email"
                    class="field-input"
                    type="email"
                    autocomplete="email"
                    placeholder="you@example.com"
                    required
                  />
                </label>

                <label class="space-y-2 sm:col-span-2">
                  <span class="field-label">Phone / WhatsApp number *</span>
                  <input
                    v-model="bookingDetails.phone"
                    class="field-input"
                    type="tel"
                    autocomplete="tel"
                    placeholder="+234..."
                    required
                  />
                </label>
              </div>

              <template v-if="!isVip">
                <div class="my-8 flex items-center gap-3">
                  <span class="h-px flex-1 bg-[#C58B92]/15" />
                  <span class="text-[9px] uppercase tracking-widest text-[#C8A77A]/70">
                    Birth details
                  </span>
                  <span class="h-px flex-1 bg-[#C58B92]/15" />
                </div>

                <div class="grid gap-5 sm:grid-cols-2">
                  <label class="space-y-2">
                    <span class="field-label">Date of birth *</span>
                    <input
                      v-model="bookingDetails.birthDate"
                      class="field-input"
                      type="date"
                      required
                    />
                  </label>

                  <label class="space-y-2">
                    <span class="field-label">Time of birth *</span>
                    <input
                      v-model="bookingDetails.birthTime"
                      class="field-input"
                      type="time"
                      required
                    />
                  </label>

                  <label class="space-y-2 sm:col-span-2">
                    <span class="field-label">Place of birth *</span>
                    <input
                      v-model="bookingDetails.birthPlace"
                      class="field-input"
                      placeholder="City, country"
                      required
                    />
                  </label>
                </div>
              </template>

              <label class="mt-6 block space-y-2">
                <span class="field-label">
                  {{ isVip ? "Tell us about your coaching needs" : "Question or area you would like to explore" }}
                  <span class="text-[#C58B92]/45">(optional)</span>
                </span>
                <textarea
                  v-model="bookingDetails.question"
                  class="field-input min-h-28 resize-y"
                  rows="4"
                  maxlength="3000"
                  placeholder="Share any relevant details..."
                />
              </label>

              <div
                v-if="isMasterClass"
                class="mt-6 rounded-2xl border border-[#C8A77A]/20 bg-[#42141F]/25 p-5"
              >
                <h3 class="font-serif text-xl">Choose your payment plan</h3>
                <div class="mt-4 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    class="rounded-xl border p-4 text-left transition"
                    :class="paymentPlan === 'full'
                      ? 'border-[#C8A77A]/60 bg-[#6B0F1A]/25'
                      : 'border-[#C58B92]/15 bg-[#261018]/40'"
                    @click="paymentPlan = 'full'"
                  >
                    <span class="block text-sm font-medium">Full payment</span>
                    <span class="mt-2 block text-lg text-[#C8A77A]">
                      {{ formatPrice(500000) }}
                    </span>
                    <span class="mt-1 block text-[10px] text-[#C58B92]/65">
                      Pay the full programme fee
                    </span>
                  </button>

                  <button
                    type="button"
                    class="rounded-xl border p-4 text-left transition"
                    :class="paymentPlan === 'stage'
                      ? 'border-[#C8A77A]/60 bg-[#6B0F1A]/25'
                      : 'border-[#C58B92]/15 bg-[#261018]/40'"
                    @click="paymentPlan = 'stage'"
                  >
                    <span class="block text-sm font-medium">Stage payment</span>
                    <span class="mt-2 block text-lg text-[#C8A77A]">
                      {{ formatPrice(300000) }} / stage
                    </span>
                    <span class="mt-1 block text-[10px] text-[#C58B92]/65">
                      Confirm each stage's payment instructions with CleoAstro
                    </span>
                  </button>
                </div>
              </div>

              <div
                class="mt-6 flex gap-3 rounded-xl border border-[#C58B92]/15 bg-[#261018]/40 p-4"
              >
                <Info class="mt-0.5 h-4 w-4 shrink-0 text-[#C8A77A]" />
                <p class="text-xs leading-5 text-[#C58B92]/75">
                  <template v-if="isVip">
                    VIP Coaching fees and arrangements are confirmed individually.
                    Submitting this form sends an enquiry, not a payment.
                  </template>
                  <template v-else>
                    Your birth details help prepare your consultation.
                    Your bank account details and exact payment amount will be shown
                    on the next step. Please use those details when making your transfer.
                  </template>
                </p>
              </div>
            </div>

            <!-- PAYMENT / VIP REQUEST -->
                        <div
              v-else-if="step === 'payment'"
              class="mt-5 rounded-2xl border border-[#C8A77A]/20 bg-[#42141F]/25 p-5 sm:p-7"
            >

              <div class="flex items-start gap-3">
                <div
                  class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#C8A77A]/25 bg-[#6B0F1A]/30"
                >
                  <CheckCircle2 class="h-5 w-5 text-[#C8A77A]" />
                </div>

                <div>
                  <p class="text-[9px] uppercase tracking-widest text-[#C8A77A]">
                    Bank transfer
                  </p>

                  <h3 class="mt-2 font-serif text-xl">
                    Make your payment
                  </h3>

                  <p class="mt-2 text-sm leading-6 text-[#C58B92]/75">
                    Transfer the exact amount below to the PalmPay account. You can copy
                    each account detail using the buttons provided.
                  </p>
                </div>
              </div>

              <div class="mt-6 space-y-3">
                <div
                  v-for="account in bankAccountRows"
                  :key="account.key"
                  class="flex items-center justify-between gap-3 rounded-xl border border-[#C58B92]/15 bg-[#1D0C13]/55 p-4"
                >
                  <div class="min-w-0">
                    <p class="text-[9px] uppercase tracking-widest text-[#C58B92]/55">
                      {{ account.label }}
                    </p>

                    <p class="mt-1 break-all text-sm font-medium text-[#F1E8E3]">
                      {{ account.value }}
                    </p>
                  </div>

                  <button
                    type="button"
                    class="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#C8A77A]/25 px-3 py-2 text-[10px] text-[#C8A77A] transition hover:bg-[#42141F]"
                    :aria-label="`Copy ${account.label}`"
                    @click="copyBankDetail(account.key)"
                  >
                    <Check
                      v-if="copiedBankField === account.key"
                      class="h-3.5 w-3.5"
                    />
                    <Copy v-else class="h-3.5 w-3.5" />

                    {{ copiedBankField === account.key ? "Copied" : "Copy" }}
                  </button>
                </div>
              </div>

              <div class="mt-5 flex items-center justify-between gap-4 rounded-xl border border-[#C8A77A]/20 bg-[#1D0C13]/60 p-4">
                <div>
                  <p class="text-[9px] uppercase tracking-widest text-[#C58B92]/55">
                    Amount to transfer
                  </p>

                  <p class="mt-1 text-xl font-medium text-[#C8A77A]">
                    {{ formatPrice(amount) }}
                  </p>

                  <p
                    v-if="isMasterClass && paymentPlan === 'stage'"
                    class="mt-1 text-[10px] text-[#C58B92]/60"
                  >
                    Stage payment
                  </p>
                </div>

                <button
                  type="button"
                  class="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#C8A77A]/25 px-3 py-2 text-[10px] text-[#C8A77A] transition hover:bg-[#42141F]"
                  aria-label="Copy payment amount"
                  @click="copyPaymentAmount"
                >
                  <Check v-if="copiedAmount" class="h-3.5 w-3.5" />
                  <Copy v-else class="h-3.5 w-3.5" />
                  {{ copiedAmount ? "Copied" : "Copy amount" }}
                </button>
              </div>

              <div class="my-6 h-px bg-[#C58B92]/15" />

              <label class="block space-y-2">
                <span class="field-label">
                  Transfer reference *
                </span>

                <input
                  v-model="transferReference"
                  class="field-input"
                  placeholder="Enter the reference on your transfer receipt"
                  maxlength="100"
                  autocomplete="off"
                  required
                />

                <span class="block text-[10px] leading-5 text-[#C58B92]/65">
                  After making the transfer, enter the reference from your receipt and
                  click the confirmation button below. Your payment will remain
                  unverified until it has been checked.
                </span>
              </label>

              <div class="mt-5 flex gap-3 rounded-xl border border-[#C8A77A]/15 bg-[#1D0C13]/40 p-4">
                <Info class="mt-0.5 h-4 w-4 shrink-0 text-[#C8A77A]" />

                <p class="text-xs leading-6 text-[#C58B92]/75">
                  Please transfer only to the account shown above. Keep your receipt
                  until CleoAstro confirms that your payment has been verified.
                </p>
              </div>
            </div>

            <!-- CONFIRMATION -->
            <div
              v-else
              class="mx-auto max-w-xl py-8 text-center sm:py-12"
            >
              <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#C8A77A]/30 bg-[#6B0F1A]/20">
                <CheckCircle2 class="h-9 w-9 text-[#C8A77A]" />
              </div>

              <p class="mt-7 text-[9px] uppercase tracking-widest text-[#C8A77A]">
                {{ isVip ? "Enquiry received" : "Booking received" }}
              </p>
              <h3 class="mt-3 font-serif text-3xl">
                Thank you, {{ bookingDetails.fullName }}.
              </h3>
              <p class="mx-auto mt-4 max-w-md text-sm leading-7 text-[#C58B92]/75">
                <template v-if="isVip">
                  Your VIP Coaching enquiry has been received. Please discuss
                  the arrangements and fee with CleoAstro via WhatsApp.
                </template>
                <template v-else>
                  Your booking has been submitted successfully, and your payment is
                  awaiting verification. I will personally review your transfer and
                  reach out to you as soon as your payment has been verified.
                  Please keep your transfer receipt until you receive confirmation.
                </template>
              </p>

              <div class="mx-auto mt-7 max-w-md rounded-2xl border border-[#C58B92]/15 bg-[#261018]/45 p-5 text-left">
                <div class="flex justify-between gap-4">
                  <span class="text-xs text-[#C58B92]/60">Package</span>
                  <span class="text-right text-xs">{{ selectedReading?.name }}</span>
                </div>
                <div class="mt-4 flex justify-between gap-4">
                  <span class="text-xs text-[#C58B92]/60">Amount</span>
                  <span class="text-right text-xs text-[#C8A77A]">
                    {{ isVip ? "On request" : formatPrice(amount) }}
                  </span>
                </div>
                <div
                  v-if="bookingResult"
                  class="mt-4 border-t border-[#C58B92]/15 pt-4"
                >
                  <p class="text-[9px] uppercase tracking-widest text-[#C58B92]/55">
                    Booking reference
                  </p>
                  <div class="mt-2 flex items-center justify-between gap-3">
                    <code class="break-all text-xs">{{ bookingReference }}</code>
                    <button
                      type="button"
                      class="shrink-0 rounded-full border border-[#C58B92]/20 p-2 text-[#C8A77A]"
                      aria-label="Copy booking reference"
                      @click="copyReference"
                    >
                      <Check v-if="copied" class="h-4 w-4" />
                      <Copy v-else class="h-4 w-4" />
                    </button>
                  </div>
                  <p class="mt-3 text-[10px] text-[#C58B92]/60">
                    {{ isVip ? "Enquiry status: received" : "Payment status: awaiting verification" }}
                  </p>
                </div>
              </div>

              

              <p
                v-else
                class="mx-auto mt-5 max-w-md text-[11px] leading-5 text-[#C58B92]/60"
              >
                Keep your transfer receipt until your payment has been verified.
              </p>

              <Button
                class="mt-7 rounded-full bg-[#F1E8E3] px-8 text-[#1D0C13] hover:bg-white"
                @click="close"
              >
                Done
              </Button>
            </div>

            <div
              v-if="errorMessage"
              role="alert"
              class="mt-5 flex gap-3 rounded-xl border border-[#A45A65]/30 bg-[#6B0F1A]/20 p-4"
            >
              <Info class="mt-0.5 h-4 w-4 shrink-0 text-[#C8A77A]" />
              <p class="text-xs leading-5 text-[#F1E8E3]/85">
                {{ errorMessage }}
              </p>
            </div>
          </main>

          <footer
            v-if="!isConfirmed"
            class="relative z-10 flex shrink-0 flex-col-reverse gap-3 border-t border-[#C58B92]/10 bg-[#160B10]/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8"
          >
            <Button
              v-if="step !== 'readings'"
              type="button"
              variant="ghost"
              class="rounded-full text-xs text-[#C58B92]/75 hover:bg-[#42141F]"
              :disabled="loading"
              @click="goBack"
            >
              <ArrowLeft class="mr-2 h-4 w-4" />
              Back
            </Button>
            <p
              v-else
              class="text-[9px] uppercase tracking-widest text-[#C58B92]/50"
            >
              Select a package to continue
            </p>

            <Button
              v-if="step === 'readings'"
              type="button"
              class="rounded-full bg-[#F1E8E3] px-6 text-xs text-[#1D0C13] hover:bg-white disabled:opacity-30"
              :disabled="!selectedReading"
              @click="continueToDetails"
            >
              Continue
              <ArrowRight class="ml-2 h-4 w-4" />
            </Button>

            <Button
              v-else-if="step === 'details'"
              type="button"
              class="rounded-full bg-[#F1E8E3] px-6 text-xs text-[#1D0C13] hover:bg-white disabled:opacity-30"
              :disabled="!detailsValid"
              @click="continueToPayment"
            >
              Continue
              <ArrowRight class="ml-2 h-4 w-4" />
            </Button>

            <Button
              v-else
              type="button"
              class="rounded-full bg-[#6B0F1A] px-6 text-xs text-[#F1E8E3] hover:bg-[#7E3541] disabled:opacity-50"
              :disabled="loading || !transferValid"
              @click="submitBooking"
            >
              <span v-if="loading">Submitting...</span>
              <span v-else>
                {{
                  isVip
                    ? "Submit coaching enquiry"
                    : "I've made the payment — verify it"
                }}
              </span>
              <ArrowRight v-if="!loading" class="ml-2 h-4 w-4" />
            </Button>
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.field-label {
  display: block;
  color: rgba(241, 232, 227, 0.68);
  font-size: 0.75rem;
}

.field-input {
  width: 100%;
  border: 1px solid rgba(197, 139, 146, 0.16);
  border-radius: 0.9rem;
  background: rgba(38, 16, 24, 0.55);
  padding: 0.8rem 0.95rem;
  color: #f1e8e3;
  outline: none;
  font-size: 0.8rem;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.field-input::placeholder {
  color: rgba(197, 139, 146, 0.4);
}

.field-input:focus {
  border-color: rgba(200, 167, 122, 0.6);
  box-shadow: 0 0 0 3px rgba(200, 167, 122, 0.08);
}

.field-input[type="date"],
.field-input[type="time"] {
  color-scheme: dark;
}

.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.3s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

div::-webkit-scrollbar {
  width: 5px;
}

div::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(197, 139, 146, 0.2);
}

@media (max-width: 640px) {
  .field-input {
    font-size: 16px;
  }
}
</style>

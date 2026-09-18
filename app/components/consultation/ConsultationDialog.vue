<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  Compass,
  Copy,
  Info,
  LoaderCircle,
  Sparkles,
  X,
} from "lucide-vue-next";
import { Button } from "@/components/ui/button";

type ConsultationType = "ifa" | "afa";

type ConsultationStep =
  | "types"
  | "details"
  | "transfer"
  | "confirmed";

interface ConsultationOption {
  id: ConsultationType;
  name: string;
  eyebrow: string;
  description: string;
  duration: string;
  amount: number;
}

interface ConsultationDetails {
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  question: string;
}

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
}>();

/*
 * ============================================================
 * CONSULTATION OPTIONS
 * ============================================================
 *
 * Replace these prices with your actual Ifá / Afa prices.
 */

const consultations: ConsultationOption[] = [
  {
    id: "ifa",
    name: "Ifá Consultation",
    eyebrow: "Traditional consultation",
    description:
      "A private consultation centred around your question, circumstances and the guidance you are seeking.",
    duration: "60 minutes",
    amount: 50000,
  },

  {
    id: "afa",
    name: "Afa Consultation",
    eyebrow: "Traditional consultation",
    description:
      "A private consultation creating space to bring an important question forward and receive guidance.",
    duration: "60 minutes",
    amount: 50000,
  },
];

/*
 * ============================================================
 * BANK DETAILS
 * ============================================================
 *
 * Replace these with the SAME bank details used by your
 * Donation dialog.
 */

const bankDetails = {
  bankName: "YOUR BANK NAME",
  accountName: "CLEO ASTRO",
  accountNumber: "0000000000",
};

/*
 * ============================================================
 * STATE
 * ============================================================
 */

const step = ref<ConsultationStep>("types");

const selectedType = ref<ConsultationType | null>(null);

const loading = ref(false);

const errorMessage = ref("");

const transferReference = ref("");

const copiedField = ref<"accountNumber" | "reference" | null>(null);

const details = ref<ConsultationDetails>({
  fullName: "",
  email: "",
  phone: "",
  birthDate: "",
  birthTime: "",
  birthPlace: "",
  question: "",
});

/*
 * ============================================================
 * COMPUTED
 * ============================================================
 */

const selectedConsultation = computed(() => {
  return (
    consultations.find(
      (consultation) =>
        consultation.id === selectedType.value
    ) ?? null
  );
});

const stepIndex = computed(() => {
  const steps: ConsultationStep[] = [
    "types",
    "details",
    "transfer",
    "confirmed",
  ];

  return steps.indexOf(step.value);
});

const detailsValid = computed(() => {
  const value = details.value;

  return (
    value.fullName.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      value.email.trim()
    ) &&
    value.phone.trim().length > 0 &&
    value.question.trim().length > 0
  );
});

const canContinueToDetails = computed(() => {
  return selectedType.value !== null;
});

const formattedAmount = computed(() => {
  if (!selectedConsultation.value) {
    return "";
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(selectedConsultation.value.amount);
});

/*
 * ============================================================
 * HELPERS
 * ============================================================
 */

const generateTransferReference = () => {
  if (transferReference.value) {
    return;
  }

  const timestamp = Date.now()
    .toString(36)
    .toUpperCase();

  const random = Math.random()
    .toString(36)
    .slice(2, 7)
    .toUpperCase();

  transferReference.value = `CLEO-${timestamp}-${random}`;
};

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
};

/*
 * ============================================================
 * SELECTION
 * ============================================================
 */

const selectConsultation = (
  type: ConsultationType
) => {
  selectedType.value = type;
  errorMessage.value = "";
};

const continueToDetails = () => {
  if (!canContinueToDetails.value) {
    return;
  }

  errorMessage.value = "";
  step.value = "details";
};

const continueToTransfer = () => {
  if (!detailsValid.value) {
    errorMessage.value =
      "Please complete the required fields before continuing.";

    return;
  }

  generateTransferReference();

  errorMessage.value = "";
  step.value = "transfer";
};

/*
 * ============================================================
 * COPY
 * ============================================================
 */

const copyToClipboard = async (
  value: string,
  field: "accountNumber" | "reference"
) => {
  if (!import.meta.client) {
    return;
  }

  try {
    await navigator.clipboard.writeText(value);

    copiedField.value = field;

    window.setTimeout(() => {
      if (copiedField.value === field) {
        copiedField.value = null;
      }
    }, 1800);
  } catch {
    errorMessage.value =
      "Unable to copy this information. Please copy it manually.";
  }
};

/*
 * ============================================================
 * SUBMIT TRANSFER NOTICE
 * ============================================================
 */

const submitTransferNotice = async () => {
  if (
    !selectedConsultation.value ||
    !detailsValid.value ||
    !transferReference.value
  ) {
    return;
  }

  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await $fetch<{
      success: boolean;
      consultation?: {
        reference: string;
        status: string;
      };
    }>("/api/consultations", {
      method: "POST",

      body: {
        consultationType: selectedConsultation.value.id,

        fullName: details.value.fullName,
        email: details.value.email,
        phone: details.value.phone,

        birthDate: details.value.birthDate,
        birthTime: details.value.birthTime,
        birthPlace: details.value.birthPlace,

        question: details.value.question,

        transferReference:
          transferReference.value,
      },
    });

    if (!response.success) {
      throw new Error(
        "Unable to submit consultation."
      );
    }

    if (response.consultation?.reference) {
      transferReference.value =
        response.consultation.reference;
    }

    step.value = "confirmed";
  } catch (error: unknown) {
    console.error(
      "Consultation submission error:",
      error
    );

    errorMessage.value =
      error instanceof Error
        ? error.message
        : "We couldn't submit your consultation request. Please try again.";
  } finally {
    loading.value = false;
  }
};

/*
 * ============================================================
 * NAVIGATION
 * ============================================================
 */

const goBack = () => {
  errorMessage.value = "";

  if (step.value === "details") {
    step.value = "types";
    return;
  }

  if (step.value === "transfer") {
    step.value = "details";
    return;
  }
};

const close = () => {
  if (loading.value) {
    return;
  }

  emit("update:open", false);
};

const reset = () => {
  step.value = "types";

  selectedType.value = null;

  loading.value = false;

  errorMessage.value = "";

  transferReference.value = "";

  copiedField.value = null;

  details.value = {
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
    if (!isOpen) {
      reset();
    }
  }
);
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div
        v-if="open"
        class="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto px-4 py-8 sm:px-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="consultation-dialog-title"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-[#080509]/90 backdrop-blur-md"
          @click="close"
        />

        <!-- Dialog -->
        <div
          class="relative z-10 w-full max-w-3xl overflow-hidden rounded-[2rem] border border-[#C58B92]/15 bg-[#160B10] shadow-[0_30px_100px_rgba(0,0,0,0.65)]"
        >
          <!-- Atmosphere -->
          <div
            aria-hidden="true"
            class="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div
              class="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#6B0F1A]/20 blur-[110px]"
            />

            <div
              class="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-[#42141F]/20 blur-[110px]"
            />

            <div
              class="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#C8A77A]/30 to-transparent"
            />
          </div>

          <!-- Header -->
          <div
            class="relative flex items-start justify-between border-b border-[#C58B92]/10 px-6 py-6 sm:px-8"
          >
            <div>
              <div class="flex items-center gap-3">
                <Sparkles
                  class="h-4 w-4 text-[#C8A77A]"
                  stroke-width="1.5"
                />

                <span
                  class="text-[9px] uppercase tracking-[0.35em] text-[#C8A77A]/70"
                >
                  Ifá & Afa
                </span>
              </div>

              <h2
                id="consultation-dialog-title"
                class="mt-3 font-serif text-2xl tracking-[-0.02em] text-[#F1E8E3] sm:text-3xl"
              >
                Private Consultation
              </h2>
            </div>

            <button
              type="button"
              aria-label="Close consultation dialog"
              class="flex h-10 w-10 items-center justify-center rounded-full border border-[#C58B92]/10 text-[#F1E8E3]/40 transition hover:border-[#C58B92]/25 hover:bg-[#261018] hover:text-[#F1E8E3]"
              :disabled="loading"
              @click="close"
            >
              <X
                class="h-4 w-4"
                stroke-width="1.5"
              />
            </button>
          </div>

          <!-- Progress -->
          <div
            v-if="step !== 'confirmed'"
            class="relative border-b border-[#C58B92]/[0.07] px-6 py-4 sm:px-8"
          >
            <div class="flex items-center gap-2">
              <template
                v-for="index in 3"
                :key="index"
              >
                <div class="flex items-center gap-2">
                  <span
                    class="flex h-6 w-6 items-center justify-center rounded-full border text-[9px] font-medium transition"
                    :class="
                      stepIndex >= index - 1
                        ? 'border-[#C8A77A]/50 bg-[#6B0F1A] text-[#F1E8E3]'
                        : 'border-[#C58B92]/10 text-[#F1E8E3]/25'
                    "
                  >
                    {{ index }}
                  </span>

                  <span
                    v-if="index < 3"
                    class="hidden text-[8px] uppercase tracking-[0.2em] text-[#F1E8E3]/20 sm:block"
                  >
                    {{
                      index === 1
                        ? "Consultation"
                        : index === 2
                          ? "Details"
                          : "Transfer"
                    }}
                  </span>
                </div>

                <div
                  v-if="index < 3"
                  class="h-px flex-1 bg-[#C58B92]/10"
                />
              </template>
            </div>
          </div>

          <!-- Body -->
          <div class="relative px-6 py-8 sm:px-8 sm:py-10">
            <!-- ==================================================
                 STEP 1 — TYPES
            =================================================== -->

            <div v-if="step === 'types'">
              <div class="max-w-xl">
                <p
                  class="text-[9px] uppercase tracking-[0.3em] text-[#C8A77A]/65"
                >
                  Choose your consultation
                </p>

                <h3
                  class="mt-3 font-serif text-3xl leading-tight text-[#F1E8E3]"
                >
                  Bring the question
                  <span class="text-[#F1E8E3]/35">
                    forward.
                  </span>
                </h3>

                <p
                  class="mt-4 text-sm leading-7 text-[#F1E8E3]/40"
                >
                  Select the consultation that feels
                  appropriate for the question or
                  situation you would like to explore.
                </p>
              </div>

              <div
                class="mt-8 grid gap-4 sm:grid-cols-2"
              >
                <button
                  v-for="consultation in consultations"
                  :key="consultation.id"
                  type="button"
                  class="group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-500"
                  :class="
                    selectedType === consultation.id
                      ? 'border-[#C8A77A]/40 bg-[#42141F]/40 shadow-[0_18px_50px_rgba(107,15,26,0.18)]'
                      : 'border-[#C58B92]/10 bg-[#1D0C13]/50 hover:border-[#C58B92]/25 hover:bg-[#261018]/70'
                  "
                  @click="
                    selectConsultation(
                      consultation.id
                    )
                  "
                >
                  <div
                    class="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full border transition"
                    :class="
                      selectedType === consultation.id
                        ? 'border-[#C8A77A]/50 bg-[#6B0F1A] text-[#F1E8E3]'
                        : 'border-[#C58B92]/10 text-transparent'
                    "
                  >
                    <Check
                      class="h-3 w-3"
                      stroke-width="2"
                    />
                  </div>

                  <span
                    class="text-[8px] uppercase tracking-[0.28em] text-[#C8A77A]/55"
                  >
                    {{ consultation.eyebrow }}
                  </span>

                  <h4
                    class="mt-3 font-serif text-xl text-[#F1E8E3]"
                  >
                    {{ consultation.name }}
                  </h4>

                  <p
                    class="mt-3 min-h-[72px] text-xs leading-6 text-[#F1E8E3]/40"
                  >
                    {{ consultation.description }}
                  </p>

                  <div
                    class="mt-5 flex items-center justify-between border-t border-[#C58B92]/[0.07] pt-4"
                  >
                    <span
                      class="flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-[#F1E8E3]/30"
                    >
                      <Clock3
                        class="h-3 w-3"
                        stroke-width="1.4"
                      />

                      {{ consultation.duration }}
                    </span>

                    <span
                      class="font-mono text-xs text-[#C8A77A]/75"
                    >
                      {{ formatPrice(consultation.amount) }}
                    </span>
                  </div>
                </button>
              </div>

              <div
                v-if="errorMessage"
                class="mt-5 rounded-xl border border-[#A45A65]/20 bg-[#42141F]/20 px-4 py-3 text-xs text-[#C58B92]"
              >
                {{ errorMessage }}
              </div>
            </div>

            <!-- ==================================================
                 STEP 2 — DETAILS
            =================================================== -->

            <div v-else-if="step === 'details'">
              <div>
                <p
                  class="text-[9px] uppercase tracking-[0.3em] text-[#C8A77A]/65"
                >
                  Your details
                </p>

                <h3
                  class="mt-3 font-serif text-3xl text-[#F1E8E3]"
                >
                  Tell me a little
                  <span class="text-[#F1E8E3]/35">
                    about the question.
                  </span>
                </h3>

                <p
                  class="mt-4 max-w-xl text-sm leading-7 text-[#F1E8E3]/40"
                >
                  These details help provide context for
                  your private consultation.
                </p>
              </div>

              <div
                class="mt-8 grid gap-5 sm:grid-cols-2"
              >
                <label class="block">
                  <span
                    class="mb-2 block text-[9px] uppercase tracking-[0.2em] text-[#F1E8E3]/30"
                  >
                    Full name
                  </span>

                  <input
                    v-model="details.fullName"
                    type="text"
                    autocomplete="name"
                    placeholder="Your full name"
                    class="h-12 w-full rounded-xl border border-[#C58B92]/10 bg-[#1D0C13]/60 px-4 text-sm text-[#F1E8E3] outline-none transition placeholder:text-[#F1E8E3]/20 focus:border-[#C8A77A]/35 focus:bg-[#261018]/70"
                  />
                </label>

                <label class="block">
                  <span
                    class="mb-2 block text-[9px] uppercase tracking-[0.2em] text-[#F1E8E3]/30"
                  >
                    Email
                  </span>

                  <input
                    v-model="details.email"
                    type="email"
                    autocomplete="email"
                    placeholder="you@example.com"
                    class="h-12 w-full rounded-xl border border-[#C58B92]/10 bg-[#1D0C13]/60 px-4 text-sm text-[#F1E8E3] outline-none transition placeholder:text-[#F1E8E3]/20 focus:border-[#C8A77A]/35 focus:bg-[#261018]/70"
                  />
                </label>

                <label class="block">
                  <span
                    class="mb-2 block text-[9px] uppercase tracking-[0.2em] text-[#F1E8E3]/30"
                  >
                    Phone
                  </span>

                  <input
                    v-model="details.phone"
                    type="tel"
                    autocomplete="tel"
                    placeholder="Your phone number"
                    class="h-12 w-full rounded-xl border border-[#C58B92]/10 bg-[#1D0C13]/60 px-4 text-sm text-[#F1E8E3] outline-none transition placeholder:text-[#F1E8E3]/20 focus:border-[#C8A77A]/35 focus:bg-[#261018]/70"
                  />
                </label>

                <label class="block">
                  <span
                    class="mb-2 block text-[9px] uppercase tracking-[0.2em] text-[#F1E8E3]/30"
                  >
                    Birth date
                    <span class="text-[#F1E8E3]/15">
                      · optional
                    </span>
                  </span>

                  <input
                    v-model="details.birthDate"
                    type="date"
                    class="h-12 w-full rounded-xl border border-[#C58B92]/10 bg-[#1D0C13]/60 px-4 text-sm text-[#F1E8E3] outline-none transition focus:border-[#C8A77A]/35 focus:bg-[#261018]/70"
                  />
                </label>

                <label class="block">
                  <span
                    class="mb-2 block text-[9px] uppercase tracking-[0.2em] text-[#F1E8E3]/30"
                  >
                    Birth time
                    <span class="text-[#F1E8E3]/15">
                      · optional
                    </span>
                  </span>

                  <input
                    v-model="details.birthTime"
                    type="time"
                    class="h-12 w-full rounded-xl border border-[#C58B92]/10 bg-[#1D0C13]/60 px-4 text-sm text-[#F1E8E3] outline-none transition focus:border-[#C8A77A]/35 focus:bg-[#261018]/70"
                  />
                </label>

                <label class="block">
                  <span
                    class="mb-2 block text-[9px] uppercase tracking-[0.2em] text-[#F1E8E3]/30"
                  >
                    Birth place
                    <span class="text-[#F1E8E3]/15">
                      · optional
                    </span>
                  </span>

                  <input
                    v-model="details.birthPlace"
                    type="text"
                    placeholder="City / country"
                    class="h-12 w-full rounded-xl border border-[#C58B92]/10 bg-[#1D0C13]/60 px-4 text-sm text-[#F1E8E3] outline-none transition placeholder:text-[#F1E8E3]/20 focus:border-[#C8A77A]/35 focus:bg-[#261018]/70"
                  />
                </label>

                <label class="block sm:col-span-2">
                  <span
                    class="mb-2 block text-[9px] uppercase tracking-[0.2em] text-[#F1E8E3]/30"
                  >
                    What would you like guidance on?
                  </span>

                  <textarea
                    v-model="details.question"
                    rows="5"
                    maxlength="3000"
                    placeholder="Share the question, situation or area of life you would like to bring into the consultation..."
                    class="w-full resize-none rounded-xl border border-[#C58B92]/10 bg-[#1D0C13]/60 px-4 py-4 text-sm leading-6 text-[#F1E8E3] outline-none transition placeholder:text-[#F1E8E3]/20 focus:border-[#C8A77A]/35 focus:bg-[#261018]/70"
                  />
                </label>
              </div>

              <div
                v-if="errorMessage"
                class="mt-5 rounded-xl border border-[#A45A65]/20 bg-[#42141F]/20 px-4 py-3 text-xs text-[#C58B92]"
              >
                {{ errorMessage }}
              </div>
            </div>

            <!-- ==================================================
                 STEP 3 — BANK TRANSFER
            =================================================== -->

            <div v-else-if="step === 'transfer'">
              <div>
                <p
                  class="text-[9px] uppercase tracking-[0.3em] text-[#C8A77A]/65"
                >
                  Complete your transfer
                </p>

                <h3
                  class="mt-3 font-serif text-3xl text-[#F1E8E3]"
                >
                  Your consultation
                  <span class="text-[#F1E8E3]/35">
                    begins here.
                  </span>
                </h3>

                <p
                  class="mt-4 max-w-xl text-sm leading-7 text-[#F1E8E3]/40"
                >
                  Transfer the exact amount using the
                  account details below. After completing
                  the transfer, let us know.
                </p>
              </div>

              <!-- Consultation summary -->
              <div
                class="mt-7 rounded-2xl border border-[#C58B92]/10 bg-[#1D0C13]/55 p-5"
              >
                <div
                  class="flex items-center justify-between gap-4"
                >
                  <div>
                    <span
                      class="text-[8px] uppercase tracking-[0.25em] text-[#C8A77A]/55"
                    >
                      Selected consultation
                    </span>

                    <p
                      class="mt-2 font-serif text-lg text-[#F1E8E3]"
                    >
                      {{ selectedConsultation?.name }}
                    </p>
                  </div>

                  <div class="text-right">
                    <span
                      class="text-[8px] uppercase tracking-[0.25em] text-[#F1E8E3]/25"
                    >
                      Amount
                    </span>

                    <p
                      class="mt-2 font-mono text-lg text-[#C8A77A]"
                    >
                      {{ formattedAmount }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Bank details -->
              <div
                class="mt-4 overflow-hidden rounded-2xl border border-[#C8A77A]/20 bg-[#261018]/70"
              >
                <div
                  class="border-b border-[#C58B92]/10 px-5 py-4"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="flex h-9 w-9 items-center justify-center rounded-full bg-[#6B0F1A]"
                    >
                      <Compass
                        class="h-4 w-4 text-[#C8A77A]"
                        stroke-width="1.4"
                      />
                    </div>

                    <div>
                      <p
                        class="text-[8px] uppercase tracking-[0.25em] text-[#C8A77A]/65"
                      >
                        Bank transfer
                      </p>

                      <p
                        class="mt-1 text-xs text-[#F1E8E3]/45"
                      >
                        Transfer the exact amount shown above.
                      </p>
                    </div>
                  </div>
                </div>

                <div class="divide-y divide-[#C58B92]/[0.07]">
                  <div
                    class="flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <span
                      class="text-[9px] uppercase tracking-[0.2em] text-[#F1E8E3]/25"
                    >
                      Bank
                    </span>

                    <span
                      class="text-sm text-[#F1E8E3]/75"
                    >
                      {{ bankDetails.bankName }}
                    </span>
                  </div>

                  <div
                    class="flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <span
                      class="text-[9px] uppercase tracking-[0.2em] text-[#F1E8E3]/25"
                    >
                      Account name
                    </span>

                    <span
                      class="text-sm text-[#F1E8E3]/75"
                    >
                      {{ bankDetails.accountName }}
                    </span>
                  </div>

                  <div
                    class="flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <span
                      class="text-[9px] uppercase tracking-[0.2em] text-[#F1E8E3]/25"
                    >
                      Account number
                    </span>

                    <button
                      type="button"
                      class="group flex items-center gap-3 rounded-lg px-2 py-1 transition hover:bg-[#42141F]/40"
                      @click="
                        copyToClipboard(
                          bankDetails.accountNumber,
                          'accountNumber'
                        )
                      "
                    >
                      <span
                        class="font-mono text-sm tracking-wide text-[#F1E8E3]"
                      >
                        {{ bankDetails.accountNumber }}
                      </span>

                      <Check
                        v-if="
                          copiedField ===
                          'accountNumber'
                        "
                        class="h-4 w-4 text-[#C8A77A]"
                      />

                      <Copy
                        v-else
                        class="h-3.5 w-3.5 text-[#F1E8E3]/30 transition group-hover:text-[#C8A77A]"
                      />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Transfer reference -->
              <div
                class="mt-4 rounded-2xl border border-[#C58B92]/10 bg-[#1D0C13]/50 p-5"
              >
                <div
                  class="flex items-start justify-between gap-4"
                >
                  <div>
                    <span
                      class="text-[8px] uppercase tracking-[0.25em] text-[#F1E8E3]/25"
                    >
                      Transfer reference
                    </span>

                    <p
                      class="mt-2 font-mono text-sm tracking-wide text-[#C8A77A]"
                    >
                      {{ transferReference }}
                    </p>

                    <p
                      class="mt-2 text-[10px] leading-5 text-[#F1E8E3]/25"
                    >
                      Use this reference in your transfer
                      narration where possible.
                    </p>
                  </div>

                  <button
                    type="button"
                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#C58B92]/10 text-[#F1E8E3]/30 transition hover:border-[#C58B92]/25 hover:bg-[#261018] hover:text-[#C8A77A]"
                    @click="
                      copyToClipboard(
                        transferReference,
                        'reference'
                      )
                    "
                  >
                    <Check
                      v-if="
                        copiedField === 'reference'
                      "
                      class="h-3.5 w-3.5 text-[#C8A77A]"
                    />

                    <Copy
                      v-else
                      class="h-3.5 w-3.5"
                    />
                  </button>
                </div>
              </div>

              <!-- Important note -->
              <div
                class="mt-4 flex gap-3 rounded-xl border border-[#C8A77A]/10 bg-[#C8A77A]/[0.04] px-4 py-4"
              >
                <Info
                  class="mt-0.5 h-4 w-4 shrink-0 text-[#C8A77A]/70"
                  stroke-width="1.5"
                />

                <p
                  class="text-[10px] leading-5 text-[#F1E8E3]/35"
                >
                  After making your transfer, click
                  <span class="text-[#F1E8E3]/65">
                    “I've made the transfer”
                  </span>
                  below. This submits your consultation
                  for payment verification. Your payment is
                  not automatically verified by this button.
                </p>
              </div>

              <div
                v-if="errorMessage"
                class="mt-5 rounded-xl border border-[#A45A65]/20 bg-[#42141F]/20 px-4 py-3 text-xs text-[#C58B92]"
              >
                {{ errorMessage }}
              </div>
            </div>

            <!-- ==================================================
                 STEP 4 — CONFIRMED
            =================================================== -->

            <div
              v-else-if="step === 'confirmed'"
              class="py-8 text-center sm:py-12"
            >
              <div
                class="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#C8A77A]/25 bg-[#42141F]/40"
              >
                <CheckCircle2
                  class="h-9 w-9 text-[#C8A77A]"
                  stroke-width="1.2"
                />
              </div>

              <p
                class="mt-7 text-[9px] uppercase tracking-[0.35em] text-[#C8A77A]/65"
              >
                Consultation request received
              </p>

              <h3
                class="mx-auto mt-4 max-w-lg font-serif text-3xl leading-tight text-[#F1E8E3] sm:text-4xl"
              >
                Thank you for booking.
              </h3>

              <p
                class="mx-auto mt-5 max-w-md text-sm leading-7 text-[#F1E8E3]/45"
              >
                Thank you,
                <span class="text-[#F1E8E3]/70">
                  {{ details.fullName }}
                </span>.
                I will contact you as soon as your payment
                is received and verified.
              </p>

              <div
                class="mx-auto mt-8 max-w-sm rounded-2xl border border-[#C58B92]/10 bg-[#1D0C13]/60 p-5 text-left"
              >
                <div
                  class="flex items-center justify-between border-b border-[#C58B92]/[0.07] pb-4"
                >
                  <span
                    class="text-[8px] uppercase tracking-[0.22em] text-[#F1E8E3]/25"
                  >
                    Consultation
                  </span>

                  <span
                    class="text-xs text-[#F1E8E3]/60"
                  >
                    {{ selectedConsultation?.name }}
                  </span>
                </div>

                <div
                  class="flex items-center justify-between border-b border-[#C58B92]/[0.07] py-4"
                >
                  <span
                    class="text-[8px] uppercase tracking-[0.22em] text-[#F1E8E3]/25"
                  >
                    Amount
                  </span>

                  <span
                    class="font-mono text-xs text-[#C8A77A]"
                  >
                    {{ formattedAmount }}
                  </span>
                </div>

                <div
                  class="flex items-center justify-between pt-4"
                >
                  <span
                    class="text-[8px] uppercase tracking-[0.22em] text-[#F1E8E3]/25"
                  >
                    Reference
                  </span>

                  <span
                    class="font-mono text-[10px] text-[#F1E8E3]/50"
                  >
                    {{ transferReference }}
                  </span>
                </div>
              </div>

              <p
                class="mx-auto mt-6 max-w-sm text-[10px] leading-5 text-[#F1E8E3]/25"
              >
                Your transfer will be checked manually.
                Please keep your transfer confirmation until
                your payment has been verified.
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div
            v-if="step !== 'confirmed'"
            class="relative flex flex-col-reverse gap-3 border-t border-[#C58B92]/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8"
          >
            <Button
              v-if="step !== 'types'"
              type="button"
              variant="ghost"
              :disabled="loading"
              class="h-11 rounded-full px-5 text-xs text-[#F1E8E3]/40 hover:bg-[#261018] hover:text-[#F1E8E3]"
              @click="goBack"
            >
              <ArrowLeft
                class="mr-2 h-3.5 w-3.5"
                stroke-width="1.5"
              />

              Back
            </Button>

            <div v-else />

            <Button
              v-if="step === 'types'"
              type="button"
              :disabled="!canContinueToDetails"
              class="h-11 rounded-full bg-[#6B0F1A] px-6 text-xs text-[#F1E8E3] shadow-[0_12px_30px_rgba(107,15,26,0.22)] transition hover:bg-[#7E3541] disabled:cursor-not-allowed disabled:opacity-30"
              @click="continueToDetails"
            >
              Continue

              <ArrowRight
                class="ml-2 h-3.5 w-3.5"
                stroke-width="1.5"
              />
            </Button>

            <Button
              v-else-if="step === 'details'"
              type="button"
              :disabled="!detailsValid"
              class="h-11 rounded-full bg-[#6B0F1A] px-6 text-xs text-[#F1E8E3] shadow-[0_12px_30px_rgba(107,15,26,0.22)] transition hover:bg-[#7E3541] disabled:cursor-not-allowed disabled:opacity-30"
              @click="continueToTransfer"
            >
              Continue to payment

              <ArrowRight
                class="ml-2 h-3.5 w-3.5"
                stroke-width="1.5"
              />
            </Button>

            <Button
              v-else-if="step === 'transfer'"
              type="button"
              :disabled="loading"
              class="h-11 rounded-full bg-[#6B0F1A] px-6 text-xs text-[#F1E8E3] shadow-[0_12px_30px_rgba(107,15,26,0.22)] transition hover:bg-[#7E3541] disabled:cursor-not-allowed disabled:opacity-50"
              @click="submitTransferNotice"
            >
              <LoaderCircle
                v-if="loading"
                class="mr-2 h-3.5 w-3.5 animate-spin"
                stroke-width="1.5"
              />

              <span v-if="loading">
                Submitting...
              </span>

              <span v-else>
                I've made the transfer
              </span>

              <ArrowRight
                v-if="!loading"
                class="ml-2 h-3.5 w-3.5"
                stroke-width="1.5"
              />
            </Button>
          </div>

          <!-- Confirmed footer -->
          <div
            v-else
            class="relative flex justify-center border-t border-[#C58B92]/10 px-6 py-5 sm:px-8"
          >
            <Button
              type="button"
              class="h-11 rounded-full bg-[#6B0F1A] px-8 text-xs text-[#F1E8E3] transition hover:bg-[#7E3541]"
              @click="close"
            >
              Done
            </Button>
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
    opacity 0.3s ease,
    transform 0.3s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.dialog-enter-from > div:last-child,
.dialog-leave-to > div:last-child {
  transform: translateY(12px) scale(0.98);
}

input[type="date"],
input[type="time"] {
  color-scheme: dark;
}
</style>
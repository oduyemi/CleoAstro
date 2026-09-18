<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clipboard,
  Copy,
  Heart,
  ShieldCheck,
  Sparkles,
} from "lucide-vue-next";

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
}>();

type DonationStep = "amount" | "transfer" | "complete";

const step = ref<DonationStep>("amount");
const amount = ref("");
const copied = ref(false);
const submitting = ref(false);

const bankDetails = {
  bankName: "YOUR BANK NAME",
  accountName: "CLEO ASTRO",
  accountNumber: "0000000000",
};

const formattedAmount = computed(() => {
  const numericAmount = Number(amount.value.replace(/,/g, ""));

  if (!numericAmount || numericAmount <= 0) {
    return "₦0";
  }

  return `₦${numericAmount.toLocaleString("en-NG")}`;
});

const canContinue = computed(() => {
  const numericAmount = Number(amount.value.replace(/,/g, ""));

  return Number.isFinite(numericAmount) && numericAmount > 0;
});

const closeDialog = () => {
  emit("update:open", false);
};

const resetDialog = () => {
  step.value = "amount";
  amount.value = "";
  copied.value = false;
  submitting.value = false;
};

const handleOpenChange = (value: boolean) => {
  emit("update:open", value);

  if (!value) {
    setTimeout(resetDialog, 250);
  }
};

const formatAmountInput = () => {
  const numericValue = amount.value.replace(/[^\d]/g, "");

  if (!numericValue) {
    amount.value = "";
    return;
  }

  amount.value = Number(numericValue).toLocaleString("en-NG");
};

const setAmount = (value: number) => {
  amount.value = value.toLocaleString("en-NG");
};

const continueToTransfer = () => {
  if (!canContinue.value) return;

  step.value = "transfer";
};

const copyAccountNumber = async () => {
  if (!import.meta.client) return;

  try {
    await navigator.clipboard.writeText(bankDetails.accountNumber);
    copied.value = true;

    window.setTimeout(() => {
      copied.value = false;
    }, 2200);
  } catch {
    copied.value = false;
  }
};

const confirmTransfer = async () => {
  if (submitting.value) return;

  submitting.value = true;

  /*
   * This is intentionally only a UI confirmation.
   *
   * When your backend is ready, this is where you can POST:
   * - donation amount
   * - donor name/email
   * - reference
   * - selected cause
   *
   * The bank transfer itself should be verified separately.
   */

  await new Promise((resolve) => setTimeout(resolve, 500));

  submitting.value = false;
  step.value = "complete";
};

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      resetDialog();
    }
  },
);
</script>

<template>
  <Teleport to="body">
    <Transition name="donation-dialog">
      <div
        v-if="open"
        class="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="donation-dialog-title"
        @click.self="closeDialog"
      >
        <!-- Backdrop -->

        <div
          class="absolute inset-0 bg-[#080507]/85 backdrop-blur-md"
          aria-hidden="true"
        />

        <!-- ===================================================== -->
        <!-- DIALOG -->
        <!-- ===================================================== -->

        <div
          class="relative my-auto w-full max-w-2xl overflow-hidden rounded-[2rem] border border-[#C58B92]/[0.14] bg-[#160B10] text-[#F1E8E3] shadow-[0_35px_120px_rgba(0,0,0,.55)]"
        >
          <!-- ================================================= -->
          <!-- ATMOSPHERE -->
          <!-- ================================================= -->

          <div
            aria-hidden="true"
            class="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#6B0F1A]/20 blur-[100px]"
          />

          <div
            aria-hidden="true"
            class="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-[#42141F]/20 blur-[100px]"
          />

          <div
            aria-hidden="true"
            class="pointer-events-none absolute right-10 top-10 h-44 w-44 rounded-full border border-[#C58B92]/[0.05]"
          />

          <div
            aria-hidden="true"
            class="pointer-events-none absolute right-16 top-16 h-32 w-32 rounded-full border border-[#C8A77A]/[0.05]"
          />

          <!-- Top line -->

          <div
            aria-hidden="true"
            class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C8A77A]/35 to-transparent"
          />

          <!-- ================================================= -->
          <!-- HEADER -->
          <!-- ================================================= -->

          <div
            class="relative flex items-start justify-between border-b border-[#C58B92]/[0.08] px-6 py-6 sm:px-8 sm:py-7"
          >
            <div class="flex items-center gap-4">
              <div
                class="flex h-11 w-11 items-center justify-center rounded-full border border-[#C8A77A]/20 bg-[#1D0C13]"
              >
                <Heart
                  class="h-4 w-4 text-[#C8A77A]"
                  stroke-width="1.3"
                />
              </div>

              <div>
                <p
                  class="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#C8A77A]/65"
                >
                  Give with intention
                </p>

                <h2
                  id="donation-dialog-title"
                  class="mt-1 font-serif text-xl font-medium tracking-[-0.025em] text-[#F1E8E3]"
                >
                  Make a donation
                </h2>
              </div>
            </div>

            <button
              type="button"
              aria-label="Close donation dialog"
              class="flex h-9 w-9 items-center justify-center rounded-full border border-[#C58B92]/10 text-[#F1E8E3]/35 transition-all duration-300 hover:border-[#C58B92]/25 hover:bg-[#261018] hover:text-[#F1E8E3]"
              @click="closeDialog"
            >
              <span class="text-xl font-light leading-none">×</span>
            </button>
          </div>

          <!-- ================================================= -->
          <!-- PROGRESS -->
          <!-- ================================================= -->

          <div
            class="relative flex items-center gap-3 border-b border-[#C58B92]/[0.06] px-6 py-4 sm:px-8"
          >
            <div
              v-for="(item, index) in [
                { key: 'amount', label: 'Amount' },
                { key: 'transfer', label: 'Transfer' },
                { key: 'complete', label: 'Thank you' },
              ]"
              :key="item.key"
              class="flex items-center gap-3"
            >
              <div
                class="flex h-6 w-6 items-center justify-center rounded-full border text-[8px] transition-all duration-500"
                :class="
                  step === item.key || ['transfer', 'complete'].includes(step) && index === 0 || step === 'complete' && index === 1
                    ? 'border-[#C8A77A]/50 bg-[#6B0F1A] text-[#F1E8E3]'
                    : 'border-[#C58B92]/10 text-[#F1E8E3]/20'
                "
              >
                <Check
                  v-if="
                    (step === 'transfer' && index === 0) ||
                    (step === 'complete' && index < 2)
                  "
                  class="h-3 w-3"
                  stroke-width="2"
                />

                <span v-else>
                  {{ index + 1 }}
                </span>
              </div>

              <span
                class="hidden text-[8px] uppercase tracking-[0.2em] sm:block"
                :class="
                  step === item.key
                    ? 'text-[#C8A77A]/70'
                    : 'text-[#F1E8E3]/20'
                "
              >
                {{ item.label }}
              </span>

              <span
                v-if="index < 2"
                class="mx-1 h-px w-6 bg-[#C58B92]/10 sm:w-10"
              />
            </div>
          </div>

          <!-- ================================================= -->
          <!-- BODY -->
          <!-- ================================================= -->

          <div class="relative px-6 py-8 sm:px-8 sm:py-10">
            <!-- ================================================= -->
            <!-- STEP 1: AMOUNT -->
            <!-- ================================================= -->

            <Transition name="step" mode="out-in">
              <div
                v-if="step === 'amount'"
                key="amount"
              >
                <div class="max-w-xl">
                  <div class="mb-2 flex items-center gap-2">
                    <Sparkles
                      class="h-3.5 w-3.5 text-[#C8A77A]/55"
                      stroke-width="1.2"
                    />

                    <span
                      class="text-[9px] uppercase tracking-[0.25em] text-[#F1E8E3]/25"
                    >
                      Choose an amount
                    </span>
                  </div>

                  <h3
                    class="font-serif text-3xl font-medium tracking-[-0.04em] text-[#F1E8E3] sm:text-4xl"
                  >
                    How much would you like to give?
                  </h3>

                  <p
                    class="mt-4 max-w-lg text-sm leading-6 text-[#F1E8E3]/38"
                  >
                    Every contribution can become practical support,
                    opportunity, care, and comfort for someone who needs it.
                  </p>
                </div>

                <!-- Quick amounts -->

                <div class="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <button
                    v-for="quickAmount in [5000, 10000, 25000, 50000]"
                    :key="quickAmount"
                    type="button"
                    class="h-12 rounded-xl border border-[#C58B92]/10 bg-[#1D0C13]/70 text-xs text-[#F1E8E3]/55 transition-all duration-300 hover:border-[#C8A77A]/30 hover:bg-[#261018] hover:text-[#F1E8E3]"
                    @click="setAmount(quickAmount)"
                  >
                    ₦{{ quickAmount.toLocaleString("en-NG") }}
                  </button>
                </div>

                <!-- Amount input -->

                <div class="mt-5">
                  <label
                    for="donation-amount"
                    class="mb-2 block text-[9px] font-semibold uppercase tracking-[0.25em] text-[#C8A77A]/55"
                  >
                    Or enter your own amount
                  </label>

                  <div class="relative">
                    <span
                      class="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 font-serif text-lg text-[#C8A77A]/65"
                    >
                      ₦
                    </span>

                    <input
                      id="donation-amount"
                      v-model="amount"
                      type="text"
                      inputmode="numeric"
                      autocomplete="off"
                      placeholder="0"
                      class="h-16 w-full rounded-2xl border border-[#C58B92]/10 bg-[#1D0C13]/70 pl-11 pr-5 font-serif text-2xl text-[#F1E8E3] outline-none transition-all duration-300 placeholder:text-[#F1E8E3]/15 focus:border-[#C8A77A]/35 focus:bg-[#261018]"
                      @input="formatAmountInput"
                    />
                  </div>
                </div>

                <!-- Continue -->

                <button
                  type="button"
                  :disabled="!canContinue"
                  class="group mt-7 flex h-14 w-full items-center justify-center rounded-full border border-[#C8A77A]/30 bg-[#6B0F1A] text-xs font-medium text-[#F1E8E3] shadow-[0_15px_40px_rgba(107,15,26,.20)] transition-all duration-500 hover:-translate-y-0.5 hover:border-[#C8A77A]/50 hover:bg-[#7E3541] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:translate-y-0"
                  @click="continueToTransfer"
                >
                  <span>Continue to bank transfer</span>

                  <ArrowRight
                    class="ml-3 h-4 w-4 opacity-60 transition-transform duration-300 group-hover:translate-x-1"
                    stroke-width="1.4"
                  />
                </button>

                <div class="mt-5 flex items-center justify-center gap-2">
                  <ShieldCheck
                    class="h-3.5 w-3.5 text-[#C8A77A]/35"
                    stroke-width="1.2"
                  />

                  <span
                    class="text-[9px] text-[#F1E8E3]/20"
                  >
                    Your transfer will be made directly to our bank account.
                  </span>
                </div>
              </div>

              <!-- ================================================= -->
              <!-- STEP 2: BANK TRANSFER -->
              <!-- ================================================= -->

              <div
                v-else-if="step === 'transfer'"
                key="transfer"
              >
                <button
                  type="button"
                  class="mb-7 flex items-center gap-2 text-[9px] uppercase tracking-[0.22em] text-[#F1E8E3]/30 transition-colors hover:text-[#C8A77A]/70"
                  @click="step = 'amount'"
                >
                  <ArrowLeft
                    class="h-3.5 w-3.5"
                    stroke-width="1.3"
                  />
                  Back
                </button>

                <div>
                  <p
                    class="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#C8A77A]/65"
                  >
                    Bank transfer
                  </p>

                  <h3
                    class="mt-2 font-serif text-3xl font-medium tracking-[-0.04em] text-[#F1E8E3] sm:text-4xl"
                  >
                    Transfer {{ formattedAmount }}
                  </h3>

                  <p
                    class="mt-4 max-w-lg text-sm leading-6 text-[#F1E8E3]/38"
                  >
                    Use the account details below to make your transfer.
                    After completing it, return here and let us know.
                  </p>
                </div>

                <!-- Bank details -->

                <div
                  class="relative mt-8 overflow-hidden rounded-[1.5rem] border border-[#C58B92]/10 bg-[#1D0C13]"
                >
                  <div
                    aria-hidden="true"
                    class="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#6B0F1A]/15 blur-[60px]"
                  />

                  <div class="relative">
                    <!-- Bank -->

                    <div
                      class="border-b border-[#C58B92]/[0.07] px-5 py-5 sm:px-6"
                    >
                      <p
                        class="text-[8px] uppercase tracking-[0.25em] text-[#F1E8E3]/20"
                      >
                        Bank
                      </p>

                      <p
                        class="mt-2 text-sm font-medium tracking-wide text-[#F1E8E3]/80"
                      >
                        {{ bankDetails.bankName }}
                      </p>
                    </div>

                    <!-- Account name -->

                    <div
                      class="border-b border-[#C58B92]/[0.07] px-5 py-5 sm:px-6"
                    >
                      <p
                        class="text-[8px] uppercase tracking-[0.25em] text-[#F1E8E3]/20"
                      >
                        Account name
                      </p>

                      <p
                        class="mt-2 text-sm font-medium tracking-wide text-[#F1E8E3]/80"
                      >
                        {{ bankDetails.accountName }}
                      </p>
                    </div>

                    <!-- Account number -->

                    <div class="px-5 py-5 sm:px-6">
                      <div class="flex items-end justify-between gap-4">
                        <div>
                          <p
                            class="text-[8px] uppercase tracking-[0.25em] text-[#F1E8E3]/20"
                          >
                            Account number
                          </p>

                          <p
                            class="mt-2 font-mono text-xl tracking-[0.12em] text-[#C8A77A]"
                          >
                            {{ bankDetails.accountNumber }}
                          </p>
                        </div>

                        <button
                          type="button"
                          class="flex h-10 shrink-0 items-center gap-2 rounded-full border border-[#C8A77A]/20 bg-[#261018] px-4 text-[9px] font-medium text-[#F1E8E3]/60 transition-all duration-300 hover:border-[#C8A77A]/40 hover:text-[#F1E8E3]"
                          @click="copyAccountNumber"
                        >
                          <Check
                            v-if="copied"
                            class="h-3.5 w-3.5 text-[#C8A77A]"
                            stroke-width="1.7"
                          />

                          <Copy
                            v-else
                            class="h-3.5 w-3.5 text-[#C8A77A]/65"
                            stroke-width="1.3"
                          />

                          {{ copied ? "Copied" : "Copy" }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Instructions -->

                <div class="mt-6 grid gap-3 sm:grid-cols-3">
                  <div
                    class="rounded-2xl border border-[#C58B92]/[0.07] bg-[#1D0C13]/45 p-4"
                  >
                    <span
                      class="text-[9px] font-semibold text-[#C8A77A]/60"
                    >
                      01
                    </span>

                    <p
                      class="mt-2 text-[11px] leading-5 text-[#F1E8E3]/35"
                    >
                      Copy the account number.
                    </p>
                  </div>

                  <div
                    class="rounded-2xl border border-[#C58B92]/[0.07] bg-[#1D0C13]/45 p-4"
                  >
                    <span
                      class="text-[9px] font-semibold text-[#C8A77A]/60"
                    >
                      02
                    </span>

                    <p
                      class="mt-2 text-[11px] leading-5 text-[#F1E8E3]/35"
                    >
                      Make your bank transfer.
                    </p>
                  </div>

                  <div
                    class="rounded-2xl border border-[#C58B92]/[0.07] bg-[#1D0C13]/45 p-4"
                  >
                    <span
                      class="text-[9px] font-semibold text-[#C8A77A]/60"
                    >
                      03
                    </span>

                    <p
                      class="mt-2 text-[11px] leading-5 text-[#F1E8E3]/35"
                    >
                      Confirm your transfer below.
                    </p>
                  </div>
                </div>

                <!-- Confirmation -->

                <button
                  type="button"
                  :disabled="submitting"
                  class="group mt-7 flex h-14 w-full items-center justify-center rounded-full border border-[#C8A77A]/30 bg-[#6B0F1A] text-xs font-medium text-[#F1E8E3] shadow-[0_15px_40px_rgba(107,15,26,.20)] transition-all duration-500 hover:-translate-y-0.5 hover:border-[#C8A77A]/50 hover:bg-[#7E3541] disabled:cursor-wait disabled:opacity-60"
                  @click="confirmTransfer"
                >
                  <span>
                    {{
                      submitting
                        ? "Confirming..."
                        : "I've made the transfer"
                    }}
                  </span>

                  <Check
                    v-if="!submitting"
                    class="ml-3 h-4 w-4 opacity-60"
                    stroke-width="1.4"
                  />
                </button>

                <p
                  class="mt-4 text-center text-[9px] leading-5 text-[#F1E8E3]/20"
                >
                  Please only confirm after you have completed the bank
                  transfer.
                </p>
              </div>

              <!-- ================================================= -->
              <!-- STEP 3: COMPLETE -->
              <!-- ================================================= -->

              <div
                v-else
                key="complete"
                class="py-5 text-center sm:py-8"
              >
                <!-- Success icon -->

                <div
                  class="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-[#C8A77A]/25 bg-[#1D0C13]"
                >
                  <div
                    class="absolute inset-2 rounded-full border border-[#C58B92]/10"
                  />

                  <CheckCircle2
                    class="h-9 w-9 text-[#C8A77A]"
                    stroke-width="1.1"
                  />

                  <span
                    class="absolute right-1 top-2 h-1.5 w-1.5 rounded-full bg-[#C8A77A] shadow-[0_0_14px_rgba(200,167,122,.6)]"
                  />
                </div>

                <p
                  class="mt-8 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#C8A77A]/65"
                >
                  Thank you
                </p>

                <h3
                  class="mt-3 font-serif text-4xl font-medium tracking-[-0.045em] text-[#F1E8E3] sm:text-5xl"
                >
                  Your generosity matters.
                </h3>

                <p
                  class="mx-auto mt-5 max-w-md text-sm leading-7 text-[#F1E8E3]/40"
                >
                  Thank you for choosing to make a difference. Your
                  contribution of
                  <span class="text-[#C8A77A]/80">
                    {{ formattedAmount }}
                  </span>
                  represents care, support, and possibility.
                </p>

                <!-- Thank you note -->

                <div
                  class="mx-auto mt-8 max-w-md rounded-2xl border border-[#C58B92]/[0.08] bg-[#1D0C13]/60 px-6 py-5"
                >
                  <div class="flex items-center justify-center gap-3">
                    <span class="h-px w-8 bg-[#C8A77A]/20" />

                    <Sparkles
                      class="h-3.5 w-3.5 text-[#C8A77A]/50"
                      stroke-width="1.2"
                    />

                    <span class="h-px w-8 bg-[#C8A77A]/20" />
                  </div>

                  <p
                    class="mt-4 font-serif text-sm italic leading-6 text-[#F1E8E3]/45"
                  >
                    “What we give outward can change what we carry inward.”
                  </p>
                </div>

                <button
                  type="button"
                  class="mt-8 h-12 rounded-full border border-[#C58B92]/15 bg-[#261018] px-7 text-[11px] font-medium text-[#F1E8E3]/65 transition-all duration-300 hover:border-[#C58B92]/30 hover:bg-[#42141F] hover:text-[#F1E8E3]"
                  @click="closeDialog"
                >
                  Return to Cleo Astro
                </button>
              </div>
            </Transition>
          </div>

          <!-- ================================================= -->
          <!-- FOOTER -->
          <!-- ================================================= -->

          <div
            v-if="step !== 'complete'"
            class="relative border-t border-[#C58B92]/[0.06] px-6 py-4 sm:px-8"
          >
            <div class="flex items-center justify-center gap-2">
              <ShieldCheck
                class="h-3.5 w-3.5 text-[#C8A77A]/30"
                stroke-width="1.2"
              />

              <p
                class="text-[8px] uppercase tracking-[0.2em] text-[#F1E8E3]/15"
              >
                Direct bank transfer
              </p>

              <span class="h-1 w-1 rounded-full bg-[#C8A77A]/30" />

              <p
                class="text-[8px] uppercase tracking-[0.2em] text-[#F1E8E3]/15"
              >
                Cleo Astro
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.donation-dialog-enter-active,
.donation-dialog-leave-active {
  transition: opacity 0.3s ease;
}

.donation-dialog-enter-from,
.donation-dialog-leave-to {
  opacity: 0;
}

.step-enter-active,
.step-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.step-enter-from {
  opacity: 0;
  transform: translateX(12px);
}

.step-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}
</style>
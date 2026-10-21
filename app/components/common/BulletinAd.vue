
<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref, watch } from "vue";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Megaphone,
  Star,
  X,
} from "lucide-vue-next";

const isDialogOpen = ref(false);
const isSubmitting = ref(false);
const submitError = ref("");
const submitted = ref(false);

const form = reactive({
  fullName: "",
  email: "",
  phone: "",
  businessName: "",
  website: "",
  industry: "",
  advertType: "",
  placement: "featured",
  campaignGoal: "",
  targetAudience: "",
  budget: "",
  startDate: "",
  endDate: "",
  advertDescription: "",
  destinationUrl: "",
  assetUrl: "",
  additionalNotes: "",
  consent: false,
});

const minDate = computed(() => new Date().toISOString().slice(0, 10));

const resetForm = () => {
  Object.assign(form, {
    fullName: "",
    email: "",
    phone: "",
    businessName: "",
    website: "",
    industry: "",
    advertType: "",
    placement: "featured",
    campaignGoal: "",
    targetAudience: "",
    budget: "",
    startDate: "",
    endDate: "",
    advertDescription: "",
    destinationUrl: "",
    assetUrl: "",
    additionalNotes: "",
    consent: false,
  });

  submitError.value = "";
  submitted.value = false;
};

const openDialog = () => {
  resetForm();
  isDialogOpen.value = true;
};

const closeDialog = () => {
  if (isSubmitting.value) return;
  isDialogOpen.value = false;
};

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === "Escape" && isDialogOpen.value) {
    closeDialog();
  }
};

watch(isDialogOpen, (open) => {
  if (typeof document === "undefined") return;

  document.body.style.overflow = open ? "hidden" : "";

  if (open) {
    window.addEventListener("keydown", handleEscape);
  } else {
    window.removeEventListener("keydown", handleEscape);
  }
});

onBeforeUnmount(() => {
  if (typeof document !== "undefined") {
    document.body.style.overflow = "";
  }
  window.removeEventListener("keydown", handleEscape);
});


const submitEnquiry = async () => {
  submitError.value = "";

  if (form.startDate && form.endDate && form.endDate < form.startDate) {
    submitError.value =
      "Your campaign end date must be after its start date.";
    return;
  }

  if (!form.consent) {
    submitError.value =
      "Please accept the consent notice before submitting.";
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await $fetch<{
      success: boolean;
      message: string;
      enquiryId?: string;
    }>("/api/advert-enquiries", {
      method: "POST",
      body: {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        businessName: form.businessName,
        website: form.website,
        industry: form.industry,
        advertType: form.advertType,
        advertDescription: form.advertDescription,
        campaignGoal: form.campaignGoal,
        targetAudience: form.targetAudience,
        placement: form.placement,
        budget: form.budget,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
        destinationUrl: form.destinationUrl,
        assetUrl: form.assetUrl,
        additionalNotes: form.additionalNotes,
        consent: form.consent,
      },
    });

    if (!response.success) {
      throw new Error(
        response.message || "We couldn't submit your enquiry."
      );
    }

    submitted.value = true;
  } catch (error: unknown) {
    const err = error as {
      data?: {
        statusMessage?: string;
        message?: string;
      };
      statusMessage?: string;
      message?: string;
    };

    submitError.value =
      err.data?.statusMessage ||
      err.data?.message ||
      err.statusMessage ||
      err.message ||
      "Something went wrong. Please try again shortly.";
  } finally {
    isSubmitting.value = false;
  }
};

</script>

<template>
  <section
    id="bulletin-advert"
    class="relative isolate overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:py-20"
    aria-labelledby="bulletin-heading"
  >
    <div
      class="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-[#C8A77A]/25 bg-[#190A10] shadow-[0_30px_100px_rgba(0,0,0,0.22)]"
    >
      <div
        class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_10%_0%,rgba(125,29,49,0.42),transparent_45%),radial-gradient(ellipse_at_100%_100%,rgba(200,167,122,0.12),transparent_42%)]"
      />

      <div
        class="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-[#C8A77A]/10 sm:h-96 sm:w-96"
      />
      <div
        class="pointer-events-none absolute -right-10 -top-14 h-52 w-52 rounded-full border border-[#C8A77A]/10 sm:h-72 sm:w-72"
      />

      <div
        class="grid items-center gap-10 p-6 sm:p-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 lg:p-14"
      >
        <div class="relative z-10">
          <div
            class="inline-flex items-center gap-2 rounded-full border border-[#C8A77A]/25 bg-[#C8A77A]/[0.07] px-3.5 py-2"
          >
            <span
              class="text-[9px] font-medium uppercase tracking-[0.24em] text-[#D7B98E]"
            >
              The CleoAstro Bulletin
            </span>
          </div>

          <h2
            id="bulletin-heading"
            class="mt-7 max-w-2xl font-serif text-4xl leading-[1.08] tracking-tight text-[#F7EEE8] sm:text-5xl lg:text-6xl"
          >
            Your brand
            <span class="block italic text-[#D7B98E]">
              deserves to be seen.
            </span>
          </h2>

          <p
            class="mt-6 max-w-xl text-sm leading-7 text-[#E2CDD0]/75 sm:text-base sm:leading-8"
          >
            Bring your products, services, and ideas to a community exploring
            astrology, self-discovery, and intentional living. Reserve a featured
            advert placement on the CleoAstro platform.
          </p>

          <div class="mt-7 flex flex-wrap gap-x-5 gap-y-3">
            <div class="flex items-center gap-2 text-xs text-[#E2CDD0]/70">
              <Star class="h-3.5 w-3.5 text-[#C8A77A]" />
              Product promotions
            </div>
            <div class="flex items-center gap-2 text-xs text-[#E2CDD0]/70">
              <Star class="h-3.5 w-3.5 text-[#C8A77A]" />
              Brand visibility
            </div>
            <div class="flex items-center gap-2 text-xs text-[#E2CDD0]/70">
              <Star class="h-3.5 w-3.5 text-[#C8A77A]" />
              Featured placements
            </div>
          </div>

          <button
            type="button"
            class="group mt-9 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#C8A77A] px-6 py-3 text-sm font-semibold text-[#241018] transition duration-300 hover:bg-[#E2C69D] focus:outline-none focus:ring-2 focus:ring-[#C8A77A] focus:ring-offset-2 focus:ring-offset-[#190A10]"
            @click="openDialog"
          >
            Enquire About Advertising
            <ArrowUpRight
              class="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </button>

          <p class="mt-3 text-[10px] tracking-wide text-[#C58B92]/65">
            Ask about placement options and advertising opportunities.
          </p>
        </div>

        <div class="relative mx-auto w-full max-w-md">
          <div
            class="absolute -inset-3 rounded-[1.75rem] border border-[#C8A77A]/10"
          />

          <div
            class="relative flex min-h-[310px] flex-col items-center justify-center overflow-hidden rounded-[1.5rem] border border-[#C8A77A]/30 bg-gradient-to-br from-[#42141F] via-[#2A0D17] to-[#16080E] px-6 py-10 text-center sm:min-h-[350px] sm:px-9"
          >
            <div
              class="pointer-events-none absolute inset-3 rounded-[1.15rem] border border-[#C8A77A]/10"
            />

            <div
              class="absolute left-8 top-8 h-1.5 w-1.5 rounded-full bg-[#D7B98E]"
            />
            <div
              class="absolute right-10 top-16 h-1 w-1 rounded-full bg-[#D7B98E]/70"
            />
            <div
              class="absolute bottom-14 left-12 h-1 w-1 rounded-full bg-[#D7B98E]/60"
            />

            <div
              class="flex h-14 w-14 items-center justify-center rounded-full border border-[#C8A77A]/30 bg-[#C8A77A]/[0.08]"
            >
              <Megaphone class="h-6 w-6 text-[#D7B98E]" />
            </div>

            <p
              class="mt-6 text-[9px] uppercase tracking-[0.3em] text-[#D7B98E]/80"
            >
              A space for your brand
            </p>

            <h3
              class="mt-4 font-serif text-3xl leading-tight text-[#F7EEE8] sm:text-4xl"
            >
              Your advert
              <span class="block italic text-[#D7B98E]">could be here.</span>
            </h3>

            <p class="mt-4 max-w-xs text-sm leading-6 text-[#E2CDD0]/65">
              Showcase your next product, service, launch, or special offer.
            </p>

            <button
              type="button"
              class="mt-7 inline-flex items-center gap-2 text-xs font-medium text-[#D7B98E] transition hover:text-[#F1D9B1]"
              @click="openDialog"
            >
              Reserve your advert space
              <ArrowRight class="h-3.5 w-3.5" />
            </button>
          </div>

          <div class="mt-5 flex items-center justify-center gap-2 text-center">
            <p class="text-[10px] text-[#C58B92]/65">
              Featured placement enquiries are now welcome.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Advertising enquiry dialog -->
    <Teleport to="body">
      <Transition
        enter-active-class="duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isDialogOpen"
          class="fixed inset-0 z-[100] flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          @click.self="closeDialog"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="advert-dialog-title"
            class="relative flex max-h-[95dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[1.5rem] border border-[#C8A77A]/25 bg-[#190A10] shadow-2xl sm:max-h-[90dvh] sm:rounded-[1.5rem]"
          >
            <!-- Dialog header -->
            <div
              class="relative shrink-0 overflow-hidden border-b border-[#C8A77A]/15 bg-gradient-to-r from-[#42141F] to-[#241019] px-5 py-5 sm:px-8 sm:py-6"
            >
              <div
                class="pointer-events-none absolute -right-10 -top-20 h-48 w-48 rounded-full border border-[#C8A77A]/10"
              />

              <div class="relative flex items-start justify-between gap-4">
                <div>
                  <div class="flex items-center gap-2">
                    <Megaphone class="h-4 w-4 text-[#D7B98E]" />
                    <p
                      class="text-[9px] font-medium uppercase tracking-[0.24em] text-[#D7B98E]"
                    >
                      CleoAstro Bulletin
                    </p>
                  </div>

                  <h2
                    id="advert-dialog-title"
                    class="mt-3 font-serif text-2xl text-[#F7EEE8] sm:text-3xl"
                  >
                    {{ submitted ? "Enquiry received" : "Let's feature your brand." }}
                  </h2>

                  <p class="mt-2 max-w-xl text-xs leading-5 text-[#E2CDD0]/70 sm:text-sm">
                    {{
                      submitted
                        ? "Thank you for your interest in advertising on CleoAstro."
                        : "Tell us about your business and the advert you have in mind."
                    }}
                  </p>
                </div>

                <button
                  type="button"
                  aria-label="Close advertising enquiry dialog"
                  class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#C8A77A]/20 text-[#E2CDD0]/70 transition hover:bg-white/5 hover:text-white"
                  @click="closeDialog"
                >
                  <X class="h-4 w-4" />
                </button>
              </div>
            </div>

            <!-- Success state -->
            <div
              v-if="submitted"
              class="flex-1 overflow-y-auto px-5 py-12 text-center sm:px-10 sm:py-16"
            >
              <div
                class="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#C8A77A]/30 bg-[#C8A77A]/10"
              >
                <CheckCircle2 class="h-8 w-8 text-[#D7B98E]" />
              </div>

              <h3 class="mt-6 font-serif text-2xl text-[#F7EEE8]">
                Thank you for reaching out.
              </h3>

              <p class="mx-auto mt-3 max-w-md text-sm leading-7 text-[#E2CDD0]/70">
                Your advertising enquiry has been submitted. The CleoAstro team
                can review your requirements and discuss suitable placements,
                pricing, and next steps.
              </p>

              <button
                type="button"
                class="mt-8 rounded-full bg-[#C8A77A] px-7 py-3 text-sm font-semibold text-[#241018] transition hover:bg-[#E2C69D]"
                @click="closeDialog"
              >
                Done
              </button>
            </div>

            <!-- Form -->
            <form
              v-else
              class="min-h-0 flex-1 overflow-y-auto"
              @submit.prevent="submitEnquiry"
            >
              <div class="space-y-8 px-5 py-6 sm:px-8 sm:py-8">
                <!-- Contact -->
                <section>
                  <div class="mb-4">
                    <p class="text-[9px] uppercase tracking-[0.2em] text-[#C8A77A]">
                      01 / Your details
                    </p>
                    <h3 class="mt-1 font-serif text-xl text-[#F7EEE8]">
                      Who should we contact?
                    </h3>
                  </div>

                  <div class="grid gap-4 sm:grid-cols-2">
                    <label class="block">
                      <span class="mb-2 block text-xs text-[#E2CDD0]/80">
                        Full name <span class="text-[#D7B98E]">*</span>
                      </span>
                      <input
                        v-model.trim="form.fullName"
                        required
                        autocomplete="name"
                        maxlength="120"
                        placeholder="Your full name"
                        class="advert-input"
                      />
                    </label>

                    <label class="block">
                      <span class="mb-2 block text-xs text-[#E2CDD0]/80">
                        Business email <span class="text-[#D7B98E]">*</span>
                      </span>
                      <input
                        v-model.trim="form.email"
                        required
                        type="email"
                        autocomplete="email"
                        maxlength="254"
                        placeholder="you@company.com"
                        class="advert-input"
                      />
                    </label>

                    <label class="block">
                      <span class="mb-2 block text-xs text-[#E2CDD0]/80">
                        Phone / WhatsApp
                      </span>
                      <input
                        v-model.trim="form.phone"
                        type="tel"
                        autocomplete="tel"
                        maxlength="40"
                        placeholder="+234..."
                        class="advert-input"
                      />
                    </label>

                    <label class="block">
                      <span class="mb-2 block text-xs text-[#E2CDD0]/80">
                        Business or brand name <span class="text-[#D7B98E]">*</span>
                      </span>
                      <input
                        v-model.trim="form.businessName"
                        required
                        maxlength="160"
                        placeholder="Your brand name"
                        class="advert-input"
                      />
                    </label>

                    <label class="block sm:col-span-2">
                      <span class="mb-2 block text-xs text-[#E2CDD0]/80">
                        Business website or social profile
                      </span>
                      <input
                        v-model.trim="form.website"
                        type="url"
                        maxlength="500"
                        placeholder="https://..."
                        class="advert-input"
                      />
                    </label>
                  </div>
                </section>

                <div class="h-px bg-[#C8A77A]/10" />

                <!-- Campaign -->
                <section>
                  <div class="mb-4">
                    <p class="text-[9px] uppercase tracking-[0.2em] text-[#C8A77A]">
                      02 / Your campaign
                    </p>
                    <h3 class="mt-1 font-serif text-xl text-[#F7EEE8]">
                      What would you like to promote?
                    </h3>
                  </div>

                  <div class="grid gap-4 sm:grid-cols-2">
                    <label class="block">
                      <span class="mb-2 block text-xs text-[#E2CDD0]/80">
                        Industry / business category <span class="text-[#D7B98E]">*</span>
                      </span>
                      <select
                        v-model="form.industry"
                        required
                        class="advert-input"
                      >
                        <option value="" disabled>Select a category</option>
                        <option value="Wellness">Wellness & lifestyle</option>
                        <option value="Astrology">Astrology & spiritual services</option>
                        <option value="Beauty">Beauty & personal care</option>
                        <option value="Fashion">Fashion & accessories</option>
                        <option value="Food">Food & beverages</option>
                        <option value="Education">Education & coaching</option>
                        <option value="Technology">Technology & digital products</option>
                        <option value="Retail">Retail & consumer products</option>
                        <option value="Professional services">Professional services</option>
                        <option value="Other">Other</option>
                      </select>
                    </label>

                    <label class="block">
                      <span class="mb-2 block text-xs text-[#E2CDD0]/80">
                        What are you advertising? <span class="text-[#D7B98E]">*</span>
                      </span>
                      <select
                        v-model="form.advertType"
                        required
                        class="advert-input"
                      >
                        <option value="" disabled>Select advert type</option>
                        <option value="Product">Physical product</option>
                        <option value="Service">Service</option>
                        <option value="Event">Event or workshop</option>
                        <option value="Course">Course or programme</option>
                        <option value="App">App or digital product</option>
                        <option value="Offer">Special offer or launch</option>
                        <option value="Other">Other</option>
                      </select>
                    </label>

                    <label class="block sm:col-span-2">
                      <span class="mb-2 block text-xs text-[#E2CDD0]/80">
                        Describe your product, service, or offer
                        <span class="text-[#D7B98E]">*</span>
                      </span>
                      <textarea
                        v-model.trim="form.advertDescription"
                        required
                        minlength="10"
                        maxlength="3000"
                        rows="4"
                        placeholder="What are you promoting, and what makes it valuable to your customers?"
                        class="advert-input min-h-28 resize-y"
                      />
                    </label>

                    <label class="block sm:col-span-2">
                      <span class="mb-2 block text-xs text-[#E2CDD0]/80">
                        What is the main goal of your campaign?
                      </span>
                      <select
                        v-model="form.campaignGoal"
                        class="advert-input"
                      >
                        <option value="">Select your main goal</option>
                        <option value="Sales">Generate sales</option>
                        <option value="Leads">Get enquiries or leads</option>
                        <option value="Awareness">Increase brand awareness</option>
                        <option value="Traffic">Drive website traffic</option>
                        <option value="Registrations">Get registrations or bookings</option>
                        <option value="Launch">Promote a launch or event</option>
                        <option value="Other">Other</option>
                      </select>
                    </label>

                    <label class="block sm:col-span-2">
                      <span class="mb-2 block text-xs text-[#E2CDD0]/80">
                        Who is your target audience?
                      </span>
                      <textarea
                        v-model.trim="form.targetAudience"
                        rows="2"
                        maxlength="1000"
                        placeholder="Audience, location, or customer group"
                        class="advert-input resize-y"
                      />
                    </label>
                  </div>
                </section>

                <div class="h-px bg-[#C8A77A]/10" />

                <!-- Placement -->
                <section>
                  <div class="mb-4">
                    <p class="text-[9px] uppercase tracking-[0.2em] text-[#C8A77A]">
                      03 / Placement and budget
                    </p>
                    <h3 class="mt-1 font-serif text-xl text-[#F7EEE8]">
                      Plan your advert
                    </h3>
                    <p class="mt-2 text-xs leading-5 text-[#E2CDD0]/60">
                      These preferences help us prepare a suitable proposal.
                      Pricing and availability will be confirmed by CleoAstro.
                    </p>
                  </div>

                  <div class="grid gap-4 sm:grid-cols-2">
                    <label class="block sm:col-span-2">
                      <span class="mb-2 block text-xs text-[#E2CDD0]/80">
                        Preferred placement <span class="text-[#D7B98E]">*</span>
                      </span>
                      <select
                        v-model="form.placement"
                        required
                        class="advert-input"
                      >
                        <option value="featured">Featured bulletin advert</option>
                        <option value="homepage">Homepage placement</option>
                        <option value="product">Product or service spotlight</option>
                        <option value="event">Event or launch promotion</option>
                        <option value="recommendation">Recommend the best option</option>
                      </select>
                    </label>

                    <label class="block">
                      <span class="mb-2 block text-xs text-[#E2CDD0]/80">
                        Estimated advertising budget
                      </span>
                      <select
                        v-model="form.budget"
                        class="advert-input"
                      >
                        <option value="">Not decided yet</option>
                        <option value="Under 50000">Under ₦50,000</option>
                        <option value="50000-150000">₦50,000–₦150,000</option>
                        <option value="150000-500000">₦150,000–₦500,000</option>
                        <option value="500000+">₦500,000+</option>
                        <option value="USD">Prefer to discuss in USD</option>
                      </select>
                    </label>

                    <label class="block">
                      <span class="mb-2 block text-xs text-[#E2CDD0]/80">
                        Desired campaign start
                      </span>
                      <input
                        v-model="form.startDate"
                        type="date"
                        :min="minDate"
                        class="advert-input"
                      />
                    </label>

                    <label class="block">
                      <span class="mb-2 block text-xs text-[#E2CDD0]/80">
                        Desired campaign end
                      </span>
                      <input
                        v-model="form.endDate"
                        type="date"
                        :min="form.startDate || minDate"
                        class="advert-input"
                      />
                    </label>

                    <label class="block sm:col-span-2">
                      <span class="mb-2 block text-xs text-[#E2CDD0]/80">
                        Destination link for interested visitors
                      </span>
                      <input
                        v-model.trim="form.destinationUrl"
                        type="url"
                        maxlength="500"
                        placeholder="https://yourwebsite.com/product"
                        class="advert-input"
                      />
                    </label>

                    <label class="block sm:col-span-2">
                      <span class="mb-2 block text-xs text-[#E2CDD0]/80">
                        Link to existing advert artwork or brand assets
                      </span>
                      <input
                        v-model.trim="form.assetUrl"
                        type="url"
                        maxlength="500"
                        placeholder="A public link to your image, video, or advert design"
                        class="advert-input"
                      />
                      <span class="mt-2 block text-[10px] leading-5 text-[#C58B92]/60">
                        Share a link only if the file is accessible to the team.
                        Do not enter passwords or private account links.
                      </span>
                    </label>

                    <label class="block sm:col-span-2">
                      <span class="mb-2 block text-xs text-[#E2CDD0]/80">
                        Anything else we should know?
                      </span>
                      <textarea
                        v-model.trim="form.additionalNotes"
                        rows="3"
                        maxlength="2000"
                        placeholder="Special requirements, preferred formats, or questions"
                        class="advert-input resize-y"
                      />
                    </label>
                  </div>
                </section>

                <!-- Consent -->
                <div
                  class="rounded-xl border border-[#C8A77A]/15 bg-[#C8A77A]/[0.04] p-4"
                >
                  <label class="flex cursor-pointer items-start gap-3">
                    <input
                      v-model="form.consent"
                      required
                      type="checkbox"
                      class="mt-1 h-4 w-4 shrink-0 accent-[#C8A77A]"
                    />
                    <span class="text-xs leading-6 text-[#E2CDD0]/75">
                      I agree that CleoAstro may use these details to contact me
                      about this advertising enquiry. I understand that submitting
                      this form does not confirm a booking or guarantee placement.
                      <span class="text-[#D7B98E]">*</span>
                    </span>
                  </label>
                </div>

                <p
                  v-if="submitError"
                  role="alert"
                  class="rounded-xl border border-red-400/20 bg-red-950/30 px-4 py-3 text-sm leading-6 text-red-200"
                >
                  {{ submitError }}
                </p>
              </div>

              <!-- Sticky footer -->
              <div
                class="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-[#C8A77A]/15 bg-[#190A10]/95 px-5 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-8"
              >
                <p class="text-[10px] leading-5 text-[#C58B92]/60">
                  * Required fields
                  <span class="hidden sm:inline"> · No payment is taken here</span>
                </p>

                <div class="flex gap-3">
                  <button
                    type="button"
                    class="flex-1 rounded-full border border-[#C8A77A]/20 px-5 py-3 text-xs text-[#E2CDD0]/80 transition hover:bg-white/5 sm:flex-none"
                    :disabled="isSubmitting"
                    @click="closeDialog"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    :disabled="isSubmitting"
                    class="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#C8A77A] px-6 py-3 text-xs font-semibold text-[#241018] transition hover:bg-[#E2C69D] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
                  >
                    {{ isSubmitting ? "Submitting..." : "Submit enquiry" }}
                    <ArrowRight v-if="!isSubmitting" class="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
.advert-input {
  width: 100%;
  min-height: 46px;
  border: 1px solid rgb(200 167 122 / 18%);
  border-radius: 0.75rem;
  background: rgb(38 16 24 / 75%);
  padding: 0.75rem 0.875rem;
  color: #f7eee8;
  font-size: 0.8125rem;
  outline: none;
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease,
    background-color 180ms ease;
}

.advert-input::placeholder {
  color: rgb(197 139 146 / 45%);
}

.advert-input:focus {
  border-color: rgb(200 167 122 / 65%);
  background: rgb(38 16 24 / 95%);
  box-shadow: 0 0 0 3px rgb(200 167 122 / 8%);
}

.advert-input:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.advert-input option {
  background: #190a10;
  color: #f7eee8;
}
</style>

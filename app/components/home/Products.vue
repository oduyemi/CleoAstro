
<script setup lang="ts">
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Sparkles,
} from "lucide-vue-next";
import { computed, ref } from "vue";
import { Button } from "@/components/ui/button";
import { PRODUCT_CATALOG } from "../../../server/utils/productCatalog";

interface Product {
  slug: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  number: string;
  featured?: boolean;
}

const products: Product[] = PRODUCT_CATALOG.map((product) => ({
  ...product,
}));

// Product navigation
const activeProduct = ref(0);

const currentProduct = computed<Product>(() => {
  return products[activeProduct.value] ?? products[0]!;
});

const productCount = computed(() => products.length);

const nextProduct = () => {
  if (!products.length) return;

  activeProduct.value = (activeProduct.value + 1) % products.length;
};

const previousProduct = () => {
  if (!products.length) return;

  activeProduct.value =
    (activeProduct.value - 1 + products.length) % products.length;
};

const selectProduct = (index: number) => {
  if (index >= 0 && index < products.length) {
    activeProduct.value = index;
  }
};

// Price formatting
const formatPrice = (price: number) =>
  `₦${price.toLocaleString("en-NG")}`;

// Checkout state
const purchaseOpen = ref(false);
const purchaseSubmitting = ref(false);
const purchaseError = ref("");
const purchaseSuccess = ref(false);

const quantity = ref(1);

const customerName = ref("");
const customerEmail = ref("");
const customerPhone = ref("");
const deliveryAddress = ref("");
const deliveryNotes = ref("");
const transferReference = ref("");
const orderReference = ref("");

const bankDetails = {
  bankName: "PalmPay",
  accountName: "CLEOASTRO(Samuel)",
  accountNumber: "8995618317",
};

// Order calculations
const productSlug = computed(() => currentProduct.value.slug);

const orderTotal = computed(
  () => currentProduct.value.price * quantity.value,
);

const formattedOrderTotal = computed(() => formatPrice(orderTotal.value));

// Checkout actions
const openPurchase = () => {
  purchaseOpen.value = true;
  purchaseError.value = "";
  purchaseSuccess.value = false;
  quantity.value = 1;
};

const closePurchase = () => {
  if (purchaseSubmitting.value) return;

  purchaseOpen.value = false;
};

const submitProductOrder = async () => {
  if (purchaseSubmitting.value) return;

  purchaseSubmitting.value = true;
  purchaseError.value = "";

  try {
    const response = await $fetch<{
      success: boolean;
      message: string;
      data: {
        reference: string;
        totalAmount: number;
      };
    }>("/api/products/orders", {
      method: "POST",
      body: {
        productSlug: productSlug.value,
        quantity: quantity.value,
        fullName: customerName.value.trim(),
        email: customerEmail.value.trim(),
        phone: customerPhone.value.trim(),
        deliveryAddress: deliveryAddress.value.trim(),
        deliveryNotes: deliveryNotes.value.trim(),
        transferReference: transferReference.value.trim(),
      },
    });

    orderReference.value = response.data.reference;
    purchaseSuccess.value = true;
  } catch (error: any) {
    purchaseError.value =
      error?.data?.statusMessage ||
      error?.data?.message ||
      "We could not submit your order. Please try again.";
  } finally {
    purchaseSubmitting.value = false;
  }
};

// Collection navigation
const scrollToCollection = () => {
  document.getElementById("product-selector")?.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
};

// Bank details
const copyProductAccountNumber = async () => {
  if (!import.meta.client) return;

  try {
    await navigator.clipboard.writeText(bankDetails.accountNumber);
  } catch {
    purchaseError.value = "Unable to copy the account number.";
  }
};
</script>

<template>
  <section
    id="products"
    class="relative overflow-hidden bg-transparent py-24 text-[#F1E8E3] sm:py-32 lg:py-40"
  >
    <!-- =========================================================
         ATMOSPHERE
    ========================================================== -->

    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0"
    >
      <div
        class="absolute left-[-15%] top-[10%] h-[600px] w-[600px] rounded-full bg-[#6B0F1A]/[0.09] blur-[170px]"
      />

      <div
        class="absolute bottom-[-15%] right-[-10%] h-[550px] w-[550px] rounded-full bg-[#42141F]/[0.13] blur-[160px]"
      />

      <div
        class="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7E3541]/[0.035] blur-[160px]"
      />

      <div
        class="absolute left-0 right-0 top-[15%] h-px bg-gradient-to-r from-transparent via-[#C58B92]/10 to-transparent"
      />
    </div>

    <!-- Grain -->

    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 opacity-[0.018]"
      style="
        background-image: url(&quot;data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.6'/%3E%3C/svg%3E&quot;);
      "
    />

    <div class="relative mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-10">

      <!-- =======================================================
           HEADER
      ======================================================== -->

      <div
        class="relative mb-12 flex flex-col gap-8 sm:mb-16 lg:mb-20 lg:flex-row lg:items-end lg:justify-between"
      >
        <div
          aria-hidden="true"
          class="pointer-events-none absolute -inset-x-8 -inset-y-8 -z-10 rounded-[3rem] bg-[#160B10]/20 backdrop-blur-[18px]"
        />

        <div>
          <div class="mb-5 flex items-center gap-4">
            <span
              class="font-mono text-[9px] tracking-[0.35em] text-[#C8A77A]/70"
            >
              04
            </span>

            <div class="h-px w-10 bg-[#C58B92]/25" />

            <span
              class="text-[9px] uppercase tracking-[0.35em] text-[#F1E8E3]/35"
            >
              The Shop
            </span>
          </div>

          <h2
            class="max-w-3xl font-serif text-[2.8rem] leading-[0.94] tracking-[-0.04em] text-[#F1E8E3] sm:text-6xl lg:text-7xl"
          >
            Objects for your
            <span class="text-[#F1E8E3]/30">
              inner world.
            </span>
          </h2>
        </div>

        <div class="max-w-md lg:pb-1">
          <p
            class="text-sm leading-7 text-[#F1E8E3]/50"
          >
            A small collection of thoughtfully chosen pieces for
            reflection, study, ritual, and everyday spiritual practice.
          </p>

          <button
            type="button"
            @click="scrollToCollection"
            class="group mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#C8A77A]/15 bg-[#C8A77A]/[0.04] px-4 text-[9px] uppercase tracking-[0.25em] text-[#C8A77A]/80 transition-all duration-300 hover:border-[#C8A77A]/35 hover:bg-[#C8A77A]/[0.08] hover:text-[#C8A77A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A77A]/40"
          >
            Explore collection

            <ArrowUpRight
              class="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </button>
        </div>
      </div>

      <!-- =======================================================
           FEATURED PRODUCT
      ======================================================== -->

      <div
        class="relative overflow-hidden rounded-[1.5rem] border border-[#C58B92]/[0.12] bg-[#1D0C13]/55 shadow-[0_30px_100px_rgba(0,0,0,0.18)] backdrop-blur-xl lg:grid lg:grid-cols-[1.15fr_0.85fr]"
      >
        <!-- IMAGE -->

        <div
          class="relative flex min-h-[400px] items-center justify-center overflow-hidden sm:min-h-[500px] lg:min-h-[650px]"
        >
          <!-- Glow -->

          <div
            aria-hidden="true"
            class="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6B0F1A]/20 blur-[100px] sm:h-[430px] sm:w-[430px]"
          />

          <!-- Large number -->

          <span
            class="pointer-events-none absolute -left-5 top-1/2 -translate-y-1/2 font-serif text-[12rem] leading-none text-[#F1E8E3]/[0.025] sm:text-[19rem]"
          >
            {{ currentProduct.number }}
          </span>

          <!-- Decorative frame -->

          <div
            class="absolute left-[7%] top-[8%] h-20 w-20 border-l border-t border-[#C58B92]/10 sm:h-28 sm:w-28"
          />

          <div
            class="absolute bottom-[10%] right-[7%] h-20 w-20 border-b border-r border-[#C58B92]/10 sm:h-28 sm:w-28"
          />

          <!-- Product image -->

          <div
            class="relative z-10 flex h-[340px] w-[260px] items-center justify-center sm:h-[470px] sm:w-[360px] lg:h-[520px] lg:w-[420px]"
          >
            <Transition
              mode="out-in"
              enter-active-class="transition duration-500 ease-out"
              enter-from-class="scale-95 opacity-0"
              enter-to-class="scale-100 opacity-100"
              leave-active-class="transition duration-300 ease-in"
              leave-from-class="scale-100 opacity-100"
              leave-to-class="scale-105 opacity-0"
            >
              <img
                :key="currentProduct.slug"
                :src="currentProduct.image"
                :alt="currentProduct.name"
                class="h-full w-full object-contain drop-shadow-[0_35px_60px_rgba(0,0,0,0.6)]"
              />
            </Transition>
          </div>

          <!-- Featured badge -->

          <div
            class="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-[#C8A77A]/15 bg-[#160B10]/45 px-3 py-2 backdrop-blur-md sm:left-7 sm:top-7"
          >
            <span
              class="h-1.5 w-1.5 rounded-full bg-[#C8A77A] shadow-[0_0_10px_rgba(200,167,122,0.8)]"
            />

            <span
              class="text-[8px] uppercase tracking-[0.25em] text-[#F1E8E3]/45"
            >
              Featured object
            </span>
          </div>

          <!-- Mobile navigation -->

          <div
            class="absolute bottom-5 left-5 right-5 flex items-center justify-between sm:bottom-7 sm:left-7 sm:right-7 lg:hidden"
          >
            <span
              class="font-mono text-[9px] tracking-[0.2em] text-[#F1E8E3]/35"
            >
              {{ currentProduct.number }} / {{ String(productCount).padStart(2, "0") }}
            </span>

            <div class="flex gap-2">
              <button
                type="button"
                @click="previousProduct"
                aria-label="Previous product"
                class="flex h-10 w-10 items-center justify-center rounded-full border border-[#C58B92]/15 bg-[#160B10]/40 text-[#F1E8E3]/55 backdrop-blur-md transition hover:border-[#C8A77A]/30 hover:text-[#F1E8E3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A77A]/40"
              >
                <ChevronLeft class="h-4 w-4" />
              </button>

              <button
                type="button"
                @click="nextProduct"
                aria-label="Next product"
                class="flex h-10 w-10 items-center justify-center rounded-full border border-[#C58B92]/15 bg-[#160B10]/40 text-[#F1E8E3]/55 backdrop-blur-md transition hover:border-[#C8A77A]/30 hover:text-[#F1E8E3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A77A]/40"
              >
                <ChevronRight class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- PRODUCT INFORMATION -->

        <div
          class="relative flex flex-col justify-between border-t border-[#C58B92]/10 p-7 sm:p-10 lg:border-l lg:border-t-0 lg:p-14 xl:p-16"
        >
          <div
            aria-hidden="true"
            class="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#6B0F1A]/[0.04] via-transparent to-[#C8A77A]/[0.025]"
          />

          <div class="relative">
            <!-- Top information -->

            <div class="flex items-center justify-between">
              <span
                class="font-mono text-[10px] tracking-[0.3em] text-[#C8A77A]/65"
              >
                {{ currentProduct.number }}
              </span>

              <span
                class="flex items-center gap-2 rounded-full border border-[#C58B92]/10 px-3 py-1.5 text-[8px] uppercase tracking-[0.2em] text-[#F1E8E3]/30"
              >
                <span
                  class="h-1.5 w-1.5 rounded-full bg-emerald-400/70"
                />

                Available
              </span>
            </div>

            <!-- Main content -->

            <div class="my-10 sm:my-14">
              <p
                class="text-[9px] uppercase tracking-[0.32em] text-[#C8A77A]/70"
              >
                {{ currentProduct.category }}
              </p>

              <h3
                class="mt-4 max-w-md font-serif text-[2.25rem] leading-[1] tracking-[-0.025em] text-[#F1E8E3] sm:text-5xl"
              >
                {{ currentProduct.name }}
              </h3>

              <p
                class="mt-6 max-w-md text-sm leading-7 text-[#F1E8E3]/48"
              >
                {{ currentProduct.description }}
              </p>

              <!-- Price -->

              <div
                class="mt-8 flex items-baseline gap-3"
              >
                <span
                  class="font-serif text-3xl tracking-[-0.02em] text-[#F1E8E3] sm:text-4xl"
                >
                  {{ currentProduct.price }}
                </span>

                <span
                  class="text-[8px] uppercase tracking-[0.25em] text-[#F1E8E3]/25"
                >
                  NGN
                </span>
              </div>
            </div>

            <!-- CTA -->

            <div>
              <Button
                type="button"
                @click="openPurchase"
                class="group h-13 w-full rounded-full border border-[#C8A77A]/30 bg-[#6B0F1A] px-5 text-[10px] uppercase tracking-[0.18em] text-[#F1E8E3] shadow-[0_15px_40px_rgba(107,15,26,0.22)] transition-all duration-500 hover:bg-[#7E3541] hover:shadow-[0_18px_50px_rgba(107,15,26,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A77A]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#160B10]"
              >
                <ShoppingBag class="mr-2 h-4 w-4" />

                Add to collection

                <ArrowUpRight
                  class="ml-auto h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Button>

              <p
                class="mt-4 text-center text-[8px] uppercase tracking-[0.18em] text-[#F1E8E3]/20"
              >
                Secure checkout · Carefully packaged
              </p>
            </div>
          </div>

          <!-- Desktop product navigation -->

          <div
            class="relative mt-10 hidden items-center justify-between border-t border-[#C58B92]/10 pt-6 lg:flex"
          >
            <div>
              <p
                class="text-[8px] uppercase tracking-[0.25em] text-[#F1E8E3]/20"
              >
                Browse collection
              </p>

              <p
                class="mt-1 font-mono text-[9px] tracking-[0.2em] text-[#C8A77A]/55"
              >
                {{ currentProduct.number }}
                /
                {{ String(productCount).padStart(2, "0") }}
              </p>
            </div>

            <div class="flex gap-2">
              <button
                type="button"
                @click="previousProduct"
                aria-label="Previous product"
                class="flex h-10 w-10 items-center justify-center rounded-full border border-[#C58B92]/10 text-[#F1E8E3]/35 transition hover:border-[#C8A77A]/30 hover:text-[#F1E8E3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A77A]/40"
              >
                <ChevronLeft class="h-4 w-4" />
              </button>

              <button
                type="button"
                @click="nextProduct"
                aria-label="Next product"
                class="flex h-10 w-10 items-center justify-center rounded-full border border-[#C58B92]/10 text-[#F1E8E3]/35 transition hover:border-[#C8A77A]/30 hover:text-[#F1E8E3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A77A]/40"
              >
                <ChevronRight class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- =======================================================
           PRODUCT SELECTOR
      ======================================================== -->

      <div
        id="product-selector"
        class="relative mt-5"
      >
        <div
          class="mb-4 flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <Sparkles
              class="h-3.5 w-3.5 text-[#C8A77A]/60"
            />

            <span
              class="text-[8px] uppercase tracking-[0.3em] text-[#F1E8E3]/30"
            >
              Explore the collection
            </span>
          </div>

          <span
            class="hidden text-[8px] uppercase tracking-[0.25em] text-[#F1E8E3]/20 sm:block"
          >
            {{ productCount }} objects
          </span>
        </div>

        <!-- Horizontal selector -->

        <div
          class="flex gap-3 overflow-x-auto pb-3 scrollbar-none"
        >
          <button
            v-for="(product, index) in products"
            :key="product.slug"
            type="button"
            @click="selectProduct(index)"
            :aria-label="`View ${product.name}`"
            :aria-current="activeProduct === index ? 'true' : undefined"
            class="group relative min-w-[190px] flex-1 overflow-hidden rounded-xl border p-4 text-left transition-all duration-300 sm:min-w-[210px] lg:min-w-0"
            :class="
              activeProduct === index
                ? 'border-[#C8A77A]/30 bg-[#6B0F1A]/[0.12] shadow-[0_12px_35px_rgba(0,0,0,0.12)]'
                : 'border-[#C58B92]/[0.08] bg-[#1D0C13]/25 hover:border-[#C58B92]/[0.18] hover:bg-[#261018]/40'
            "
          >
            <!-- Active indicator -->

            <div
              class="absolute left-0 top-0 h-full w-[2px] bg-[#C8A77A] transition-opacity"
              :class="
                activeProduct === index
                  ? 'opacity-100'
                  : 'opacity-0'
              "
            />

            <div
              class="flex items-center justify-between"
            >
              <span
                class="font-mono text-[9px]"
                :class="
                  activeProduct === index
                    ? 'text-[#C8A77A]/80'
                    : 'text-[#C8A77A]/35'
                "
              >
                {{ product.number }}
              </span>

              <ArrowUpRight
                class="h-3.5 w-3.5 transition-all duration-300"
                :class="
                  activeProduct === index
                    ? 'text-[#C8A77A]/70'
                    : 'text-[#F1E8E3]/15 group-hover:text-[#C8A77A]/60'
                "
              />
            </div>

            <h4
              class="mt-5 line-clamp-1 font-serif text-lg transition-colors"
              :class="
                activeProduct === index
                  ? 'text-[#F1E8E3]'
                  : 'text-[#F1E8E3]/65 group-hover:text-[#F1E8E3]/90'
              "
            >
              {{ product.name }}
            </h4>

            <div
              class="mt-2 flex items-center justify-between gap-3"
            >
              <span
                class="line-clamp-1 text-[8px] uppercase tracking-[0.2em] text-[#F1E8E3]/25"
              >
                {{ product.category }}
              </span>

              <span
                class="shrink-0 font-serif text-sm text-[#F1E8E3]/45"
              >
                {{ formatPrice(product.price) }}
              </span>
            </div>
          </button>
        </div>
      </div>

      <!-- =======================================================
           BOTTOM STATEMENT
      ======================================================== -->

      <div
        class="mt-16 flex flex-col gap-6 border-t border-[#C58B92]/[0.08] pt-7 sm:mt-20 sm:flex-row sm:items-center sm:justify-between lg:mt-24"
      >
        <div class="flex items-center gap-4">
          <div
            class="flex h-8 w-8 items-center justify-center rounded-full border border-[#C8A77A]/15 bg-[#C8A77A]/[0.035]"
          >
            <Sparkles
              class="h-3.5 w-3.5 text-[#C8A77A]/55"
            />
          </div>

          <div>
            <p
              class="text-[9px] uppercase tracking-[0.28em] text-[#F1E8E3]/30"
            >
              Curated with intention
            </p>

            <p
              class="mt-1 text-xs text-[#F1E8E3]/20"
            >
              Objects chosen to accompany your journey.
            </p>
          </div>
        </div>

        <div
          class="flex items-center gap-3"
        >
          <span
            class="mr-2 font-mono text-[9px] tracking-[0.2em] text-[#F1E8E3]/20"
          >
            {{ currentProduct.number }}
            /
            {{ String(productCount).padStart(2, "0") }}
          </span>

          <button
            type="button"
            @click="previousProduct"
            class="flex h-10 w-10 items-center justify-center rounded-full border border-[#C58B92]/10 text-[#F1E8E3]/40 transition hover:border-[#C8A77A]/30 hover:bg-[#C8A77A]/[0.04] hover:text-[#F1E8E3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A77A]/40"
            aria-label="Previous product"
          >
            <ChevronLeft class="h-4 w-4" />
          </button>

          <button
            type="button"
            @click="nextProduct"
            class="flex h-10 w-10 items-center justify-center rounded-full border border-[#C58B92]/10 text-[#F1E8E3]/40 transition hover:border-[#C8A77A]/30 hover:bg-[#C8A77A]/[0.04] hover:text-[#F1E8E3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A77A]/40"
            aria-label="Next product"
          >
            <ChevronRight class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </section>

  
<Teleport to="body">
  <Transition name="donation-dialog">
    <div
      v-if="purchaseOpen"
      class="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-checkout-title"
      @click.self="closePurchase"
    >
      <div class="absolute inset-0 bg-[#080507]/85 backdrop-blur-md" />

      <div
        class="relative my-auto max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[1.75rem] border border-[#C58B92]/15 bg-[#160B10] text-[#F1E8E3] shadow-[0_35px_120px_rgba(0,0,0,.55)]"
      >
        <div class="flex items-start justify-between border-b border-[#C58B92]/10 px-6 py-6">
          <div>
            <p class="text-[9px] uppercase tracking-[0.28em] text-[#C8A77A]/65">
              Cleo Astro Shop
            </p>
            <h2
              id="product-checkout-title"
              class="mt-2 font-serif text-2xl"
            >
              {{ purchaseSuccess ? "Order received" : "Complete your order" }}
            </h2>
          </div>

          <button
            type="button"
            aria-label="Close checkout"
            :disabled="purchaseSubmitting"
            @click="closePurchase"
            class="flex h-9 w-9 items-center justify-center rounded-full border border-[#C58B92]/15 text-xl text-[#F1E8E3]/50 hover:text-[#F1E8E3] disabled:opacity-30"
          >
            ×
          </button>
        </div>

        <div v-if="!purchaseSuccess" class="space-y-6 p-6">
          <!-- Product summary -->
          <div class="flex items-center gap-4 rounded-2xl border border-[#C58B92]/10 bg-[#1D0C13] p-4">
            <div class="h-20 w-20 shrink-0 rounded-xl bg-[#261018] p-2">
              <img
                :src="currentProduct.image"
                :alt="currentProduct.name"
                class="h-full w-full object-contain"
              />
            </div>

            <div class="min-w-0 flex-1">
              <p class="text-[8px] uppercase tracking-[0.2em] text-[#C8A77A]/60">
                {{ currentProduct.category }}
              </p>
              <h3 class="mt-1 font-serif text-lg">
                {{ currentProduct.name }}
              </h3>
              <p class="mt-1 text-xs text-[#F1E8E3]/40">
                {{ formatPrice(currentProduct.price) }}
              </p>
            </div>
          </div>

          <!-- Quantity -->
          <div class="flex items-center justify-between">
            <label class="text-[9px] uppercase tracking-[0.2em] text-[#C8A77A]/60">
              Quantity
            </label>

            <div class="flex items-center gap-4">
              <button
                type="button"
                @click="quantity = Math.max(1, quantity - 1)"
                class="flex h-9 w-9 items-center justify-center rounded-full border border-[#C58B92]/15"
              >
                −
              </button>

              <span class="min-w-5 text-center font-mono text-sm">
                {{ quantity }}
              </span>

              <button
                type="button"
                @click="quantity = Math.min(20, quantity + 1)"
                class="flex h-9 w-9 items-center justify-center rounded-full border border-[#C58B92]/15"
              >
                +
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between border-t border-[#C58B92]/10 pt-4">
            <span class="text-[9px] uppercase tracking-[0.2em] text-[#F1E8E3]/40">
              Order total
            </span>
            <span class="font-serif text-2xl text-[#C8A77A]">
              {{ formattedOrderTotal }}
            </span>
          </div>

          <!-- Customer information -->
          <div class="space-y-4">
            <p class="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#C8A77A]/65">
              Your information
            </p>

            <input
              v-model="customerName"
              type="text"
              autocomplete="name"
              placeholder="Full name"
              required
              class="h-12 w-full rounded-xl border border-[#C58B92]/10 bg-[#1D0C13] px-4 text-sm outline-none placeholder:text-[#F1E8E3]/25 focus:border-[#C8A77A]/35"
            />

            <div class="grid gap-3 sm:grid-cols-2">
              <input
                v-model="customerEmail"
                type="email"
                autocomplete="email"
                placeholder="Email address"
                required
                class="h-12 min-w-0 w-full rounded-xl border border-[#C58B92]/10 bg-[#1D0C13] px-4 text-sm outline-none placeholder:text-[#F1E8E3]/25 focus:border-[#C8A77A]/35"
              />

              <input
                v-model="customerPhone"
                type="tel"
                autocomplete="tel"
                placeholder="Phone number"
                required
                class="h-12 min-w-0 w-full rounded-xl border border-[#C58B92]/10 bg-[#1D0C13] px-4 text-sm outline-none placeholder:text-[#F1E8E3]/25 focus:border-[#C8A77A]/35"
              />
            </div>

            <textarea
              v-model="deliveryAddress"
              rows="3"
              placeholder="Complete delivery address"
              required
              class="w-full resize-none rounded-xl border border-[#C58B92]/10 bg-[#1D0C13] p-4 text-sm outline-none placeholder:text-[#F1E8E3]/25 focus:border-[#C8A77A]/35"
            />

            <textarea
              v-model="deliveryNotes"
              rows="2"
              placeholder="Additional delivery instructions (optional)"
              class="w-full resize-none rounded-xl border border-[#C58B92]/10 bg-[#1D0C13] p-4 text-sm outline-none placeholder:text-[#F1E8E3]/25 focus:border-[#C8A77A]/35"
            />
          </div>

          <!-- Bank details -->
          <div class="rounded-2xl border border-[#C8A77A]/15 bg-[#1D0C13] p-5">
            <p class="text-[9px] uppercase tracking-[0.22em] text-[#C8A77A]/65">
              Bank transfer details
            </p>

            <div class="mt-4 space-y-3">
              <div class="flex justify-between gap-4 text-xs">
                <span class="text-[#F1E8E3]/35">Bank</span>
                <span>{{ bankDetails.bankName }}</span>
              </div>

              <div class="flex justify-between gap-4 text-xs">
                <span class="text-[#F1E8E3]/35">Account name</span>
                <span>{{ bankDetails.accountName }}</span>
              </div>

              <div class="flex justify-between gap-4 text-xs">
                <span class="text-[#F1E8E3]/35">Account number</span>
                <button
                  type="button"
                  class="font-mono text-[#C8A77A]"
                  @click="copyProductAccountNumber"
                >
                  {{ bankDetails.accountNumber }} · Copy
                </button>
              </div>

              <div class="flex justify-between gap-4 border-t border-[#C58B92]/10 pt-3 text-sm">
                <span class="text-[#F1E8E3]/45">Transfer amount</span>
                <span class="font-serif text-lg text-[#C8A77A]">
                  {{ formattedOrderTotal }}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label class="mb-2 block text-[9px] uppercase tracking-[0.22em] text-[#C8A77A]/65">
              Bank transfer reference *
            </label>

            <input
              v-model="transferReference"
              type="text"
              placeholder="Enter your transaction reference"
              required
              class="h-12 w-full rounded-xl border border-[#C58B92]/10 bg-[#1D0C13] px-4 text-sm outline-none placeholder:text-[#F1E8E3]/25 focus:border-[#C8A77A]/35"
            />
          </div>

          <p
            v-if="purchaseError"
            role="alert"
            class="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-xs leading-5 text-red-300"
          >
            {{ purchaseError }}
          </p>

          <button
            type="button"
            :disabled="
              purchaseSubmitting ||
              !customerName.trim() ||
              !customerEmail.trim() ||
              !customerPhone.trim() ||
              !deliveryAddress.trim() ||
              !transferReference.trim()
            "
            @click="submitProductOrder"
            class="flex h-14 w-full items-center justify-center rounded-full border border-[#C8A77A]/30 bg-[#6B0F1A] text-xs font-medium text-[#F1E8E3] transition-all hover:bg-[#7E3541] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {{
              purchaseSubmitting
                ? "Submitting order..."
                : "I've made the transfer"
            }}
          </button>

          <p class="text-center text-[9px] leading-5 text-[#F1E8E3]/25">
            Your order will be processed after payment verification.
          </p>
        </div>

        <!-- Success -->
        <div v-else class="px-6 py-12 text-center">
          <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#C8A77A]/25 bg-[#1D0C13]">
            <ShoppingBag class="h-8 w-8 text-[#C8A77A]" />
          </div>

          <p class="mt-7 text-[9px] uppercase tracking-[0.3em] text-[#C8A77A]/65">
            Thank you
          </p>

          <h3 class="mt-3 font-serif text-3xl">
            Your order has been received.
          </h3>

          <p class="mx-auto mt-4 max-w-sm text-sm leading-7 text-[#F1E8E3]/45">
            Your order is awaiting payment verification. We will follow up using the contact details you provided.
          </p>

          <div class="mt-7 rounded-xl border border-[#C8A77A]/15 bg-[#1D0C13] p-4">
            <p class="text-[8px] uppercase tracking-[0.2em] text-[#F1E8E3]/35">
              Order reference
            </p>
            <p class="mt-2 font-mono text-sm text-[#C8A77A]">
              {{ orderReference }}
            </p>
          </div>

          <button
            type="button"
            @click="closePurchase"
            class="mt-8 h-12 rounded-full border border-[#C58B92]/15 bg-[#261018] px-8 text-xs text-[#F1E8E3]/70 transition hover:bg-[#42141F]"
          >
            Return to collection
          </button>
        </div>
      </div>
    </div>
  </Transition>
</Teleport>

</template>
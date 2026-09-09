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

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  price: string;
  image: string;
  number: string;
  featured?: boolean;
}

const products: Product[] = [
  {
    id: 1,
    number: "01",
    name: "Goodluck Charm Necklace",
    category: "Spiritual Jewelry",
    description:
      "A meaningful everyday piece created as a personal symbol of intention, protection, and good fortune.",
    price: "₦45,000",
    image: "/images/products/goodluckcharm.webp",
  },
  {
    id: 2,
    number: "02",
    name: "Cleo Astro Signature Hoodie",
    category: "Apparel",
    description:
      "A premium statement hoodie inspired by the mystery of the stars and the journey within.",
    price: "₦65,000",
    image: "/images/products/hoodie.jpeg",
  },
  {
    id: 3,
    number: "03",
    name: "Cleo Astro T-Shirt",
    category: "Apparel",
    description:
      "A clean everyday essential carrying the Cleo Astro spirit wherever you go.",
    price: "₦35,000",
    image: "/images/products/astro-tshirt.png",
  },
  {
    id: 4,
    number: "04",
    name: "Cosmic Symbol T-Shirt",
    category: "Apparel",
    description:
      "A symbolic design inspired by celestial movement, intuition, and self-discovery.",
    price: "₦38,000",
    image: "/images/products/tshirt.jpeg",
  },
  {
    id: 5,
    number: "05",
    name: "Sacred Energy Hoodie",
    category: "Apparel",
    description:
      "A heavyweight hoodie designed around the idea of carrying your inner world with you.",
    price: "₦70,000",
    image: "/images/products/hoodie.jpeg",
  },
  {
    id: 6,
    number: "06",
    name: "Astrology Pendant",
    category: "Spiritual Jewelry",
    description:
      "A subtle celestial pendant designed as a wearable reminder to stay connected to your path.",
    price: "₦40,000",
    image: "/images/products/goodluckcharm.webp",
  },
  {
    id: 7,
    number: "07",
    name: "Moon Phase Necklace",
    category: "Spiritual Jewelry",
    description:
      "A celestial-inspired necklace reflecting the rhythm of cycles, change, and renewal.",
    price: "₦42,000",
    image: "/images/products/goodluckcharm.webp",
  },
  {
    id: 8,
    number: "08",
    name: "Cleo Astro Cap",
    category: "Accessories",
    description:
      "A minimal branded cap for everyday wear, finished with the Cleo Astro identity.",
    price: "₦25,000",
    image: "/images/products/cap.webp",
  },
  {
    id: 9,
    number: "09",
    name: "Cosmic Tote",
    category: "Accessories",
    description:
      "A practical everyday tote carrying a little piece of the cosmic world with you.",
    price: "₦22,000",
    image: "/images/products/tote.webp",
  },
  {
    id: 10,
    number: "10",
    name: "Celestial Journal",
    category: "Reflection",
    description:
      "A beautiful space for recording dreams, intentions, reflections, and the questions that matter.",
    price: "₦28,000",
    image: "/images/products/journal.webp",
  },
  {
    id: 11,
    number: "11",
    name: "Cleo Astro Bracelet",
    category: "Spiritual Jewelry",
    description:
      "A simple symbolic bracelet designed to become part of your everyday ritual.",
    price: "₦30,000",
    image: "/images/products/bracelet.webp",
  },
  {
    id: 12,
    number: "12",
    name: "Cosmic Gift Set",
    category: "Gift Set",
    description:
      "A curated collection of Cleo Astro pieces created for someone beginning their own journey of reflection.",
    price: "₦95,000",
    image: "/images/products/giftset.jpeg",
  },
];

const activeProduct = ref(0);

const currentProduct = computed<Product>(() => {
  const product = products[activeProduct.value];

  if (!product) {
    return products[0]!;
  }

  return product;
});

const nextProduct = () => {
  activeProduct.value =
    (activeProduct.value + 1) % products.length;
};

const previousProduct = () => {
  activeProduct.value =
    (activeProduct.value - 1 + products.length) % products.length;
};
</script>

<template>
  <section
    id="products"
    class="relative overflow-hidden bg-transparent py-28 text-[#F1E8E3] sm:py-36 lg:py-44"
  >
    <!-- =========================================================
         ATMOSPHERE
    ========================================================== -->

    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0"
    >
      <!-- Restrained burgundy glow -->
      <div
        class="absolute left-[-10%] top-[15%] h-[550px] w-[550px] rounded-full bg-[#6B0F1A]/[0.08] blur-[160px]"
      />

      <!-- Secondary wine glow -->
      <div
        class="absolute bottom-[-15%] right-[-10%] h-[500px] w-[500px] rounded-full bg-[#42141F]/[0.12] blur-[150px]"
      />

      <!-- Soft rose atmosphere -->
      <div
        class="absolute left-[45%] top-[45%] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7E3541]/[0.045] blur-[150px]"
      />

      <!-- Editorial horizon -->
      <div
        class="absolute left-0 right-0 top-[18%] h-px bg-gradient-to-r from-transparent via-[#C58B92]/10 to-transparent"
      />
    </div>

    <!-- =========================================================
         GRAIN
    ========================================================== -->

    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 opacity-[0.02]"
      style="
        background-image: url(&quot;data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.6'/%3E%3C/svg%3E&quot;);
      "
    />

    <div class="relative mx-auto max-w-[1400px] px-6 lg:px-10">
      <!-- =======================================================
           HEADER
      ======================================================== -->

      <div
        class="relative mb-16 flex flex-col gap-8 lg:mb-24 lg:flex-row lg:items-end lg:justify-between"
      >
        <!-- Readability layer -->
        <div
          aria-hidden="true"
          class="pointer-events-none absolute -inset-x-10 -inset-y-10 -z-10 rounded-[4rem] bg-[#160B10]/20 backdrop-blur-[18px]"
        />

        <div>
          <div class="mb-6 flex items-center gap-4">
            <span
              class="font-mono text-[9px] tracking-[0.35em] text-[#C8A77A]/60"
            >
              04
            </span>

            <div class="h-px w-10 bg-[#C58B92]/25" />

            <span
              class="text-[9px] uppercase tracking-[0.35em] text-[#F1E8E3]/30"
            >
              The Shop
            </span>
          </div>

          <h2
            class="max-w-3xl font-serif text-5xl leading-[0.95] tracking-[-0.035em] text-[#F1E8E3] sm:text-6xl lg:text-7xl"
          >
            Objects for your
            <span class="text-[#F1E8E3]/30">
              inner world.
            </span>
          </h2>
        </div>

        <div class="max-w-sm lg:pb-2">
          <p
            class="text-sm leading-7 text-[#F1E8E3]/45"
          >
            A small collection of thoughtfully chosen pieces for
            reflection, study, ritual, and everyday spiritual practice.
          </p>

          <button
            type="button"
            class="group mt-5 flex items-center gap-2 text-[9px] uppercase tracking-[0.28em] text-[#C8A77A]/70 transition hover:text-[#C8A77A]"
          >
            View the collection

            <ArrowUpRight
              class="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </button>
        </div>
      </div>

      <!-- =======================================================
           FEATURED PRODUCT
      ======================================================== -->

      <div
        class="relative grid min-h-[650px] overflow-hidden border border-[#C58B92]/[0.10] bg-[#1D0C13]/55 backdrop-blur-[12px] lg:grid-cols-[1.15fr_0.85fr]"
      >
        <!-- =====================================================
             IMAGE SIDE
        ====================================================== -->

        <div
          class="relative flex min-h-[430px] items-center justify-center overflow-hidden lg:min-h-[650px]"
        >
          <!-- Soft wine atmosphere -->
          <div
            aria-hidden="true"
            class="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6B0F1A]/[0.08] blur-[110px]"
          />

          <!-- Background number -->
          <span
            class="pointer-events-none absolute -left-5 top-1/2 -translate-y-1/2 font-serif text-[15rem] leading-none text-[#F1E8E3]/[0.025] sm:text-[20rem]"
          >
            {{ currentProduct.number }}
          </span>

          <!-- Decorative square -->
          <div
            class="absolute left-[8%] top-[10%] h-28 w-28 border border-[#C58B92]/[0.08]"
          />

          <!-- Secondary decorative line -->
          <div
            aria-hidden="true"
            class="absolute bottom-[12%] right-[10%] h-px w-20 bg-gradient-to-r from-transparent to-[#C8A77A]/25"
          />

          <!-- Image -->
          <div
            class="relative z-10 flex h-[390px] w-[300px] items-center justify-center sm:h-[470px] sm:w-[360px]"
          >
            <img
              :src="currentProduct.image"
              :alt="currentProduct.name"
              class="h-full w-full object-contain drop-shadow-[0_35px_60px_rgba(0,0,0,0.55)] transition-all duration-700"
            />
          </div>

          <!-- Image label -->
          <div
            class="absolute bottom-7 left-7 flex items-center gap-3"
          >
            <div
              class="h-1.5 w-1.5 rounded-full bg-[#C8A77A]"
            />

            <span
              class="text-[8px] uppercase tracking-[0.3em] text-[#F1E8E3]/30"
            >
              Featured object
            </span>
          </div>
        </div>

        <!-- =====================================================
             PRODUCT INFO
        ====================================================== -->

        <div
          class="relative flex flex-col justify-between border-t border-[#C58B92]/[0.10] p-8 sm:p-12 lg:border-l lg:border-t-0 lg:p-14 xl:p-16"
        >
          <!-- Localized readability blur -->
          <div
            aria-hidden="true"
            class="pointer-events-none absolute -inset-y-8 -right-8 -z-10 rounded-[3rem] bg-[#160B10]/20 backdrop-blur-[18px]"
          />

          <!-- Product number -->
          <div class="flex items-center justify-between">
            <span
              class="font-mono text-[10px] tracking-[0.3em] text-[#C8A77A]/60"
            >
              {{ currentProduct.number }}
            </span>

            <span
              class="text-[8px] uppercase tracking-[0.28em] text-[#F1E8E3]/20"
            >
              Available
            </span>
          </div>

          <!-- Main content -->
          <div class="my-12">
            <p
              class="text-[9px] uppercase tracking-[0.32em] text-[#C8A77A]/60"
            >
              {{ currentProduct.category }}
            </p>

            <h3
              class="mt-5 max-w-md font-serif text-4xl leading-[1.05] text-[#F1E8E3] sm:text-5xl"
            >
              {{ currentProduct.name }}
            </h3>

            <p
              class="mt-7 max-w-md text-sm leading-7 text-[#F1E8E3]/45"
            >
              {{ currentProduct.description }}
            </p>

            <!-- Price -->
            <div class="mt-10 flex items-end gap-3">
              <span
                class="font-serif text-3xl text-[#F1E8E3]"
              >
                {{ currentProduct.price }}
              </span>

              <span
                class="pb-1 text-[8px] uppercase tracking-[0.25em] text-[#F1E8E3]/20"
              >
                NGN
              </span>
            </div>
          </div>

          <!-- CTA -->
          <div>
            <Button
              type="button"
              class="group h-12 w-full rounded-full border border-[#C8A77A]/30 bg-[#6B0F1A] text-[10px] uppercase tracking-[0.2em] text-[#F1E8E3] shadow-[0_12px_36px_rgba(107,15,26,0.20)] transition-all duration-500 hover:bg-[#7E3541] hover:shadow-[0_16px_45px_rgba(107,15,26,0.30)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A77A]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#160B10]"
            >
              <ShoppingBag class="mr-2 h-4 w-4" />

              Add to collection

              <ArrowUpRight
                class="ml-auto h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Button>

            <p
              class="mt-4 text-center text-[8px] uppercase tracking-[0.2em] text-[#F1E8E3]/15"
            >
              Secure checkout · Carefully packaged
            </p>
          </div>
        </div>
      </div>

      <!-- =======================================================
           PRODUCT NAVIGATION
      ======================================================== -->

      <div class="mt-5 grid gap-4 sm:grid-cols-3">
              <div
          aria-hidden="true"
          class="pointer-events-none absolute -inset-x-8 -inset-y-10 -z-10 rounded-[4rem] bg-[#160B10]/25 backdrop-blur-[18px]"
        />

        <div
          aria-hidden="true"
          class="pointer-events-none absolute -inset-x-8 -inset-y-10 -z-10 rounded-[4rem] bg-gradient-to-r from-[#160B10]/0 via-[#160B10]/20 to-[#160B10]/60"
        />
        <button
          v-for="(product, index) in products"
          :key="product.id"
          type="button"
          @click="activeProduct = index"
          class="group relative overflow-hidden border p-5 text-left transition-all duration-300"
          :class="
            activeProduct === index
              ? 'border-[#C8A77A]/30 bg-[#6B0F1A]/[0.10]'
              : 'border-[#C58B92]/[0.07] bg-[#1D0C13]/30 hover:border-[#C58B92]/[0.16] hover:bg-[#261018]/45]'
          "
        >
          <!-- Active line -->
          <div
            v-if="activeProduct === index"
            class="absolute left-0 top-0 h-full w-px bg-[#C8A77A]"
          />

          <div class="flex items-start justify-between">
            <span
              class="font-mono text-[9px] text-[#C8A77A]/50"
            >
              {{ product.number }}
            </span>

            <ArrowUpRight
              class="h-3.5 w-3.5 text-[#F1E8E3]/15 transition group-hover:text-[#C8A77A]/60"
            />
          </div>

          <h4
            class="mt-7 font-serif text-xl text-[#F1E8E3]/80"
          >
            {{ product.name }}
          </h4>

          <div
            class="mt-3 flex items-center justify-between"
          >
            <span
              class="text-[8px] uppercase tracking-[0.25em] text-[#F1E8E3]/25"
            >
              {{ product.category }}
            </span>

            <span
              class="font-serif text-sm text-[#F1E8E3]/50"
            >
              {{ product.price }}
            </span>
          </div>
        </button>
      </div>

      <!-- =======================================================
           BOTTOM STATEMENT
      ======================================================== -->

      <div
        class="mt-20 flex flex-col items-start justify-between gap-6 border-t border-[#C58B92]/[0.08] pt-7 sm:flex-row sm:items-center lg:mt-28"
      >
        <div class="flex items-center gap-4">
          <Sparkles
            class="h-4 w-4 text-[#C8A77A]/50"
          />

          <p
            class="text-[9px] uppercase tracking-[0.28em] text-[#F1E8E3]/25"
          >
            Curated with intention
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="previousProduct"
            class="flex h-10 w-10 items-center justify-center border border-[#C58B92]/[0.10] text-[#F1E8E3]/40 transition hover:border-[#C8A77A]/30 hover:text-[#F1E8E3]"
            aria-label="Previous product"
          >
            <ChevronLeft class="h-4 w-4" />
          </button>

          <button
            type="button"
            @click="nextProduct"
            class="flex h-10 w-10 items-center justify-center border border-[#C58B92]/[0.10] text-[#F1E8E3]/40 transition hover:border-[#C8A77A]/30 hover:text-[#F1E8E3]"
            aria-label="Next product"
          >
            <ChevronRight class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
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
    name: "Cleo Astro Beeds",
    category: "Spiritual Jewelry",
    description:
      "A symbolic beaded piece created for everyday wear, personal intention, and connection to your spiritual journey.",
    price: "₦50,000",
    image: "/images/products/beads.png",
  },
  {
    id: 2,
    number: "02",
    name: "Cleo Astra Clothes",
    category: "Spiritual Wears",
    description:
      "Meaningful spiritual wear designed to blend everyday style with intention, protection, and the energy of personal expression.",
    price: "₦70,000",
    image: "/images/products/clothes.png",
  },
  {
    id: 3,
    number: "03",
    name: "Cleo Astro Cap",
    category: "Apparel",
    description:
      "A distinctive everyday cap inspired by the cosmos, crafted to carry the Cleo Astro spirit with effortless style.",
    price: "₦50,000",
    image: "/images/products/cap.jpeg",
  },
  {
    id: 4,
    number: "04",
    name: "Cleo Astro Perfumes",
    category: "Perfume",
    description:
      "A refined fragrance experience created to complement your presence, evoke intention, and leave a memorable impression.",
    price: "₦70,000",
    image: "/images/products/perfumes.png",
  },
  {
    id: 5,
    number: "05",
    name: "Cosmic Dogs",
    category: "Dogs",
    description:
      "Thoughtfully selected companion dogs for those seeking a loyal, meaningful presence and a deeper connection with their everyday journey.",
    price: "₦150,000",
    image: "/images/products/dog.png",
  },
  {
    id: 6,
    number: "06",
    name: "Sacred Flip Flops",
    category: "Apparel",
    description:
      "Comfortable everyday footwear infused with the Cleo Astro spirit, designed for relaxed movement and effortless personal style.",
    price: "₦100,000",
    image: "/images/products/flipflop.png",
  },
  {
    id: 7,
    number: "07",
    name: "Astrology Jalamai",
    category: "Apparel",
    description:
      "A distinctive piece inspired by astrology and spiritual tradition, created as a wearable expression of identity, intention, and personal alignment.",
    price: "₦30,000",
    image: "/images/products/jalamia.png",
  },
  {
    id: 8,
    number: "08",
    name: "Sea Water",
    category: "Spiritual Jewelry",
    description:
      "A carefully presented spiritual essential inspired by the cleansing, renewing, and transformative qualities associated with the sea.",
    price: "₦5,000",
    image: "/images/products/seawater.png",
  },
  {
    id: 9,
    number: "09",
    name: "Salt / Alum / Nzu",
    category: "Accessories",
    description:
      "Traditional spiritual essentials brought together for personal rituals, cleansing practices, and intentional everyday use.",
    price: "₦5,000",
    image: "/images/products/nzu.png",
  },
  {
    id: 10,
    number: "10",
    name: "Cleo Astro Clay Pot",
    category: "Accessories",
    description:
      "A handcrafted clay vessel inspired by traditional symbolism and spiritual practice, bringing an earthy, grounded presence to your space.",
    price: "₦70,000",
    image: "/images/products/pot.png",
  },
];

const activeProduct = ref(0);

const currentProduct = computed<Product>(() => {
  return products[activeProduct.value] ?? products[0]!;
});

const productCount = computed(() => products.length);

const nextProduct = () => {
  activeProduct.value =
    (activeProduct.value + 1) % products.length;
};

const previousProduct = () => {
  activeProduct.value =
    (activeProduct.value - 1 + products.length) % products.length;
};

const selectProduct = (index: number) => {
  activeProduct.value = index;
};

const scrollToCollection = () => {
  document
    .getElementById("product-selector")
    ?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
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
                :key="currentProduct.id"
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
            :key="product.id"
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
                {{ product.price }}
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
</template>
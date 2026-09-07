<script setup lang="ts">
import {
  onMounted,
  onUnmounted,
  ref,
  watch,
} from "vue";

import {
  ArrowRight,
  ChevronRight,
  Menu,
  X,
} from "lucide-vue-next";

import { Button } from "@/components/ui/button";

const mobileMenuOpen = ref(false);
const scrolled = ref(false);
const activeSection = ref("");

const navigation = [
  {
    label: "About",
    href: "#about",
  },
  {
    label: "Readings",
    href: "#readings",
  },
  {
    label: "Ancestral Karma",
    href: "#ancestral",
  },
  {
    label: "Planetary Updates",
    href: "#planets",
  },
];

/* ============================================================
   Scroll handling
============================================================ */

const handleScroll = () => {
  scrolled.value = window.scrollY > 50;

  const sections = navigation
    .map((item) => document.querySelector(item.href))
    .filter(Boolean);

  let current = "";

  sections.forEach((section) => {
    if (!section) return;

    const rect = section.getBoundingClientRect();

    if (rect.top <= 180) {
      current = `#${section.id}`;
    }
  });

  activeSection.value = current;
};

/* ============================================================
   Mobile menu
============================================================ */

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const handleNavigation = (href: string) => {
  activeSection.value = href;
  closeMobileMenu();
};

/* ============================================================
   Prevent background scrolling while menu is open
============================================================ */

watch(mobileMenuOpen, (isOpen) => {
  if (typeof document === "undefined") return;

  document.body.style.overflow = isOpen ? "hidden" : "";
});

/* ============================================================
   Escape key
============================================================ */

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape" && mobileMenuOpen.value) {
    closeMobileMenu();
  }
};

onMounted(() => {
  handleScroll();

  window.addEventListener("scroll", handleScroll, {
    passive: true,
  });

  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("keydown", handleKeydown);

  document.body.style.overflow = "";
});
</script>

<template>
  <!-- =========================================================
       HEADER
  ========================================================== -->

  <header
    :class="[
      'fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-out',
      scrolled ? 'pt-3 lg:pt-4' : 'pt-0',
    ]"
  >
    <!-- =======================================================
         Desktop / Global ambient glow
    ======================================================== -->

    <div
      class="pointer-events-none absolute left-1/2 top-0 h-40 w-[32rem] -translate-x-1/2 rounded-full bg-amber-300/[0.045] blur-3xl"
    />

    <!-- =======================================================
         Navigation shell
    ======================================================== -->

    <div
      :class="[
        'relative mx-auto transition-all duration-700 ease-out',
        scrolled
          ? 'mx-3 max-w-6xl rounded-[1.4rem] border border-white/[0.09] bg-[#090711]/80 shadow-[0_20px_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:mx-5 lg:mx-auto'
          : 'max-w-7xl',
      ]"
    >
      <!-- =====================================================
           Main navigation bar
      ====================================================== -->

      <div
        :class="[
          'relative flex items-center justify-between px-5 transition-all duration-700 sm:px-6 lg:px-8',
          scrolled
            ? 'h-[4.4rem]'
            : 'h-20 lg:h-[5.5rem]',
        ]"
      >
        <!-- ===================================================
             LOGO
        ==================================================== -->

        <a
          href="/"
          aria-label="Sammy Vedic Astrology home"
          class="group relative flex shrink-0 items-center outline-none"
          @click="handleNavigation('')"
        >
          <!-- Logo glow -->

          <div
            class="pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300/10 opacity-0 blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-100"
          />

          <!-- Logo image -->

          <div
            class="relative flex items-center justify-center overflow-visible"
          >
            <img
              src="/images/logo/logo.png"
              alt="Sammy Vedic Astrology"
              class="h-11 w-auto object-contain transition-all duration-700 ease-out group-hover:scale-[1.04] lg:h-14"
            />
          </div>

          <!-- Small celestial accent -->

          <span
            class="pointer-events-none absolute -right-1 top-1 h-1.5 w-1.5 rounded-full bg-amber-200/80 shadow-[0_0_10px_rgba(253,230,138,0.9)]"
          />
        </a>

        <!-- ===================================================
             DESKTOP NAVIGATION
        ==================================================== -->

        <nav
          aria-label="Main navigation"
          class="absolute left-1/2 hidden -translate-x-1/2 lg:flex"
        >
          <div
            class="flex items-center gap-1 rounded-full border border-white/[0.07] bg-white/[0.025] p-1 shadow-[inset_0_1px_rgba(255,255,255,0.03)] backdrop-blur-md"
          >
            <a
              v-for="item in navigation"
              :key="item.href"
              :href="item.href"
              :class="[
                'group relative rounded-full px-4 py-2.5 text-[12px] font-medium tracking-wide transition-all duration-300 xl:px-5',
                activeSection === item.href
                  ? 'bg-white/[0.07] text-amber-100'
                  : 'text-white/50 hover:bg-white/[0.045] hover:text-white/90',
              ]"
              @click="handleNavigation(item.href)"
            >
              <span class="relative z-10 whitespace-nowrap">
                {{ item.label }}
              </span>

              <!-- Active line -->

              <span
                :class="[
                  'absolute bottom-[5px] left-1/2 h-px -translate-x-1/2 bg-gradient-to-r from-transparent via-amber-200 to-transparent transition-all duration-300',
                  activeSection === item.href
                    ? 'w-6 opacity-100'
                    : 'w-0 opacity-0 group-hover:w-5 group-hover:opacity-70',
                ]"
              />
            </a>
          </div>
        </nav>

        <!-- ===================================================
             DESKTOP CTA
        ==================================================== -->

        <div class="hidden items-center gap-3 lg:flex">
          <span
            class="hidden text-[8px] font-medium uppercase tracking-[0.22em] text-white/25 xl:block"
          >
            Discover your path
          </span>

          <Button
            class="group relative h-11 overflow-hidden rounded-full border border-amber-200/20 bg-gradient-to-r from-amber-100/10 via-amber-100/[0.07] to-transparent px-5 text-[12px] font-semibold tracking-wide text-amber-100 shadow-[inset_0_1px_rgba(255,255,255,0.08)] backdrop-blur-md transition-all duration-500 hover:border-amber-200/40 hover:bg-amber-100 hover:text-[#090711] hover:shadow-[0_10px_40px_rgba(251,191,36,0.15)]"
          >
            <!-- Shine -->

            <span
              class="absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/25 transition-all duration-700 group-hover:left-[130%]"
            />
            <span class="relative">
              Book a Reading
            </span>

            <ArrowRight
              class="relative ml-2 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
            />
          </Button>
        </div>

        <!-- ===================================================
             MOBILE MENU BUTTON
        ==================================================== -->

        <button
          type="button"
          :aria-expanded="mobileMenuOpen"
          aria-controls="mobile-navigation"
          aria-label="Toggle navigation"
          class="group relative flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.035] text-white/75 shadow-[inset_0_1px_rgba(255,255,255,0.05)] transition-all duration-300 hover:border-amber-200/30 hover:bg-amber-100/5 hover:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-200/30 lg:hidden"
          @click="toggleMobileMenu"
        >
          <!-- Active glow -->

          <span
            :class="[
              'absolute inset-0 rounded-full bg-amber-200/5 blur-md transition-opacity duration-300',
              mobileMenuOpen
                ? 'opacity-100'
                : 'opacity-0',
            ]"
          />

          <Transition
            name="icon-switch"
            mode="out-in"
          >
            <X
              v-if="mobileMenuOpen"
              key="close"
              class="relative h-[19px] w-[19px]"
            />

            <Menu
              v-else
              key="menu"
              class="relative h-[19px] w-[19px] transition-transform duration-300 group-hover:scale-110"
            />
          </Transition>
        </button>
      </div>

      <!-- =======================================================
           MOBILE NAVIGATION
      ======================================================== -->

      <Transition name="mobile-menu">
        <div
          v-if="mobileMenuOpen"
          id="mobile-navigation"
          class="overflow-hidden lg:hidden"
        >
          <div
            class="mx-3 mb-3 border-t border-white/[0.07] pt-3 sm:mx-4"
          >
            <div
              class="rounded-[1.25rem] border border-white/[0.08] bg-[#0d0a18]/95 p-2 shadow-[0_25px_70px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
            >
              <!-- Mobile nav -->

              <nav
                aria-label="Mobile navigation"
                class="flex flex-col"
              >
                <a
                  v-for="(item, index) in navigation"
                  :key="item.href"
                  :href="item.href"
                  :class="[
                    'group flex items-center justify-between rounded-xl px-4 py-3.5 transition-all duration-300',
                    activeSection === item.href
                      ? 'bg-amber-100/[0.07] text-amber-100'
                      : 'text-white/65 hover:bg-white/[0.045] hover:text-white',
                  ]"
                  :style="{
                    transitionDelay: `${index * 35}ms`,
                  }"
                  @click="handleNavigation(item.href)"
                >
                  <div class="flex items-center gap-3">
                    <!-- Active indicator -->

                    <span
                      :class="[
                        'h-1.5 w-1.5 rounded-full transition-all duration-300',
                        activeSection === item.href
                          ? 'bg-amber-200 shadow-[0_0_10px_rgba(253,230,138,0.8)]'
                          : 'bg-white/10 group-hover:bg-amber-200/50',
                      ]"
                    />

                    <span class="text-sm font-medium">
                      {{ item.label }}
                    </span>
                  </div>

                  <ChevronRight
                    :class="[
                      'h-4 w-4 transition-all duration-300',
                      activeSection === item.href
                        ? 'translate-x-0 text-amber-200/70'
                        : '-translate-x-1 text-white/0 group-hover:translate-x-0 group-hover:text-white/40',
                    ]"
                  />
                </a>
              </nav>

              <!-- Divider -->

              <div class="my-2 border-t border-white/[0.06]" />

              <!-- Mobile CTA -->

              <Button
                class="group relative h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-amber-100 via-amber-200 to-amber-100 text-sm font-semibold text-[#090711] shadow-[0_10px_30px_rgba(251,191,36,0.1)] transition-all duration-300 hover:shadow-[0_15px_40px_rgba(251,191,36,0.18)]"
                @click="closeMobileMenu"
              >
                <span
                  class="absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/30 transition-all duration-700 group-hover:left-[130%]"
                />

                <span class="relative">
                  Book a Private Reading
                </span>

                <ArrowRight
                  class="relative ml-auto h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Button>

              <div
                class="flex items-center justify-center gap-2 py-3"
              >
                <span
                  class="h-px w-6 bg-white/[0.08]"
                />

                <p
                  class="text-[8px] font-medium uppercase tracking-[0.28em] text-white/25"
                >
                  Guidance · Timing · Clarity
                </p>

                <span
                  class="h-px w-6 bg-white/[0.08]"
                />
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </header>

  <Transition name="backdrop">
    <div
      v-if="mobileMenuOpen"
      class="fixed inset-0 z-40 bg-black/45 backdrop-blur-md lg:hidden"
      aria-hidden="true"
      @click="closeMobileMenu"
    >
      <!-- Subtle center glow -->

      <div
        class="pointer-events-none absolute left-1/2 top-32 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-300/[0.035] blur-3xl"
      />
    </div>
  </Transition>
</template>

<style scoped>
:global(html) {
  scroll-behavior: smooth;
}

.backdrop-enter-active,
.backdrop-leave-active {
  transition:
    opacity 0.35s ease,
    backdrop-filter 0.35s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
  backdrop-filter: blur(0);
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  max-height: 600px;
  opacity: 1;
  transform: translateY(0);

  transition:
    max-height 0.4s ease,
    opacity 0.3s ease,
    transform 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

.icon-switch-enter-active,
.icon-switch-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.icon-switch-enter-from {
  opacity: 0;
  transform: rotate(-45deg) scale(0.7);
}

.icon-switch-leave-to {
  opacity: 0;
  transform: rotate(45deg) scale(0.7);
}

a:focus-visible,
button:focus-visible {
  outline: 2px solid rgba(253, 230, 138, 0.5);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  :global(html) {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
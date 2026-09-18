<script setup lang="ts">
import {ArrowDownRight, ArrowUpRight, Heart, PawPrint, Users} from "lucide-vue-next";
import { ref } from "vue";
import DonationDialog from "@/components/donation/DonationDialog.vue";
import { Button } from "@/components/ui/button";


const donationOpen = ref(false);
const openDonation = () => {
  donationOpen.value = true;
};

const causes = [
  {
    number: "01",
    title: "Widows",
    subtitle: "Dignity & support",
    description:
      "Support practical needs, essential care, and meaningful assistance for women rebuilding life after loss.",
    icon: Users,
  },
  {
    number: "02",
    title: "Children",
    subtitle: "Hope & opportunity",
    description:
      "Help provide food, education, care, protection, and the everyday support a child deserves.",
    icon: Heart,
  },
  {
    number: "03",
    title: "Animals",
    subtitle: "Compassion & care",
    description:
      "Help vulnerable animals receive food, shelter, treatment, and the care they need to thrive.",
    icon: PawPrint,
  },
];
</script>

<template>
  <section
    id="donations"
    class="relative isolate overflow-hidden bg-[#160B10] text-[#F1E8E3]"
  >
    <!-- ========================================================= -->
    <!-- OPAQUE CANVAS -->
    <!-- Keeps the global bg_img.png from bleeding into this section -->
    <!-- ========================================================= -->

    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 -z-30 bg-[#160B10]"
    />

    <!-- ========================================================= -->
    <!-- ATMOSPHERE -->
    <!-- ========================================================= -->

    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 -z-20 overflow-hidden"
    >
      <!-- Central wine glow -->
      <div
        class="absolute left-1/2 top-[42%] h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6B0F1A]/[0.10] blur-[140px]"
      />

      <!-- Upper-right warmth -->
      <div
        class="absolute -right-48 -top-40 h-[36rem] w-[36rem] rounded-full bg-[#42141F]/[0.18] blur-[130px]"
      />

      <!-- Lower-left rose atmosphere -->
      <div
        class="absolute -bottom-48 -left-48 h-[32rem] w-[32rem] rounded-full bg-[#7E3541]/[0.07] blur-[130px]"
      />

      <!-- Large orbital geometry -->
      <div
        class="absolute -right-[17rem] -top-[17rem] h-[42rem] w-[42rem] rounded-full border border-[#C58B92]/[0.055]"
      />

      <div
        class="absolute -right-[12rem] -top-[12rem] h-[32rem] w-[32rem] rounded-full border border-[#C8A77A]/[0.045]"
      />

      <div
        class="absolute -bottom-[21rem] -left-[17rem] h-[43rem] w-[43rem] rounded-full border border-[#C58B92]/[0.045]"
      />

      <div
        class="absolute -bottom-[16rem] -left-[12rem] h-[33rem] w-[33rem] rounded-full border border-[#C8A77A]/[0.035]"
      />

      <!-- Fine celestial points -->
      <span
        class="absolute left-[11%] top-[25%] h-1.5 w-1.5 rounded-full bg-[#C8A77A]/45 shadow-[0_0_14px_rgba(200,167,122,.25)]"
      />

      <span
        class="absolute right-[17%] top-[18%] h-1 w-1 rounded-full bg-[#C58B92]/45 shadow-[0_0_12px_rgba(197,139,146,.25)]"
      />

      <span
        class="absolute bottom-[21%] right-[9%] h-1.5 w-1.5 rounded-full bg-[#C8A77A]/25"
      />

      <span
        class="absolute bottom-[29%] left-[7%] h-1 w-1 rounded-full bg-[#F1E8E3]/15"
      />

      <span
        class="absolute right-[43%] top-[12%] h-1 w-1 rounded-full bg-[#C58B92]/20"
      />
    </div>

    <!-- ========================================================= -->
    <!-- TOP EDGE -->
    <!-- ========================================================= -->

    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C58B92]/20 to-transparent"
    />

    <div
      class="relative mx-auto max-w-[1500px] px-5 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-36"
    >
      <!-- ========================================================= -->
      <!-- SECTION INTRO -->
      <!-- ========================================================= -->

      <div
        class="mb-20 flex flex-col gap-10 border-b border-[#C58B92]/[0.09] pb-10 lg:mb-24 lg:flex-row lg:items-end lg:justify-between"
      >
        <div class="max-w-4xl">
          <!-- Section marker -->

          <div class="mb-8 flex items-center gap-4">
            <span
              class="flex h-9 w-9 items-center justify-center rounded-full border border-[#C8A77A]/25 bg-[#1D0C13]/40 text-[10px] font-medium tracking-[0.2em] text-[#C8A77A]/75"
            >
              05
            </span>

            <span
              class="h-px w-8 bg-[#C8A77A]/25"
            />

            <span
              class="text-[9px] font-semibold uppercase tracking-[0.32em] text-[#C8A77A]/65"
            >
              Give With Intention
            </span>
          </div>

          <!-- Heading -->

          <h2
            class="max-w-5xl font-serif text-5xl font-medium leading-[0.94] tracking-[-0.055em] text-[#F1E8E3] sm:text-6xl lg:text-[6.8rem]"
          >
            Let your
            <span
              class="italic text-[#C8A77A]"
            >
              abundance
            </span>
            <br />
            reach someone else.
          </h2>
        </div>

        <!-- Supporting copy -->

        <div class="max-w-sm lg:pb-2">
          <div class="mb-5 flex items-center gap-3">
            <span
              class="text-[9px] uppercase tracking-[0.25em] text-[#F1E8E3]/25"
            >
              An intentional gesture
            </span>
          </div>

          <p
            class="text-sm leading-7 text-[#F1E8E3]/48 sm:text-base"
          >
            Sometimes generosity is not about having more. It is about
            choosing to let what you have become meaningful in another
            person's life.
          </p>
        </div>
      </div>

      <!-- ========================================================= -->
      <!-- MAIN EDITORIAL AREA -->
      <!-- ========================================================= -->

      <div class="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:gap-8">
        <!-- ======================================================= -->
        <!-- LEFT: DONATION STATEMENT -->
        <!-- ======================================================= -->

        <div
          class="group relative min-h-[620px] overflow-hidden rounded-[2rem] border border-[#C58B92]/[0.10] bg-[#1D0C13]/90 p-8 shadow-[0_30px_100px_rgba(0,0,0,.20)] sm:p-12 lg:p-14"
        >
          <!-- Local atmosphere -->

          <div
            aria-hidden="true"
            class="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#6B0F1A]/[0.13] blur-[90px]"
          />

          <div
            aria-hidden="true"
            class="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#42141F]/[0.22] blur-[100px]"
          />

          <!-- Orbital geometry -->

          <div
            aria-hidden="true"
            class="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full border border-[#C58B92]/[0.12] transition-transform duration-[1400ms] ease-out group-hover:rotate-6"
          />

          <div
            aria-hidden="true"
            class="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border border-[#C8A77A]/[0.08]"
          />

          <div
            aria-hidden="true"
            class="pointer-events-none absolute bottom-[-10rem] left-[-10rem] h-80 w-80 rounded-full border border-[#C58B92]/[0.07]"
          />

          <!-- Fine markers -->

          <span
            aria-hidden="true"
            class="absolute left-10 top-10 h-1.5 w-1.5 rounded-full bg-[#C8A77A]/80 shadow-[0_0_14px_rgba(200,167,122,.4)]"
          />

          <span
            aria-hidden="true"
            class="absolute right-12 top-24 h-1 w-1 rounded-full bg-[#C58B92]/55"
          />

          <div
            class="relative z-10 flex h-full flex-col justify-between"
          >
            <div>
              <!-- Icon -->

              <div
                class="mb-14 flex h-16 w-16 items-center justify-center rounded-full border border-[#C8A77A]/20 bg-[#261018]/50 shadow-[0_0_45px_rgba(107,15,26,.12)]"
              >
                <Heart
                  :size="24"
                  stroke-width="1.2"
                  class="text-[#C8A77A]"
                />
              </div>

              <p
                class="mb-5 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#C8A77A]/65"
              >
                A simple act
              </p>

              <h3
                class="max-w-xl font-serif text-4xl font-medium leading-[1.01] tracking-[-0.045em] text-[#F1E8E3] sm:text-5xl lg:text-6xl"
              >
                Give where
                <span
                  class="italic text-[#C58B92]"
                >
                  it matters.
                </span>
              </h3>

              <p
                class="mt-8 max-w-md text-sm leading-7 text-[#F1E8E3]/48 sm:text-base"
              >
                Your contribution can become food on a table, support during
                a difficult season, care for a vulnerable child, or comfort
                for an animal that has nowhere else to turn.
              </p>
            </div>

            <!-- Bottom statement -->

            <div class="mt-16">
              <div
                class="mb-7 flex items-center gap-4 text-[9px] uppercase tracking-[0.27em] text-[#F1E8E3]/25"
              >
                <span class="h-px w-10 bg-[#C8A77A]/30" />
                Every contribution carries meaning
              </div>

              <div class="flex items-end justify-between gap-5">
                <div>
                  <div
                    class="font-serif text-7xl font-medium leading-none tracking-[-0.07em] text-[#F1E8E3] sm:text-8xl"
                  >
                    ∞
                  </div>

                  <p
                    class="mt-2 text-[9px] uppercase tracking-[0.24em] text-[#F1E8E3]/25"
                  >
                    The ripple continues
                  </p>
                </div>

                <div
                  class="mb-1 h-10 w-10 rounded-full border border-[#C58B92]/10"
                >
                  <div
                    class="m-2 h-5 w-5 rounded-full border border-[#C8A77A]/20"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ======================================================= -->
        <!-- RIGHT: CAUSES -->
        <!-- ======================================================= -->

        <div
          class="overflow-hidden rounded-[2rem] border border-[#C58B92]/[0.10] bg-[#F1E8E3]/[0.96] text-[#1D0C13] shadow-[0_30px_100px_rgba(0,0,0,.16)]"
        >
          <!-- Causes header -->

          <div
            class="flex items-center justify-between border-b border-[#1D0C13]/[0.09] px-7 py-7 sm:px-9"
          >
            <div>
              <p
                class="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#6B0F1A]"
              >
                Choose where your heart goes
              </p>

              <p
                class="mt-2 text-sm text-[#1D0C13]/45"
              >
                Every cause represents a life that can be touched.
              </p>
            </div>

            <div
              class="hidden h-10 w-10 items-center justify-center rounded-full border border-[#1D0C13]/[0.08] sm:flex"
            >
              <ArrowDownRight
                :size="18"
                stroke-width="1.1"
                class="text-[#6B0F1A]"
              />
            </div>
          </div>

          <!-- Cause list -->

          <div>
            <div
              v-for="(cause, index) in causes"
              :key="cause.number"
              class="group relative border-b border-[#1D0C13]/[0.09] px-7 py-9 transition-all duration-500 last:border-b-0 hover:bg-white sm:px-9 sm:py-10"
            >
              <!-- Background number -->

              <span
                class="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 font-serif text-[7rem] font-medium leading-none tracking-[-0.08em] text-[#1D0C13]/[0.035] transition-all duration-700 group-hover:text-[#6B0F1A]/[0.08] sm:right-9 sm:text-[9rem]"
              >
                {{ cause.number }}
              </span>

              <!-- Subtle hover line -->

              <span
                class="absolute bottom-0 left-0 h-px w-0 bg-[#6B0F1A]/40 transition-all duration-700 group-hover:w-full"
              />

              <div
                class="relative z-10 grid gap-7 sm:grid-cols-[70px_1fr_auto] sm:items-center"
              >
                <!-- Icon -->

                <div
                  class="flex h-14 w-14 items-center justify-center rounded-full border border-[#6B0F1A]/20 bg-[#1D0C13]/[0.025] transition-all duration-500 group-hover:border-[#6B0F1A] group-hover:bg-[#6B0F1A] group-hover:shadow-[0_10px_30px_rgba(107,15,26,.18)]"
                >
                  <component
                    :is="cause.icon"
                    :size="21"
                    stroke-width="1.2"
                    class="text-[#6B0F1A] transition-colors duration-500 group-hover:text-[#F1E8E3]"
                  />
                </div>

                <!-- Text -->

                <div class="max-w-xl">
                  <div class="mb-2 flex items-center gap-3">
                    <span
                      class="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#6B0F1A]"
                    >
                      {{ cause.number }}
                    </span>

                    <span
                      class="h-px w-5 bg-[#6B0F1A]/25"
                    />

                    <span
                      class="text-[9px] uppercase tracking-[0.2em] text-[#1D0C13]/30"
                    >
                      {{ cause.subtitle }}
                    </span>
                  </div>

                  <h3
                    class="font-serif text-3xl font-medium tracking-[-0.035em] text-[#1D0C13] sm:text-4xl"
                  >
                    {{ cause.title }}
                  </h3>

                  <p
                    class="mt-3 max-w-lg text-sm leading-6 text-[#1D0C13]/50"
                  >
                    {{ cause.description }}
                  </p>
                </div>

                <!-- Arrow -->

                <div
                  class="flex h-11 w-11 items-center justify-center rounded-full border border-[#1D0C13]/10 transition-all duration-500 group-hover:-translate-y-1 group-hover:border-[#6B0F1A] group-hover:bg-[#6B0F1A]"
                >
                  <ArrowUpRight
                    :size="17"
                    stroke-width="1.3"
                    class="text-[#1D0C13]/40 transition-all duration-500 group-hover:text-[#F1E8E3]"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- ===================================================== -->
          <!-- DONATION ACTION -->
          <!-- ===================================================== -->

          <div
            class="relative overflow-hidden border-t border-[#C58B92]/10 bg-[#1D0C13] p-7 text-[#F1E8E3] sm:p-9"
          >
            <!-- Local glow -->

            <div
              aria-hidden="true"
              class="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-[#6B0F1A]/20 blur-[70px]"
            />

            <div
              class="relative flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div class="mb-3 flex items-center gap-3">
                  <span
                    class="h-1.5 w-1.5 rounded-full bg-[#C8A77A] shadow-[0_0_12px_rgba(200,167,122,.5)]"
                  />

                  <p
                    class="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#C8A77A]/70"
                  >
                    Ready to give?
                  </p>
                </div>

                <p
                  class="max-w-md text-sm leading-6 text-[#F1E8E3]/42"
                >
                  Choose a cause and make a contribution that reflects what
                  matters to you.
                </p>
              </div>

                <Button
                    type="button"
                    class="group h-14 shrink-0 rounded-full border border-[#C8A77A]/30 bg-[#6B0F1A] px-7 text-[#F1E8E3] shadow-[0_15px_40px_rgba(107,15,26,.25)] transition-all duration-500 hover:-translate-y-1 hover:border-[#C8A77A]/50 hover:bg-[#7E3541] hover:shadow-[0_20px_50px_rgba(107,15,26,.35)]"
                    @click="openDonation"
                    >
                    <span>Make a donation</span>

                    <ArrowUpRight
                        :size="17"
                        stroke-width="1.4"
                        class="ml-2 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <DonationDialog v-model:open="donationOpen" />
</template>
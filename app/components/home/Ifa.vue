<script setup lang="ts">
import {
  ArrowUpRight,
  Check,
  Sparkles,
} from "lucide-vue-next";

const consultationPoints = [
  "Relationships & important personal decisions",
  "Career, business & direction",
  "Recurring patterns, obstacles & uncertainty",
  "Spiritual questions, purpose & life transitions",
];

const scrollToBooking = () => {
  const booking =
    document.getElementById("booking") ||
    document.getElementById("book") ||
    document.getElementById("contact");

  if (booking) {
    booking.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};
</script>

<template>
  <section
    id="ifa"
    class="relative overflow-hidden bg-transparent py-24 text-[#F1E8E3] sm:py-32 lg:py-40"
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
        class="absolute left-[42%] top-[35%] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#6B0F1A]/[0.09] blur-[150px]"
      />

      <!-- Secondary wine glow -->
      <div
        class="absolute bottom-[-15%] right-[-5%] h-[450px] w-[450px] rounded-full bg-[#42141F]/[0.12] blur-[150px]"
      />

      <!-- Very subtle rose horizon -->
      <div
        class="absolute left-0 right-0 top-[28%] h-px bg-gradient-to-r from-transparent via-[#C58B92]/10 to-transparent"
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
      <!-- =========================================================
           TOP LABEL
      ========================================================== -->

      <div class="mb-14 flex items-center justify-between lg:mb-20">
        <div class="flex items-center gap-4">
          <span
            class="font-mono text-[10px] tracking-[0.35em] text-[#C8A77A]/70"
          >
            03
          </span>

          <div class="h-px w-10 bg-[#C58B92]/25" />

          <span
            class="text-[9px] uppercase tracking-[0.35em] text-[#F1E8E3]/35"
          >
            Ifá Consultation
          </span>
        </div>

        <span
          class="hidden text-[9px] uppercase tracking-[0.3em] text-[#F1E8E3]/20 sm:block"
        >
          The Oracle · The Question · The Path
        </span>
      </div>

      <!-- =========================================================
           MAIN COMPOSITION
      ========================================================== -->

      <div
        class="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8"
      >
        <!-- =======================================================
             LEFT / ORACLE
        ======================================================== -->

        <div
          class="relative min-h-[500px] sm:min-h-[600px] lg:min-h-[650px]"
        >
        <div
          aria-hidden="true"
          class="pointer-events-none absolute -inset-x-8 -inset-y-10 -z-10 rounded-[4rem] bg-[#160B10]/25 backdrop-blur-[18px]"
        />

        <div
          aria-hidden="true"
          class="pointer-events-none absolute -inset-x-8 -inset-y-10 -z-10 rounded-[4rem] bg-gradient-to-r from-[#160B10]/0 via-[#160B10]/20 to-[#160B10]/60"
        />
          <!-- Large outer circle -->
          <div
            aria-hidden="true"
            class="absolute left-1/2 top-1/2 h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#C58B92]/[0.08] sm:h-[520px] sm:w-[520px] lg:h-[600px] lg:w-[600px]"
          />

          <!-- Broken circle -->
          <div
            aria-hidden="true"
            class="absolute left-1/2 top-1/2 h-[370px] w-[370px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#C58B92]/[0.09] sm:h-[450px] sm:w-[450px] lg:h-[510px] lg:w-[510px]"
          />

          <!-- Image -->
          <div
            class="absolute left-1/2 top-1/2 z-10 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 sm:h-[400px] sm:w-[400px] lg:h-[455px] lg:w-[455px]"
          >
            <!-- Restrained rose halo -->
            <div
              aria-hidden="true"
              class="absolute -inset-6 rounded-full bg-[#6B0F1A]/[0.08] blur-2xl"
            />

            <div
              class="relative h-full w-full overflow-hidden rounded-full border border-[#C58B92]/20 bg-[#1D0C13]/40 p-3"
            >
              <div
                class="relative h-full w-full overflow-hidden rounded-full"
              >
                <img
                  src="/images/ifa.png"
                  alt="Ifá oracle"
                  class="h-full w-full object-cover transition duration-[1200ms] hover:scale-105"
                />

                <!-- Cinematic wine overlay -->
                <div
                  aria-hidden="true"
                  class="absolute inset-0 bg-gradient-to-br from-[#160B10]/15 via-transparent to-[#160B10]/65"
                />

                <!-- Inner ring -->
                <div
                  aria-hidden="true"
                  class="absolute inset-5 rounded-full border border-[#F1E8E3]/[0.12]"
                />
              </div>
            </div>
          </div>

          <!-- =====================================================
               ORACLE MARKERS
          ====================================================== -->

          <!-- Top marker -->
          <div
            class="absolute left-1/2 top-[2%] z-20 flex -translate-x-1/2 flex-col items-center"
          >
            <span
              class="font-mono text-[8px] tracking-[0.3em] text-[#C8A77A]/60"
            >
              ORACLE
            </span>

            <div
              class="mt-2 h-10 w-px bg-gradient-to-b from-[#C8A77A]/40 to-transparent"
            />
          </div>

          <!-- Left marker -->
          <div
            class="absolute left-[3%] top-1/2 z-20 hidden -translate-y-1/2 items-center gap-3 sm:flex"
          >
            <div class="h-px w-10 bg-[#C58B92]/25" />

            <span
              class="text-[8px] uppercase tracking-[0.3em] text-[#F1E8E3]/30 [writing-mode:vertical-rl]"
            >
              Ask
            </span>
          </div>

          <!-- Right marker -->
          <div
            class="absolute right-[3%] top-1/2 z-20 hidden -translate-y-1/2 items-center gap-3 sm:flex"
          >
            <span
              class="text-[8px] uppercase tracking-[0.3em] text-[#F1E8E3]/30 [writing-mode:vertical-rl]"
            >
              Listen
            </span>

            <div class="h-px w-10 bg-[#C58B92]/25" />
          </div>

          <!-- Bottom marker -->
          <div
            class="absolute bottom-[2%] left-1/2 z-20 flex -translate-x-1/2 flex-col items-center"
          >
            <div
              class="mb-2 h-10 w-px bg-gradient-to-t from-[#C8A77A]/40 to-transparent"
            />

            <span
              class="font-mono text-[8px] tracking-[0.3em] text-[#C8A77A]/60"
            >
              REVEAL
            </span>
          </div>

          <!-- =====================================================
               FLOATING CONSULTATION SEAL
          ====================================================== -->

          <div
            class="absolute bottom-[10%] right-[2%] z-30 flex h-28 w-28 items-center justify-center rounded-full border border-[#C58B92]/25 bg-[#1D0C13]/90 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:h-32 sm:w-32"
          >
            <div
              aria-hidden="true"
              class="absolute inset-2 rounded-full border border-dashed border-[#C58B92]/15"
            />

            <div class="relative flex flex-col items-center text-center">
              <Sparkles
                class="mb-2 h-4 w-4 text-[#C8A77A]"
              />

              <span
                class="text-[8px] uppercase tracking-[0.28em] text-[#C8A77A]/80"
              >
                Private
              </span>

              <span
                class="mt-1 text-[9px] uppercase tracking-[0.2em] text-[#F1E8E3]/50"
              >
                Consultation
              </span>
            </div>
          </div>
        </div>

        <!-- =======================================================
             RIGHT / COPY
        ======================================================== -->

        <div class="relative lg:pl-12 xl:pl-20">
        <div
          aria-hidden="true"
          class="pointer-events-none absolute -inset-x-8 -inset-y-10 -z-10 rounded-[4rem] bg-[#160B10]/25 backdrop-blur-[18px]"
        />

        <div
          aria-hidden="true"
          class="pointer-events-none absolute -inset-x-8 -inset-y-10 -z-10 rounded-[4rem] bg-gradient-to-r from-[#160B10]/0 via-[#160B10]/20 to-[#160B10]/60"
        />

        <!-- Vertical editorial label -->
        <div
          class="absolute -left-2 top-1/2 hidden -translate-y-1/2 lg:block"
        >
          <span
            class="text-[8px] uppercase tracking-[0.45em] text-[#C58B92]/35 [writing-mode:vertical-rl]"
          >
            Ifá Divination · Spiritual Consultation
          </span>
        </div>
        
          <!-- Eyebrow -->
          <div class="flex items-center gap-3">
            <span class="h-px w-8 bg-[#C8A77A]/50" />

            <span
              class="text-[9px] uppercase tracking-[0.35em] text-[#C8A77A]/70"
            >
              Ifá & Consultation
            </span>
          </div>

          <!-- Headline -->
          <h2
            class="mt-7 max-w-xl font-serif text-[3rem] leading-[0.98] tracking-[-0.035em] text-[#F1E8E3] sm:text-[4rem] lg:text-[4.5rem]"
          >
            Some questions

            <span class="block text-[#F1E8E3]/35">
              deserve more
            </span>

            <span class="relative inline-block text-[#C8A77A]">
              than an answer.

              <span
                class="absolute -bottom-2 left-0 h-px w-[72%] bg-[#C58B92]/30"
              />
            </span>
          </h2>

          <!-- Intro -->
          <p
            class="mt-9 max-w-lg text-base leading-8 text-[#F1E8E3]/55 sm:text-lg"
          >
            There are moments when you have thought about every angle,
            asked everyone you trust, and still feel that something
            remains unclear.
          </p>

          <p
            class="mt-5 max-w-lg text-sm leading-7 text-[#F1E8E3]/35"
          >
            An Ifá consultation creates space to bring a question
            forward, examine what is unfolding, and receive guidance
            through a traditional divinatory system.
          </p>

          <!-- =====================================================
               CONSULTATION AREAS
          ====================================================== -->

          <div class="mt-10 max-w-lg">
            <div
              class="mb-4 flex items-center justify-between border-b border-[#C58B92]/[0.07] pb-3"
            >
              <span
                class="text-[8px] uppercase tracking-[0.3em] text-[#F1E8E3]/25"
              >
                Bring your question
              </span>

              <span
                class="font-mono text-[9px] text-[#C8A77A]/50"
              >
                01—04
              </span>
            </div>

            <div class="grid gap-x-8 sm:grid-cols-2">
              <div
                v-for="(point, index) in consultationPoints"
                :key="point"
                class="group flex items-start gap-3 border-b border-[#C58B92]/[0.05] py-4"
              >
                <span
                  class="pt-0.5 font-mono text-[9px] text-[#C58B92]/45"
                >
                  0{{ index + 1 }}
                </span>

                <div class="flex items-start gap-2">
                  <Check
                    class="mt-0.5 h-3 w-3 shrink-0 text-[#C8A77A]/50 transition group-hover:text-[#C8A77A]"
                  />

                  <span
                    class="text-xs leading-5 text-[#F1E8E3]/45 transition group-hover:text-[#F1E8E3]/70"
                  >
                    {{ point }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- =====================================================
               CTA
          ====================================================== -->

          <div class="mt-10 flex flex-wrap items-center gap-5">
            <Button
              type="button"
              @click="scrollToBooking"
              class="group inline-flex h-12 items-center justify-center rounded-full border border-[#C8A77A]/35 bg-[#6B0F1A] px-7 text-[13px] font-medium tracking-wide text-[#F1E8E3] shadow-[0_12px_36px_rgba(107,15,26,0.24)] transition-all duration-500 hover:-translate-y-0.5 hover:border-[#C8A77A]/55 hover:bg-[#7E3541] hover:shadow-[0_16px_45px_rgba(107,15,26,0.34)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A77A]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#160B10]"
            >
              Book an Ifá Consultation

              <ArrowUpRight
                class="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Button>

            <span
              class="max-w-[170px] text-[9px] uppercase leading-4 tracking-[0.16em] text-[#F1E8E3]/20"
            >
              Private consultation · Personal guidance
            </span>
          </div>

          <!-- =====================================================
               CLOSING STATEMENT
          ====================================================== -->

          <div
            class="mt-12 flex items-start gap-4 border-t border-[#C58B92]/[0.06] pt-6"
          >
            <span
              class="font-serif text-2xl text-[#C8A77A]/40"
            >
              “
            </span>

            <p
              class="max-w-md text-sm leading-7 text-[#F1E8E3]/30"
            >
              Come with the question. Leave with a deeper understanding
              of what you are being called to see.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
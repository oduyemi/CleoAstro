<script setup lang="ts">
import Header from "@/components/common/Header.vue";
import PreFooter from "@/components/common/PreFooter.vue";
import Footer from "@/components/common/Footer.vue";
</script>

<template>
  <div class="min-h-screen bg-transparent text-[#F1E8E3]">
    <!-- Site header -->
    <header class="relative z-50">
      <Header />
    </header>

    <!-- Page content -->
    <main class="relative z-10">
      <slot />
    </main>

    <!-- Final atmospheric CTA -->
    <PreFooter />

    <!-- Site footer -->
    <footer class="relative z-10">
      <Footer />
    </footer>
  </div>
</template>
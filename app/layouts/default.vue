<script setup lang="ts">
import Header from "@/components/common/Header.vue";
</script>


<template>
  <div class="min-h-screen bg-spiritual-cream">
    <header>
      <Header />
    </header>

    <main>
      <slot />
    </main>

    <footer>
      <!-- Public Footer will go here -->
    </footer>
  </div>
</template>
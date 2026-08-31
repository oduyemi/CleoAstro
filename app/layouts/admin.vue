<template>
  <div class="min-h-screen bg-gray-50">
    <div class="flex min-h-screen">
      <!-- Admin Sidebar -->

      <div class="flex min-w-0 flex-1 flex-col">
        <!-- Admin Header -->

        <main class="flex-1 p-4 sm:p-6 lg:p-8">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>
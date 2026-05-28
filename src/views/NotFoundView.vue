<template>
  <div class="min-h-screen flex items-center justify-center bg-trovara-cream pt-20">
    <div class="text-center max-w-md px-4">
      <div class="text-8xl mb-6">🌱</div>
      <h1 class="text-6xl font-black text-trovara-dark mb-4">404</h1>
      <p class="text-2xl font-bold text-trovara-dark mb-2">Page Not Found</p>
      <p class="text-gray-500 mb-8">
        This page hasn't been planted yet. Head back to our farm.
      </p>
      <div class="flex flex-wrap gap-4 justify-center">
        <RouterLink to="/" class="btn-primary px-8 py-3">Back to Home</RouterLink>
        <RouterLink to="/products" class="btn-secondary px-8 py-3">See Products</RouterLink>
      </div>
    </div>
  </div>
</template>

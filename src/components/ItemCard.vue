<template>
  <router-link
    :to="`/item/${item.id}`"
    class="group bg-white rounded-2xl border border-brand-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col"
  >
    <!-- Image placeholder -->
    <div class="aspect-video bg-gradient-to-br from-brand-50 to-rose-50 flex items-center justify-center overflow-hidden relative">
      <img
        v-if="!imageError && item.imagesFolder"
        :src="`${$baseUrl}images/${item.imagesFolder}/main.jpg`"
        :alt="item.displayName"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        @error="imageError = true"
      />
      <svg
        v-else
        class="w-14 h-14 text-brand-200 group-hover:scale-110 transition-transform duration-300"
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    </div>

    <!-- Content -->
    <div class="p-4 flex flex-col flex-1">
      <span class="inline-block text-xs font-semibold text-brand-400 uppercase tracking-wider">
        {{ item.category }}
      </span>

      <h3 class="mt-1 font-display font-semibold text-gray-800 group-hover:text-brand-600 transition-colors leading-snug line-clamp-1 text-lg">
        {{ item.displayName }}
      </h3>

      <p class="mt-1 text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1">
        {{ item.description }}
      </p>

      <!-- Price row -->
      <div class="mt-3 pt-3 border-t border-brand-50 flex items-center justify-between">
        <div class="flex items-baseline gap-1.5">
          <span class="text-base font-bold text-gray-900">
            {{ item.currency }} {{ item.price[0]?.discounted ?? item.price[0]?.value }}
          </span>
          <span v-if="item.price[0]?.discounted" class="text-sm text-gray-400 line-through">
            {{ item.price[0]?.value }}
          </span>
        </div>
        <span class="flex items-center gap-1 text-xs font-medium text-brand-400 group-hover:text-brand-600">
          View
          <svg class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { ref } from 'vue'
defineProps({
  item: { type: Object, required: true }
})
const imageError = ref(false)
</script>

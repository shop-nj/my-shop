<template>
  <div>
    <div class="mb-6">
      <h1 class="font-display text-3xl font-semibold text-gray-800">Gallery</h1>
      <p class="text-gray-500 mt-1.5">A peek at our handcrafted creations.</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-16">
      <div class="animate-spin h-7 w-7 border-[3px] border-brand-400 border-t-transparent rounded-full"></div>
    </div>

    <!-- Empty -->
    <div v-else-if="images.length === 0" class="text-center py-16">
      <div class="inline-flex items-center justify-center w-14 h-14 bg-brand-50 rounded-2xl mb-4">
        <svg class="w-7 h-7 text-brand-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 6h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1z" />
        </svg>
      </div>
      <p class="text-gray-500 font-medium">No photos in the gallery yet.</p>
      <p class="text-gray-400 text-sm mt-1">Drop images into <code class="bg-gray-100 px-1.5 py-0.5 rounded">public/gallery</code> to see them here.</p>
    </div>

    <!-- Masonry grid -->
    <div v-else class="columns-1 sm:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
      <button
        v-for="(img, i) in images"
        :key="img"
        class="mb-4 w-full block rounded-xl overflow-hidden border border-brand-100 shadow-sm hover:shadow-lg transition-shadow duration-200 break-inside-avoid group"
        @click="openAt(i)"
      >
        <img
          :src="`${baseUrl}gallery/${img}`"
          :alt="img"
          loading="lazy"
          class="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-300"
        />
      </button>
    </div>

    <ImageLightbox
      v-model="lightboxOpen"
      :images="images"
      base-path="gallery"
      :start-index="activeIndex"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ImageLightbox from './ImageLightbox.vue'

const baseUrl = import.meta.env.BASE_URL
const images = ref([])
const loading = ref(true)
const lightboxOpen = ref(false)
const activeIndex = ref(0)

const openAt = (i) => {
  activeIndex.value = i
  lightboxOpen.value = true
}

onMounted(async () => {
  try {
    const res = await fetch(`${baseUrl}gallery-manifest.json`)
    images.value = res.ok ? await res.json() : []
  } catch {
    images.value = []
  } finally {
    loading.value = false
  }
})
</script>

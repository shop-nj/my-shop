<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
        @click.self="close"
        @keydown.esc="close"
        @keydown.left="prev"
        @keydown.right="next"
        tabindex="-1"
        ref="overlayRef"
      >
        <!-- Close button -->
        <button
          class="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          @click="close"
          aria-label="Close"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Counter -->
        <div class="absolute top-4 left-4 z-10 text-white/70 text-sm font-medium bg-black/30 px-3 py-1 rounded-full">
          {{ activeIndex + 1 }} / {{ images.length }}
        </div>

        <!-- Prev button -->
        <button
          v-if="images.length > 1"
          class="absolute left-3 sm:left-6 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
          @click="prev"
          aria-label="Previous image"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Main image -->
        <div class="flex items-center justify-center w-full h-full px-16 sm:px-24 py-16">
          <Transition name="img-slide" mode="out-in">
            <img
              :key="activeIndex"
              :src="`${$baseUrl}images/${folder}/${images[activeIndex]}`"
              :alt="`Image ${activeIndex + 1}`"
              class="max-w-full max-h-full object-contain rounded-lg shadow-2xl select-none"
              draggable="false"
            />
          </Transition>
        </div>

        <!-- Next button -->
        <button
          v-if="images.length > 1"
          class="absolute right-3 sm:right-6 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
          @click="next"
          aria-label="Next image"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Thumbnail strip -->
        <div
          v-if="images.length > 1"
          class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 bg-black/40 rounded-2xl overflow-x-auto max-w-[90vw]"
        >
          <button
            v-for="(img, i) in images"
            :key="i"
            :class="[
              'flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-150',
              i === activeIndex ? 'border-white opacity-100 scale-110' : 'border-transparent opacity-50 hover:opacity-80'
            ]"
            @click="activeIndex = i"
          >
            <img
              :src="`${$baseUrl}images/${folder}/${img}`"
              :alt="`Thumbnail ${i + 1}`"
              class="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  images: { type: Array, required: true },
  folder: { type: String, required: true },
  startIndex: { type: Number, default: 0 }
})

const emit = defineEmits(['update:modelValue'])

const overlayRef = ref(null)
const activeIndex = ref(props.startIndex)

// Sync startIndex when modal opens
watch(() => props.modelValue, (val) => {
  if (val) {
    activeIndex.value = props.startIndex
    // Lock body scroll and focus overlay for keyboard events
    document.body.style.overflow = 'hidden'
    nextTick(() => overlayRef.value?.focus())
  } else {
    document.body.style.overflow = ''
  }
})

const close = () => emit('update:modelValue', false)

const prev = () => {
  activeIndex.value = (activeIndex.value - 1 + props.images.length) % props.images.length
}
const next = () => {
  activeIndex.value = (activeIndex.value + 1) % props.images.length
}

// Clean up scroll lock if component is destroyed while open
onUnmounted(() => { document.body.style.overflow = '' })
</script>

<style scoped>
/* Lightbox open/close */
.lightbox-enter-active, .lightbox-leave-active {
  transition: opacity 0.25s ease;
}
.lightbox-enter-from, .lightbox-leave-to {
  opacity: 0;
}

/* Image slide on prev/next */
.img-slide-enter-active, .img-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.img-slide-enter-from {
  opacity: 0;
  transform: scale(0.95);
}
.img-slide-leave-to {
  opacity: 0;
  transform: scale(1.05);
}
</style>

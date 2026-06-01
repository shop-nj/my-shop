<template>
  <div>
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-1.5 text-sm text-gray-400 mb-6">
      <component :is="previewMode ? 'span' : 'router-link'" to="/" class="hover:text-brand-600 transition-colors cursor-default">Home</component>
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
      <component :is="previewMode ? 'span' : 'router-link'" :to="`/category/${item.category}`" class="hover:text-brand-600 transition-colors capitalize cursor-default">
        {{ item.category || 'category' }}
      </component>
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
      <span class="text-gray-700 font-medium truncate max-w-[200px]">{{ item.displayName }}</span>
    </nav>

    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <!-- Top: gallery + summary -->
      <div class="flex flex-col md:flex-row">

        <!-- Image Gallery -->
        <div class="md:w-2/5 flex flex-col">
          <!-- Main image -->
          <div
            class="relative bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden group/main"
            :class="previewMode ? '' : 'cursor-zoom-in'"
            style="aspect-ratio:4/3"
            @click="!previewMode && openLightbox(activeImageIndex)"
          >
            <Transition name="img-fade" mode="out-in">
              <img
                v-if="currentImageSrc(activeImageIndex)"
                :key="activeImageIndex"
                :src="currentImageSrc(activeImageIndex)"
                :alt="`${item.displayName} — image ${activeImageIndex + 1}`"
                class="w-full h-full object-cover"
                @error="imageErrors[activeImageIndex] = true"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <svg class="w-20 h-20 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="0.75"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
              </div>
            </Transition>

            <!-- Expand hint (real mode only) -->
            <div v-if="!previewMode" class="absolute inset-0 bg-black/0 group-hover/main:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
              <div class="opacity-0 group-hover/main:opacity-100 transition-opacity bg-black/50 rounded-full p-2">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"/>
                </svg>
              </div>
            </div>

            <!-- Prev/Next arrows -->
            <template v-if="displayImages.length > 1">
              <button
                class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full shadow flex items-center justify-center transition-all"
                @click.stop="prevImage"
              >
                <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <button
                class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full shadow flex items-center justify-center transition-all"
                @click.stop="nextImage"
              >
                <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
              <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                <button
                  v-for="(_, i) in displayImages"
                  :key="i"
                  :class="['h-1.5 rounded-full transition-all', i === activeImageIndex ? 'bg-white w-4' : 'bg-white/60 w-1.5']"
                  @click.stop="activeImageIndex = i"
                />
              </div>
            </template>
          </div>

          <!-- Thumbnails -->
          <div v-if="displayImages.length > 1" class="flex gap-2 p-3 bg-gray-50 border-t border-gray-100 overflow-x-auto">
            <button
              v-for="(_, i) in displayImages"
              :key="i"
              :class="[
                'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-150',
                i === activeImageIndex ? 'border-brand-500 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'
              ]"
              @click="activeImageIndex = i"
            >
              <img
                v-if="currentImageSrc(i)"
                :src="currentImageSrc(i)"
                :alt="`Thumbnail ${i+1}`"
                class="w-full h-full object-cover"
                @error="imageErrors[i] = true"
              />
              <div v-else class="w-full h-full bg-slate-100 flex items-center justify-center">
                <svg class="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            </button>
          </div>
        </div>

        <!-- Summary -->
        <div class="flex-1 p-6 lg:p-8 flex flex-col">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-xs font-semibold text-brand-600 bg-brand-50 border border-brand-100 px-2.5 py-0.5 rounded-full capitalize">
              {{ item.category }}
            </span>
            <span v-if="displayImages.length > 1" class="text-xs text-gray-400">{{ displayImages.length }} photos</span>
          </div>

          <h1 class="text-2xl font-bold text-gray-900 tracking-tight">{{ item.displayName }}</h1>
          <p class="mt-2 text-gray-500 leading-relaxed">{{ item.description }}</p>

          <!-- Price options -->
          <div class="mt-6">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Select option</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="(p, i) in item.price"
                :key="i"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-150',
                  selectedPriceIndex === i
                    ? 'bg-brand-600 border-brand-600 text-white shadow-sm'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-brand-400 hover:text-brand-700'
                ]"
                @click="selectedPriceIndex = i"
              >{{ p.text }}</button>
            </div>
            <div class="mt-4 flex items-baseline gap-2">
              <span class="text-3xl font-bold text-gray-900">
                {{ item.currency }} {{ selectedPrice?.discounted ?? selectedPrice?.value }}
              </span>
              <span v-if="selectedPrice?.discounted" class="text-lg text-gray-400 line-through">
                {{ item.currency }} {{ selectedPrice?.value }}
              </span>
            </div>
          </div>

          <!-- Quantity + Add to Cart -->
          <div class="mt-auto pt-6 flex flex-col gap-3">
            <div class="flex items-center gap-4">
              <div>
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Quantity</p>
                <div class="flex items-center border border-gray-200 rounded-xl overflow-hidden w-fit">
                  <button class="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors text-lg leading-none"
                    @click="!previewMode && quantity > 1 && quantity--">−</button>
                  <span class="w-10 text-center text-sm font-semibold text-gray-800">{{ quantity }}</span>
                  <button class="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors text-lg leading-none"
                    @click="!previewMode && quantity++">+</button>
                </div>
              </div>
              <div class="pt-5">
                <p class="text-xs text-gray-400">Total</p>
                <p class="font-bold text-gray-900">
                  {{ item.currency }} {{ ((parseFloat(selectedPrice?.discounted ?? (selectedPrice?.value ?? 0))) * quantity).toFixed(2) }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <button
                class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm"
                :class="previewMode ? 'bg-brand-400 text-white cursor-default' : 'bg-brand-600 text-white hover:bg-brand-700 active:scale-95'"
                @click="handleAddToCart"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                {{ previewMode ? 'Add to Cart (preview)' : 'Add to Cart' }}
              </button>
              <Transition name="toast-fade">
                <router-link
                  v-if="addedToast && !previewMode"
                  to="/cart"
                  class="text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-xl font-medium hover:bg-green-100 transition-colors flex items-center gap-1.5"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Added! View cart →
                </router-link>
              </Transition>
            </div>
          </div>
        </div>
      </div>

      <!-- Detail sections -->
      <div v-if="sortedDetails.length" class="border-t border-gray-100">
        <div class="p-6 lg:p-8">
          <h2 class="text-base font-semibold text-gray-900 mb-6">
            {{ item.detailsSectionHeader || 'Product Details' }}
          </h2>
          <div class="space-y-6">
            <div v-for="(entry, i) in sortedDetails" :key="i">
              <!-- Key-value section (both dataFields array and data object formats) -->
              <template v-if="hasData(entry.section)">
                <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  {{ entry.section.header || entry.section.name }}
                </h3>
                <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 divide-y divide-gray-50">
                  <div v-for="(pair, j) in getDataPairs(entry.section)" :key="j"
                    class="flex items-baseline gap-3 py-2.5">
                    <dt class="text-sm text-gray-400 w-36 shrink-0">{{ pair.key }}</dt>
                    <dd class="text-sm text-gray-800 font-medium">
                      <a v-if="isUrl(pair.value)" :href="pair.value" target="_blank" rel="noopener noreferrer"
                        class="text-brand-600 hover:text-brand-700 hover:underline break-all">
                        {{ pair.value }}
                      </a>
                      <span v-else>{{ pair.value }}</span>
                    </dd>
                  </div>
                </dl>
              </template>

              <!-- Text section -->
              <template v-else-if="entry.section.text">
                <p class="text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-3 leading-relaxed">
                  {{ entry.section.text }}
                </p>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox (real mode only) -->
    <ImageLightbox
      v-if="!previewMode"
      v-model="lightboxOpen"
      :images="allImages"
      :folder="item.imagesFolder"
      :start-index="lightboxStartIndex"
    />
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue'
import ImageLightbox from './ImageLightbox.vue'
import { useCart } from '../composables/useCart.js'

const props = defineProps({
  item: { type: Object, required: true },
  previewImages: { type: Array, default: () => [] }, // blob URLs from image processor
  previewMode: { type: Boolean, default: false },
})

const { addToCart } = useCart()

const selectedPriceIndex = ref(0)
const activeImageIndex = ref(0)
const imageErrors = reactive({})
const lightboxOpen = ref(false)
const lightboxStartIndex = ref(0)
const quantity = ref(1)
const addedToast = ref(false)

// Reset when item changes
watch(() => props.item, () => {
  selectedPriceIndex.value = 0
  activeImageIndex.value = 0
  quantity.value = 1
  addedToast.value = false
  Object.keys(imageErrors).forEach(k => delete imageErrors[k])
}, { deep: false })

// Reset when preview images change
watch(() => props.previewImages, () => {
  activeImageIndex.value = 0
  Object.keys(imageErrors).forEach(k => delete imageErrors[k])
})

// Images: in preview mode use blob URLs, else filenames from item
const allImages = computed(() =>
  props.item?.images?.length ? props.item.images : (props.item?.imagesFolder ? ['main.jpg'] : [])
)

// In preview mode, displayImages drives the count (use previewImages if provided, else allImages)
const displayImages = computed(() =>
  props.previewMode && props.previewImages.length ? props.previewImages : allImages.value
)

// Resolve the actual URL for a given index
const currentImageSrc = (index) => {
  if (imageErrors[index]) return null
  if (props.previewMode && props.previewImages[index]) return props.previewImages[index]
  const filename = allImages.value[index]
  return filename ? `${import.meta.env.BASE_URL}images/${props.item.imagesFolder}/${filename}` : null
}

const selectedPrice = computed(() => props.item?.price?.[selectedPriceIndex.value])

const sortedDetails = computed(() =>
  [...(props.item?.details ?? [])].sort((a, b) => (a.section.order ?? 0) - (b.section.order ?? 0))
)

// Normalise both data formats into [{key, value}] pairs
const hasData = (section) => !!(section.dataFields?.length || section.data)
const getDataPairs = (section) => {
  if (section.dataFields) {
    return [...section.dataFields]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map(f => ({ key: f.name, value: f.value }))
  }
  if (section.data) {
    return Object.entries(section.data).map(([key, value]) => ({ key, value }))
  }
  return []
}

const isUrl = (val) => typeof val === 'string' && /^https?:\/\//i.test(val.trim())

const prevImage = () => {
  activeImageIndex.value = (activeImageIndex.value - 1 + displayImages.value.length) % displayImages.value.length
}
const nextImage = () => {
  activeImageIndex.value = (activeImageIndex.value + 1) % displayImages.value.length
}
const openLightbox = (index) => {
  lightboxStartIndex.value = index
  lightboxOpen.value = true
}

const handleAddToCart = () => {
  if (props.previewMode) return
  addToCart(props.item, selectedPrice.value, quantity.value)
  addedToast.value = true
  setTimeout(() => { addedToast.value = false }, 3000)
}
</script>

<style scoped>
.img-fade-enter-active, .img-fade-leave-active { transition: opacity 0.25s ease; }
.img-fade-enter-from, .img-fade-leave-to { opacity: 0; }
.toast-fade-enter-active, .toast-fade-leave-active { transition: opacity 0.3s ease; }
.toast-fade-enter-from, .toast-fade-leave-to { opacity: 0; }
</style>

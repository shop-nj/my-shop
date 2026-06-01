<template>
  <div>
    <!-- Hero -->
    <div class="mb-8 bg-gradient-to-br from-[#fef3e8] via-[#fdf0e2] to-[#feeee6] rounded-3xl p-7 sm:p-10 border border-brand-100 relative overflow-hidden">
      <!-- Decorative circles -->
      <div class="absolute -top-12 -right-12 w-56 h-56 bg-brand-100 rounded-full opacity-40 pointer-events-none"></div>
      <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-rose-100 rounded-full opacity-30 pointer-events-none"></div>
      <span class="inline-flex items-center gap-1.5 bg-brand-50 text-brand-500 border border-brand-100 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 shadow-sm">
        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        New Arrivals
      </span>

      <h1 class="font-display text-4xl font-semibold text-gray-800 leading-snug">Welcome to <em class="text-brand-500 not-italic">Artful Aura</em></h1>
      <p class="text-gray-500 mt-2 text-base leading-relaxed">Handcrafted with love — browse our latest collection of unique pieces.</p>

      <!-- Category quick links -->
      <div v-if="categories.length" class="flex flex-wrap gap-2 mt-5">
        <router-link
          v-for="cat in categories"
          :key="cat.id"
          :to="`/category/${cat.id}`"
          class="px-3.5 py-1.5 bg-white border border-brand-100 rounded-full text-sm font-medium text-gray-600 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50 transition-all shadow-sm"
        >
          {{ cat.displayName }}
        </router-link>
      </div>
    </div> <!-- end hero card -->

    <!-- Divider -->
    <div class="flex items-center gap-3 mb-6 mt-8">
      <h2 class="font-display text-xl font-semibold text-gray-800">Latest Items</h2>
      <div class="flex-1 h-px bg-brand-100"></div>
      <span class="text-xs text-gray-400">{{ latestItems.length }} items</span>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-16">
      <div class="animate-spin h-7 w-7 border-[3px] border-brand-400 border-t-transparent rounded-full"></div>
    </div>

    <!-- Empty -->
    <div v-else-if="latestItems.length === 0" class="text-center py-16">
      <div class="inline-flex items-center justify-center w-14 h-14 bg-gray-100 rounded-2xl mb-4">
        <svg class="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>
      <p class="text-gray-500 font-medium">No items available yet.</p>
    </div>

    <!-- Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      <ItemCard v-for="item in latestItems" :key="item.id" :item="item" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import ItemCard from './ItemCard.vue'

const items = ref([])
const categories = ref([])
const loading = ref(true)

onMounted(async () => {
  const [itemsRes, catsRes] = await Promise.all([
    fetch(import.meta.env.BASE_URL + 'items.json'),
    fetch(import.meta.env.BASE_URL + 'categories.json')
  ])
  items.value = await itemsRes.json()
  categories.value = (await catsRes.json()).sort((a, b) => a.order - b.order)
  loading.value = false
})

const latestItems = computed(() =>
  [...items.value]
    .sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn))
    .slice(0, 6)
)
</script>

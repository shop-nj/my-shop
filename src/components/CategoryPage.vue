<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <router-link to="/" class="text-sm text-brand-600 hover:underline">← Back to Home</router-link>
      <h1 class="text-2xl font-bold text-gray-800 mt-2">{{ categoryName }}</h1>
      <p class="text-sm text-gray-500 mt-1">{{ filteredItems.length }} item{{ filteredItems.length !== 1 ? 's' : '' }}</p>
    </div>

    <div v-if="loading" class="flex justify-center py-16">
      <div class="animate-spin h-8 w-8 border-4 border-brand-600 border-t-transparent rounded-full"></div>
    </div>

    <div v-else-if="filteredItems.length === 0" class="text-center py-16 text-gray-400">
      <p class="text-5xl mb-3">📭</p>
      <p class="text-lg font-medium">No items in this category yet.</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      <ItemCard v-for="item in filteredItems" :key="item.id" :item="item" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ItemCard from './ItemCard.vue'

const route = useRoute()
const items = ref([])
const categories = ref([])
const loading = ref(true)

const loadData = async () => {
  loading.value = true
  const [itemsRes, catsRes] = await Promise.all([
    fetch(import.meta.env.BASE_URL + 'items.json'),
    fetch(import.meta.env.BASE_URL + 'categories.json')
  ])
  items.value = await itemsRes.json()
  categories.value = await catsRes.json()
  loading.value = false
}

onMounted(loadData)
watch(() => route.params.id, loadData)

const filteredItems = computed(() =>
  items.value.filter(item => item.category === route.params.id)
)

const categoryName = computed(() =>
  categories.value.find(c => c.id === route.params.id)?.displayName ?? route.params.id
)
</script>

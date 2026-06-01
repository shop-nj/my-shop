<template>
  <div v-if="loading" class="flex justify-center py-16">
    <div class="animate-spin h-7 w-7 border-[3px] border-brand-600 border-t-transparent rounded-full"></div>
  </div>

  <div v-else-if="!item" class="text-center py-16">
    <div class="inline-flex items-center justify-center w-14 h-14 bg-gray-100 rounded-2xl mb-4">
      <svg class="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>
    </div>
    <p class="text-gray-500 font-medium">Item not found.</p>
    <router-link to="/" class="mt-3 inline-block text-sm text-brand-600 hover:underline">Back to Home</router-link>
  </div>

  <ProductDetailView v-else :item="item" />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductDetailView from './ProductDetailView.vue'

const route = useRoute()
const item = ref(null)
const loading = ref(true)

const loadItem = async () => {
  loading.value = true
  const res = await fetch(`${import.meta.env.BASE_URL}items.json`)
  const items = await res.json()
  item.value = items.find(i => String(i.id) === String(route.params.id)) ?? null
  loading.value = false
}

onMounted(loadItem)
watch(() => route.params.id, loadItem)
</script>

<template>
  <div class="flex min-h-screen bg-[#fef9f6]">
    <!-- Mobile overlay -->
    <Transition name="fade">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-20 bg-black/50 lg:hidden"
        @click="sidebarOpen = false"
      />
    </Transition>

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-30 w-64 bg-[#e8c0ce] border-r border-brand-200 flex flex-col',
        'transform transition-transform duration-300 ease-in-out',
        'lg:static lg:translate-x-0',
        sidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'
      ]"
    >
      <!-- Brand -->
      <div class="flex items-center gap-3 px-5 h-16 border-b border-brand-200 flex-shrink-0">
        <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-400/80 flex-shrink-0">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <router-link
          to="/"
          class="font-display font-semibold text-gray-800 text-base hover:text-brand-600 transition-colors"
          @click="sidebarOpen = false"
        >
          Artful Aura
        </router-link>
      </div>

      <!-- Nav -->
      <nav class="flex-1 overflow-y-auto px-3 py-4">
        <!-- Home -->
        <router-link
          to="/"
          exact
          class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-brand-100 hover:text-brand-800 transition-colors"
          active-class="bg-brand-200 text-brand-800"
          @click="sidebarOpen = false"
        >
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Home
        </router-link>

        <!-- Cart -->
        <router-link
          to="/cart"
          class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-brand-100 hover:text-brand-800 transition-colors"
          active-class="bg-brand-200 text-brand-800"
          @click="sidebarOpen = false"
        >
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Cart
          <span
            v-if="totalCount > 0"
            class="ml-auto min-w-[20px] h-5 flex items-center justify-center bg-brand-600 text-white text-xs font-bold rounded-full px-1.5"
          >
            {{ totalCount > 99 ? '99+' : totalCount }}
          </span>
        </router-link>

        <!-- Categories -->
        <div class="mt-5">
          <p class="px-3 mb-1.5 text-[11px] font-semibold text-brand-400 uppercase tracking-widest">
            Browse
          </p>
          <router-link
            v-for="cat in categories"
            :key="cat.id"
            :to="`/category/${cat.id}`"
            class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-brand-100 hover:text-brand-800 transition-colors"
            active-class="bg-brand-200 text-brand-800"
            @click="sidebarOpen = false"
          >
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            {{ cat.displayName }}
          </router-link>
        </div>

        <!-- Tools -->
        <div class="mt-5 pt-4 border-t border-brand-200">
          <p class="px-3 mb-1.5 text-[11px] font-semibold text-brand-400 uppercase tracking-widest">
            Tools
          </p>
          <router-link
            to="/json-generator"
            class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-brand-100 hover:text-brand-800 transition-colors"
            active-class="bg-brand-200 text-brand-800"
            @click="sidebarOpen = false"
          >
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            JSON Generator
          </router-link>
        </div>
      </nav>

      <!-- Sidebar footer -->
      <div class="px-5 py-3 border-t border-brand-200">
        <p class="text-xs text-brand-400 font-display italic">© 2025 Artful Aura</p>
      </div>
    </aside>

    <!-- Main area -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Mobile topbar -->
      <header class="lg:hidden sticky top-0 z-10 bg-[#fef9f6]/95 backdrop-blur-sm border-b border-brand-100 px-4 h-14 flex items-center gap-3">
        <button
          class="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          aria-label="Open menu"
          @click="sidebarOpen = true"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div class="flex items-center gap-2">
          <div class="flex items-center justify-center w-6 h-6 rounded-md bg-brand-400">
            <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <span class="font-display font-semibold text-gray-800 text-sm">Artful Aura</span>
        </div>
      </header>

      <main class="flex-1 p-5 sm:p-7">
        <div class="max-w mx-auto">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCart } from './composables/useCart.js'

const categories = ref([])
const sidebarOpen = ref(false)
const { totalCount } = useCart()

onMounted(async () => {
  const res = await fetch(import.meta.env.BASE_URL + 'categories.json')
  categories.value = (await res.json()).sort((a, b) => a.order - b.order)
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

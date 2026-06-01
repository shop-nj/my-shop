<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue"
        class="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm"
        @keydown.esc="$emit('update:modelValue', false)"
        tabindex="-1"
        ref="backdrop"
      >
        <div class="min-h-full flex items-start justify-center p-4 py-8">
          <div class="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-4xl" @click.stop>
            <!-- Header -->
            <div class="flex items-center justify-between px-5 py-4 bg-white rounded-t-2xl border-b border-gray-100">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <span class="font-semibold text-gray-800 text-sm">Product Preview</span>
                <span class="text-xs text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md font-medium">Preview only — cart disabled</span>
              </div>
              <button class="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                @click="$emit('update:modelValue', false)">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- Product detail — exact same component as the real page -->
            <div class="p-5 md:p-6">
              <ProductDetailView
                v-if="item?.displayName"
                :item="item"
                :preview-images="previewImages"
                :preview-mode="true"
              />
              <div v-else class="text-center py-16 text-gray-400">
                <svg class="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <p class="text-sm font-medium text-gray-500">Fill in the form to see a preview</p>
                <p class="text-xs text-gray-400 mt-1">Display name and category are required</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import ProductDetailView from './ProductDetailView.vue'

const props = defineProps({
  modelValue: Boolean,
  item: Object,
  previewImages: { type: Array, default: () => [] },
})
defineEmits(['update:modelValue'])

const backdrop = ref(null)
watch(() => props.modelValue, (val) => {
  if (val) nextTick(() => backdrop.value?.focus())
})
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>

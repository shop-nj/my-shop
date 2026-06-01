<template>
  <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
    <!-- Header -->
    <button
      class="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      @click="expanded = !expanded"
    >
      <div class="flex items-center gap-2.5">
        <svg class="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        <span class="font-semibold text-gray-800">Image Processor</span>
        <span v-if="images.length" class="text-xs text-gray-400 font-normal">
          — {{ images.length }} image{{ images.length !== 1 ? 's' : '' }},
          {{ images.filter(i => i.edited).length }} edited
        </span>
        <span v-else class="text-xs text-gray-400 font-normal">— crop, resize, adjust &amp; download</span>
      </div>
      <svg class="w-4 h-4 text-gray-400 transition-transform duration-200" :class="expanded ? 'rotate-180' : ''"
        fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
      </svg>
    </button>

    <div v-if="expanded" class="border-t border-gray-100 p-5 space-y-5">
      <!-- Upload zone -->
      <div
        class="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors"
        :class="images.length ? 'border-gray-200 hover:border-brand-300 bg-gray-50/50 hover:bg-brand-50/20 py-4' : 'border-gray-200 hover:border-brand-400 hover:bg-brand-50/30 p-10'"
        @click="fileInput.click()"
        @dragover.prevent
        @drop.prevent="onDrop"
      >
        <svg class="text-gray-300 mx-auto mb-2" :class="images.length ? 'w-6 h-6' : 'w-10 h-10'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
        </svg>
        <p class="text-sm font-medium text-gray-600">
          {{ images.length ? 'Add more images' : 'Drop images here or' }}
          <span class="text-brand-600">{{ images.length ? '' : ' browse' }}</span>
        </p>
        <p v-if="!images.length" class="text-xs text-gray-400 mt-1">JPG, PNG, WebP · multiple files supported</p>
        <input ref="fileInput" type="file" accept="image/*" multiple class="hidden" @change="onFileChange" />
      </div>

      <!-- Image grid -->
      <div v-if="images.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        <div
          v-for="(img, idx) in images"
          :key="img.id"
          class="relative group rounded-xl overflow-hidden border-2 transition-colors"
          :class="img.edited ? 'border-green-400' : 'border-gray-100'"
        >
          <!-- Thumbnail -->
          <div class="aspect-square bg-gray-100">
            <img :src="img.processedSrc || img.originalSrc" :alt="img.name"
              class="w-full h-full object-cover" />
          </div>

          <!-- Edited badge -->
          <div v-if="img.edited"
            class="absolute top-1.5 left-1.5 flex items-center gap-1 bg-green-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-md shadow-sm">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
            </svg>
            Edited
          </div>

          <!-- Hover overlay -->
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              class="bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-100 shadow transition-colors"
              @click.stop="openEditor(idx)"
            >Edit</button>
            <button
              class="bg-white text-gray-800 text-xs font-semibold px-2 py-1.5 rounded-lg hover:bg-gray-100 shadow transition-colors"
              @click.stop="downloadOne(img)"
              :title="img.edited ? 'Download processed' : 'Download original'"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
            </button>
          </div>

          <!-- Filename -->
          <div class="px-2 py-1.5 bg-white border-t border-gray-100">
            <p class="text-xs text-gray-500 truncate">{{ img.name }}</p>
          </div>

          <!-- Remove -->
          <button
            class="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all shadow"
            @click.stop="removeImage(idx)"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Download all -->
      <div v-if="images.length > 1" class="flex justify-end">
        <button
          class="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 border border-brand-200 px-4 py-2 rounded-xl hover:bg-brand-50 transition-colors"
          @click="downloadAll"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Download All ({{ images.filter(i => i.edited).length }} edited)
        </button>
      </div>
    </div>
  </div>

  <!-- ===== EDITOR MODAL ===== -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        @keydown.esc="closeEditor"
        tabindex="-1"
        ref="modalBackdrop"
      >
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden" @click.stop>
          <!-- Modal header -->
          <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
              </svg>
              <span class="font-semibold text-gray-800 text-sm">
                Edit: {{ editingIdx >= 0 ? images[editingIdx]?.name : '' }}
              </span>
              <span v-if="images[editingIdx]?.edited" class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-md font-medium">Previously edited</span>
            </div>
            <button class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100" @click="closeEditor">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Modal body -->
          <div class="flex flex-col md:flex-row flex-1 overflow-hidden min-h-0">
            <!-- Cropper -->
            <div class="flex-1 bg-gray-900 flex items-center justify-center min-h-[260px] overflow-hidden" ref="cropperWrapper">
              <img v-if="editSrc" ref="editCropperImg" :src="editSrc" class="max-w-full max-h-full block" />
            </div>

            <!-- Controls sidebar -->
            <div class="w-full md:w-72 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col overflow-y-auto shrink-0">
              <div class="p-4 space-y-5 flex-1">
                <!-- Aspect ratio -->
                <div>
                  <p class="ctrl-label">Aspect Ratio</p>
                  <div class="flex flex-wrap gap-1.5">
                    <button v-for="ar in aspectRatios" :key="ar.label"
                      class="text-xs px-2.5 py-1 rounded-lg border transition-colors"
                      :class="editAspect === ar.value ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'"
                      @click="setAspect(ar.value)"
                    >{{ ar.label }}</button>
                  </div>
                </div>

                <!-- Rotate -->
                <div>
                  <p class="ctrl-label">Rotate</p>
                  <div class="flex gap-2">
                    <button class="flex-1 text-xs px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors" @click="rotate(-90)">↺ 90° Left</button>
                    <button class="flex-1 text-xs px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors" @click="rotate(90)">↻ 90° Right</button>
                  </div>
                </div>

                <!-- Adjustments (live preview) -->
                <div class="space-y-3">
                  <p class="ctrl-label">Adjustments <span class="text-gray-400 font-normal text-xs">(live preview)</span></p>
                  <div v-for="adj in adjustments" :key="adj.key">
                    <div class="flex justify-between mb-1">
                      <label class="text-xs text-gray-600">{{ adj.label }}</label>
                      <span class="text-xs font-medium text-gray-500">{{ editFilters[adj.key] }}{{ adj.unit }}</span>
                    </div>
                    <input type="range" :min="adj.min" :max="adj.max" :step="adj.step"
                      v-model.number="editFilters[adj.key]"
                      class="w-full accent-brand-600 cursor-pointer" />
                  </div>
                  <button v-if="filtersChanged"
                    class="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                    @click="resetFilters">Reset adjustments</button>
                </div>

                <!-- Output size -->
                <div>
                  <p class="ctrl-label">Output Width <span class="text-gray-400 font-normal">(won't upscale)</span></p>
                  <div class="flex gap-1.5 flex-wrap">
                    <button v-for="p in sizePresets" :key="p.value"
                      class="text-xs px-2.5 py-1 rounded-lg border transition-colors"
                      :class="editOutputWidth === p.value ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'"
                      @click="editOutputWidth = p.value"
                    >{{ p.label }}</button>
                  </div>
                </div>

                <!-- Quality -->
                <div>
                  <div class="flex justify-between mb-1">
                    <p class="ctrl-label">JPEG Quality</p>
                    <span class="text-xs font-medium text-gray-500">{{ editQuality }}%</span>
                  </div>
                  <input type="range" min="60" max="100" step="5" v-model.number="editQuality"
                    class="w-full accent-brand-600 cursor-pointer" />
                </div>

                <!-- Filename -->
                <div>
                  <p class="ctrl-label">Filename (no extension)</p>
                  <input v-model="editFilename" class="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-300 font-mono" />
                </div>
              </div>

              <!-- Modal footer -->
              <div class="p-4 border-t border-gray-100 flex gap-2 shrink-0">
                <button
                  class="flex-1 bg-brand-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-brand-700 active:scale-95 transition-all"
                  @click="saveEdit"
                >Save & Close</button>
                <button
                  class="bg-gray-100 text-gray-600 text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-gray-200 transition-colors"
                  @click="closeEditor"
                >Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

const emit = defineEmits(['change'])

// ── State ─────────────────────────────────────────────────────────────────────
const expanded = ref(false)
const fileInput = ref(null)
const images = ref([]) // [{id, name, originalSrc, processedSrc, edited}]

// Modal
const showModal = ref(false)
const modalBackdrop = ref(null)
const editingIdx = ref(-1)
const editSrc = ref(null)
const editCropperImg = ref(null)
const cropperWrapper = ref(null)
const editFilename = ref('image')
const editAspect = ref(NaN)
const editOutputWidth = ref(800)
const editQuality = ref(85)
const editFilters = reactive({ brightness: 100, contrast: 100, saturation: 100 })
let cropperInst = null

// ── Config ────────────────────────────────────────────────────────────────────
const aspectRatios = [
  { label: 'Free', value: NaN },
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '16:9', value: 16 / 9 },
  { label: '3:2', value: 3 / 2 },
]
const sizePresets = [
  { label: '300px', value: 300 },
  { label: '800px', value: 800 },
  { label: '1200px', value: 1200 },
]
const adjustments = [
  { key: 'brightness', label: 'Brightness', min: 50, max: 150, step: 5, unit: '%' },
  { key: 'contrast',   label: 'Contrast',   min: 50, max: 150, step: 5, unit: '%' },
  { key: 'saturation', label: 'Saturation', min: 0,  max: 200, step: 5, unit: '%' },
]

const filtersChanged = computed(() =>
  editFilters.brightness !== 100 || editFilters.contrast !== 100 || editFilters.saturation !== 100
)

// ── Upload ────────────────────────────────────────────────────────────────────
let idCounter = 0
const loadFiles = (files) => {
  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      images.value.push({
        id: ++idCounter,
        name: file.name.replace(/\.[^.]+$/, ''), // strip extension
        originalSrc: e.target.result,
        processedSrc: null,
        edited: false,
      })
    }
    reader.readAsDataURL(file)
  })
}
const onFileChange = (e) => loadFiles(e.target.files)
const onDrop = (e) => loadFiles(e.dataTransfer.files)

// ── Editor open/close ─────────────────────────────────────────────────────────
const openEditor = (idx) => {
  editingIdx.value = idx
  const img = images.value[idx]
  // Start from processed version if already edited, else original
  editSrc.value = img.processedSrc || img.originalSrc
  editFilename.value = img.name
  editAspect.value = NaN
  editOutputWidth.value = 800
  editQuality.value = 85
  Object.assign(editFilters, { brightness: 100, contrast: 100, saturation: 100 })
  showModal.value = true
  nextTick(() => {
    initCropper()
    modalBackdrop.value?.focus()
  })
}

const closeEditor = () => {
  destroyCropper()
  showModal.value = false
  editSrc.value = null
}

// ── Cropper ───────────────────────────────────────────────────────────────────
const initCropper = () => {
  destroyCropper()
  if (!editCropperImg.value) return
  cropperInst = new Cropper(editCropperImg.value, {
    aspectRatio: NaN,
    viewMode: 1,
    dragMode: 'move',
    autoCropArea: 0.85,
    responsive: true,
    restore: false,
    ready() { applyFilterStyle() },
  })
}

const destroyCropper = () => {
  if (cropperInst) { cropperInst.destroy(); cropperInst = null }
}

const setAspect = (val) => {
  editAspect.value = val
  cropperInst?.setAspectRatio(val)
}

const rotate = (deg) => cropperInst?.rotate(deg)

// ── Live filter preview ───────────────────────────────────────────────────────
const applyFilterStyle = () => {
  if (!cropperWrapper.value) return
  const f = `brightness(${editFilters.brightness}%) contrast(${editFilters.contrast}%) saturate(${editFilters.saturation}%)`
  cropperWrapper.value.querySelectorAll('.cropper-canvas, .cropper-view-box img').forEach(el => {
    el.style.filter = f
  })
}

watch(editFilters, applyFilterStyle, { deep: true })

const resetFilters = () => {
  Object.assign(editFilters, { brightness: 100, contrast: 100, saturation: 100 })
}

// ── Save ──────────────────────────────────────────────────────────────────────
const saveEdit = () => {
  if (!cropperInst) return
  const cropped = cropperInst.getCroppedCanvas({ maxWidth: 4096, maxHeight: 4096 })
  if (!cropped) return

  const targetW = Math.min(editOutputWidth.value, cropped.width) // never upscale
  const scale = targetW / cropped.width
  const destW = targetW
  const destH = Math.round(cropped.height * scale)

  const out = document.createElement('canvas')
  out.width = destW
  out.height = destH
  const ctx = out.getContext('2d')
  ctx.filter = `brightness(${editFilters.brightness}%) contrast(${editFilters.contrast}%) saturate(${editFilters.saturation}%)`
  ctx.drawImage(cropped, 0, 0, destW, destH)
  ctx.filter = 'none'

  out.toBlob(blob => {
    const img = images.value[editingIdx.value]
    if (img.processedSrc) URL.revokeObjectURL(img.processedSrc)
    img.processedSrc = URL.createObjectURL(blob)
    img.edited = true
    img.name = editFilename.value || img.name
    closeEditor()
    emit('change', images.value.map(i => ({ name: i.name, src: i.processedSrc || i.originalSrc })))
  }, 'image/jpeg', editQuality.value / 100)
}

// ── Download ──────────────────────────────────────────────────────────────────
const downloadOne = (img) => {
  const a = document.createElement('a')
  a.href = img.processedSrc || img.originalSrc
  a.download = `${img.name}.jpg`
  a.click()
}

const downloadAll = async () => {
  for (const img of images.value) {
    downloadOne(img)
    await new Promise(r => setTimeout(r, 300))
  }
}

// ── Remove ────────────────────────────────────────────────────────────────────
const removeImage = (idx) => {
  const img = images.value[idx]
  if (img.processedSrc) URL.revokeObjectURL(img.processedSrc)
  images.value.splice(idx, 1)
}

// ── Expose processed images for product preview ───────────────────────────────
defineExpose({
  getPreviewUrls: () => images.value.map(i => i.processedSrc || i.originalSrc),
})

onBeforeUnmount(destroyCropper)
</script>

<style scoped>
.ctrl-label {
  @apply text-xs font-semibold text-gray-600 mb-1.5 block;
}
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
</style>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-800">JSON Generator</h1>
      <p class="text-gray-500 mt-1 text-sm">Build a product entry, then copy the JSON into <code class="bg-gray-100 px-1 rounded text-xs">public/items.json</code>.</p>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
      <!-- ===== LEFT: FORM ===== -->
      <div class="space-y-5">

        <!-- Basic Info -->
        <section class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
          <h2 class="font-semibold text-gray-700 text-sm uppercase tracking-widest">Basic Info</h2>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="field-label">ID <span class="text-gray-400 font-normal">(suggested)</span></label>
              <input v-model.number="form.id" type="number" min="1" class="field-input" />
            </div>
            <div>
              <label class="field-label">Currency</label>
              <input v-model="form.currency" class="field-input" placeholder="USD" />
            </div>
          </div>

          <div>
            <label class="field-label">Display Name</label>
            <input v-model="form.displayName" class="field-input" placeholder="Product name" @input="syncFolder" />
          </div>

          <div>
            <label class="field-label">Category</label>
            <select v-model="form.category" class="field-input" @change="syncFolder">
              <option value="">— pick a category —</option>
              <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.displayName }}</option>
            </select>
          </div>

          <div>
            <label class="field-label">Description</label>
            <textarea v-model="form.description" rows="3" class="field-input resize-none" placeholder="Short product description…"></textarea>
          </div>

          <div>
            <label class="field-label">Images Folder <span class="text-gray-400 font-normal">(relative to /public/images/)</span></label>
            <input v-model="form.imagesFolder" class="field-input font-mono text-sm" placeholder="category/product-slug" />
          </div>

          <div>
            <label class="field-label">Created On</label>
            <input v-model="form.createdOnInput" type="datetime-local" class="field-input" />
          </div>
        </section>

        <!-- Pricing -->
        <section class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="font-semibold text-gray-700 text-sm uppercase tracking-widest">Pricing</h2>
            <button class="add-btn" @click="addPrice">+ Add option</button>
          </div>

          <div v-if="form.price.length === 0" class="text-xs text-gray-400 text-center py-4">
            No price options yet — add at least one.
          </div>

          <div v-for="(p, i) in form.price" :key="i" class="flex gap-2 items-start">
            <div class="flex-1">
              <label class="field-label text-xs">Label <span class="text-gray-400">(e.g. 15 inch)</span></label>
              <input v-model="p.text" class="field-input text-sm" placeholder="Option label" />
            </div>
            <div class="w-28">
              <label class="field-label text-xs">Regular Price</label>
              <input v-model="p.value" class="field-input text-sm" placeholder="100" />
            </div>
            <div class="w-28">
              <label class="field-label text-xs whitespace-nowrap">Sale Price <span class="text-gray-400 font-normal">(optional)</span></label>
              <input v-model="p.discounted" class="field-input text-sm"
                :class="p.discounted ? 'border-green-300 focus:ring-green-300' : ''"
                placeholder="—" />
            </div>
            <button class="mt-5 text-red-400 hover:text-red-600 p-1 rounded transition-colors" @click="removePrice(i)" title="Remove">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </section>

        <!-- Detail Sections -->
        <section class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="font-semibold text-gray-700 text-sm uppercase tracking-widest">Detail Sections</h2>
            <div class="flex gap-2">
              <button class="add-btn" @click="addSection('kv')">+ Key-Value</button>
              <button class="add-btn" @click="addSection('text')">+ Text Block</button>
            </div>
          </div>

          <div v-if="form.sections.length === 0" class="text-xs text-gray-400 text-center py-4">
            No sections yet — add key-value specs or a text block.
          </div>

          <div v-for="(sec, si) in form.sections" :key="si"
            class="border border-gray-100 rounded-xl p-4 space-y-3 bg-gray-50/50">
            <!-- Section header -->
            <div class="flex gap-2 items-center">
              <!-- Up / Down -->
              <div class="flex flex-col gap-0.5 mt-4 shrink-0">
                <button
                  class="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                  :disabled="si === 0"
                  @click="moveSectionUp(si)"
                  title="Move up"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7"/>
                  </svg>
                </button>
                <button
                  class="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                  :disabled="si === form.sections.length - 1"
                  @click="moveSectionDown(si)"
                  title="Move down"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
              </div>
              <div class="flex-1">
                <label class="field-label text-xs">Section name</label>
                <input v-model="sec.name" class="field-input text-sm" placeholder="e.g. specs, features, footer" />
              </div>
              <span class="mt-4 text-xs px-2 py-1 rounded-lg font-medium"
                :class="sec.type === 'kv' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'">
                {{ sec.type === 'kv' ? 'Key-Value' : 'Text' }}
              </span>
              <button class="mt-4 text-red-400 hover:text-red-600 p-1 rounded transition-colors" @click="removeSection(si)" title="Remove section">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- KV rows -->
            <template v-if="sec.type === 'kv'">
              <div v-for="(kv, ki) in sec.rows" :key="ki" class="flex gap-2 items-center">
                <!-- Row up/down -->
                <div class="flex flex-col gap-0.5 shrink-0">
                  <button
                    class="w-5 h-5 flex items-center justify-center rounded text-gray-300 hover:bg-gray-200 hover:text-gray-500 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                    :disabled="ki === 0"
                    @click="moveRowUp(sec, ki)"
                    title="Move up"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7"/>
                    </svg>
                  </button>
                  <button
                    class="w-5 h-5 flex items-center justify-center rounded text-gray-300 hover:bg-gray-200 hover:text-gray-500 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                    :disabled="ki === sec.rows.length - 1"
                    @click="moveRowDown(sec, ki)"
                    title="Move down"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>
                </div>
                <input v-model="kv.key" class="field-input text-sm flex-1" placeholder="Key" />
                <input v-model="kv.value" class="field-input text-sm flex-1" placeholder="Value or URL" />
                <button class="text-red-400 hover:text-red-600 p-1 rounded transition-colors" @click="sec.rows.splice(ki, 1)" title="Remove row">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              <button class="text-xs text-brand-600 hover:text-brand-700 font-medium" @click="sec.rows.push({ key: '', value: '' })">+ row</button>
            </template>

            <!-- Text block -->
            <template v-else>
              <textarea v-model="sec.text" rows="3" class="field-input text-sm resize-none" placeholder="Section text…"></textarea>
            </template>
          </div>
        </section>

      </div>

      <!-- ===== RIGHT: PREVIEW ===== -->
      <div class="xl:sticky xl:top-6 space-y-4">
        <!-- Validation -->
        <div v-if="errors.length" class="bg-red-50 border border-red-200 rounded-xl px-4 py-3 space-y-1">
          <p class="text-xs font-semibold text-red-700">Fix before exporting:</p>
          <ul class="list-disc list-inside space-y-0.5">
            <li v-for="e in errors" :key="e" class="text-xs text-red-600">{{ e }}</li>
          </ul>
        </div>

        <!-- JSON output -->
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="flex items-center justify-between px-5 py-3 border-b border-gray-100">
            <span class="text-sm font-semibold text-gray-700">JSON Preview</span>
            <div class="flex gap-2">
              <button
                class="text-xs px-3 py-1.5 rounded-lg border border-brand-200 bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors flex items-center gap-1 font-medium"
                @click="showPreview = true"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                Preview Page
              </button>
              <button
                class="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors flex items-center gap-1"
                @click="copyJson"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
                {{ copied ? 'Copied!' : 'Copy' }}
              </button>
              <button
                class="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors flex items-center gap-1"
                @click="downloadJson"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                Download
              </button>
            </div>
          </div>
          <pre class="text-xs text-gray-700 p-5 overflow-auto max-h-[60vh] leading-relaxed font-mono bg-gray-50"><code>{{ jsonOutput }}</code></pre>
        </div>

        <!-- Hint -->
        <div class="bg-brand-50 border border-brand-100 rounded-xl px-4 py-3">
          <p class="text-xs text-brand-700 font-medium mb-1">How to use</p>
          <ol class="text-xs text-brand-600 space-y-1 list-decimal list-inside">
            <li>Process &amp; download your images to <code class="bg-brand-100 px-1 rounded">public/images/{{ form.imagesFolder || 'category/product' }}/</code></li>
            <li>Copy the JSON above</li>
            <li>Open <code class="bg-brand-100 px-1 rounded">public/items.json</code> and append it to the array</li>
          </ol>
        </div>
      </div>
    </div>

    <!-- Image Processor (full width) -->
    <ImageProcessor ref="imageProcessorRef" @change="onImagesChange" />

    <!-- Product Preview Modal -->
    <ProductPreviewModal
      v-model="showPreview"
      :item="buildJson()"
      :preview-images="previewImageUrls"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import ImageProcessor from './ImageProcessor.vue'
import ProductPreviewModal from './ProductPreviewModal.vue'

// ── State ─────────────────────────────────────────────────────────────────────
const categories = ref([])
const existingIds = ref([])
const copied = ref(false)
const showPreview = ref(false)
const previewImageUrls = ref([])
const imageProcessorRef = ref(null)

const onImagesChange = (imgs) => {
  previewImageUrls.value = imgs.map(i => i.src)
}

const form = reactive({
  id: 1,
  createdOnInput: new Date().toISOString().slice(0, 16),
  displayName: '',
  category: '',
  description: '',
  imagesFolder: '',
  currency: 'USD',
  price: [],
  sections: [],
})

// ── Bootstrap ─────────────────────────────────────────────────────────────────
onMounted(async () => {
  const [catRes, itemsRes] = await Promise.all([
    fetch(import.meta.env.BASE_URL + 'categories.json'),
    fetch(import.meta.env.BASE_URL + 'items.json'),
  ])
  categories.value = (await catRes.json()).sort((a, b) => a.order - b.order)
  const items = await itemsRes.json()
  existingIds.value = items.map(i => i.id)
  const maxId = existingIds.value.length ? Math.max(...existingIds.value) : 0
  form.id = maxId + 1
})

// ── Helpers ──────────────────────────────────────────────────────────────────
const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

const syncFolder = () => {
  if (form.category && form.displayName) {
    form.imagesFolder = `${form.category}/${slugify(form.displayName)}`
  }
}

const formatCreatedOn = (dtLocal) => {
  if (!dtLocal) return ''
  const [date, time] = dtLocal.split('T')
  const [y, m, d] = date.split('-')
  return `${m}/${d}/${y}T${time}`
}

// ── Dynamic lists ─────────────────────────────────────────────────────────────
const addPrice = () => form.price.push({ text: '', value: '', discounted: '' })
const removePrice = (i) => form.price.splice(i, 1)
const addSection = (type) => form.sections.push(
  type === 'kv'
    ? { type: 'kv', name: '', rows: [{ key: '', value: '' }] }
    : { type: 'text', name: '', text: '' }
)
const removeSection = (i) => form.sections.splice(i, 1)

const moveSectionUp = (i) => {
  if (i === 0) return
  const tmp = form.sections.splice(i, 1)[0]
  form.sections.splice(i - 1, 0, tmp)
}
const moveSectionDown = (i) => {
  if (i === form.sections.length - 1) return
  const tmp = form.sections.splice(i, 1)[0]
  form.sections.splice(i + 1, 0, tmp)
}
const moveRowUp = (sec, ri) => {
  if (ri === 0) return
  const tmp = sec.rows.splice(ri, 1)[0]
  sec.rows.splice(ri - 1, 0, tmp)
}
const moveRowDown = (sec, ri) => {
  if (ri === sec.rows.length - 1) return
  const tmp = sec.rows.splice(ri, 1)[0]
  sec.rows.splice(ri + 1, 0, tmp)
}

// ── Validation ────────────────────────────────────────────────────────────────
const errors = computed(() => {
  const errs = []
  if (!form.displayName.trim()) errs.push('Display name is required.')
  if (!form.category) errs.push('Category is required.')
  if (form.price.length === 0) errs.push('At least one price option is required.')
  form.price.forEach((p, i) => {
    if (!p.text.trim()) errs.push(`Price option ${i + 1}: label is empty.`)
    if (!p.value.toString().trim() || isNaN(Number(p.value))) errs.push(`Price option ${i + 1}: regular price must be a number.`)
    if (p.discounted && isNaN(Number(p.discounted))) errs.push(`Price option ${i + 1}: sale price must be a number.`)
    if (p.discounted && Number(p.discounted) >= Number(p.value)) errs.push(`Price option ${i + 1}: sale price should be less than regular price.`)
  })
  form.sections.forEach((sec, i) => {
    if (!sec.name.trim()) errs.push(`Section ${i + 1}: name is required.`)
    if (sec.type === 'kv') {
      if (sec.rows.length === 0) errs.push(`Section "${sec.name || i + 1}": add at least one row.`)
      sec.rows.forEach((row, ri) => {
        if (!row.key.trim()) errs.push(`Section "${sec.name || i + 1}" row ${ri + 1}: key is empty.`)
      })
    } else {
      if (!sec.text.trim()) errs.push(`Section "${sec.name || i + 1}": text block is empty.`)
    }
  })
  if (existingIds.value.includes(form.id)) errs.push(`ID ${form.id} already exists in items.json.`)
  return errs
})

// ── JSON builder ──────────────────────────────────────────────────────────────
const buildJson = () => ({
  id: form.id,
  createdOn: formatCreatedOn(form.createdOnInput),
  displayName: form.displayName.trim(),
  category: form.category,
  description: form.description.trim(),
  imagesFolder: form.imagesFolder.trim(),
  price: form.price.map(p => {
    const entry = { text: p.text.trim(), value: String(p.value) }
    if (p.discounted?.toString().trim()) entry.discounted = String(p.discounted)
    return entry
  }),
  currency: form.currency.trim() || 'USD',
  details: form.sections.map(sec =>
    sec.type === 'kv'
      ? { section: { name: sec.name.trim(), data: Object.fromEntries(sec.rows.map(r => [r.key.trim(), r.value.trim()])) } }
      : { section: { name: sec.name.trim(), text: sec.text.trim() } }
  ),
})

const jsonOutput = computed(() => JSON.stringify(buildJson(), null, 2))

// ── Export actions ────────────────────────────────────────────────────────────
const copyJson = async () => {
  await navigator.clipboard.writeText(jsonOutput.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

const downloadJson = () => {
  const blob = new Blob([jsonOutput.value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${slugify(form.displayName || 'item')}.json`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.field-label {
  @apply block text-xs font-semibold text-gray-600 mb-1;
}
.field-input {
  @apply w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 bg-white transition-shadow;
}
.add-btn {
  @apply text-xs px-3 py-1.5 rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors font-medium;
}
</style>

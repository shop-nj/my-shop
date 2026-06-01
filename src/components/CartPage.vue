<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Shopping Cart</h1>
        <p class="text-sm text-gray-500 mt-0.5">
          {{ items.length === 0 ? 'Your cart is empty' : `${totalCount} item${totalCount !== 1 ? 's' : ''}` }}
        </p>
      </div>
      <button
        v-if="items.length"
        class="text-sm text-red-500 hover:text-red-600 hover:underline transition-colors"
        @click="clearCart"
      >
        Clear cart
      </button>
    </div>

    <!-- Empty state -->
    <div v-if="items.length === 0" class="text-center py-20">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <p class="text-gray-500 font-medium mb-4">Nothing in your cart yet.</p>
      <router-link
        to="/"
        class="inline-flex items-center gap-2 bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-700 transition-colors"
      >
        Browse items
      </router-link>
    </div>

    <!-- Cart content -->
    <div v-else class="flex flex-col lg:flex-row gap-6">

      <!-- Left: items + customer info -->
      <div class="flex-1 min-w-0 space-y-4">
        <!-- Cart items -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div
            v-for="(ci, idx) in items"
            :key="`${ci.itemId}-${ci.selectedOption.text}`"
            :class="['flex gap-4 p-4', idx !== 0 ? 'border-t border-gray-50' : '']"
          >
            <!-- Thumbnail -->
            <router-link :to="`/item/${ci.itemId}`" class="flex-shrink-0">
              <div class="w-20 h-20 rounded-xl overflow-hidden bg-slate-100">
                <img
                  v-if="ci.imagesFolder"
                  :src="`${$baseUrl}images/${ci.imagesFolder}/${ci.images?.[0] ?? 'main.jpg'}`"
                  :alt="ci.displayName"
                  class="w-full h-full object-cover"
                  @error="(e) => e.target.style.display='none'"
                />
              </div>
            </router-link>

            <!-- Details -->
            <div class="flex-1 min-w-0">
              <router-link :to="`/item/${ci.itemId}`" class="font-semibold text-gray-900 hover:text-brand-700 transition-colors line-clamp-1">
                {{ ci.displayName }}
              </router-link>
              <p class="text-xs text-gray-500 mt-0.5 capitalize">{{ ci.category }} · {{ ci.selectedOption.text }}</p>

              <div class="flex items-center justify-between mt-3">
                <!-- Quantity control -->
                <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    class="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors text-lg leading-none"
                    @click="updateQuantity(ci.itemId, ci.selectedOption.text, ci.quantity - 1)"
                  >−</button>
                  <span class="w-9 text-center text-sm font-semibold text-gray-800">{{ ci.quantity }}</span>
                  <button
                    class="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors text-lg leading-none"
                    @click="updateQuantity(ci.itemId, ci.selectedOption.text, ci.quantity + 1)"
                  >+</button>
                </div>

                <!-- Line total + remove -->
                <div class="flex items-center gap-4">
                  <span class="font-bold text-gray-900 text-sm">
                    {{ ci.currency }} {{ lineTotal(ci).toFixed(2) }}
                  </span>
                  <button
                    class="text-gray-300 hover:text-red-400 transition-colors"
                    title="Remove item"
                    @click="removeFromCart(ci.itemId, ci.selectedOption.text)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Customer Info -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 class="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg class="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Your Details
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1.5">
                Email address <span class="text-red-500">*</span>
              </label>
              <input
                v-model="customer.email"
                type="email"
                placeholder="you@example.com"
                class="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition"
                :class="{ 'border-red-300 focus:ring-red-300': errors.email }"
              />
              <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1.5">
                Phone number <span class="text-red-500">*</span>
              </label>
              <input
                v-model="customer.phone"
                type="tel"
                placeholder="+1 555 000 0000"
                class="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition"
                :class="{ 'border-red-300 focus:ring-red-300': errors.phone }"
              />
              <p v-if="errors.phone" class="mt-1 text-xs text-red-500">{{ errors.phone }}</p>
            </div>
          </div>
          <div class="mt-4">
            <label class="block text-xs font-medium text-gray-600 mb-1.5">Notes <span class="text-gray-400">(optional)</span></label>
            <textarea
              v-model="customer.notes"
              placeholder="Any special instructions or requests..."
              rows="2"
              class="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition resize-none"
            />
          </div>
        </div>
      </div>

      <!-- Right: order summary (sticky on lg) -->
      <div class="lg:w-80 lg:flex-shrink-0">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:sticky lg:top-8">
          <h2 class="text-sm font-semibold text-gray-900 mb-4">Order Summary</h2>

          <!-- Item lines -->
          <div class="space-y-2 mb-4">
            <div v-for="ci in items" :key="`${ci.itemId}-${ci.selectedOption.text}`"
                 class="flex justify-between text-sm text-gray-600">
              <span class="truncate max-w-[170px]">{{ ci.displayName }} × {{ ci.quantity }}</span>
              <span class="font-medium text-gray-800 ml-2 flex-shrink-0">
                {{ ci.currency }} {{ lineTotal(ci).toFixed(2) }}
              </span>
            </div>
          </div>

          <div class="border-t border-gray-100 pt-3 mb-3 space-y-2">
            <div class="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span class="font-medium">{{ currency }} {{ subtotal.toFixed(2) }}</span>
            </div>

            <!-- Coupon row -->
            <div v-if="appliedCoupon" class="flex justify-between text-sm text-green-700 bg-green-50 -mx-1 px-1 py-1 rounded-lg">
              <span class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ appliedCoupon.code }}
                <span class="text-green-600 text-xs">({{ appliedCoupon.description }})</span>
              </span>
              <div class="flex items-center gap-1.5">
                <span class="font-medium">−{{ currency }} {{ discount.toFixed(2) }}</span>
                <button class="text-green-400 hover:text-red-400 transition-colors" @click="removeCoupon">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Total -->
          <div class="flex justify-between items-baseline border-t border-gray-100 pt-3 mb-5">
            <span class="font-semibold text-gray-900">Total</span>
            <span class="text-2xl font-bold text-gray-900">{{ currency }} {{ total.toFixed(2) }}</span>
          </div>

          <!-- Coupon input -->
          <div v-if="!appliedCoupon" class="mb-5">
            <p class="text-xs font-medium text-gray-600 mb-1.5">Discount coupon</p>
            <div class="flex gap-2">
              <input
                v-model="couponInput"
                type="text"
                placeholder="Enter code"
                class="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent uppercase"
                @keyup.enter="applyCoupon"
              />
              <button
                class="px-3 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
                @click="applyCoupon"
              >
                Apply
              </button>
            </div>
            <p v-if="couponError" class="mt-1 text-xs text-red-500">{{ couponError }}</p>
          </div>

          <!-- Place order -->
          <button
            class="w-full bg-brand-600 text-white font-semibold py-3 rounded-xl hover:bg-brand-700 active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2 text-sm"
            @click="placeOrder"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Place Order via Email
          </button>
          <p class="text-xs text-gray-400 text-center mt-2">
            Opens your email client with a pre-filled order.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCart } from '../composables/useCart.js'

const { items, removeFromCart, updateQuantity, clearCart, totalCount, subtotal } = useCart()

// Customer info
const customer = ref({ email: '', phone: '', notes: '' })
const errors = ref({ email: '', phone: '' })

// Coupons
const couponInput = ref('')
const couponError = ref('')
const appliedCoupon = ref(null)
const allCoupons = ref([])

fetch(import.meta.env.BASE_URL + 'coupons.json').then(r => r.json()).then(d => { allCoupons.value = d })

const currency = computed(() => items.value[0]?.currency ?? 'USD')

const lineTotal = (ci) => {
  const price = parseFloat(ci.selectedOption.discounted ?? ci.selectedOption.value)
  return price * ci.quantity
}

const discount = computed(() => {
  if (!appliedCoupon.value) return 0
  if (appliedCoupon.value.type === 'percentage') {
    return subtotal.value * (appliedCoupon.value.value / 100)
  }
  return Math.min(appliedCoupon.value.value, subtotal.value)
})

const total = computed(() => Math.max(0, subtotal.value - discount.value))

const applyCoupon = () => {
  couponError.value = ''
  const code = couponInput.value.trim().toUpperCase()
  if (!code) { couponError.value = 'Please enter a coupon code.'; return }

  const found = allCoupons.value.find(c => c.code === code)
  if (!found) { couponError.value = `"${code}" is not a valid coupon.`; return }

  appliedCoupon.value = found
  couponInput.value = ''
}

const removeCoupon = () => { appliedCoupon.value = null }

// Validation
const validate = () => {
  errors.value = { email: '', phone: '' }
  let valid = true
  if (!customer.value.email.trim()) {
    errors.value.email = 'Email is required.'
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.value.email)) {
    errors.value.email = 'Please enter a valid email.'
    valid = false
  }
  if (!customer.value.phone.trim()) {
    errors.value.phone = 'Phone number is required.'
    valid = false
  }
  return valid
}

const placeOrder = () => {
  if (!validate()) return

  const date = new Date().toLocaleString()
  const itemLines = items.value
    .map(ci => `  • ${ci.displayName} [${ci.selectedOption.text}] × ${ci.quantity} = ${ci.currency} ${lineTotal(ci).toFixed(2)}`)
    .join('\n')

  const couponLine = appliedCoupon.value
    ? `\nCoupon Applied : ${appliedCoupon.value.code} (${appliedCoupon.value.description})\nDiscount       : -${currency.value} ${discount.value.toFixed(2)}`
    : ''

  const body =
`ORDER DETAILS
=============
Date    : ${date}
Email   : ${customer.value.email}
Phone   : ${customer.value.phone}${customer.value.notes ? `\nNotes   : ${customer.value.notes}` : ''}

ITEMS:
${itemLines}

─────────────────────────
Subtotal : ${currency.value} ${subtotal.value.toFixed(2)}${couponLine}
TOTAL    : ${currency.value} ${total.value.toFixed(2)}
─────────────────────────

Please confirm this order and get back to me at your earliest convenience.`

  const subject = encodeURIComponent(`New Order — ${customer.value.email}`)
  const encodedBody = encodeURIComponent(body)
  window.location.href = `mailto:shop@example.com?subject=${subject}&body=${encodedBody}`
}
</script>

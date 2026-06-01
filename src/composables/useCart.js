import { ref, computed, watch, readonly } from 'vue'

const STORAGE_KEY = 'myshop-cart'

// Module-level singleton so cart state is shared across all components
const _items = ref(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))

watch(_items, (val) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
}, { deep: true })

function _key(itemId, optionText) {
  return `${itemId}::${optionText}`
}

function addToCart(item, selectedOption, quantity = 1) {
  const existing = _items.value.find(
    ci => _key(ci.itemId, ci.selectedOption.text) === _key(item.id, selectedOption.text)
  )
  if (existing) {
    existing.quantity += quantity
  } else {
    _items.value = [
      ..._items.value,
      {
        itemId: item.id,
        displayName: item.displayName,
        category: item.category,
        imagesFolder: item.imagesFolder,
        images: item.images || null,
        selectedOption,
        quantity,
        currency: item.currency
      }
    ]
  }
}

function removeFromCart(itemId, optionText) {
  _items.value = _items.value.filter(
    ci => _key(ci.itemId, ci.selectedOption.text) !== _key(itemId, optionText)
  )
}

function updateQuantity(itemId, optionText, quantity) {
  if (quantity <= 0) {
    removeFromCart(itemId, optionText)
    return
  }
  const item = _items.value.find(
    ci => _key(ci.itemId, ci.selectedOption.text) === _key(itemId, optionText)
  )
  if (item) item.quantity = quantity
}

function clearCart() {
  _items.value = []
}

const totalCount = computed(() =>
  _items.value.reduce((sum, ci) => sum + ci.quantity, 0)
)

const subtotal = computed(() =>
  _items.value.reduce((sum, ci) => {
    const price = parseFloat(ci.selectedOption.discounted ?? ci.selectedOption.value)
    return sum + price * ci.quantity
  }, 0)
)

export function useCart() {
  return {
    items: readonly(_items),
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalCount,
    subtotal
  }
}

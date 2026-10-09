import { products } from './products.js'

// Модель запису про продаж:
// { productId: 'prod-001', date: '2026-10-08', time: '14:35', quantity: 2 }
//
// Демонстраційні дані генеруються детерміновано: той самий день і товар
// завжди дають ті самі значення, тож графік не змінюється між оновленнями.
// Замість generateSales() можна підставити власний масив такого ж вигляду.

function hashString(text) {
  let hash = 2166136261
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function createRandom(seed) {
  let state = seed
  return function random() {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pad(value) {
  return String(value).padStart(2, '0')
}

function formatDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function generateSales() {
  const today = new Date()
  const start = new Date(today.getFullYear() - 3, 0, 1)
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const records = []

  for (const product of products) {
    const profile = createRandom(hashString(product.id))
    const chance = 0.25 + profile() * 0.6
    const maxQuantity = 2 + Math.floor(profile() * 5)

    for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
      const date = formatDate(day)
      const random = createRandom(hashString(`${product.id}:${date}`))

      if (random() >= chance) {
        continue
      }

      const purchases = 1 + Math.floor(random() * 3)
      for (let i = 0; i < purchases; i += 1) {
        records.push({
          productId: product.id,
          date,
          time: `${pad(8 + Math.floor(random() * 13))}:${pad(Math.floor(random() * 60))}`,
          quantity: 1 + Math.floor(random() * maxQuantity),
        })
      }
    }
  }

  return records
}

export const sales = generateSales()
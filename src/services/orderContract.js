import { products } from '../data/products.js'
import { suppliers } from '../data/suppliers.js'
import { ORDER_KIND, ORDER_STATUS, validateOrder } from '../domain/orderValidation.js'
import { ServiceError } from './ServiceError.js'

const STATUSES = Object.values(ORDER_STATUS)
const KINDS = Object.values(ORDER_KIND)

// Команда запису: перевіряємо ті самі правила, що й форма, і залишаємо лише дозволені поля.
export function toOrderInput(input) {
  const result = validateOrder(input ?? {}, { products, suppliers })
  if (!result.ok) {
    throw new ServiceError('Перевірте поля замовлення.', {
      code: 'VALIDATION',
      errors: result.errors,
      itemErrors: result.itemErrors,
    })
  }
  return result.value
}

function isItem(value) {
  return value !== null
    && typeof value === 'object'
    && typeof value.productId === 'string'
    && Number.isInteger(value.quantity)
    && value.quantity > 0
    && typeof value.comment === 'string'
    && (value.supplierId === undefined
      || value.supplierId === null
      || typeof value.supplierId === 'string')
}

function copyItem(item) {
  const copy = { productId: item.productId, quantity: item.quantity, comment: item.comment }
  if (Object.hasOwn(item, 'supplierId')) {
    copy.supplierId = item.supplierId
  }
  return copy
}

// Мінімальна перевірка структури прочитаного запису; повертає окремий об'єкт.
export function toOrder(value) {
  const valid = value !== null
    && typeof value === 'object'
    && typeof value.id === 'string'
    && value.id.length > 0
    && typeof value.date === 'string'
    && /^\d{4}-\d{2}-\d{2}$/.test(value.date)
    && STATUSES.includes(value.status)
    && KINDS.includes(value.kind)
    && (value.supplierId === null || typeof value.supplierId === 'string')
    && Array.isArray(value.items)
    && value.items.length > 0
    && value.items.every(isItem)

  if (!valid) {
    throw new ServiceError('Джерело повернуло некоректний запис замовлення.', {
      code: 'BAD_DATA',
    })
  }

  return {
    id: value.id,
    date: value.date,
    status: value.status,
    kind: value.kind,
    supplierId: value.supplierId,
    items: value.items.map(copyItem),
  }
}

export function toOrderList(value) {
  if (!Array.isArray(value)) {
    throw new ServiceError('Джерело повернуло некоректний список.', { code: 'BAD_DATA' })
  }

  const records = value.map(toOrder)
  if (new Set(records.map((record) => record.id)).size !== records.length) {
    throw new ServiceError('Джерело повернуло повторні ідентифікатори.', { code: 'BAD_DATA' })
  }
  return records
}
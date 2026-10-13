import { ORDER_STATUS } from './orderValidation.js'

export const LOW_STOCK_THRESHOLD = 5


const IN_TRANSIT = [ORDER_STATUS.new, ORDER_STATUS.sent]
export function isInTransit(order) {
  return IN_TRANSIT.includes(order.status)
}

export function orderedByProduct(orders) {
  const ordered = new Map()

    for (const order of orders) {
        if (!isInTransit(order)) { continue }
        for (const item of order.items) {
        ordered.set(item.productId, (ordered.get(item.productId) ?? 0) + item.quantity)
        }
    }

  return ordered
}

export function stockLevel(quantity, ordered = 0) {
  const total = quantity + ordered
  let status = 'ok'

  if (total === 0) {
    status = 'out'
  } else if (total <= LOW_STOCK_THRESHOLD) {
    status = 'low'
  }

  return { quantity, ordered, total, status }
}

export function isDeficit(item) {
  return stockLevel(item.quantity, item.ordered).status !== 'ok'
}

export function withOrdered(product, orderedMap) {
  return { ...product, ordered: orderedMap.get(product.id) ?? 0 }
}
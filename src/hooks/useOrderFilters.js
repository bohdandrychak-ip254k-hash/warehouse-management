import { useSearchParams } from 'react-router'
import { ORDER_STATUS } from '../domain/orderValidation.js'
import { KIND_LABEL, findSupplier, totalQuantity } from '../domain/orderView.js'
import {
  DEFAULT_SORT,
  DEFAULT_STATUS_FILTER,
  SORT_OPTIONS,
} from '../domain/orderListOptions.js'

export default function useOrderFilters(orders, items, suppliers) {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const rawStatus = searchParams.get('status')
  const status = Object.hasOwn(ORDER_STATUS, rawStatus) ? rawStatus : DEFAULT_STATUS_FILTER
  const rawSort = searchParams.get('sort')
  const sort = SORT_OPTIONS.some((option) => option.value === rawSort) ? rawSort : DEFAULT_SORT

  const names = new Map(items.map((item) => [item.id, item.name]))
  const firstName = (order) => names.get(order.items[0]?.productId) ?? ''
  const normalizedQuery = query.trim().toLocaleLowerCase('uk')

  const visibleOrders = orders.filter((order) => {
    const text = [
      order.id,
      KIND_LABEL[order.kind],
      findSupplier(order, suppliers)?.name ?? '',
      ...order.items.map((item) => `${names.get(item.productId) ?? ''} ${item.comment}`),
    ]
      .join(' ')
      .toLocaleLowerCase('uk')
    const matchesStatus = status === DEFAULT_STATUS_FILTER || order.status === ORDER_STATUS[status]
    return text.includes(normalizedQuery) && matchesStatus
  })

  const byId = (a, b) => a.id.localeCompare(b.id, 'uk', { numeric: true })

  visibleOrders.sort((a, b) => {
    if (sort === 'date-asc') {
      return a.date.localeCompare(b.date) || byId(a, b)
    }
    if (sort === 'quantity-desc') {
      return totalQuantity(b) - totalQuantity(a) || byId(a, b)
    }
    if (sort === 'quantity-asc') {
      return totalQuantity(a) - totalQuantity(b) || byId(a, b)
    }
    if (sort === 'product') {
      return firstName(a).localeCompare(firstName(b), 'uk') || byId(a, b)
    }
    return b.date.localeCompare(a.date) || byId(b, a)
  })

  const canReset = query !== '' || status !== DEFAULT_STATUS_FILTER || sort !== DEFAULT_SORT

  function setParameter(name, value, defaultValue, replace = false) {
    const next = new URLSearchParams(searchParams)
    if (value === defaultValue) {
      next.delete(name)
    } else {
      next.set(name, value)
    }
    setSearchParams(next, { replace })
  }

  function resetFilters() {
    const next = new URLSearchParams(searchParams)
    next.delete('q')
    next.delete('status')
    next.delete('sort')
    setSearchParams(next)
  }

  return {
    query,
    status,
    sort,
    visibleOrders,
    canReset,
    setQuery: (value) => setParameter('q', value, '', true),
    setStatus: (value) => setParameter('status', value, DEFAULT_STATUS_FILTER),
    setSort: (value) => setParameter('sort', value, DEFAULT_SORT),
    resetFilters,
  }
}
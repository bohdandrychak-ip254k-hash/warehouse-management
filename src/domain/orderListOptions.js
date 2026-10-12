import { ORDER_STATUS } from './orderValidation.js'

export const DEFAULT_STATUS_FILTER = 'all'
export const DEFAULT_SORT = 'date-desc'

export const STATUS_FILTER_OPTIONS = [
  { value: DEFAULT_STATUS_FILTER, label: 'Усі статуси' },
  ...Object.entries(ORDER_STATUS).map(([value, label]) => ({ value, label })),
]

export const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Спочатку нові' },
  { value: 'date-asc', label: 'Спочатку старі' },
  { value: 'quantity-desc', label: 'Більша кількість спочатку' },
  { value: 'quantity-asc', label: 'Менша кількість спочатку' },
  { value: 'product', label: 'За назвою товару' },
]
import { mockOrderService } from './mockOrderService.js'
import { createApiOrderService } from './apiOrderService.js'

const source = import.meta.env.VITE_DATA_SOURCE ?? 'mock'

function selectService() {
  if (source === 'mock') {
    return mockOrderService
  }
  if (source === 'api') {
    return createApiOrderService(import.meta.env.VITE_API_BASE_URL)
  }
  throw new Error(`Unsupported data source: ${source}`)
}

// Єдине місце вибору реалізації: решта коду імпортує лише orderService.
export const orderService = selectService()
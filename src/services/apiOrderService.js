import { ServiceError } from './ServiceError.js'
import { toOrder, toOrderInput, toOrderList } from './orderContract.js'

// Єдине місце, де зовнішній формат записів перетворюється на внутрішній.
// Для навчального REST контракту формати збігаються, тож перетворення тотожні.
// Якщо справжнє API повертає { items: [...] }, числові id чи інші назви полів,
// змінюйте лише ці дві функції.
function adaptRecord(raw) {
  return raw
}

function adaptList(raw) {
  return raw
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function normalizeBase(baseUrl) {
  if (typeof baseUrl !== 'string' || baseUrl.trim() === '') {
    throw new Error('VITE_API_BASE_URL is required when VITE_DATA_SOURCE=api')
  }

  const trimmed = baseUrl.trim().replace(/\/+$/, '')
  if (!/^https?:\/\//.test(trimmed) && !trimmed.startsWith('/')) {
    throw new Error(`VITE_API_BASE_URL must start with http://, https:// or /, got: ${baseUrl}`)
  }
  return trimmed
}

function failureFor(status, payload) {
  if (status === 404) {
    return new ServiceError('Замовлення не знайдено.', { code: 'NOT_FOUND', status })
  }
  if (status === 400 || status === 422) {
    return new ServiceError('Сервіс відхилив поля замовлення.', {
      code: 'VALIDATION',
      status,
      errors: isPlainObject(payload?.errors) ? payload.errors : undefined,
      itemErrors: isPlainObject(payload?.itemErrors) ? payload.itemErrors : undefined,
    })
  }
  if (status === 401 || status === 403) {
    return new ServiceError('Немає доступу до сервісу замовлень.', { code: 'ACCESS', status })
  }
  if (status >= 500) {
    return new ServiceError('Сервіс замовлень тимчасово недоступний.', { code: 'SERVER', status })
  }
  return new ServiceError('Сервіс відхилив запит.', { code: 'HTTP', status })
}

export function createApiOrderService(baseUrl) {
  const root = normalizeBase(baseUrl)

  async function send(path, { method = 'GET', body, signal } = {}) {
    const headers = { Accept: 'application/json' }
    if (body !== undefined) {
      headers['Content-Type'] = 'application/json'
    }

    let response
    try {
      response = await fetch(`${root}${path}`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        signal,
      })
    } catch (cause) {
      // Скасування не є збоєм сервісу: його пропускаємо як є.
      if (cause?.name === 'AbortError') {
        throw cause
      }
      throw new ServiceError('Не вдалося зв’язатися із сервісом замовлень.', { code: 'NETWORK' })
    }

    // fetch не відхиляє Promise для 404 чи 500: статус перевіряємо явно.
    if (!response.ok) {
      let payload
      if (response.status === 400 || response.status === 422) {
        try {
          payload = await response.json()
        } catch {
          payload = undefined
        }
      }
      throw failureFor(response.status, payload)
    }
    return response
  }

  async function readJson(response) {
    try {
      return await response.json()
    } catch (cause) {
      if (cause?.name === 'AbortError') {
        throw cause
      }
      throw new ServiceError('Джерело повернуло некоректну відповідь.', {
        code: 'BAD_DATA',
        status: response.status,
      })
    }
  }

  return {
    async getAll({ signal } = {}) {
      const response = await send('/orders', { signal })
      return toOrderList(adaptList(await readJson(response)))
    },

    async getById(id, { signal } = {}) {
      const response = await send(`/orders/${encodeURIComponent(id)}`, { signal })
      return toOrder(adaptRecord(await readJson(response)))
    },

    async create(input) {
      const value = toOrderInput(input)
      const response = await send('/orders', { method: 'POST', body: value })
      return toOrder(adaptRecord(await readJson(response)))
    },

    // Тип і постачальник замовлення не змінюються: на сервер передаємо лише позиції,
    // а їхню предметну перевірку (з урахуванням типу) виконує сервер.
    async update(id, input) {
      if (!Array.isArray(input?.items) || input.items.length === 0) {
        throw new ServiceError('Перевірте поля замовлення.', {
          code: 'VALIDATION',
          errors: { items: 'Додайте до замовлення хоча б одну позицію.' },
        })
      }
      const response = await send(`/orders/${encodeURIComponent(id)}`, {
        method: 'PUT',
        body: { items: input.items },
      })
      return toOrder(adaptRecord(await readJson(response)))
    },

    // 204 No Content: тіла немає, JSON не читаємо.
    async delete(id) {
      await send(`/orders/${encodeURIComponent(id)}`, { method: 'DELETE' })
    },
  }
}
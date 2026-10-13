import { orders as initialOrders } from '../data/orders.js'
import { ORDER_STATUS } from '../domain/orderValidation.js'
import { ServiceError } from './ServiceError.js'
import { toOrder, toOrderInput, toOrderList } from './orderContract.js'

const recordsKey = 'warehouse.orders.v1'
const counterKey = 'warehouse.orders.counter.v1'


export const mockSettings = { delayMs: 600 }

const failures = new Set()

export function failNextMockOrder(operation) {
  failures.add(operation)
}

export function clearMockFailures() {
  failures.clear()
}

function pause(signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'))
      return
    }

    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', abort)
      resolve()
    }, mockSettings.delayMs)

    function abort() {
      clearTimeout(timer)
      signal?.removeEventListener('abort', abort)
      reject(new DOMException('Aborted', 'AbortError'))
    }

    signal?.addEventListener('abort', abort, { once: true })
  })
}

async function before(operation, signal) {
  await pause(signal)
  if (failures.delete(operation)) {
    throw new ServiceError('Навчальна відмова сервісу. Повторіть дію.', {
      code: 'MOCK_FAILURE',
    })
  }
}

function read() {
  try {
    const raw = localStorage.getItem(recordsKey)
    return toOrderList(raw === null ? initialOrders : JSON.parse(raw))
  } catch (error) {
    if (error instanceof ServiceError) {
      throw error
    }
    throw new ServiceError('Не вдалося прочитати локальні дані.', { code: 'STORAGE_READ' })
  }
}

function save(key, text) {
  try {
    localStorage.setItem(key, text)
  } catch {
    throw new ServiceError('Не вдалося зберегти локальні дані.', { code: 'STORAGE_WRITE' })
  }
}

function readCounter() {
  try {
    const number = Number(localStorage.getItem(counterKey))
    return Number.isInteger(number) && number > 0 ? number : 0
  } catch {
    throw new ServiceError('Не вдалося прочитати локальні дані.', { code: 'STORAGE_READ' })
  }
}

function highestNumber(records) {
  return records.reduce((highest, record) => {
    const match = /^ord-(\d+)$/.exec(record.id)
    return match ? Math.max(highest, Number(match[1])) : highest
  }, 0)
}

function todayIso() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

function findRecord(records, id) {
  const record = records.find((entry) => entry.id === id)
  if (!record) {
    throw new ServiceError('Замовлення не знайдено.', { code: 'NOT_FOUND' })
  }
  return record
}

export const mockOrderService = {
  async getAll({ signal } = {}) {
    await before('getAll', signal)
    return read()
  },

  async getById(id, { signal } = {}) {
    await before('getById', signal)
    return findRecord(read(), id)
  },

  async create(input) {
    const value = toOrderInput(input)
    await before('create')
    const records = read()

    const number = Math.max(readCounter(), highestNumber(initialOrders), highestNumber(records)) + 1
    const record = {
      ...value,
      id: `ord-${String(number).padStart(3, '0')}`,
      date: todayIso(),
      status: ORDER_STATUS.new,
    }
    save(counterKey, String(number))
    save(recordsKey, JSON.stringify([...records, record]))
    return toOrder(record)
  },


  async update(id, input) {
    await before('update')
    const records = read()
    const current = findRecord(records, id)
    const value = toOrderInput({
      kind: current.kind,
      supplierId: current.supplierId,
      items: input?.items,
    })
    const record = { ...value, id: current.id, date: current.date, status: current.status }
    save(recordsKey, JSON.stringify(records.map((entry) => (entry.id === id ? record : entry))))
    return toOrder(record)
  },

  async delete(id) {
    await before('delete')
    const records = read()
    findRecord(records, id)
    save(recordsKey, JSON.stringify(records.filter((entry) => entry.id !== id)))
  },
}
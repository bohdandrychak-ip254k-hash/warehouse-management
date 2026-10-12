import { useRef, useState } from 'react'
import { OrdersContext } from '../context/OrdersContext.js'
import { orders as initialOrders } from '../data/orders.js'
import { ORDER_STATUS, validateOrder } from '../domain/orderValidation.js'

function todayIso() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

function highestNumber(records) {
  return records.reduce((highest, record) => {
    const match = /^ord-(\d+)$/.exec(record.id)
    return match ? Math.max(highest, Number(match[1])) : highest
  }, 0)
}

function formatOrderId(number) {
  return `ord-${String(number).padStart(3, '0')}`
}

function copyOrder(order) {
  return { ...order, items: order.items.map((item) => ({ ...item })) }
}

export default function OrdersProvider({ items, suppliers, children }) {
  const [orders, setOrders] = useState(() => initialOrders.map(copyOrder))
  const [notice, setNotice] = useState('')
  // Лічильник тільки зростає: номер видаленого замовлення не видається вдруге.
  const lastNumber = useRef(null)
  if (lastNumber.current === null) {
    lastNumber.current = highestNumber(initialOrders)
  }

  function createOrder(input) {
    const validation = validateOrder(input, { products: items, suppliers })
    if (!validation.ok) {
      return validation
    }

    lastNumber.current += 1
    const record = {
      ...validation.value,
      id: formatOrderId(lastNumber.current),
      date: todayIso(),
      status: ORDER_STATUS.new,
    }
    setOrders((previous) => [...previous, record])
    setNotice('Замовлення створено в поточній локальній колекції.')
    return { ok: true, record }
  }

  // Тип і постачальник замовлення не змінюються: оновлюються лише позиції.
  function updateOrder(id, input) {
    const current = orders.find((order) => order.id === id)
    if (!current) {
      return { ok: false, message: 'Замовлення для оновлення не знайдено.' }
    }

    const validation = validateOrder(
      { kind: current.kind, supplierId: current.supplierId, items: input.items },
      { products: items, suppliers },
    )
    if (!validation.ok) {
      return validation
    }

    const record = {
      ...validation.value,
      id: current.id,
      date: current.date,
      status: current.status,
    }
    setOrders((previous) => previous.map((order) => (
      order.id === id ? record : order
    )))
    setNotice('Зміни замовлення збережено в поточній локальній колекції.')
    return { ok: true, record }
  }

  function deleteOrder(id) {
    if (!orders.some((order) => order.id === id)) {
      return { ok: false, message: 'Замовлення для видалення не знайдено.' }
    }

    setOrders((previous) => previous.filter((order) => order.id !== id))
    setNotice('Замовлення видалено з поточної локальної колекції.')
    return { ok: true }
  }

  function dismissNotice() {
    setNotice('')
  }

  const value = {
    orders,
    createOrder,
    updateOrder,
    deleteOrder,
    notice,
    dismissNotice,
  }

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}
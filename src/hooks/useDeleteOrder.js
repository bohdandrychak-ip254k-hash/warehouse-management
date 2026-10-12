import useOrders from './useOrders.js'

function describeOrder(order, products) {
  const names = order.items.map((item) => (
    products.find((product) => product.id === item.productId)?.name ?? item.productId
  ))

  if (order.kind === 'form') {
    return `форму ${order.id} (${names.map((name) => `«${name}»`).join(', ')})`
  }
  return `замовлення ${order.id} на «${names[0]}»`
}

export default function useDeleteOrder(items) {
  const { deleteOrder } = useOrders()

  return function deleteWithConfirmation(order) {
    const confirmed = window.confirm(
      `Видалити ${describeOrder(order, items)}? `
      + 'Запис буде вилучено з поточної локальної колекції. '
      + 'Скасування видалення не передбачено.',
    )
    if (!confirmed) {
      return { ok: false, cancelled: true }
    }
    return deleteOrder(order.id)
  }
}
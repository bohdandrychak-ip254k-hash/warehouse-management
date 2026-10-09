import useOrders from './useOrders.js'

export default function useDeleteOrder(items) {
  const { deleteOrder } = useOrders()

  return function deleteWithConfirmation(order) {
    const item = items.find((entry) => entry.id === order.productId)
    const name = item?.name ?? order.productId
    const confirmed = window.confirm(
      `Видалити замовлення ${order.id} на «${name}»? `
      + 'Запис буде вилучено з поточної локальної колекції. '
      + 'Скасування видалення не передбачено.',
    )
    if (!confirmed) {
      return { ok: false, cancelled: true }
    }
    return deleteOrder(order.id)
  }
}
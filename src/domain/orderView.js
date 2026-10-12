export const KIND_LABEL = {
  single: 'Один товар',
  form: 'Форма',
}

export function totalQuantity(order) {
  return order.items.reduce((sum, item) => sum + item.quantity, 0)
}

export function findSupplier(order, suppliers) {
  return suppliers.find((supplier) => supplier.id === order.supplierId) ?? null
}
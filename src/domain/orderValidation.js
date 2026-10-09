export const ORDER_STATUSES = ['Нове', 'Надіслано', 'Отримано']

export const ORDER_RULES = {
  quantityMin: 1,
  quantityMax: 1000,
  supplierMin: 2,
  supplierMax: 100,
  commentMax: 300,
  largeQuantity: 100,
  largeCommentMin: 10,
}

export function validateOrder(input, catalog) {
  const rules = ORDER_RULES
  const errors = {}
  const supplier = typeof input.supplier === 'string' ? input.supplier.trim() : ''
  const comment = typeof input.comment === 'string' ? input.comment.trim() : ''
  const quantityText = String(input.quantity ?? '').trim()
  const quantity = Number(quantityText)

  if (!catalog.some((item) => item.id === input.productId)) {
    errors.productId = 'Виберіть наявний товар з каталогу.'
  }

  if (quantityText === '') {
    errors.quantity = 'Укажіть кількість.'
  } else if (
    !/^\d+$/.test(quantityText)
    || quantity < rules.quantityMin
    || quantity > rules.quantityMax
  ) {
    errors.quantity = `Кількість має бути цілим числом від ${rules.quantityMin} до ${rules.quantityMax}.`
  }

  if (supplier.length === 0) {
    errors.supplier = 'Укажіть постачальника.'
  } else if (supplier.length < rules.supplierMin || supplier.length > rules.supplierMax) {
    errors.supplier = `Назва постачальника має містити від ${rules.supplierMin} до ${rules.supplierMax} символів без крайніх пробілів.`
  }

  if (comment.length > rules.commentMax) {
    errors.comment = `Коментар не може бути довшим за ${rules.commentMax} символів.`
  } else if (
    !errors.quantity
    && quantity > rules.largeQuantity
    && comment.length < rules.largeCommentMin
  ) {
    errors.comment = `Для кількості понад ${rules.largeQuantity} поясніть замовлення в коментарі (щонайменше ${rules.largeCommentMin} символів).`
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors }
  }

  return {
    ok: true,
    errors: {},
    value: {
      productId: input.productId,
      quantity,
      supplier,
      comment,
    },
  }
}
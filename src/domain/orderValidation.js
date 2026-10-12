export const ORDER_STATUS = {
  new: 'Нове',
  sent: 'Надіслано',
  received: 'Отримано',
}

export const ORDER_KIND = {
  single: 'single',
  form: 'form',
}

export const ORDER_RULES = {
  quantityMin: 1,
  quantityMax: 1000,
  commentMax: 300,
  largeQuantity: 100,
  largeCommentMin: 10,
}

export function validateOrderItem(input, products) {
  const rules = ORDER_RULES
  const errors = {}
  const comment = typeof input.comment === 'string' ? input.comment.trim() : ''
  const quantityText = String(input.quantity ?? '').trim()
  const quantity = Number(quantityText)

  if (!products.some((product) => product.id === input.productId)) {
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
    value: { productId: input.productId, quantity, comment },
  }
}

export function validateOrder(input, { products, suppliers }) {
  const errors = {}
  const itemErrors = {}
  const kind = input.kind
  const supplierId = input.supplierId ?? null
  const rawItems = Array.isArray(input.items) ? input.items : []
  const values = []

  if (kind !== ORDER_KIND.single && kind !== ORDER_KIND.form) {
    errors.kind = 'Невідомий тип замовлення.'
  } else if (kind === ORDER_KIND.single) {
    if (supplierId !== null) {
      errors.supplierId = 'Просте замовлення створюється без постачальника.'
    }
    if (rawItems.length !== 1) {
      errors.items = 'Просте замовлення має містити рівно один товар.'
    }
    } else {
      if (supplierId !== null && !suppliers.some((supplier) => supplier.id === supplierId)) {
        errors.supplierId = 'Виберіть постачальника зі списку.'
      }
      if (rawItems.length === 0) {
        errors.items = 'Додайте до форми хоча б один товар.'
      }
    }

    const checkSupplies = kind === ORDER_KIND.form
      && supplierId !== null
      && suppliers.some((supplier) => supplier.id === supplierId)
    const supplies = (productId) => (
      (products.find((product) => product.id === productId)?.supplierIds ?? []).includes(supplierId)
    )

    const seen = new Set()
    rawItems.forEach((rawItem, index) => {
      const result = validateOrderItem(rawItem ?? {}, products)
      if (!result.ok) {
        itemErrors[index] = result.errors
      } else if (seen.has(result.value.productId)) {
        itemErrors[index] = { productId: 'Цей товар уже є в замовленні.' }
      } else if (checkSupplies && !supplies(result.value.productId)) {
        itemErrors[index] = { productId: 'Цей постачальник не постачає цей товар.' }
      } else {
        seen.add(result.value.productId)
        values.push(result.value)
      }
    })

  if (Object.keys(itemErrors).length > 0 && !errors.items) {
    errors.items = 'Виправте помилки в позиціях замовлення.'
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors, itemErrors }
  }

  return {
    ok: true,
    errors: {},
    itemErrors: {},
    value: { kind, supplierId, items: values },
  }
}
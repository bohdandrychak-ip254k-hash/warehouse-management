import { useState } from 'react'
import AppButton from '../ui/AppButton.jsx'
import AvailabilityBadge from '../products/AvailabilityBadge.jsx'
import OrderForm from './OrderForm.jsx'
import FocusHeading from './FocusHeading.jsx'
import { validateFormItem } from '../../domain/orderValidation.js'

export default function FormItemStep({
  product,
  otherOrdered,
  perItemSupplier = false,
  suppliers = [],
  position,
  total,
  draft,
  isDirty,
  submitLabel,
  focusOnMount,
  onChange,
  onSave,
  onReset,
  onRemove,
}) {
  const [touched, setTouched] = useState({})
  const [attempted, setAttempted] = useState(false)

  const fieldOrder = perItemSupplier ? ['supplierId', 'quantity', 'comment'] : ['quantity', 'comment']
  const supplierOptions = perItemSupplier
    ? (product.supplierIds ?? [])
      .map((id) => suppliers.find((entry) => entry.id === id))
      .filter(Boolean)
    : []
  const validation = validateFormItem(draft, product, { perItemSupplier, suppliers })
  const errors = Object.fromEntries(
    Object.entries(validation.errors).filter(([field]) => attempted || touched[field]),
  )
  const ordered = product.ordered ?? 0

  function handleSubmit(event) {
    event.preventDefault()
    setAttempted(true)

    if (!validation.ok) {
      const firstField = fieldOrder.find((field) => validation.errors[field])
      if (firstField) {
        event.currentTarget.elements.namedItem(firstField)?.focus()
      }
      return
    }

    onSave(validation.value)
  }

  function handleReset() {
    if (!isDirty) {
      return
    }
    if (!window.confirm('Відкинути введені зміни та відновити початкові поля?')) {
      return
    }
    onReset()
    setTouched({})
    setAttempted(false)
  }

  return (
    <div>
      <FocusHeading id="wizard-step-title" focus={focusOnMount}>
        Товар {position} з {total}: {product.name}
      </FocusHeading>
      <p>
        Наявно: {product.quantity} {product.unit}, замовлено {ordered} {product.unit}
      </p>
      <AvailabilityBadge quantity={product.quantity} ordered={ordered} />
      {otherOrdered > 0 && (
        <p className="stock-warning" role="note">
          Увага: на цей товар уже є незавершені замовлення на {otherOrdered} {product.unit}.
          Перевірте, чи потрібно замовляти ще.
        </p>
      )}

      {perItemSupplier && supplierOptions.length === 0 && (
        <p className="field-hint">Для цього товару постачальників не вказано.</p>
      )}

      <OrderForm
        idPrefix="wizard-item"
        productName={product.name}
        draft={draft}
        errors={errors}
        operationError=""
        onChange={onChange}
        onBlur={(field) => setTouched((previous) => ({ ...previous, [field]: true }))}
        onSubmit={handleSubmit}
        onReset={handleReset}
        submitLabel={submitLabel}
        supplierField={supplierOptions.length > 0 ? { options: supplierOptions } : null}
      />

      <AppButton variant="secondary" onClick={onRemove}>
        Прибрати цей товар з форми
      </AppButton>
    </div>
  )
}
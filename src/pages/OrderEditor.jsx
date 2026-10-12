import { useState } from 'react'
import PageHeading from '../components/ui/PageHeading.jsx'
import Section from '../components/ui/Section.jsx'
import AppButton from '../components/ui/AppButton.jsx'
import AvailabilityBadge from '../components/products/AvailabilityBadge.jsx'
import OrderForm from '../components/orders/OrderForm.jsx'
import OrderSummary from '../components/orders/OrderSummary.jsx'
import { validateOrderItem } from '../domain/orderValidation.js'


const emptyDraft = { quantity: '', comment: '' }
const FIELD_ORDER = ['quantity', 'comment']

// Тимчасово: до кроку 5 збереження не підключене, тому відмова чесна.
const notConnected = () => ({ ok: false, message: 'Збереження ще не підключено.' })

export default function OrderEditor({
  title,
  product,
  initialDraft = emptyDraft,
  onSave = notConnected,
  onCancel,
  submitLabel = 'Зберегти',
  cancelLabel = 'Вийти без збереження',
}) {
  const initialValues = {
    quantity: String(initialDraft.quantity),
    comment: initialDraft.comment,
  }
  const [draft, setDraft] = useState(() => ({ ...initialValues }))
  const [touched, setTouched] = useState({})
  const [attempted, setAttempted] = useState(false)
  const [operationError, setOperationError] = useState('')

  const validation = validateOrderItem({ ...draft, productId: product.id }, [product])
  const errors = Object.fromEntries(
    Object.entries(validation.errors).filter(([field]) => (
      attempted || touched[field]
    )),
  )
  const isDirty = FIELD_ORDER.some((field) => draft[field] !== initialValues[field])

  function handleChange(field, value) {
    setDraft((previous) => ({ ...previous, [field]: value }))
    setOperationError('')
  }

  function handleBlur(field) {
    setTouched((previous) => ({ ...previous, [field]: true }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setAttempted(true)
    setOperationError('')

    if (!validation.ok) {
      const firstField = FIELD_ORDER.find((field) => validation.errors[field])
      if (firstField) {
        event.currentTarget.elements.namedItem(firstField)?.focus()
      }
      return
    }

    const result = onSave(validation.value)
    if (!result.ok) {
      setOperationError(result.message || Object.values(result.errors).join(' '))
    }
  }

  function handleReset() {
    if (!isDirty) {
      return
    }
    if (!window.confirm('Відкинути введені зміни та відновити початкові поля?')) {
      return
    }
    setDraft({ ...initialValues })
    setTouched({})
    setAttempted(false)
    setOperationError('')
  }

  function handleCancel() {
    if (isDirty && !window.confirm('Вийти та відкинути незбережені зміни?')) {
      return
    }
    onCancel()
  }

  return (
    <>
      <PageHeading title={title} />
      <Section id="order-editor" title="Поля та підсумок">
        <p>
          Товар «{product.name}»: на складі {product.quantity} {product.unit}
        </p>
        <AvailabilityBadge quantity={product.quantity} />

        <div className="order-columns">
          <OrderForm
            idPrefix="order-draft"
            productName={product.name}
            draft={draft}
            errors={errors}
            operationError={operationError}
            onChange={handleChange}
            onBlur={handleBlur}
            onSubmit={handleSubmit}
            onReset={handleReset}
            submitLabel={submitLabel}
          />
          <OrderSummary productName={product.name} draft={draft} />
        </div>
      </Section>
      <AppButton variant="secondary" onClick={handleCancel}>
        {cancelLabel}
      </AppButton>
    </>
  )
}
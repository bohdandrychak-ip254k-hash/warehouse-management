import { useState } from 'react'
import PageHeading from '../components/ui/PageHeading.jsx'
import Section from '../components/ui/Section.jsx'
import AppButton from '../components/ui/AppButton.jsx'
import AvailabilityBadge from '../components/products/AvailabilityBadge.jsx'
import OrderForm from '../components/orders/OrderForm.jsx'
import OrderSummary from '../components/orders/OrderSummary.jsx'

const emptyDraft = { quantity: '', supplier: '', comment: '' }

export default function OrderEditor({
  title,
  product,
  initialDraft = emptyDraft,
  onCancel,
  cancelLabel = 'Вийти без збереження',
}) {
  const [draft, setDraft] = useState(() => ({ ...initialDraft }))

  function handleQuantityChange(quantity) {
    setDraft((previous) => ({ ...previous, quantity }))
  }

  function handleSupplierChange(supplier) {
    setDraft((previous) => ({ ...previous, supplier }))
  }

  function handleCommentChange(comment) {
    setDraft((previous) => ({ ...previous, comment }))
  }

  function handleReset() {
    setDraft({ ...emptyDraft })
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
            onQuantityChange={handleQuantityChange}
            onSupplierChange={handleSupplierChange}
            onCommentChange={handleCommentChange}
            onReset={handleReset}
          />
          <OrderSummary productName={product.name} draft={draft} />
        </div>
      </Section>
      <AppButton variant="secondary" onClick={onCancel}>
        {cancelLabel}
      </AppButton>
    </>
  )
}
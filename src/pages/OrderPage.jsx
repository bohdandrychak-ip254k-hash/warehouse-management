import { useState } from 'react'
import Section from '../components/ui/Section.jsx'
import DeficitList from '../components/orders/DeficitList.jsx'
import OrderForm from '../components/orders/OrderForm.jsx'
import OrderSummary from '../components/orders/OrderSummary.jsx'
import AppButton from '../components/ui/AppButton.jsx'
import { products } from '../data/products.js'

function createEmptyDraft() {
  return { quantity: '', supplier: '', comment: '' }
}

export default function OrderPage({ selectedProduct, onClearSelection }) {
  const [draft, setDraft] = useState(createEmptyDraft)
  const deficitProducts = products.filter((p) => p.quantity <= 5)

  function handleQuantityChange(value) {
    setDraft((previous) => ({ ...previous, quantity: value }))
  }

  function handleSupplierChange(value) {
    setDraft((previous) => ({ ...previous, supplier: value }))
  }

  function handleCommentChange(value) {
    setDraft((previous) => ({ ...previous, comment: value }))
  }

  function handleResetDraft() {
    setDraft(createEmptyDraft())
  }

  return (
    <Section id="order" title="Замовлення">
      <p>Товари з низьким залишком або відсутні на складі:</p>
      <DeficitList items={deficitProducts} />

      {selectedProduct ? (
        <>
          <p>
            Обраний товар: <strong>{selectedProduct.name}</strong>{' '}
            ({selectedProduct.quantity} {selectedProduct.unit} на складі)
          </p>
          <AppButton variant="secondary" onClick={onClearSelection}>
            Скасувати вибір
          </AppButton>

          <div className="order-columns">
            <OrderForm
              idPrefix="order"
              productName={selectedProduct.name}
              draft={draft}
              onQuantityChange={handleQuantityChange}
              onSupplierChange={handleSupplierChange}
              onCommentChange={handleCommentChange}
              onReset={handleResetDraft}
            />
            <OrderSummary productName={selectedProduct.name} draft={draft} />
          </div>
        </>
      ) : (
        <p>Товар для замовлення ще не обрано — оберіть його в каталозі вище.</p>
      )}
    </Section>
  )
}
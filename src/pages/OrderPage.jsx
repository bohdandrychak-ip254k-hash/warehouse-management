import Section from '../components/ui/Section.jsx'
import DeficitList from '../components/orders/DeficitList.jsx'
import OrderFormPreview from '../components/orders/OrderFormPreview.jsx'
import AppButton from '../components/ui/AppButton.jsx'
import { products } from '../data/products.js'

export default function OrderPage({ selectedProduct, onClearSelection }) {
  const deficitProducts = products.filter((p) => p.quantity <= 5)

  return (
    <Section id="order" title="Замовлення">
      <p>Товари з низьким залишком або відсутні на складі:</p>
      <DeficitList items={deficitProducts} />

      <div className="selected-product">
        {selectedProduct ? (
          <>
            <p>
              Обраний товар для замовлення: <strong>{selectedProduct.name}</strong>{' '}
              ({selectedProduct.quantity} {selectedProduct.unit} на складі)
            </p>
            <AppButton variant="secondary" onClick={onClearSelection}>
              Скасувати вибір
            </AppButton>
          </>
        ) : (
          <p>Товар для замовлення ще не обрано — оберіть його в каталозі вище.</p>
        )}
      </div>

      <OrderFormPreview />
    </Section>
  )
}
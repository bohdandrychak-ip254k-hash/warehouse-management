import Section from '../components/ui/Section.jsx'
import DeficitList from '../components/orders/DeficitList.jsx'
import OrderFormPreview from '../components/orders/OrderFormPreview.jsx'
import { products } from '../data/products.js'

export default function OrderPage() {
  const deficitProducts = products.filter((p) => p.quantity <= 5)

  return (
    <Section id="order" title="Замовлення">
      <p>Товари з низьким залишком або відсутні на складі:</p>
      <DeficitList items={deficitProducts} />
      <OrderFormPreview />
    </Section>
  )
}
import { useLocation, useNavigate } from 'react-router'
import useOrders from '../hooks/useOrders.js'
import OrderFormEditor from './OrderFormEditor.jsx'

export default function OrderFormCreatePage({ catalog, suppliers, supplier, productIds }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { createOrder } = useOrders()

  function handleSave(items) {
    const result = createOrder({ kind: 'form', supplierId: supplier?.id ?? null, items })
    if (result.ok) {
      navigate(`/orders/${encodeURIComponent(result.record.id)}`, { replace: true })
    }
    return result
  }

  // Є куди повернутись у межах застосунку — повертаємось; адресу відкрили напряму — ведемо на список.
  function handleCancel() {
    if (location.key !== 'default') {
      navigate(-1)
    } else {
      navigate('/orders/restock', { replace: true })
    }
  }

  return (
    <OrderFormEditor
      key={`${supplier?.id ?? 'none'}:${productIds.join(',')}`}
      title="Нова форма замовлення"
      supplier={supplier}
      suppliers={suppliers}
      products={catalog}
      initialQueue={productIds}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  )
}
import { useNavigate, useParams } from 'react-router'
import useOrders from '../hooks/useOrders.js'
import OrderEditor from './OrderEditor.jsx'
import NotFoundPage from './NotFoundPage.jsx'
import OrderFormEditPage from './OrderFormEditPage.jsx'

export default function OrderEditPage({ catalog, suppliers }) {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { orders, updateOrder } = useOrders()
  const order = orders.find((entry) => entry.id === orderId)

  if (!order) {
    return (
      <NotFoundPage
        title="Замовлення не знайдено"
        message="Перевірте ідентифікатор замовлення в адресі."
        backTo="/orders"
        backLabel="До списку замовлень"
      />
    )
  }

  const detailsPath = `/orders/${encodeURIComponent(order.id)}`

    if (order.kind === 'form') {
    return <OrderFormEditPage order={order} catalog={catalog} suppliers={suppliers} />
  }

  const item = order.items[0]
  const product = catalog.find((entry) => entry.id === item.productId)

  if (!product) {
    return (
      <NotFoundPage
        title="Товар замовлення відсутній"
        message="Запис посилається на товар, якого немає в каталозі."
        backTo="/orders"
        backLabel="До списку замовлень"
      />
    )
  }

  function handleSave(input) {
    const result = updateOrder(order.id, { items: [input] })
    if (result.ok) {
      navigate(`/orders/${encodeURIComponent(result.record.id)}`, { replace: true })
    }
    return result
  }

  return (
    <OrderEditor
      key={`edit-${order.id}`}
      title={`Редагування замовлення ${order.id}`}
      product={product}
      initialDraft={{
        quantity: String(item.quantity),
        comment: item.comment,
      }}
      onSave={handleSave}
      submitLabel="Зберегти зміни"
      onCancel={() => navigate(detailsPath)}
    />
  )
}
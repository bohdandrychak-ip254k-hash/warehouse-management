import { useNavigate, useParams } from 'react-router'
import OrderEditor from './OrderEditor.jsx'
import NotFoundPage from './NotFoundPage.jsx'

export default function OrderEditPage({ orders, catalog }) {
  const { orderId } = useParams()
  const navigate = useNavigate()
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

  const product = catalog.find((entry) => entry.id === order.productId)

  if (!product) {
    return (
      <NotFoundPage
        title="Товар замовлення відсутній"
        message="Демонстраційний запис посилається на товар, якого немає в каталозі."
        backTo="/orders"
        backLabel="До списку замовлень"
      />
    )
  }

  return (
    <OrderEditor
      key={`edit-${order.id}`}
      title={`Редагування замовлення ${order.id}`}
      product={product}
      initialDraft={{
        quantity: String(order.quantity),
        supplier: order.supplier,
        comment: order.comment,
      }}
      onCancel={() => navigate('/orders')}
    />
  )
}
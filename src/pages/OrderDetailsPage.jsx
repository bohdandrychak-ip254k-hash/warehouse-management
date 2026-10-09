import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import PageHeading from '../components/ui/PageHeading.jsx'
import AppButton from '../components/ui/AppButton.jsx'
import useOrders from '../hooks/useOrders.js'
import useDeleteOrder from '../hooks/useDeleteOrder.js'
import { formatIsoDate } from '../utils/formatDate.js'
import NotFoundPage from './NotFoundPage.jsx'

export default function OrderDetailsPage({ catalog }) {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { orders } = useOrders()
  const deleteWithConfirmation = useDeleteOrder(catalog)
  const [error, setError] = useState('')
  const order = orders.find((entry) => entry.id === orderId)

  if (!order) {
    return (
      <NotFoundPage
        title="Замовлення не знайдено"
        message="Замовлення з такою адресою немає в поточній локальній колекції."
        backTo="/orders"
        backLabel="До списку замовлень"
      />
    )
  }

  const product = catalog.find((entry) => entry.id === order.productId)

  function handleDelete() {
    setError('')
    const result = deleteWithConfirmation(order)
    if (result.ok) {
      navigate('/orders', { replace: true })
    } else if (!result.cancelled) {
      setError(result.message)
    }
  }

  return (
    <>
      <PageHeading title={`Замовлення ${order.id}`} />
      {error && <p className="form-alert" role="alert">{error}</p>}
      <dl className="details-list">
        <dt>Дата</dt>
        <dd>{formatIsoDate(order.date)}</dd>
        <dt>Статус</dt>
        <dd>{order.status}</dd>
        <dt>Товар</dt>
        <dd>{product?.name ?? 'Товар відсутній у каталозі'}</dd>
        <dt>Кількість</dt>
        <dd>{order.quantity} {product?.unit ?? ''}</dd>
        <dt>Постачальник</dt>
        <dd>{order.supplier}</dd>
        <dt>Коментар</dt>
        <dd>{order.comment || 'Немає'}</dd>
      </dl>
      <p>
        Замовлення існує лише в пам'яті застосунку й не надсилається
        постачальнику.
      </p>
      <p>
        <Link to={`/orders/${encodeURIComponent(order.id)}/edit`} className="app-button app-button-secondary app-button-small">
          Редагувати замовлення
        </Link>
      </p>
      
      <AppButton variant="danger" size="small" aria-label={`Видалити ${order.id}`} onClick={handleDelete}>
        Видалити замовлення
      </AppButton>
      <p><Link to="/orders" className="app-button app-button-secondary app-button-small">До всіх замовлень</Link></p>
    </>
  )
}
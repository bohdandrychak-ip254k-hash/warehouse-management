import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import PageHeading from '../components/ui/PageHeading.jsx'
import AppButton from '../components/ui/AppButton.jsx'
import useOrders from '../hooks/useOrders.js'
import useDeleteOrder from '../hooks/useDeleteOrder.js'
import { formatIsoDate } from '../utils/formatDate.js'
import { KIND_LABEL, findSupplier } from '../domain/orderView.js'
import NotFoundPage from './NotFoundPage.jsx'

export default function OrderDetailsPage({ catalog, suppliers }) {
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

  const supplier = findSupplier(order, suppliers)
  const perItemSupplier = order.kind === 'form' && order.supplierId === null

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
        <dt>Тип</dt>
        <dd>{KIND_LABEL[order.kind]}</dd>
        <dt>Постачальник</dt>
        <dd>{supplier ? supplier.name : 'Без постачальника'}</dd>
        {supplier && (
          <>
            <dt>Контакти</dt>
            <dd>{supplier.contacts}</dd>
          </>
        )}
      </dl>

      <h2>Позиції</h2>
      <div className="table-scroll">
        <table className="items-table">
          <caption>Товари замовлення</caption>
          <thead>
            <tr>
              <th scope="col">Товар</th>
              <th scope="col">Кількість</th>
              {perItemSupplier && <th scope="col">Постачальник</th>}
              <th scope="col">Коментар</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => {
              const product = catalog.find((entry) => entry.id === item.productId)
              return (
                <tr key={item.productId}>
                  <td>{product?.name ?? 'Товар відсутній у каталозі'}</td>
                  <td>{item.quantity} {product?.unit ?? ''}</td>
                  {perItemSupplier && (
                    <td>{suppliers.find((entry) => entry.id === item.supplierId)?.name ?? '—'}</td>
                  )}
                  <td>{item.comment || '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p>
        Замовлення існує лише в пам'яті застосунку й не надсилається
        постачальнику.
      </p>
      <p>
        <Link to={`/orders/${encodeURIComponent(order.id)}/edit`}>
          Редагувати замовлення
        </Link>
      </p>
      <AppButton variant="secondary" onClick={handleDelete}>
        Видалити замовлення
      </AppButton>
      <p><Link to="/orders">До всіх замовлень</Link></p>
    </>
  )
}
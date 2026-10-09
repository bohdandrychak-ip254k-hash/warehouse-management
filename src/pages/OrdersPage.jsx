import { useState } from 'react'
import { Link } from 'react-router'
import PageHeading from '../components/ui/PageHeading.jsx'
import Section from '../components/ui/Section.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import DeficitList from '../components/orders/DeficitList.jsx'
import OrderTable from '../components/orders/OrderTable.jsx'
import useOrders from '../hooks/useOrders.js'
import useDeleteOrder from '../hooks/useDeleteOrder.js'

export default function OrdersPage({ catalog }) {
  const { orders } = useOrders()
  const deleteWithConfirmation = useDeleteOrder(catalog)
  const [error, setError] = useState('')
  const deficitProducts = catalog.filter((item) => item.quantity <= 5)

  function handleDelete(order) {
    setError('')
    const result = deleteWithConfirmation(order)
    if (!result.ok && !result.cancelled) {
      setError(result.message)
    }
  }

  return (
    <>
      <PageHeading title="Замовлення" />

      <Section id="deficit" title="Потребують поповнення">
        <DeficitList items={deficitProducts} />
      </Section>

      <Section id="orders-list" title="Усі замовлення">
        {error && <p className="form-alert" role="alert">{error}</p>}
        {orders.length === 0 ? (
          <EmptyState message="Замовлень ще немає.">
            <p><Link to="/products">Виберіть товар для першого замовлення</Link></p>
          </EmptyState>
        ) : (
          <OrderTable orders={orders} items={catalog} onDelete={handleDelete} />
        )}
      </Section>
    </>
  )
}
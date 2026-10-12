import { useState } from 'react'
import { Link } from 'react-router'
import PageHeading from '../components/ui/PageHeading.jsx'
import Section from '../components/ui/Section.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import AppButton from '../components/ui/AppButton.jsx'
import OrderFilters from '../components/orders/OrderFilters.jsx'
import OrderTable from '../components/orders/OrderTable.jsx'
import useOrders from '../hooks/useOrders.js'
import useOrderFilters from '../hooks/useOrderFilters.js'
import useDeleteOrder from '../hooks/useDeleteOrder.js'
import { isDeficit } from '../domain/stock.js'

export default function OrdersPage({ catalog, suppliers }) {
  const { orders } = useOrders()
  const filters = useOrderFilters(orders, catalog, suppliers)
  const deleteWithConfirmation = useDeleteOrder(catalog)
  const [error, setError] = useState('')
  const deficitCount = catalog.filter(isDeficit).length

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
        <p>Товарів, яким не вистачає наявного й замовленого: {deficitCount}.</p>
        <Link to="/orders/restock" className="app-button app-button-primary">
          Перейти до поповнення
        </Link>
      </Section>

      <Section id="orders-list" title="Усі замовлення">
        <OrderFilters
          query={filters.query}
          status={filters.status}
          sort={filters.sort}
          canReset={filters.canReset}
          onQueryChange={filters.setQuery}
          onStatusChange={filters.setStatus}
          onSortChange={filters.setSort}
          onReset={filters.resetFilters}
        />
        <p>Показано: {filters.visibleOrders.length} із {orders.length}</p>
        {error && <p className="form-alert" role="alert">{error}</p>}
        {orders.length === 0 ? (
          <EmptyState message="Замовлень ще немає.">
            <p><Link to="/products">Виберіть товар для першого замовлення</Link></p>
          </EmptyState>
        ) : filters.visibleOrders.length === 0 ? (
          <EmptyState message="За цими умовами нічого не знайдено.">
            <AppButton variant="secondary" onClick={filters.resetFilters}>
              Показати всі замовлення
            </AppButton>
          </EmptyState>
        ) : (
          <OrderTable
            orders={filters.visibleOrders}
            items={catalog}
            suppliers={suppliers}
            onDelete={handleDelete}
          />
        )}
      </Section>
    </>
  )
}
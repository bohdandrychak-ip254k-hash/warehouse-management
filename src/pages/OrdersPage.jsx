import { Link } from 'react-router'
import PageHeading from '../components/ui/PageHeading.jsx'
import Section from '../components/ui/Section.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import DeficitList from '../components/orders/DeficitList.jsx'

function formatDate(isoDate) {
  return isoDate.split('-').reverse().join('.')
}

export default function OrdersPage({ orders, catalog }) {
  const deficitProducts = catalog.filter((item) => item.quantity <= 5)

  return (
    <>
      <PageHeading title="Замовлення" />

      <Section id="deficit" title="Потребують поповнення">
        <DeficitList items={deficitProducts} />
      </Section>

      <Section id="orders-list" title="Демонстраційні замовлення">
        <p>Нижче наведено локальні демонстраційні записи.</p>
        {orders.length === 0 ? (
          <EmptyState message="Замовлень ще немає.">
            <p><Link to="/orders/new">Підготувати нове замовлення</Link></p>
          </EmptyState>
        ) : (
          <div className="table-scroll">
            <table className="orders-table">
              <caption>Замовлення для перевірки навігації</caption>
              <thead>
                <tr>
                  <th scope="col">Номер</th>
                  <th scope="col">Дата</th>
                  <th scope="col">Товар</th>
                  <th scope="col">Кількість</th>
                  <th scope="col">Постачальник</th>
                  <th scope="col">Статус</th>
                  <th scope="col">Дія</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const product = catalog.find((item) => item.id === order.productId)

                  return (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{formatDate(order.date)}</td>
                      <td>{product?.name ?? 'Товар відсутній у каталозі'}</td>
                      <td>{order.quantity} {product?.unit ?? ''}</td>
                      <td>{order.supplier}</td>
                      <td>{order.status}</td>
                      <td>
                        <Link to={`/orders/${encodeURIComponent(order.id)}/edit`}>
                          Редагувати {order.id}
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </>
  )
}
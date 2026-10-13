import { Link } from 'react-router'
import AppButton from '../ui/AppButton.jsx'
import { formatIsoDate } from '../../utils/formatDate.js'
import { KIND_LABEL, findSupplier } from '../../domain/orderView.js'

export default function OrderTable({ orders, items, suppliers, onDelete }) {
  return (
    <div className="table-scroll">
      <table className="orders-table">
        <caption>Замовлення поточної локальної колекції</caption>
        <thead>
          <tr>
            <th scope="col">Номер</th>
            <th scope="col">Дата</th>
            <th scope="col">Тип</th>
            <th scope="col">Позиції</th>
            <th scope="col">Постачальник</th>
            <th scope="col">Статус</th>
            <th scope="col">Дії</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const path = `/orders/${encodeURIComponent(order.id)}`
            const supplier = findSupplier(order, suppliers)

            return (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{formatIsoDate(order.date)}</td>
                <td>{KIND_LABEL[order.kind]}</td>
                <td>
                  <ul className="order-items">
                    {order.items.map((item) => {
                                            const product = items.find((entry) => entry.id === item.productId)
                      const itemSupplier = suppliers.find((entry) => entry.id === item.supplierId)
                      return (
                        <li key={item.productId}>
                          {product?.name ?? 'Товар відсутній у каталозі'} — {item.quantity} {product?.unit ?? ''}
                          {itemSupplier && ` · ${itemSupplier.name}`}
                        </li>
                      )
                    })}
                  </ul>
                </td>
                <td>{supplier?.name ?? (order.kind === 'form' ? 'Без постачальника' : '—')}</td>
                <td>{order.status}</td>
                <td>
                  <div className="row-actions">
                    <Link
                      to={path}
                      className="app-button app-button-secondary app-button-small"
                      aria-label={`Переглянути ${order.id}`}
                    >
                      Переглянути
                    </Link>
                    
                      <Link
                        to={`${path}/edit`}
                        className="app-button app-button-secondary app-button-small"
                        aria-label={`Редагувати ${order.id}`}
                      >
                        Редагувати
                      </Link>

                    <AppButton
                      variant="danger"
                      size="small"
                      aria-label={`Видалити ${order.id}`}
                      onClick={() => onDelete(order)}
                    >
                      Видалити
                    </AppButton>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
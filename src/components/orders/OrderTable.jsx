import { Link } from 'react-router'
import AppButton from '../ui/AppButton.jsx'
import { formatIsoDate } from '../../utils/formatDate.js'

export default function OrderTable({ orders, items, onDelete }) {
  return (
    <div className="table-scroll">
      <table className="orders-table">
        <caption>Замовлення поточної локальної колекції</caption>
        <thead>
          <tr>
            <th scope="col">Номер</th>
            <th scope="col">Дата</th>
            <th scope="col">Товар</th>
            <th scope="col">Кількість</th>
            <th scope="col">Постачальник</th>
            <th scope="col">Статус</th>
            <th scope="col">Дії</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const item = items.find((entry) => entry.id === order.productId)
            const path = `/orders/${encodeURIComponent(order.id)}`

            return (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{formatIsoDate(order.date)}</td>
                <td>{item?.name ?? 'Товар відсутній у каталозі'}</td>
                <td>{order.quantity} {item?.unit ?? ''}</td>
                <td>{order.supplier}</td>
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
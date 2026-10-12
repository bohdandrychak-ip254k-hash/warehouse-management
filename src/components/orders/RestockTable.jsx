import { Link } from 'react-router'
import AvailabilityBadge from '../products/AvailabilityBadge.jsx'

function singleOrderPath(productId) {
  return `/orders/new?${new URLSearchParams({ productId })}`
}

export default function RestockTable({ products, suppliers, selectedIds, onToggle }) {
  return (
    <div className="table-scroll">
      <table className="restock-table">
        <caption>Товари для поповнення запасів</caption>
        <thead>
          <tr>
            <th scope="col">Вибір</th>
            <th scope="col">Товар</th>
            <th scope="col">Наявно</th>
            <th scope="col">Замовлено</th>
            <th scope="col">Разом</th>
            <th scope="col">Статус</th>
            <th scope="col">Постачальники</th>
            <th scope="col">Дія</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const ordered = product.ordered ?? 0
            const selected = selectedIds.has(product.id)
            const supplierNames = (product.supplierIds ?? [])
              .map((id) => suppliers.find((entry) => entry.id === id)?.name)
              .filter(Boolean)

            return (
              <tr key={product.id} className={selected ? 'row-selected' : undefined}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => onToggle(product.id)}
                    aria-label={`Обрати ${product.name}`}
                  />
                </td>
                <td>
                  {product.name}
                  <p className="path">{product.sectionName} / {product.categoryName}</p>
                </td>
                <td>{product.quantity} {product.unit}</td>
                <td>{ordered} {product.unit}</td>
                <td>{product.quantity + ordered} {product.unit}</td>
                <td>
                  <AvailabilityBadge quantity={product.quantity} ordered={ordered} />
                </td>
                <td>{supplierNames.length > 0 ? supplierNames.join('; ') : '—'}</td>
                <td>
                  <Link
                    to={singleOrderPath(product.id)}
                    className="app-button app-button-secondary app-button-small"
                    aria-label={`Оформити ${product.name}`}
                  >
                    Оформити
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
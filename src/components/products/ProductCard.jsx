import { Link } from 'react-router'
import AvailabilityBadge from './AvailabilityBadge.jsx'
import AppButton from '../ui/AppButton.jsx'

export default function ProductCard({ item, selected, onSelect }) {
  const orderPath = `/orders/new?${new URLSearchParams({ productId: item.id })}`

  return (
    <article className="product-card">
      <h3>{item.name}</h3>
      <p className="path">{item.sectionName} / {item.categoryName}</p>
      <p className="barcode">Штрихкод: {item.barcode}</p>
      <p>Наявно: {item.quantity} {item.unit}</p>
      <p>Замовлено: {item.ordered ?? 0} {item.unit}</p>
      <AvailabilityBadge quantity={item.quantity} ordered={item.ordered} />

      <div className="card-actions">
        <Link to={`/products/${item.id}`} className="app-button app-button-secondary">
          Детальніше
        </Link>

        <AppButton aria-pressed={selected} onClick={() => onSelect(item.id)}>
          {selected ? 'Обрано' : 'Обрати для замовлення'}
        </AppButton>
      </div>

      {selected && (
        <p className="selection-note">
          Обрано останнім. <Link to={orderPath}>Підготувати замовлення</Link>
        </p>
      )}
    </article>
  )
}
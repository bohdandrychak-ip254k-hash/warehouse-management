import { Link } from 'react-router'
import AvailabilityBadge from '../products/AvailabilityBadge.jsx'

function newOrderPath(productId) {
  return `/orders/new?${new URLSearchParams({ productId })}`
}

export default function DeficitList({ items }) {
  if (items.length === 0) {
    return <p>Товарів з дефіцитом немає.</p>
  }

  return (
    <ul className="deficit-list">
      {items.map((item) => (
        <li key={item.id} className="deficit-row">
          <span>{item.name}</span>
          <span>{item.quantity} {item.unit}</span>
          <AvailabilityBadge quantity={item.quantity} />
          <Link to={newOrderPath(item.id)} className="app-button app-button-secondary">
            Замовити
          </Link>
        </li>
      ))}
    </ul>
  )
}
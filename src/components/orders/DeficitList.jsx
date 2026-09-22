import AvailabilityBadge from '../products/AvailabilityBadge.jsx'

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
        </li>
      ))}
    </ul>
  )
}
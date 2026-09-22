import AvailabilityBadge from './AvailabilityBadge.jsx'

export default function ProductCard({ item }) {
  return (
    <article className="product-card">
      <h3>{item.name}</h3>
      <p className="path">{item.sectionName} / {item.categoryName}</p>
      <p className="barcode">Штрихкод: {item.barcode}</p>
      <p>Кількість: {item.quantity} {item.unit}</p>
      <AvailabilityBadge quantity={item.quantity} />
    </article>
  )
}
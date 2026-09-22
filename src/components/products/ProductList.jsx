import ProductCard from './ProductCard.jsx'
import EmptyState from '../ui/EmptyState.jsx'

export default function ProductList({ items }) {
  if (items.length === 0) {
    return <EmptyState message="Товари ще не додано." />
  }

  return (
    <ul className="product-grid">
      {items.map((item) => (
        <li key={item.id}>
          <ProductCard item={item} />
        </li>
      ))}
    </ul>
  )
}
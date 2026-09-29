import ProductCard from './ProductCard.jsx'
import EmptyState from '../ui/EmptyState.jsx'

export default function ProductList({ items, emptyMessage = 'Товари ще не додано.', selectedId, onSelect }) {
  if (items.length === 0) {
    return <EmptyState message={emptyMessage} />
  }

  return (
    <ul className="product-grid">
      {items.map((item) => (
        <li key={item.id}>
          <ProductCard item={item} selected={item.id === selectedId} onSelect={onSelect} />
        </li>
      ))}
    </ul>
  )
}
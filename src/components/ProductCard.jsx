export default function ProductCard({ item }) {
  let status = 'В наявності'
  let statusClass = 'status available'

  if (item.quantity === 0) {
    status = 'Немає в наявності'
    statusClass = 'status out'
  } else if (item.quantity <= 5) {
    status = 'Закінчується'
    statusClass = 'status low'
  }

  return (
    <article className="product-card">
      <h3>{item.name}</h3>
      <p className="path">{item.sectionName} / {item.categoryName}</p>
      <p className="barcode">Штрихкод: {item.barcode}</p>
      <p>Кількість: {item.quantity} {item.unit}</p>
      <p className={statusClass}>{status}</p>
    </article>
  )
}
import { stockLevel } from '../../domain/stock.js'

export default function AvailabilityBadge({ quantity, ordered = 0 }) {
  const { status } = stockLevel(quantity, ordered)
  let text = 'В наявності'
  let statusClass = 'status available'

  if (status === 'out') {
    text = 'Немає в наявності'
    statusClass = 'status out'
  } else if (status === 'low') {
    text = 'Закінчується'
    statusClass = 'status low'
  } else if (quantity === 0) {
    text = 'Очікується поставка'
    statusClass = 'status incoming'
  }

  return <p className={statusClass}>{text}</p>
}
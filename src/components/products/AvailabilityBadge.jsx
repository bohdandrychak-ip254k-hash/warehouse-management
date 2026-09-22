export default function AvailabilityBadge({ quantity }) {
  let status = 'В наявності'
  let statusClass = 'status available'

  if (quantity === 0) {
    status = 'Немає в наявності'
    statusClass = 'status out'
  } else if (quantity <= 5) {
    status = 'Закінчується'
    statusClass = 'status low'
  }

  return <p className={statusClass}>{status}</p>
}
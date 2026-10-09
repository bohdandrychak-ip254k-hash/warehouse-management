export const PERIODS = [
  { id: 'day', label: 'Дні' },
  { id: 'week', label: 'Тижні' },
  { id: 'month', label: 'Місяці' },
  { id: 'year', label: 'Роки' },
]

const MONTHS = ['січ', 'лют', 'бер', 'кві', 'тра', 'чер', 'лип', 'сер', 'вер', 'жов', 'лис', 'гру']

function pad(value) {
  return String(value).padStart(2, '0')
}

function formatDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function parseDate(text) {
  const [year, month, day] = text.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function shortDate(date) {
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}`
}

function mondayOf(date) {
  const offset = (date.getDay() + 6) % 7
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - offset)
}

function buildBuckets(period, today) {
  const buckets = []

  if (period === 'day') {
    for (let i = 29; i >= 0; i -= 1) {
      const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i)
      buckets.push({
        key: formatDate(day),
        label: shortDate(day),
        fullLabel: `${shortDate(day)}.${day.getFullYear()}`,
      })
    }
  }

  if (period === 'week') {
    const thisMonday = mondayOf(today)
    for (let i = 11; i >= 0; i -= 1) {
      const monday = new Date(thisMonday.getFullYear(), thisMonday.getMonth(), thisMonday.getDate() - i * 7)
      const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6)
      buckets.push({
        key: formatDate(monday),
        label: shortDate(monday),
        fullLabel: `Тиждень ${shortDate(monday)} – ${shortDate(sunday)}.${sunday.getFullYear()}`,
      })
    }
  }

  if (period === 'month') {
    for (let i = 11; i >= 0; i -= 1) {
      const first = new Date(today.getFullYear(), today.getMonth() - i, 1)
      buckets.push({
        key: `${first.getFullYear()}-${pad(first.getMonth() + 1)}`,
        label: `${MONTHS[first.getMonth()]} ${String(first.getFullYear()).slice(2)}`,
        fullLabel: `${MONTHS[first.getMonth()]} ${first.getFullYear()}`,
      })
    }
  }

  if (period === 'year') {
    for (let i = 3; i >= 0; i -= 1) {
      const year = today.getFullYear() - i
      buckets.push({ key: String(year), label: String(year), fullLabel: `${year} рік` })
    }
  }

  return buckets.map((bucket) => ({ ...bucket, total: 0 }))
}

function bucketKey(period, dateText) {
  if (period === 'day') return dateText
  if (period === 'week') return formatDate(mondayOf(parseDate(dateText)))
  if (period === 'month') return dateText.slice(0, 7)
  return dateText.slice(0, 4)
}

export function aggregateSales(sales, period, today = new Date()) {
  const buckets = buildBuckets(period, today)
  const indexByKey = new Map(buckets.map((bucket, index) => [bucket.key, index]))

  for (const sale of sales) {
    const index = indexByKey.get(bucketKey(period, sale.date))
    if (index !== undefined) {
      buckets[index].total += sale.quantity
    }
  }

  return buckets
}
import { useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { aggregateSales, PERIODS } from '../../utils/salesAggregation.js'

export default function SalesChart({ sales, unit }) {
  const [period, setPeriod] = useState('month')

  const data = aggregateSales(sales, period)
  const total = data.reduce((sum, bucket) => sum + bucket.total, 0)

  return (
    <div className="sales-chart">
      <div className="period-switch" role="group" aria-label="Період відображення продажів">
        {PERIODS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="period-button"
            aria-pressed={period === item.id}
            onClick={() => setPeriod(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <p className="sales-total">
        Продано за період: <strong>{total} {unit}</strong>
      </p>

      {total === 0 ? (
        <p className="empty-state">За цей період продажів немає.</p>
      ) : (
        <div className="sales-chart-body">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CCE1EF" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#455b6b', fontSize: 12 }} tickLine={false} />
              <YAxis
                allowDecimals={false}
                width={36}
                tick={{ fill: '#455b6b', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: '#E8F5FD' }}
                labelFormatter={(label, payload) => payload?.[0]?.payload?.fullLabel ?? label}
                formatter={(value) => [`${value} ${unit}`, 'Продано']}
              />
              <Bar dataKey="total" fill="#1B5B7E" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
import AppButton from '../ui/AppButton.jsx'
import FormField from '../ui/FormField.jsx'
import { SORT_OPTIONS, STATUS_FILTER_OPTIONS } from '../../domain/orderListOptions.js'

export default function OrderFilters({
  query,
  status,
  sort,
  canReset,
  onQueryChange,
  onStatusChange,
  onSortChange,
  onReset,
}) {
  return (
    <div className="order-filters">
      <FormField
        id="orders-query"
        label="Пошук у замовленнях"
        hint="Номер, товар, постачальник або коментар."
      >
        <input
          id="orders-query"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          aria-describedby="orders-query-hint"
        />
      </FormField>

      <FormField id="orders-status" label="Статус">
        <select
          id="orders-status"
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
        >
          {STATUS_FILTER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </FormField>

      <FormField id="orders-sort" label="Упорядкування">
        <select
          id="orders-sort"
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </FormField>

      <AppButton variant="secondary" onClick={onReset} disabled={!canReset}>
        Скинути умови
      </AppButton>
    </div>
  )
}
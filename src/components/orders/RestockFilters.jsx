import AppButton from '../ui/AppButton.jsx'
import FormField from '../ui/FormField.jsx'
import { SHOW_OPTIONS } from '../../domain/restockOptions.js'

export default function RestockFilters({
  query,
  show,
  section,
  category,
  supplier,
  sections,
  categories,
  suppliers,
  canReset,
  onQueryChange,
  onShowChange,
  onSectionChange,
  onCategoryChange,
  onSupplierChange,
  onReset,
}) {
  return (
    <div className="order-filters">
      <FormField
        id="restock-query"
        label="Пошук товару"
      >
        <input
          id="restock-query"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          aria-describedby="restock-query-hint"
          placeholder='Назва або штрихкод'
        />
      </FormField>

      <FormField id="restock-show" label="Показати">
        <select
          id="restock-show"
          value={show}
          onChange={(event) => onShowChange(event.target.value)}
        >
          {SHOW_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </FormField>

      <FormField id="restock-section" label="Секція">
        <select
          id="restock-section"
          value={section}
          onChange={(event) => onSectionChange(event.target.value)}
        >
          <option value="">Усі секції</option>
          {sections.map((entry) => (
            <option key={entry.id} value={entry.id}>{entry.name}</option>
          ))}
        </select>
      </FormField>

      <FormField id="restock-category" label="Категорія">
        <select
          id="restock-category"
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          <option value="">Усі категорії</option>
          {categories.map((entry) => (
            <option key={entry.id} value={entry.id}>{entry.name}</option>
          ))}
        </select>
      </FormField>

      <FormField
        id="restock-supplier"
        label="Постачальник форми"
      >
        <select
          id="restock-supplier"
          value={supplier}
          onChange={(event) => onSupplierChange(event.target.value)}
          aria-describedby="restock-supplier-hint"
        >
          <option value="">Без постачальника (усі товари)</option>
          {suppliers.map((entry) => (
            <option key={entry.id} value={entry.id}>{entry.name}</option>
          ))}
        </select>
      </FormField>

      <AppButton variant="secondary" onClick={onReset} disabled={!canReset}>
        Скинути умови
      </AppButton>
    </div>
  )
}
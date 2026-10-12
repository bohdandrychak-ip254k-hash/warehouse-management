import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import PageHeading from '../components/ui/PageHeading.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import AppButton from '../components/ui/AppButton.jsx'
import FormField from '../components/ui/FormField.jsx'
import RestockFilters from '../components/orders/RestockFilters.jsx'
import RestockTable from '../components/orders/RestockTable.jsx'
import useRestockFilters from '../hooks/useRestockFilters.js'
import { sections, categories } from '../data/products.js'

export default function RestockPage({ catalog, suppliers }) {
  const navigate = useNavigate()
  const filters = useRestockFilters(catalog, sections, categories)
  const [selectedIds, setSelectedIds] = useState(() => new Set())
  const [supplierId, setSupplierId] = useState('')
  const [formError, setFormError] = useState('')
  const supplierRef = useRef(null)

  const names = new Map(catalog.map((product) => [product.id, product.name]))
  const selectedNames = [...selectedIds].map((id) => names.get(id) ?? id)

  function toggleProduct(id) {
    setSelectedIds((previous) => {
      const next = new Set(previous)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
    setFormError('')
  }

  function selectAllShown() {
    setSelectedIds((previous) => {
      const next = new Set(previous)
      filters.visibleProducts.forEach((product) => next.add(product.id))
      return next
    })
    setFormError('')
  }

  function clearSelection() {
    setSelectedIds(new Set())
    setFormError('')
  }

  function handleCreateForm() {
    if (selectedIds.size === 0) {
      setFormError('Оберіть хоча б один товар для форми.')
      return
    }
    if (supplierId === '') {
      setFormError('Оберіть постачальника форми.')
      supplierRef.current?.focus()
      return
    }
    setFormError('')
    const search = new URLSearchParams({
      supplier: supplierId,
      products: [...selectedIds].join(','),
    })
    navigate(`/orders/new?${search}`)
  }

  return (
    <>
      <PageHeading title="Поповнення запасів" />
      <p>
        Дефіцит рахується від суми «наявно + замовлено», тож товар, який уже
        замовлено, не з'явиться тут вдруге.
      </p>

      <RestockFilters
        query={filters.query}
        show={filters.show}
        section={filters.section}
        category={filters.category}
        sections={sections}
        categories={categories}
        canReset={filters.canReset}
        onQueryChange={filters.setQuery}
        onShowChange={filters.setShow}
        onSectionChange={filters.setSection}
        onCategoryChange={filters.setCategory}
        onReset={filters.resetFilters}
      />

      <div className="selection-panel">
        <p>
          Обрано товарів: {selectedIds.size}
          {selectedNames.length > 0 && <>. {selectedNames.join('; ')}</>}
        </p>
        <p className="field-hint">
          Вибір зберігається, поки ви змінюєте умови відбору вище.
        </p>
        <div className="selection-actions">
          <AppButton
            variant="secondary"
            size="small"
            onClick={selectAllShown}
            disabled={filters.visibleProducts.length === 0}
          >
            Обрати всі показані
          </AppButton>
          <AppButton
            variant="secondary"
            size="small"
            onClick={clearSelection}
            disabled={selectedIds.size === 0}
          >
            Очистити вибір
          </AppButton>
        </div>

        <FormField
          id="restock-supplier"
          label="Постачальник форми"
          hint="Один постачальник для всіх товарів форми."
        >
          <select
            id="restock-supplier"
            ref={supplierRef}
            value={supplierId}
            onChange={(event) => {
              setSupplierId(event.target.value)
              setFormError('')
            }}
            aria-describedby="restock-supplier-hint"
          >
            <option value="">Оберіть постачальника</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
            ))}
          </select>
        </FormField>

        <AppButton onClick={handleCreateForm}>Створити форму замовлення</AppButton>
        {formError && <p className="form-alert" role="alert">{formError}</p>}
      </div>

      <p>Показано: {filters.visibleProducts.length} із {catalog.length}</p>

      {catalog.length === 0 ? (
        <EmptyState message="У каталозі ще немає товарів." />
      ) : filters.visibleProducts.length === 0 ? (
        filters.show === 'deficit' && filters.onlyDefaultView ? (
          <EmptyState message="Дефіцитних товарів немає: з урахуванням замовленого всього вистачає.">
            <AppButton variant="secondary" onClick={() => filters.setShow('all')}>
              Показати всі товари
            </AppButton>
          </EmptyState>
        ) : (
          <EmptyState message="За цими умовами нічого не знайдено.">
            <AppButton variant="secondary" onClick={filters.resetFilters}>
              Скинути умови
            </AppButton>
          </EmptyState>
        )
      ) : (
        <RestockTable
          products={filters.visibleProducts}
          selectedIds={selectedIds}
          onToggle={toggleProduct}
        />
      )}
    </>
  )
}
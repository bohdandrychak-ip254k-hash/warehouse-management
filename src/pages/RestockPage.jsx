import { useState } from 'react'
import { useNavigate } from 'react-router'
import PageHeading from '../components/ui/PageHeading.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import AppButton from '../components/ui/AppButton.jsx'
import RestockFilters from '../components/orders/RestockFilters.jsx'
import RestockTable from '../components/orders/RestockTable.jsx'
import useRestockFilters from '../hooks/useRestockFilters.js'
import { sections, categories } from '../data/products.js'

export default function RestockPage({ catalog, suppliers }) {
  const navigate = useNavigate()
  const filters = useRestockFilters(catalog, sections, categories, suppliers)
  const [selectedIds, setSelectedIds] = useState(() => new Set())
  const [formError, setFormError] = useState('')

  const byId = new Map(catalog.map((product) => [product.id, product]))
  const supplier = suppliers.find((entry) => entry.id === filters.supplier) ?? null


  const supplies = (id) => (
    supplier === null || (byId.get(id)?.supplierIds ?? []).includes(supplier.id)
  )
  const eligibleIds = [...selectedIds].filter(supplies)
  const excludedNames = [...selectedIds]
    .filter((id) => !supplies(id))
    .map((id) => byId.get(id)?.name ?? id)
  const eligibleNames = eligibleIds.map((id) => byId.get(id)?.name ?? id)

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

  function handleSupplierChange(value) {
    filters.setSupplier(value)
    setFormError('')
  }

  function handleCreateForm() {
    if (eligibleIds.length === 0) {
      setFormError('Оберіть хоча б один товар для форми.')
      return
    }
    setFormError('')
    const params = new URLSearchParams(
      supplier
        ? { supplier: supplier.id, products: eligibleIds.join(',') }
        : { products: eligibleIds.join(',') },
    )
    navigate(`/orders/new?${params}`)
  }

  return (
    <>
      <PageHeading title="Поповнення запасів" />

      <RestockFilters
        query={filters.query}
        show={filters.show}
        section={filters.section}
        category={filters.category}
        supplier={filters.supplier}
        sections={sections}
        categories={categories}
        suppliers={suppliers}
        canReset={filters.canReset}
        onQueryChange={filters.setQuery}
        onShowChange={filters.setShow}
        onSectionChange={filters.setSection}
        onCategoryChange={filters.setCategory}
        onSupplierChange={handleSupplierChange}
        onReset={filters.resetFilters}
      />

      <div className="selection-panel">
        <p>
          {supplier
            ? `Форма за постачальником «${supplier.name}»: показано лише його товари.`
            : 'Форма без постачальника: можна обрати товари будь-яких постачальників.'}
        </p>
        <p>
          Обрано товарів: {eligibleIds.length}
          {eligibleNames.length > 0 && <>. {eligibleNames.join('; ')}</>}
        </p>
        {excludedNames.length > 0 && (
          <p className="field-hint">
            Не потраплять до цієї форми, бо обраний постачальник їх не постачає: {excludedNames.join('; ')}
          </p>
        )}
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
          suppliers={suppliers}
          selectedIds={selectedIds}
          onToggle={toggleProduct}
        />
      )}
    </>
  )
}
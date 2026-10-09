import { useState } from 'react'
import PageHeading from '../components/ui/PageHeading.jsx'
import CatalogSummary from '../components/products/CatalogSummary.jsx'
import ProductList from '../components/products/ProductList.jsx'
import FiltersModal from '../components/products/FiltersModal.jsx'
import AppButton from '../components/ui/AppButton.jsx'
import useProductFilters from '../hooks/useProductFilters.js'
import { sections, categories } from '../data/products.js'

export default function ProductsPage({ catalog, selectedId, onSelect }) {
  const [filtersOpen, setFiltersOpen] = useState(false)

  const {
    query,
    setQuery,
    lowStockOnly,
    setLowStockOnly,
    selectedSectionIds,
    selectedCategoryIds,
    toggleSection,
    toggleCategory,
    visibleProducts,
    filtersActive,
    resetFilters,
  } = useProductFilters(catalog)

  const emptyMessage = filtersActive
    ? 'За заданими умовами товарів не знайдено.'
    : 'Товари ще не додано.'

  return (
    <section id="catalog">
      <PageHeading title="Каталог товарів" />

      <div className="filters">
        <label>
          Пошук
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Назва або штрихкод"
          />
        </label>

        <label className="checkbox-field">
          <input
            type="checkbox"
            checked={lowStockOnly}
            onChange={(event) => setLowStockOnly(event.target.checked)}
          />
          Лише дефіцитні
        </label>

        <AppButton variant="secondary" aria-haspopup="dialog" onClick={() => setFiltersOpen(true)}>
          Фільтри{filtersActive && ' •'}
        </AppButton>

        <AppButton variant="secondary" onClick={resetFilters} disabled={!filtersActive}>
          Скинути фільтри
        </AppButton>
      </div>

      <CatalogSummary total={visibleProducts.length} caption="Знайдено товарів" />
      <ProductList
        items={visibleProducts}
        emptyMessage={emptyMessage}
        selectedId={selectedId}
        onSelect={onSelect}
      />

      {filtersOpen && (
        <FiltersModal
          sections={sections}
          categories={categories}
          selectedSectionIds={selectedSectionIds}
          selectedCategoryIds={selectedCategoryIds}
          onToggleSection={toggleSection}
          onToggleCategory={toggleCategory}
          onClose={() => setFiltersOpen(false)}
        />
      )}
    </section>
  )
}
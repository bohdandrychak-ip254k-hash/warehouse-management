import Section from '../components/ui/Section.jsx'
import CatalogSummary from '../components/products/CatalogSummary.jsx'
import ProductList from '../components/products/ProductList.jsx'
import FiltersModal from '../components/products/FiltersModal.jsx'
import AppButton from '../components/ui/AppButton.jsx'
import useProductFilters from '../hooks/useProductFilters.js'
import { sections, categories } from '../data/products.js'
import { useState } from 'react'

export default function HomePage({ catalog, selectedId, onSelect }) {
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
    <>
      <section id="about" aria-labelledby="about-title">
        <h1 id="about-title">Склад</h1>
        <p>Веб-система управління складським приміщенням.</p>
        <p>Перегляньте каталог товарів, їхню категорію, секцію та залишки.</p>
      </section>

      <Section id="catalog" title="Каталог товарів">
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
      </Section>

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
    </>
  )
}
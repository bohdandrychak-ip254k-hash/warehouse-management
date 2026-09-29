import { useState } from 'react'
import Section from '../components/ui/Section.jsx'
import CatalogSummary from '../components/products/CatalogSummary.jsx'
import ProductList from '../components/products/ProductList.jsx'
import FiltersModal from '../components/products/FiltersModal.jsx'
import AppButton from '../components/ui/AppButton.jsx'
import { products, categories, sections } from '../data/products.js'

function enrichProduct(product) {
  const category = categories.find((c) => c.id === product.categoryId)
  const section = sections.find((s) => s.id === product.sectionId)

  return {
    ...product,
    categoryName: category?.name ?? 'Без категорії',
    sectionName: section?.name ?? 'Без секції',
  }
}

function matchesQuery(product, query) {
  const normalized = query.trim().toLowerCase()
  if (normalized === '') {
    return true
  }
  return (
    product.name.toLowerCase().includes(normalized) ||
    product.barcode.includes(normalized)
  )
}

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [lowStockOnly, setLowStockOnly] = useState(false)
  const [selectedSectionIds, setSelectedSectionIds] = useState(() => new Set())
  const [selectedCategoryIds, setSelectedCategoryIds] = useState(() => new Set())
  const [filtersOpen, setFiltersOpen] = useState(false)

  const catalog = products.map(enrichProduct)
  const visibleProducts = catalog.filter((item) => {
    const matchesSection = selectedSectionIds.size === 0 || selectedSectionIds.has(item.sectionId)
    const matchesCategory = selectedCategoryIds.size === 0 || selectedCategoryIds.has(item.categoryId)
    return (
      matchesQuery(item, query) &&
      (!lowStockOnly || item.quantity <= 5) &&
      matchesSection &&
      matchesCategory
    )
  })

  const filtersActive =
    query.trim() !== '' ||
    lowStockOnly ||
    selectedSectionIds.size > 0 ||
    selectedCategoryIds.size > 0

  function handleReset() {
    setQuery('')
    setLowStockOnly(false)
    setSelectedSectionIds(new Set())
    setSelectedCategoryIds(new Set())
  }

  function toggleSection(id) {
    setSelectedSectionIds((previous) => {
      const next = new Set(previous)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function toggleCategory(id) {
    setSelectedCategoryIds((previous) => {
      const next = new Set(previous)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

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

          <AppButton
            variant="secondary"
            aria-haspopup="dialog"
            onClick={() => setFiltersOpen(true)}
          >
            Фільтри{filtersActive && ' •'}
          </AppButton>

          <AppButton variant="secondary" onClick={handleReset} disabled={!filtersActive}>
            Скинути фільтри
          </AppButton>
        </div>

        <CatalogSummary total={visibleProducts.length} caption="Знайдено товарів" />
        <ProductList items={visibleProducts} emptyMessage={emptyMessage} />
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
import { useState } from 'react'

export default function useProductFilters(catalog) {
  const [query, setQuery] = useState('')
  const [lowStockOnly, setLowStockOnly] = useState(false)
  const [selectedSectionIds, setSelectedSectionIds] = useState(() => new Set())
  const [selectedCategoryIds, setSelectedCategoryIds] = useState(() => new Set())

  const normalizedQuery = query.trim().toLocaleLowerCase('uk')

  const visibleProducts = catalog.filter((item) => {
    const matchesQuery =
      normalizedQuery === '' ||
      item.name.toLocaleLowerCase('uk').includes(normalizedQuery) ||
      item.barcode.includes(normalizedQuery)
    const matchesStock = !lowStockOnly || item.quantity <= 5
    const matchesSection = selectedSectionIds.size === 0 || selectedSectionIds.has(item.sectionId)
    const matchesCategory = selectedCategoryIds.size === 0 || selectedCategoryIds.has(item.categoryId)
    return matchesQuery && matchesStock && matchesSection && matchesCategory
  })

  const filtersActive =
    normalizedQuery !== '' ||
    lowStockOnly ||
    selectedSectionIds.size > 0 ||
    selectedCategoryIds.size > 0

  function toggleSection(id) {
    setSelectedSectionIds((previous) => {
      const next = new Set(previous)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleCategory(id) {
    setSelectedCategoryIds((previous) => {
      const next = new Set(previous)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function resetFilters() {
    setQuery('')
    setLowStockOnly(false)
    setSelectedSectionIds(new Set())
    setSelectedCategoryIds(new Set())
  }

  return {
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
  }
}
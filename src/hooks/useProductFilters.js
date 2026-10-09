import { useSearchParams } from 'react-router'

function readIds(searchParams, name) {
  const raw = searchParams.get(name) ?? ''
  return new Set(raw.split(',').filter(Boolean))
}

export default function useProductFilters(catalog) {
  const [searchParams, setSearchParams] = useSearchParams()

  const query = searchParams.get('q') ?? ''
  const lowStockOnly = searchParams.get('lowStock') === '1'
  const selectedSectionIds = readIds(searchParams, 'sections')
  const selectedCategoryIds = readIds(searchParams, 'categories')

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

  function setQuery(value) {
    const next = new URLSearchParams(searchParams)
    if (value === '') {
      next.delete('q')
    } else {
      next.set('q', value)
    }
    setSearchParams(next, { replace: true })
  }

  function setLowStockOnly(value) {
    const next = new URLSearchParams(searchParams)
    if (value) {
      next.set('lowStock', '1')
    } else {
      next.delete('lowStock')
    }
    setSearchParams(next)
  }

  function toggleId(name, id) {
    const ids = readIds(searchParams, name)
    if (ids.has(id)) {
      ids.delete(id)
    } else {
      ids.add(id)
    }

    const next = new URLSearchParams(searchParams)
    if (ids.size === 0) {
      next.delete(name)
    } else {
      next.set(name, [...ids].join(','))
    }
    setSearchParams(next)
  }

  function toggleSection(id) {
    toggleId('sections', id)
  }

  function toggleCategory(id) {
    toggleId('categories', id)
  }

  function resetFilters() {
    const next = new URLSearchParams(searchParams)
    next.delete('q')
    next.delete('lowStock')
    next.delete('sections')
    next.delete('categories')
    setSearchParams(next)
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
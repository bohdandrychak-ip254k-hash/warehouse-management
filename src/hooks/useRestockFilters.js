import { useSearchParams } from 'react-router'
import { isDeficit, stockLevel } from '../domain/stock.js'
import { DEFAULT_SHOW, SHOW_OPTIONS } from '../domain/restockOptions.js'

export default function useRestockFilters(catalog, sections, categories) {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const rawShow = searchParams.get('show')
  const show = SHOW_OPTIONS.some((option) => option.value === rawShow) ? rawShow : DEFAULT_SHOW
  const rawSection = searchParams.get('section')
  const section = sections.some((entry) => entry.id === rawSection) ? rawSection : ''
  const rawCategory = searchParams.get('category')
  const category = categories.some((entry) => entry.id === rawCategory) ? rawCategory : ''

  const normalizedQuery = query.trim().toLocaleLowerCase('uk')

  const visibleProducts = catalog.filter((product) => {
    let matchesShow = true
    if (show === 'deficit') {
      matchesShow = isDeficit(product)
    } else if (show === 'ordered') {
      matchesShow = (product.ordered ?? 0) > 0
    }

    const matchesText = normalizedQuery === ''
      || product.name.toLocaleLowerCase('uk').includes(normalizedQuery)
      || product.barcode.includes(normalizedQuery)
    const matchesSection = section === '' || product.sectionId === section
    const matchesCategory = category === '' || product.categoryId === category

    return matchesShow && matchesText && matchesSection && matchesCategory
  })

  // Найменша сума «наявно + замовлено» — зверху; рівних впорядковує назва.
  const total = (product) => stockLevel(product.quantity, product.ordered).total
  visibleProducts.sort((a, b) => total(a) - total(b) || a.name.localeCompare(b.name, 'uk'))

  const canReset = query !== '' || show !== DEFAULT_SHOW || section !== '' || category !== ''
  const onlyDefaultView = normalizedQuery === '' && section === '' && category === ''

  function setParameter(name, value, defaultValue, replace = false) {
    const next = new URLSearchParams(searchParams)
    if (value === defaultValue) {
      next.delete(name)
    } else {
      next.set(name, value)
    }
    setSearchParams(next, { replace })
  }

  function resetFilters() {
    const next = new URLSearchParams(searchParams)
    next.delete('q')
    next.delete('show')
    next.delete('section')
    next.delete('category')
    setSearchParams(next)
  }

  return {
    query,
    show,
    section,
    category,
    visibleProducts,
    canReset,
    onlyDefaultView,
    setQuery: (value) => setParameter('q', value, '', true),
    setShow: (value) => setParameter('show', value, DEFAULT_SHOW),
    setSection: (value) => setParameter('section', value, ''),
    setCategory: (value) => setParameter('category', value, ''),
    resetFilters,
  }
}
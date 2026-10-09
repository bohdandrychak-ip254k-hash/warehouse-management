import { useState } from 'react'
import { ProductSelectionContext } from '../context/ProductSelectionContext.js'

export default function ProductSelectionProvider({ items, children }) {
  const [selectedId, setSelectedId] = useState(null)
  const selectedProduct = items.find((item) => item.id === selectedId) ?? null

  function selectProduct(id) {
    if (items.some((item) => item.id === id)) {
      setSelectedId(id)
    }
  }

  function clearSelection() {
    setSelectedId(null)
  }

  const value = { selectedId, selectedProduct, selectProduct, clearSelection }

  return (
    <ProductSelectionContext.Provider value={value}>
      {children}
    </ProductSelectionContext.Provider>
  )
}
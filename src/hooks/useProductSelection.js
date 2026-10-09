import { useContext } from 'react'
import { ProductSelectionContext } from '../context/ProductSelectionContext.js'

export default function useProductSelection() {
  const selection = useContext(ProductSelectionContext)

  if (selection === null) {
    throw new Error('useProductSelection must be used within ProductSelectionProvider')
  }

  return selection
}
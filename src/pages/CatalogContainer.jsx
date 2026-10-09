import ProductsPage from './ProductsPage.jsx'
import useProductSelection from '../hooks/useProductSelection.js'

export default function CatalogContainer({ catalog }) {
  const { selectedId, selectProduct } = useProductSelection()

  return <ProductsPage catalog={catalog} selectedId={selectedId} onSelect={selectProduct} />
}
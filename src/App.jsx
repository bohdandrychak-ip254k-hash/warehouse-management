import { useState } from 'react'
import AppLayout from './components/layout/AppLayout.jsx'
import HomePage from './pages/HomePage.jsx'
import OrderPage from './pages/OrderPage.jsx'
import { products, categories, sections } from './data/products.js'

const navLinks = [
  { label: 'Про застосунок', href: '#about' },
  { label: 'Каталог', href: '#catalog' },
  { label: 'Замовлення', href: '#order' },
]

function enrichProduct(product) {
  const category = categories.find((c) => c.id === product.categoryId)
  const section = sections.find((s) => s.id === product.sectionId)

  return {
    ...product,
    categoryName: category?.name ?? 'Без категорії',
    sectionName: section?.name ?? 'Без секції',
  }
}

export default function App() {
  const [selectedId, setSelectedId] = useState(null)

  const catalog = products.map(enrichProduct)
  const selectedProduct = catalog.find((item) => item.id === selectedId) ?? null

  return (
    <AppLayout title="Склад" links={navLinks}>
      <HomePage catalog={catalog} selectedId={selectedId} onSelect={setSelectedId} />
      <OrderPage
          key={selectedId ?? 'empty'}
          selectedProduct={selectedProduct}
          onClearSelection={() => setSelectedId(null)}
        />
    </AppLayout>
  )
}
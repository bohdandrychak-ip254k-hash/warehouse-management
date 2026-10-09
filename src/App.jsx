import { Routes, Route } from 'react-router'
import AppLayout from './components/layout/AppLayout.jsx'
import OrdersLayout from './components/layout/OrdersLayout.jsx'
import ProductSelectionProvider from './providers/ProductSelectionProvider.jsx'
import WelcomePage from './pages/WelcomePage.jsx'
import CatalogContainer from './pages/CatalogContainer.jsx'
import ProductDetailsPage from './pages/ProductDetailsPage.jsx'
import OrdersPage from './pages/OrdersPage.jsx'
import OrderCreatePage from './pages/OrderCreatePage.jsx'
import OrderEditPage from './pages/OrderEditPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import { products, categories, sections } from './data/products.js'
import { orders } from './data/orders.js'

const navLinks = [
  { to: '/', label: 'Про застосунок', end: true },
  { to: '/products', label: 'Каталог' },
  { to: '/orders', label: 'Замовлення' },
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
  const catalog = products.map(enrichProduct)

  return (
    <ProductSelectionProvider items={catalog}>
      <Routes>
        <Route element={<AppLayout title="Склад" links={navLinks} />}>
          <Route index element={<WelcomePage />} />
          <Route path="products" element={<CatalogContainer catalog={catalog} />} />
          <Route path="products/:productId" element={<ProductDetailsPage catalog={catalog} />} />

          <Route path="orders" element={<OrdersLayout />}>
            <Route index element={<OrdersPage orders={orders} catalog={catalog} />} />
            <Route path="new" element={<OrderCreatePage catalog={catalog} />} />
            <Route
              path=":orderId/edit"
              element={<OrderEditPage orders={orders} catalog={catalog} />}
            />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ProductSelectionProvider>
  )
}
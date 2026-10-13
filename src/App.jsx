import { Routes, Route } from 'react-router'
import AppLayout from './components/layout/AppLayout.jsx'
import OrdersLayout from './components/layout/OrdersLayout.jsx'
import ProductSelectionProvider from './providers/ProductSelectionProvider.jsx'
import OrdersProvider from './providers/OrdersProvider.jsx'
import WelcomePage from './pages/WelcomePage.jsx'
import CatalogContainer from './pages/CatalogContainer.jsx'
import ProductDetailsPage from './pages/ProductDetailsPage.jsx'
import OrdersPage from './pages/OrdersPage.jsx'
import OrderCreatePage from './pages/OrderCreatePage.jsx'
import OrderDetailsPage from './pages/OrderDetailsPage.jsx'
import OrderEditPage from './pages/OrderEditPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import useOrders from './hooks/useOrders.js'
import RestockPage from './pages/RestockPage.jsx'
import { suppliers } from './data/suppliers.js'
import { orderedByProduct, withOrdered } from './domain/stock.js'
import { products, categories, sections } from './data/products.js'

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

function AppRoutes({ baseCatalog }) {
  const { orders } = useOrders()
  const orderedMap = orderedByProduct(orders)
  const catalog = baseCatalog.map((product) => withOrdered(product, orderedMap))

  return (
    <Routes>
      <Route element={<AppLayout title="Склад" links={navLinks} />}>
        <Route index element={<WelcomePage catalog={catalog} />} />
        <Route path="products" element={<CatalogContainer catalog={catalog} />} />
        <Route path="products/:productId" element={<ProductDetailsPage catalog={catalog} suppliers={suppliers} />} />

        <Route path="orders" element={<OrdersLayout />}>
          <Route index element={<OrdersPage catalog={catalog} suppliers={suppliers} />} />
          <Route path="new" element={<OrderCreatePage catalog={catalog} suppliers={suppliers} />} />
          <Route path="restock" element={<RestockPage catalog={catalog} suppliers={suppliers} />} />
          <Route path=":orderId" element={<OrderDetailsPage catalog={catalog} suppliers={suppliers} />} />
          <Route path=":orderId/edit" element={<OrderEditPage catalog={catalog} suppliers={suppliers} />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  const baseCatalog = products.map(enrichProduct)

  return (
    <ProductSelectionProvider items={baseCatalog}>
      <OrdersProvider items={baseCatalog} suppliers={suppliers}>
        <AppRoutes baseCatalog={baseCatalog} />
      </OrdersProvider>
    </ProductSelectionProvider>
  )
}
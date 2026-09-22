import AppLayout from './components/layout/AppLayout.jsx'
import HomePage from './pages/HomePage.jsx'
import OrderPage from './pages/OrderPage.jsx'

const navLinks = [
  { label: 'Про застосунок', href: '#about' },
  { label: 'Каталог', href: '#catalog' },
  { label: 'Замовлення', href: '#order' },
]

export default function App() {
  return (
    <AppLayout title="Склад" links={navLinks}>
      <HomePage />
      <OrderPage />
    </AppLayout>
  )
}
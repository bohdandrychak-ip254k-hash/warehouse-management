import AppLayout from './components/layout/AppLayout.jsx'
import HomePage from './pages/HomePage.jsx'

const navLinks = [
  { label: 'Про застосунок', href: '#about' },
  { label: 'Каталог', href: '#catalog' },
]

export default function App() {
  return (
    <AppLayout title="Склад" links={navLinks}>
      <HomePage />
    </AppLayout>
  )
}
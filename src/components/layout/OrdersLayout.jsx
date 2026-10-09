import { NavLink, Outlet } from 'react-router'
import OrderNotice from '../orders/OrderNotice.jsx'

function linkClass({ isActive }) {
  return isActive ? 'subnav-link active' : 'subnav-link'
}

export default function OrdersLayout() {
  return (
    <>
      <nav className="subnav" aria-label="Навігація розділом замовлень">
        <NavLink to="/orders" end className={linkClass}>Список замовлень</NavLink>
        <NavLink to="/orders/new" className={linkClass}>Нове замовлення</NavLink>
      </nav>
      <p className="local-note">Локальні дані зберігаються до перезавантаження сторінки.</p>
      <OrderNotice />
      <Outlet />
    </>
  )
}
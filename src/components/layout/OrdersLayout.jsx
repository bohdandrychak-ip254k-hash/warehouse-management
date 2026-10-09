import { NavLink, Outlet } from 'react-router'

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
      <Outlet />
    </>
  )
}
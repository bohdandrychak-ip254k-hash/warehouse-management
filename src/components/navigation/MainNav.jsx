import { NavLink } from 'react-router'

export default function MainNav({ links }) {
  return (
    <nav aria-label="Основна навігація">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  )
}
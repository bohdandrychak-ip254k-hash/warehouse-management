export default function MainNav({ links }) {
  return (
    <nav aria-label="Основна навігація">
      {links.map((link) => (
        <a key={link.href} href={link.href}>
          {link.label}
        </a>
      ))}
    </nav>
  )
}
import MainNav from '../navigation/MainNav.jsx'

export default function SiteHeader({ title, links }) {
  return (
    <header className="site-header">
      <span>{title}</span>
      <MainNav links={links} />
    </header>
  )
}
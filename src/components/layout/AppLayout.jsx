import SiteHeader from './SiteHeader.jsx'

export default function AppLayout({ title, links, children }) {
  return (
    <>
      <SiteHeader title={title} links={links} />
      <main>{children}</main>
      <footer>Навчальний проєкт. Початковий каталог.</footer>
    </>
  )
}
import { Outlet } from 'react-router'
import SiteHeader from './SiteHeader.jsx'

export default function AppLayout({ title, links }) {
  return (
    <>
      <SiteHeader title={title} links={links} />
      <main>
        <Outlet />
      </main>
      <footer>Навчальний проєкт. Початковий каталог.</footer>
    </>
  )
}
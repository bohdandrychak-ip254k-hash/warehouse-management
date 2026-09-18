import HomePage from './pages/HomePage.jsx'

export default function App() {
  return (
    <>
      <header className="site-header">
        <span>Склад</span>
        <nav aria-label="Основна навігація">
          <a href="#about">Про застосунок</a>
          <a href="#catalog">Каталог</a>
        </nav>
      </header>
      <main>
        <HomePage />
      </main>
      <footer>Навчальний проєкт. Початковий каталог.</footer>
    </>
  )
}
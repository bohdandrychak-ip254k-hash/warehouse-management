import { Link } from 'react-router'
import PageHeading from '../components/ui/PageHeading.jsx'
import FeatureCard from '../components/home/FeatureCard.jsx'
import { products, sections, categories } from '../data/products.js'

export default function WelcomePage() {
  const totalProducts = products.length
  const lowStockCount = products.filter((p) => p.quantity <= 5).length

  return (
    <>
      <section className="hero" aria-labelledby="welcome-heading">
        <PageHeading title="Склад" />
        <p className="hero-tagline">Веб-система управління складським приміщенням</p>
        <p className="hero-text">
          Інформація про наявність товарів і рух матеріалів більше не розпорошена —
          каталог, секції, категорії та дефіцит зібрані в одному місці.
        </p>
        <div className="hero-actions">
          <Link to="/products" className="app-button app-button-primary">
            Переглянути каталог
          </Link>
          <Link to="/orders" className="app-button app-button-secondary">
            До замовлень
          </Link>
        </div>
      </section>

      <section className="stats-strip" aria-label="Коротка статистика складу">
        <div className="stat">
          <span className="stat-value">{totalProducts}</span>
          <span className="stat-label">товарів</span>
        </div>
        <div className="stat">
          <span className="stat-value">{sections.length}</span>
          <span className="stat-label">секції</span>
        </div>
        <div className="stat">
          <span className="stat-value">{categories.length}</span>
          <span className="stat-label">категорій</span>
        </div>
        <div className="stat stat-warning">
          <span className="stat-value">{lowStockCount}</span>
          <span className="stat-label">дефіцит</span>
        </div>
      </section>

     

      <section aria-labelledby="features-heading">
        <h2 id="features-heading">Можливості</h2>
        <div className="feature-grid">
          <FeatureCard
            icon="📦"
            title="Каталог товарів"
            description="Перегляд, пошук і фільтри за секцією та категорією."
            to="/products"
          />
          <FeatureCard
            icon="🧾"
            title="Замовлення"
            description="Створення, редагування й видалення замовлень постачальникам."
            to="/orders"
          />
          <FeatureCard
            icon="🗺️"
            title="Карта секцій"
            description="Візуальне розміщення товарів по секціях складу."
            comingSoon
          />
          <FeatureCard
            icon="📊"
            title="Статистика"
            description="Графіки руху товарів і звіти по дефіциту."
            comingSoon
          />
          <FeatureCard
            icon="📜"
            title="Історія операцій"
            description="Журнал надходжень, видач і переміщень товару."
            comingSoon
          />
          <FeatureCard
            icon="🔐"
            title="Авторизація"
            description="Вхід за роллю: комірник, менеджер, адміністратор."
            comingSoon
          />
        </div>
      </section>
    </>
  )
}
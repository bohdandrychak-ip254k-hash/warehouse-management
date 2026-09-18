import ProductCard from '../components/ProductCard.jsx'
import { products, categories, sections } from '../data/products.js'

function enrichProduct(product) {
  const category = categories.find((c) => c.id === product.categoryId)
  const section = category
    ? sections.find((s) => s.id === category.sectionId)
    : undefined

  return {
    ...product,
    categoryName: category?.name ?? 'Без категорії',
    sectionName: section?.name ?? 'Без секції',
  }
}

export default function HomePage() {
  const catalog = products.map(enrichProduct)

  return (
    <>
      <section id="about" aria-labelledby="about-title">
        <h1 id="about-title">Склад</h1>
        <p>Веб-система управління складським приміщенням.</p>
        <p>Перегляньте каталог товарів, їхню категорію, секцію та залишки.</p>
      </section>

      <section id="catalog" aria-labelledby="catalog-title">
        <h2 id="catalog-title">Каталог товарів</h2>
        <p>Товарів у каталозі: {catalog.length}</p>
        {catalog.length === 0 ? (
          <p>Товари ще не додано.</p>
        ) : (
          <ul className="product-grid">
            {catalog.map((item) => (
              <li key={item.id}>
                <ProductCard item={item} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}
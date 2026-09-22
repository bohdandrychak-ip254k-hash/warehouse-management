import Section from '../components/ui/Section.jsx'
import CatalogSummary from '../components/products/CatalogSummary.jsx'
import ProductList from '../components/products/ProductList.jsx'
import { products, categories, sections } from '../data/products.js'

function enrichProduct(product) {
  const category = categories.find((c) => c.id === product.categoryId)
  const section = sections.find((s) => s.id === product.sectionId)

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

      <Section id="catalog" title="Каталог товарів">
        <CatalogSummary total={catalog.length} />
        <ProductList items={catalog} />
      </Section>
    </>
  )
}
export default function CatalogSummary({ total, caption = 'Товарів у каталозі' }) {
  return (
    <p>
      {caption}: {total}
    </p>
  )
}
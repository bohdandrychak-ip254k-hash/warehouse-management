export default function OrderSummary({ productName, draft }) {
  return (
    <aside className="order-summary" aria-labelledby="order-summary-title">
      <h3 id="order-summary-title">Поточна чернетка</h3>
      <dl>
        <dt>Товар</dt>
        <dd>{productName}</dd>
        <dt>Кількість</dt>
        <dd>{draft.quantity || 'Ще не вказано'}</dd>
        <dt>Постачальник</dt>
        <dd>{draft.supplier.trim() || 'Ще не вказано'}</dd>
        <dt>Коментар</dt>
        <dd>{draft.comment.trim() || 'Немає'}</dd>
      </dl>
      <p>Цей підсумок не підтверджує оформлення замовлення.</p>
    </aside>
  )
}
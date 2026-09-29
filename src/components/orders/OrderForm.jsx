import AppButton from '../ui/AppButton.jsx'
import FormField from '../ui/FormField.jsx'

export default function OrderForm({
  idPrefix,
  productName,
  draft,
  onQuantityChange,
  onSupplierChange,
  onCommentChange,
  onReset,
}) {
  const nameId = `${idPrefix}-name`
  const quantityId = `${idPrefix}-quantity`
  const supplierId = `${idPrefix}-supplier`
  const commentId = `${idPrefix}-comment`
  const noticeId = `${idPrefix}-notice`

  return (
    <form
      aria-label="Чернетка замовлення постачальнику"
      aria-describedby={noticeId}
      onSubmit={(event) => event.preventDefault()}
    >
      <p id={noticeId}>
        Чернетка існує лише до зміни товару, скасування вибору або
        перезавантаження сторінки. Замовлення не надсилається.
      </p>

      <FormField id={nameId} label="Товар">
        <input id={nameId} name="productName" value={productName} readOnly />
      </FormField>

      <FormField id={quantityId} label="Кількість до замовлення">
        <input
          id={quantityId}
          name="quantity"
          type="number"
          min="1"
          value={draft.quantity}
          onChange={(event) => onQuantityChange(event.target.value)}
        />
      </FormField>

      <FormField id={supplierId} label="Постачальник">
        <input
          id={supplierId}
          name="supplier"
          type="text"
          value={draft.supplier}
          onChange={(event) => onSupplierChange(event.target.value)}
        />
      </FormField>

      <FormField id={commentId} label="Коментар">
        <textarea
          id={commentId}
          name="comment"
          rows="3"
          value={draft.comment}
          onChange={(event) => onCommentChange(event.target.value)}
        />
      </FormField>

      <div className="form-actions">
        <AppButton variant="secondary" onClick={onReset}>
          Очистити поля
        </AppButton>
        <AppButton disabled>Оформити замовлення</AppButton>
      </div>
    </form>
  )
}
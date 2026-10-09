import AppButton from '../ui/AppButton.jsx'
import FormField from '../ui/FormField.jsx'
import { ORDER_RULES } from '../../domain/orderValidation.js'

function describedBy(id, error) {
  return `${id}-hint${error ? ` ${id}-error` : ''}`
}

export default function OrderForm({
  idPrefix,
  productName,
  draft,
  errors,
  operationError,
  onChange,
  onBlur,
  onSubmit,
  onReset,
  submitLabel,
}) {
  const nameId = `${idPrefix}-name`
  const quantityId = `${idPrefix}-quantity`
  const supplierId = `${idPrefix}-supplier`
  const commentId = `${idPrefix}-comment`
  const hasErrors = Object.keys(errors).length > 0

  return (
    <form noValidate onSubmit={onSubmit} aria-label="Форма замовлення постачальнику">
      <p>
        Збережіть зміни кнопкою нижче. Незбережене введення зникає при виході
        зі сторінки або її перезавантаженні.
      </p>
      {hasErrors && <p className="form-alert" role="alert">Виправте позначені поля.</p>}
      {errors.productId && <p className="form-alert" role="alert">{errors.productId}</p>}
      {operationError && <p className="form-alert" role="alert">{operationError}</p>}

      <FormField id={nameId} label="Товар">
        <input id={nameId} name="productName" value={productName} readOnly />
      </FormField>

      <FormField
        id={quantityId}
        label="Кількість до замовлення (обов'язково)"
        hint={`Ціле число від ${ORDER_RULES.quantityMin} до ${ORDER_RULES.quantityMax}.`}
        error={errors.quantity}
      >
        <input
          id={quantityId}
          name="quantity"
          type="number"
          min={ORDER_RULES.quantityMin}
          max={ORDER_RULES.quantityMax}
          step={1}
          required
          value={draft.quantity}
          onChange={(event) => onChange('quantity', event.target.value)}
          onBlur={() => onBlur('quantity')}
          aria-invalid={Boolean(errors.quantity)}
          aria-describedby={describedBy(quantityId, errors.quantity)}
        />
      </FormField>

      <FormField
        id={supplierId}
        label="Постачальник (обов'язково)"
        hint={`Від ${ORDER_RULES.supplierMin} до ${ORDER_RULES.supplierMax} символів без крайніх пробілів.`}
        error={errors.supplier}
      >
        <input
          id={supplierId}
          name="supplier"
          type="text"
          required
          value={draft.supplier}
          onChange={(event) => onChange('supplier', event.target.value)}
          onBlur={() => onBlur('supplier')}
          aria-invalid={Boolean(errors.supplier)}
          aria-describedby={describedBy(supplierId, errors.supplier)}
        />
      </FormField>

      <FormField
        id={commentId}
        label="Коментар"
        hint={`Необов'язково, до ${ORDER_RULES.commentMax} символів. Для кількості понад ${ORDER_RULES.largeQuantity} коментар обов'язковий (щонайменше ${ORDER_RULES.largeCommentMin} символів).`}
        error={errors.comment}
      >
        <textarea
          id={commentId}
          name="comment"
          rows={3}
          value={draft.comment}
          onChange={(event) => onChange('comment', event.target.value)}
          onBlur={() => onBlur('comment')}
          aria-invalid={Boolean(errors.comment)}
          aria-describedby={describedBy(commentId, errors.comment)}
        />
      </FormField>

      <div className="form-actions">
        <AppButton type="submit">{submitLabel}</AppButton>
        <AppButton variant="secondary" onClick={onReset}>
          Відновити початкові поля
        </AppButton>
      </div>
    </form>
  )
}
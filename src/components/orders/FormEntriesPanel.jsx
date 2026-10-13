import AppButton from '../ui/AppButton.jsx'

export default function FormEntriesPanel({ entries, total, pendingNames, onEdit, onRemove }) {
  return (
    <aside className="wizard-right" aria-labelledby="wizard-entered-title">
      <h2 id="wizard-entered-title">Внесені товари ({entries.length} з {total})</h2>

      {entries.length === 0 ? (
        <p>Поки що нічого не внесено.</p>
      ) : (
        <ul className="wizard-entries">
          {entries.map(({ product, entry, isCurrent, supplierName }) => (
            <li
              key={product.id}
              className={isCurrent ? 'wizard-entry wizard-entry-current' : 'wizard-entry'}
            >
              <strong>{product.name}</strong>
              <p>{entry.quantity} {product.unit}</p>
              {supplierName && <p className="field-hint">Постачальник: {supplierName}</p>}
              {entry.comment && <p className="field-hint">{entry.comment}</p>}
              <div className="wizard-entry-actions">
                <AppButton
                  variant="secondary"
                  size="small"
                  aria-label={`Редагувати ${product.name}`}
                  onClick={() => onEdit(product.id)}
                >
                  Редагувати
                </AppButton>
                <AppButton
                  variant="danger"
                  size="small"
                  aria-label={`Видалити ${product.name}`}
                  onClick={() => onRemove(product.id)}
                >
                  Видалити
                </AppButton>
              </div>
            </li>
          ))}
        </ul>
      )}

      {pendingNames.length > 0 && (
        <p className="field-hint">Ще не заповнено: {pendingNames.join('; ')}</p>
      )}
    </aside>
  )
}
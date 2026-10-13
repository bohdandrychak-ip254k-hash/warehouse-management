import { useState } from 'react'
import AppButton from '../ui/AppButton.jsx'
import FormField from '../ui/FormField.jsx'

export default function FormAddProduct({ products, suppliers = [], supplier, onAdd }) {
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLocaleLowerCase('uk')

  const shown = products.filter((product) => (
    normalizedQuery === ''
    || product.name.toLocaleLowerCase('uk').includes(normalizedQuery)
    || (product.barcode ?? '').includes(normalizedQuery)
  ))

  const supplierNames = (product) => (product.supplierIds ?? [])
    .map((id) => suppliers.find((entry) => entry.id === id)?.name)
    .filter(Boolean)

  return (
    <section className="wizard-add" aria-labelledby="wizard-add-title">
      <h2 id="wizard-add-title">Додати товар до форми</h2>
      {supplier && (
        <p className="field-hint">Показано лише товари постачальника «{supplier.name}».</p>
      )}

      {products.length === 0 ? (
        <p>Немає товарів, які можна додати.</p>
      ) : (
        <>
          <FormField id="wizard-add-query" label="Пошук товару" hint="Назва або штрихкод.">
            <input
              id="wizard-add-query"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-describedby="wizard-add-query-hint"
            />
          </FormField>
          <p>Знайдено: {shown.length} із {products.length}</p>

          {shown.length === 0 ? (
            <p>За цим запитом нічого не знайдено.</p>
          ) : (
            <ul className="add-results">
              {shown.map((product) => (
                <li key={product.id}>
                  <span>
                    <strong>{product.name}</strong>
                    {supplierNames(product).length > 0 && (
                      <small className="field-hint">{supplierNames(product).join('; ')}</small>
                    )}
                  </span>
                  <AppButton
                    variant="secondary"
                    size="small"
                    aria-label={`Додати ${product.name}`}
                    onClick={() => onAdd(product.id)}
                  >
                    Додати
                  </AppButton>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  )
}
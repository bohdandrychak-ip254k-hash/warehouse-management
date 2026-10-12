import { useState } from 'react'
import { Link } from 'react-router'
import PageHeading from '../components/ui/PageHeading.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import AppButton from '../components/ui/AppButton.jsx'
import FocusHeading from '../components/orders/FocusHeading.jsx'
import FormItemStep from '../components/orders/FormItemStep.jsx'
import FormEntriesPanel from '../components/orders/FormEntriesPanel.jsx'
import useFormWizard from '../hooks/useFormWizard.js'
import { enteredIds, orderedItems, pendingIds } from '../domain/formWizard.js'

export default function OrderFormEditor({
  title,
  supplier,
  products,
  initialQueue,
  initialEntries,
  onSave,
  onCancel,
  submitLabel = 'Створити форму замовлення',
  cancelLabel = 'Скасувати форму',
}) {
  const w = useFormWizard(initialQueue, initialEntries)
  const { wizard } = w
  const [error, setError] = useState('')

  const byId = new Map(products.map((product) => [product.id, product]))
  const nameOf = (id) => byId.get(id)?.name ?? id
  const total = wizard.queue.length
  const entered = enteredIds(wizard)
  const pending = pendingIds(wizard)
  const otherPending = pending.filter((id) => id !== wizard.currentId)

  const entries = entered.map((id) => ({
    product: byId.get(id),
    entry: wizard.entries[id],
    isCurrent: id === wizard.currentId,
  }))

  function handleRemove(id) {
    const hasData = Object.hasOwn(wizard.entries, id) || w.isDirty(id)
    if (hasData && !window.confirm(`Прибрати «${nameOf(id)}» з форми? Введені дані цього товару буде втрачено.`)) {
      return
    }
    setError('')
    w.remove(id)
  }

  function handleCreate() {
    setError('')
    const result = onSave(orderedItems(wizard))
    if (!result.ok) {
      setError(result.message || Object.values(result.errors).join(' '))
    }
  }

  function handleCancel() {
    if (w.hasProgress && !window.confirm('Скасувати форму? Введені дані буде втрачено.')) {
      return
    }
    onCancel()
  }

  let left
  if (wizard.currentId !== null) {
    const id = wizard.currentId
    left = (
      <FormItemStep
        key={id}
        product={byId.get(id)}
        position={wizard.queue.indexOf(id) + 1}
        total={total}
        draft={w.draftFor(id)}
        isDirty={w.isDirty(id)}
        submitLabel={otherPending.length > 0 ? 'Наступний' : 'Зберегти товар'}
        focusOnMount={w.moved}
        onChange={(field, value) => w.changeDraft(id, field, value)}
        onSave={w.save}
        onReset={() => w.resetDraft(id)}
        onRemove={() => handleRemove(id)}
      />
    )
  } else if (total === 0) {
    left = (
      <EmptyState message="У формі не залишилось товарів.">
        <p><Link to="/orders/restock">Повернутися до списку поповнення</Link></p>
      </EmptyState>
    )
  } else {
    left = (
      <div>
        <FocusHeading id="wizard-step-title" focus={w.moved}>Усі товари заповнено</FocusHeading>
        <p>
          Перегляньте внесені позиції праворуч: їх можна відредагувати або
          видалити. Коли все готово, створіть форму.
        </p>
        <AppButton onClick={handleCreate}>{submitLabel}</AppButton>
      </div>
    )
  }

  return (
    <>
      <PageHeading title={title} />
    <dl className="details-list">
        <dt>Постачальник</dt>
        <dd>{supplier ? supplier.name : 'Без постачальника'}</dd>
        {supplier && (
          <>
            <dt>Контакти</dt>
            <dd>{supplier.contacts}</dd>
          </>
        )}
      </dl>
      {error && <p className="form-alert" role="alert">{error}</p>}

      <div className="wizard-columns">
        <section className="wizard-left" aria-labelledby="wizard-step-title">
          {left}
        </section>
        <FormEntriesPanel
          entries={entries}
          total={total}
          pendingNames={pending.map(nameOf)}
          onEdit={w.edit}
          onRemove={handleRemove}
        />
      </div>

      <AppButton variant="secondary" onClick={handleCancel}>
        {cancelLabel}
      </AppButton>
    </>
  )
}
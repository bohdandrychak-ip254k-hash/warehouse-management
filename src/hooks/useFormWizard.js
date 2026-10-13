import { useState } from 'react'
import {
  addItem,
  createWizard,
  editItem,
  removeItem,
  saveItem,
} from '../domain/formWizard.js'

const EMPTY_DRAFT = { quantity: '', comment: '' }

function toDraft(entry) {
  const draft = { quantity: String(entry.quantity), comment: entry.comment }
  if (Object.hasOwn(entry, 'supplierId')) {
    draft.supplierId = entry.supplierId ?? ''
  }
  return draft
}

function sameDraft(a, b) {
  return a.quantity === b.quantity
    && a.comment === b.comment
    && (a.supplierId ?? '') === (b.supplierId ?? '')
}

function sameEntry(a, b) {
  return a.quantity === b.quantity
    && a.comment === b.comment
    && (a.supplierId ?? null) === (b.supplierId ?? null)
}

function without(object, key) {
  const next = { ...object }
  delete next[key]
  return next
}

export default function useFormWizard(initialQueue, initialEntries = {}, defaultDraftFor = () => EMPTY_DRAFT) {
  const [initial] = useState(() => ({ queue: [...initialQueue], entries: { ...initialEntries } }))
  const [wizard, setWizard] = useState(() => createWizard(initialQueue, initialEntries))
  // Незбережений текст кожного товару окремо: перехід до іншого товару його не стирає.
  const [drafts, setDrafts] = useState({})
  const [moved, setMoved] = useState(false)

  const initialDraftFor = (id) => (
    Object.hasOwn(wizard.entries, id) ? toDraft(wizard.entries[id]) : defaultDraftFor(id)
  )
  const draftFor = (id) => drafts[id] ?? initialDraftFor(id)
  const isDirty = (id) => !sameDraft(draftFor(id), initialDraftFor(id))
  const sameQueue = wizard.queue.length === initial.queue.length
    && wizard.queue.every((id, index) => id === initial.queue[index])
  const sameEntries = Object.keys(wizard.entries).length === Object.keys(initial.entries).length
    && Object.entries(wizard.entries).every(([id, entry]) => (
      Object.hasOwn(initial.entries, id) && sameEntry(initial.entries[id], entry)
    ))
  // Зміни порівнюються з початковим станом: відкрита для редагування форма без правок — не «змінена».
  const hasChanges = !sameQueue || !sameEntries || wizard.queue.some((id) => isDirty(id))

  function changeDraft(id, field, value) {
    setDrafts((previous) => ({
      ...previous,
      [id]: { ...(previous[id] ?? initialDraftFor(id)), [field]: value },
    }))
  }

  function resetDraft(id) {
    setDrafts((previous) => without(previous, id))
  }

  function save(value) {
    setWizard((current) => saveItem(current, value))
    setDrafts((previous) => without(previous, value.productId))
    setMoved(true)
  }

  // «Редагувати» починає від збереженого стану позиції.
  function edit(id) {
    setWizard((current) => editItem(current, id))
    setDrafts((previous) => without(previous, id))
    setMoved(true)
  }

  function remove(id) {
    setWizard((current) => removeItem(current, id))
    setDrafts((previous) => without(previous, id))
    setMoved(true)
  }

  function add(id) {
    setWizard((current) => addItem(current, id))
    setMoved(true)
  }

  return {
    wizard,
    moved,
    draftFor,
    isDirty,
    hasChanges,
    changeDraft,
    resetDraft,
    save,
    edit,
    remove,
    add,
  }
}
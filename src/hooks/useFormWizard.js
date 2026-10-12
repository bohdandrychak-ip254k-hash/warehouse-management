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
  return { quantity: String(entry.quantity), comment: entry.comment }
}

function without(object, key) {
  const next = { ...object }
  delete next[key]
  return next
}

export default function useFormWizard(initialQueue, initialEntries = {}) {
  const [wizard, setWizard] = useState(() => createWizard(initialQueue, initialEntries))
  // Незбережений текст кожного товару окремо: перехід до іншого товару його не стирає.
  const [drafts, setDrafts] = useState({})
  const [moved, setMoved] = useState(false)

  const initialDraftFor = (id) => (
    Object.hasOwn(wizard.entries, id) ? toDraft(wizard.entries[id]) : EMPTY_DRAFT
  )
  const draftFor = (id) => drafts[id] ?? initialDraftFor(id)
  const isDirty = (id) => {
    const draft = draftFor(id)
    const initial = initialDraftFor(id)
    return draft.quantity !== initial.quantity || draft.comment !== initial.comment
  }
  const hasProgress = Object.keys(wizard.entries).length > 0 || wizard.queue.some((id) => isDirty(id))

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
    hasProgress,
    changeDraft,
    resetDraft,
    save,
    edit,
    remove,
    add,
  }
}
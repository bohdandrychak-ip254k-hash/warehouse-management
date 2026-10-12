// Чистий стан майстра форми: черга товарів, внесені позиції, поточний товар.
// Жодних побічних дій: кожна функція повертає новий стан.

function isEntered(state, id) {
  return Object.hasOwn(state.entries, id)
}

function pendingFrom(state, ids) {
  return ids.find((id) => !isEntered(state, id)) ?? null
}

// Наступний незаповнений товар після вказаної позиції; якщо далі немає — з початку черги.
function nextPending(state, startIndex) {
  return pendingFrom(state, state.queue.slice(startIndex)) ?? pendingFrom(state, state.queue)
}

export function createWizard(queue, entries = {}) {
  const state = { queue: [...queue], entries: { ...entries }, currentId: null }
  return { ...state, currentId: pendingFrom(state, state.queue) }
}

export function saveItem(state, value) {
  const next = { ...state, entries: { ...state.entries, [value.productId]: value } }
  return { ...next, currentId: nextPending(next, state.queue.indexOf(value.productId) + 1) }
}

export function editItem(state, productId) {
  if (!state.queue.includes(productId) || !isEntered(state, productId)) {
    return state
  }
  return { ...state, currentId: productId }
}

export function removeItem(state, productId) {
  const index = state.queue.indexOf(productId)
  if (index === -1) {
    return state
  }

  const queue = state.queue.filter((id) => id !== productId)
  const entries = { ...state.entries }
  delete entries[productId]
  const next = { queue, entries, currentId: state.currentId }

  if (state.currentId === productId) {
    next.currentId = nextPending(next, index)
  }
  return next
}

export function addItem(state, productId) {
  if (state.queue.includes(productId)) {
    return state
  }
  return { ...state, queue: [...state.queue, productId], currentId: productId }
}

export function enteredIds(state) {
  return state.queue.filter((id) => isEntered(state, id))
}

export function pendingIds(state) {
  return state.queue.filter((id) => !isEntered(state, id))
}

export function isComplete(state) {
  return state.queue.length > 0 && pendingIds(state).length === 0
}

// Позиції у порядку черги (а не в порядку заповнення).
export function orderedItems(state) {
  return enteredIds(state).map((id) => state.entries[id])
}
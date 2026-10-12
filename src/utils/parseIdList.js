export function parseIdList(raw) {
  const ids = []

  for (const part of (raw ?? '').split(',')) {
    const id = part.trim()
    if (id !== '' && !ids.includes(id)) {
      ids.push(id)
    }
  }

  return ids
}
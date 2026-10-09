export function formatIsoDate(isoDate) {
  return isoDate.split('-').reverse().join('.')
}